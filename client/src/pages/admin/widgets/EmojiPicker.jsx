import React, { useState } from 'react';

// Curated emoji set covering the most common types of side projects.
// Reads naturally as "pick the icon that fits your project" — and there's
// still a free-form input below for anything off-list.
const EMOJI_GROUPS = [
  {
    name: 'Dev',
    emojis: ['💻', '🖥️', '📱', '🌐', '⚙️', '🛠️', '🔧', '🧩', '🧱', '🗂️']
  },
  {
    name: 'Apps',
    emojis: ['🚗', '🏠', '🎬', '📈', '📊', '📁', '📝', '🛒', '🍔', '✈️', '💰', '🏥', '🎮', '🎵', '📚', '🔒']
  },
  {
    name: 'Vibe',
    emojis: ['☁️', '🤖', '🧠', '⚡', '🚀', '✨', '🎨', '📷', '📺', '💼', '📦', '🎯', '🌟', '💡', '🔥', '💎']
  }
];

const EmojiPicker = ({ value, onChange }) => {
  const [custom, setCustom] = useState('');

  const choose = (e) => {
    onChange(e);
    setCustom('');
  };

  return (
    <div className="emoji-picker">
      <div className="emoji-picker-preview">
        <span className="emoji-picker-current">{value || '❔'}</span>
        <span className="emoji-picker-hint">
          {value ? 'Selected fallback icon' : 'No icon selected — pick one below'}
        </span>
      </div>

      {EMOJI_GROUPS.map((group) => (
        <div key={group.name} className="emoji-picker-group">
          <span className="emoji-picker-label">{group.name}</span>
          <div className="emoji-picker-grid">
            {group.emojis.map((e) => (
              <button
                type="button"
                key={e}
                className={`emoji-picker-btn ${value === e ? 'active' : ''}`}
                onClick={() => choose(e)}
                aria-label={`Use ${e}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="emoji-picker-custom">
        <input
          type="text"
          maxLength={4}
          value={custom}
          placeholder="Or paste any emoji…"
          onChange={(e) => setCustom(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => custom && choose(custom)}
          disabled={!custom}
        >
          Use
        </button>
      </div>
    </div>
  );
};

export default EmojiPicker;
