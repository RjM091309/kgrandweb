import React, { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { X, ZoomIn } from 'lucide-react';

export const LightboxModal: React.FC = () => {
  const { lightboxImage, closeLightbox } = useHotel();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightboxImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImage, closeLightbox]);

  if (!lightboxImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={closeLightbox}
    >
      <button
        onClick={closeLightbox}
        aria-label="Close Lightbox"
        className="absolute top-5 right-5 text-stone-300 hover:text-white p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 transition-colors z-50 cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-h-[78vh] flex items-center justify-center overflow-hidden rounded-lg shadow-2xl bg-stone-950">
          <img
            src={lightboxImage.url}
            alt={lightboxImage.title}
            referrerPolicy="no-referrer"
            className="max-h-[78vh] w-auto max-w-full object-contain rounded-lg"
          />
        </div>
        <div className="w-full mt-3 px-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-stone-200">
          <div>
            <h3 className="text-base sm:text-lg font-serif tracking-wide text-white">
              {lightboxImage.title}
            </h3>
            {lightboxImage.caption && (
              <p className="text-xs text-stone-400 mt-0.5">{lightboxImage.caption}</p>
            )}
          </div>
          <span className="text-xs text-amber-300/80 mt-1 sm:mt-0 font-sans tracking-wider uppercase">
            The K Grand Collection
          </span>
        </div>
      </div>
    </div>
  );
};
