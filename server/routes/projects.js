const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { upload, destroyImage } = require('../middleware/upload');
const { blastNewContent } = require('../utils/notify');

// Body fields that arrive as JSON strings inside multipart/form-data
// need to be parsed back into arrays before we save.
const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      // fall through to comma split
    }
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

const buildProjectPayload = (body, file) => {
  const payload = {
    title: body.title,
    description: body.description,
    longDescription: body.longDescription,
    technologies: parseArrayField(body.technologies),
    emoji: body.emoji || '',
    liveUrl: body.liveUrl,
    githubUrl: body.githubUrl,
    category: body.category || 'web',
    featured: body.featured === 'true' || body.featured === true,
    order: Number(body.order) || 0
  };
  if (file) {
    payload.image = file.path;
    payload.imagePublicId = file.filename;
  }
  return payload;
};

// GET /api/projects — public list, supports ?category= and ?featured=
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    // Newest first — admin's most recent additions always appear at the top.
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/projects/:id — public detail
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/projects — admin only, accepts optional image upload
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const project = new Project(buildProjectPayload(req.body, req.file));
    await project.save();
    res.status(201).json(project);

    // Fire-and-forget — email subscribers about the new project. Not awaited
    // so the admin's save returns immediately.
    blastNewContent('project', project).catch((e) =>
      console.error('Project blast failed:', e.message)
    );
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/projects/:id — admin only. If a new image arrives, the old one is removed.
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Project not found' });

    const payload = buildProjectPayload(req.body, req.file);

    if (req.file && existing.imagePublicId) {
      // Replace old Cloudinary asset.
      await destroyImage(existing.imagePublicId);
    }

    Object.assign(existing, payload);
    await existing.save();
    res.json(existing);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/projects/:id — admin only. Removes Cloudinary asset too.
router.delete('/:id', protect, async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Project not found' });
    if (existing.imagePublicId) await destroyImage(existing.imagePublicId);
    await existing.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
