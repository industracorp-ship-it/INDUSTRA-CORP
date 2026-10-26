import React, { useState } from 'react';

interface IndustraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'gold' | 'light' | 'mono';
  alt?: string;
}

/**
 * Official UTD / Industracorp Golden Brand Logo
 * Rendered using the official high-resolution 3D embossed metallic emblem
 * "INDUSTRA - Trustworthy. Always."
 */
export const IndustraLogo: React.FC<IndustraLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  variant = 'gold',
  alt = 'UTD Industracorp - Trustworthy. Always.',
}) => {
  const [imageError, setImageError] = useState(false);

  // Height / scale mappings tailored to the official 2.56:1 gold crest logo
  const heightClasses: Record<string, string> = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-18',
    xl: 'h-24 sm:h-28',
    '2xl': 'h-32 sm:h-40',
  };

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      {!imageError ? (
        <img
          src="/assets/aistudio/image_c970573c.png"
          alt={alt}
          className={`${heightClasses[size] || heightClasses.md} w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] transition-transform duration-300 hover:scale-[1.03] cursor-pointer`}
          loading="eager"
          decoding="async"
          onError={() => setImageError(true)}
        />
      ) : (
        <img
          src="/logo.png"
          alt={alt}
          className={`${heightClasses[size] || heightClasses.md} w-auto object-contain`}
        />
      )}
    </div>
  );
};
