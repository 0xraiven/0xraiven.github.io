import React from 'react';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryBlockProps {
  images: GalleryImage[];
  className?: string;
}

export function GalleryBlock({ images, className = '' }: GalleryBlockProps) {
  if (!images || images.length === 0) return null;

  const cols = images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`my-4 grid ${cols} gap-3 ${className}`}>
      {images.map((img, idx) => (
        <figure
          key={idx}
          className="rounded border border-border bg-surface overflow-hidden flex flex-col justify-between"
        >
          <div className="relative w-full aspect-video bg-surface-2/40 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover block"
            />
          </div>
          {img.caption && (
            <figcaption className="p-2 text-center text-[10px] text-text-secondary font-mono border-t border-border bg-surface-2/60">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
