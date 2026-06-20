// Multer + Cloudinary upload middleware.
// Mutating routes accept multipart/form-data with a single field named "image".
// On success the file is uploaded straight to Cloudinary and req.file has:
//   req.file.path     -> Cloudinary secure URL (stored on the doc as image/coverImage/logo)
//   req.file.filename -> Cloudinary public_id (stored so we can delete it later)

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Folder per resource so the Cloudinary dashboard stays tidy.
    const folder =
      req.baseUrl.includes('blogs') ? 'portfolio/blogs'
      : req.baseUrl.includes('experience') ? 'portfolio/experience'
      : 'portfolio/projects';

    return {
      folder,
      // SVG intentionally excluded: it can carry <script>/onload payloads and
      // would be served from Cloudinary with an image content-type to public
      // visitors (stored-XSS vector).
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }]
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// Delete a previously-uploaded image when a doc is replaced or removed.
// Swallows errors — we don't want a stale-image cleanup failure to break the request.
const destroyImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary destroy failed:', err.message);
  }
};

module.exports = { upload, cloudinary, destroyImage };
