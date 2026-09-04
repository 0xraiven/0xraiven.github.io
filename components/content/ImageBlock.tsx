import React from 'react';

export interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function ImageBlock({ src, alt, caption, className = '' }: ImageBlockProps) {
  return (
    <figure className={`my-4 rounded border border-border bg-surface overflow-hidden ${className}`}>
      <div className="relative w-full flex items-center justify-center bg-surface-2/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto max-h-[600px] object-contain block mx-auto"
        />
      </div>
      {caption && (
        <figcaption className="p-2.5 text-center text-[11px] text-text-secondary font-mono border-t border-border bg-surface-2/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
