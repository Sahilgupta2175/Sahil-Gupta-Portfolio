const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { protect } = require("../middleware/auth");
const { upload, destroyImage } = require("../middleware/upload");
const { sendPendingBlogBlasts } = require("../utils/notify");
const parseArrayField = require("../utils/parseArrayField");
const { syncIfStale } = require("../utils/hashnodeFeed");
const { setTimeout: sleep } = require("timers/promises");

const SYNC_WAIT_MS = 2500;

const buildBlogPayload = (body, file) => {
  const payload = {
    title: body.title,
    excerpt: body.excerpt,
    tags: parseArrayField(body.tags),
    readTime: body.readTime || "5 min read",
    externalUrl: body.externalUrl,
    published:
      body.published === "false" || body.published === false ? false : true,
  };
  if (file) {
    payload.coverImage = file.path;
    payload.coverImagePublicId = file.filename;
  }
  return payload;
};

// GET /api/blogs?limit=3&tag=react - public list, only returns published.
// Pulls new posts from the Hashnode feed first (throttled), so publishing
// there is all it takes for a post to appear here.
router.get("/", async (req, res) => {
  try {
    // Throttled Hashnode refresh; a sync that finds a new post flags it and
    // emails subscribers. Readers wait for it at most SYNC_WAIT_MS: on a cold
    // start (Mongo connect + feed fetch + saves) it used to blow past the
    // site's 20s request timeout and the Writing section came back empty.
    // Whatever is unfinished carries on in the background (or resumes when
    // the serverless instance next wakes) and is never started twice.
    const refresh = syncIfStale()
      .then((synced) => synced && sendPendingBlogBlasts())
      .catch((e) =>
        console.error("Hashnode sync / blog blast failed:", e.message),
      );
    await Promise.race([refresh, sleep(SYNC_WAIT_MS)]);

    const { limit, tag } = req.query;
    const filter = { published: true };
    if (tag) filter.tags = tag;

    let query = Blog.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));

    const blogs = await query.exec();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/blogs/:slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/blogs - admin only, optional cover image upload
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const blog = new Blog(buildBlogPayload(req.body, req.file));
    // Published posts are emailed now; drafts get emailed once published
    // (the flag waits for the next sync after you publish).
    blog.notifyPending = true;
    await blog.save();

    // Awaited, not fire-and-forget: Vercel freezes the function after the
    // response, which used to drop these emails.
    await sendPendingBlogBlasts().catch((e) =>
      console.error("Blog blast failed:", e.message),
    );
    res.status(201).json(await Blog.findById(blog._id));
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/blogs/:id - admin only
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Blog not found" });

    const payload = buildBlogPayload(req.body, req.file);

    if (req.file && existing.coverImagePublicId) {
      await destroyImage(existing.coverImagePublicId);
    }

    Object.assign(existing, payload);
    await existing.save();

    // A draft created earlier is still flagged; publishing it sends it now.
    if (existing.published && existing.notifyPending) {
      await sendPendingBlogBlasts().catch((e) =>
        console.error("Blog blast failed:", e.message),
      );
      return res.json(await Blog.findById(existing._id));
    }
    res.json(existing);
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/blogs/:id/notify - admin only. Emails this post to every active
// subscriber now, e.g. for a post that was added before emailing worked.
router.post("/:id/notify", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (!blog.published) {
      return res
        .status(400)
        .json({ message: "Publish the post before emailing it." });
    }
    blog.notifyPending = true;
    await blog.save();

    const sent = await sendPendingBlogBlasts();
    const mine = sent.find((s) => s.id === String(blog._id));
    if (!mine) {
      return res
        .status(503)
        .json({
          message:
            "Email is not configured on the server (EMAIL_USER / EMAIL_PASS).",
        });
    }
    res.json({
      success: true,
      ...mine,
      notifiedAt: (await Blog.findById(blog._id)).notifiedAt,
    });
  } catch (error) {
    console.error("Notify blog error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /api/blogs/:id - admin only
router.delete("/:id", protect, async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Blog not found" });
    if (existing.coverImagePublicId)
      await destroyImage(existing.coverImagePublicId);
    await existing.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
