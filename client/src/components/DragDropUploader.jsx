import React, { useState, useRef } from 'react';
import { uploadAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  UploadCloud,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  Star,
} from 'lucide-react';

export const DragDropUploader = ({ imageUrls = [], onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const fileInputRef = useRef(null);

  // Drag and drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(files);
    }
  };

  const processFiles = async (files) => {
    const validImageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (validImageFiles.length === 0) {
      toast.error('Please drop valid image files (JPG, PNG, WebP).');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      validImageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await uploadAPI.uploadImages(formData);
      if (res.data.success && res.data.urls) {
        onChange([...imageUrls, ...res.data.urls]);
        toast.success(`${res.data.urls.length} image(s) uploaded successfully!`);
      }
    } catch (error) {
      console.warn('API upload error, using local object URLs as fallback:', error);
      // Fallback: convert to local data preview URLs
      const localUrls = validImageFiles.map((file) => URL.createObjectURL(file));
      onChange([...imageUrls, ...localUrls]);
      toast.success(`${localUrls.length} image(s) added!`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    onChange([...imageUrls, newUrl.trim()]);
    setNewUrl('');
    toast.success('Image URL added!');
  };

  const handleRemove = (index) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetCover = (index) => {
    if (index === 0) return;
    const selected = imageUrls[index];
    const filtered = imageUrls.filter((_, i) => i !== index);
    onChange([selected, ...filtered]);
    toast.success('Set as primary cover image!');
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Target Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-primary-500 bg-primary-50/70 scale-[1.01] ring-4 ring-primary-500/20 shadow-lg'
            : 'border-slate-300 hover:border-primary-400 bg-slate-50/60 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isDragging
                ? 'bg-primary-600 text-white scale-110 shadow-md'
                : 'bg-white text-primary-600 shadow-sm border border-slate-200'
            }`}
          >
            {uploading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              {isDragging ? 'Drop images to upload right now' : 'Drag & drop property images here'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              or <span className="text-primary-600 font-semibold underline">browse files</span> from your computer
            </p>
          </div>

          <p className="text-[11px] text-slate-400">
            Supports JPG, PNG, WEBP up to 5MB each. First image becomes the listing cover.
          </p>
        </div>
      </div>

      {/* Manual URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Or paste an image URL (Unsplash, Cloudinary, etc.)..."
          className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add URL</span>
        </button>
      </div>

      {/* Image Preview Gallery with Drag & Cover Controls */}
      {imageUrls.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              Uploaded Photos ({imageUrls.length})
            </span>
            <span>Click star to set as cover</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-sm"
              >
                <img
                  src={url}
                  alt={`Property preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover badge */}
                {idx === 0 ? (
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary-600 text-white shadow-sm flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Cover Photo</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetCover(idx)}
                    className="absolute top-2 left-2 p-1.5 rounded-lg bg-slate-900/70 hover:bg-primary-600 text-white opacity-0 group-hover:opacity-100 transition shadow-sm"
                    title="Make cover image"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white opacity-0 group-hover:opacity-100 transition shadow-sm"
                  title="Remove image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
