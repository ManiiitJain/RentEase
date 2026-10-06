import React, { useState } from 'react';

export const ImageGallery = ({ images = [], title = 'Property Image' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallback = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
  const validImages = images && images.length > 0 ? images : [fallback];

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md">
        <img
          src={validImages[selectedIndex]}
          alt={`${title} - view ${selectedIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-md font-medium">
          {selectedIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition ${
                selectedIndex === idx
                  ? 'border-primary-600 ring-2 ring-primary-500/20'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
