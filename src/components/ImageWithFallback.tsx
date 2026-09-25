import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'BURGER HOME',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 p-4 select-none ${className}`}
        aria-label={alt}
      >
        <Utensils className="w-8 h-8 stroke-[1.5] text-neutral-400 mb-1" />
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider text-center">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
};
