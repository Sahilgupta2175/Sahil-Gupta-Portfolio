import React, { useEffect, useRef, useState } from 'react';
import { FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

// Styled wrapper around a hidden <input type="file">. Shows a drop-zone
// button before a file is chosen, then a thumbnail + filename + clear button.
// `currentImageUrl` is the existing Cloudinary URL when editing an item, so
// the admin can see what they have before deciding to replace it.
const ImageUpload = ({ value, onChange, currentImageUrl, accept = 'image/*' }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!value) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const pickFile = () => inputRef.current?.click();

  const onChosen = (e) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const clear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) onChange(file);
  };

  return (
    <div
      className={`image-upload ${value ? 'has-file' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChosen}
        style={{ display: 'none' }}
      />

      {value ? (
        <div className="image-upload-preview">
          <img src={previewUrl} alt="Selected" />
          <div className="image-upload-info">
            <strong>{value.name}</strong>
            <span>{(value.size / 1024).toFixed(0)} KB · ready to upload</span>
            <div className="image-upload-actions">
              <button type="button" className="btn btn-secondary btn-small" onClick={pickFile}>
                Replace
              </button>
              <button type="button" className="btn-text" onClick={clear}>
                <FiX /> Clear
              </button>
            </div>
          </div>
        </div>
      ) : currentImageUrl ? (
        <div className="image-upload-preview">
          <img src={currentImageUrl} alt="Current" />
          <div className="image-upload-info">
            <strong>Current image</strong>
            <span>Drop a new file or click below to replace</span>
            <div className="image-upload-actions">
              <button type="button" className="btn btn-secondary btn-small" onClick={pickFile}>
                <FiImage /> Choose new image
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="image-upload-dropzone" onClick={pickFile}>
          <FiUploadCloud />
          <strong>Click to upload</strong>
          <span>or drag and drop · PNG, JPG, WebP up to 5 MB</span>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
