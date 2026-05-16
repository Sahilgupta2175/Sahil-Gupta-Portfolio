const jwt = require('jsonwebtoken');

// Verifies the Bearer JWT and attaches { email } to req.admin.
// All mutating routes (POST/PUT/DELETE) sit behind this.
const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET not configured on server' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

module.exports = { protect };
