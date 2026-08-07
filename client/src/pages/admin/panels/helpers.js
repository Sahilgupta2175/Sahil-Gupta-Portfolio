// Comma-separated text field <-> array of clean strings.
export const toArr = (str) => (str || '').split(',').map((s) => s.trim()).filter(Boolean);
export const fromArr = (arr) => (arr || []).join(', ');
