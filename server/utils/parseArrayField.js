// Body fields that arrive as JSON strings inside multipart/form-data need to
// be parsed back into arrays before we save. Falls back to a comma split so a
// plain "react, node" value still works.
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

module.exports = parseArrayField;
