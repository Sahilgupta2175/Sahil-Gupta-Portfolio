const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');
const { upload, destroyImage } = require('../middleware/upload');

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

const buildBlogPayload = (body, file) => {
  const payload = {
    title: body.title,
    excerpt: body.excerpt,
    tags: parseArrayField(body.tags),
    readTime: body.readTime || '5 min read',
    externalUrl: body.externalUrl,
    published: body.published === 'false' || body.published === false ? false : true
  };
  if (file) {
    payload.coverImage = file.path;
    payload.coverImagePublicId = file.filename;
  }
  return payload;
};

// GET /api/blogs?limit=3&tag=react — public list, only returns published
router.get('/', async (req, res) => {
  try {
    const { limit, tag } = req.query;
    const filter = { published: true };
    if (tag) filter.tags = tag;

    let query = Blog.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));

    const blogs = await query.exec();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

// GET /api/blogs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

// POST /api/blogs — admin only, optional cover image upload
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const blog = new Blog(buildBlogPayload(req.body, req.file));
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

// PUT /api/blogs/:id — admin only
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Blog not found' });

    const payload = buildBlogPayload(req.body, req.file);

    if (req.file && existing.coverImagePublicId) {
      await destroyImage(existing.coverImagePublicId);
    }

    Object.assign(existing, payload);
    await existing.save();
    res.json(existing);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

// DELETE /api/blogs/:id — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Blog not found' });
    if (existing.coverImagePublicId) await destroyImage(existing.coverImagePublicId);
    await existing.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error', type: error.name });
  }
});

module.exports = router;
