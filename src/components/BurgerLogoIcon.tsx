import React from 'react';

interface BurgerLogoIconProps {
  className?: string;
}

export const BurgerLogoIcon: React.FC<BurgerLogoIconProps> = ({ className = 'w-7 h-7' }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 flex-shrink-0 aspect-square select-none ${className}`}
      style={{ aspectRatio: '1 / 1' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="burgerBadgeGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Brand Icon Badge Base */}
      <rect width="32" height="32" rx="8" fill="url(#burgerBadgeGrad)" />

      {/* Inner subtle glow border */}
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="7.25"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />

      {/* Top Brioche Bun */}
      <path
        d="M8.5 12.2C8.5 8.2 11.8 6 16 6C20.2 6 23.5 8.2 23.5 12.2H8.5Z"
        fill="white"
      />

      {/* Sesame Seeds */}
      <ellipse cx="12" cy="8.8" rx="0.7" ry="0.45" fill="#A7F3D0" />
      <ellipse cx="16" cy="7.8" rx="0.7" ry="0.45" fill="#A7F3D0" />
      <ellipse cx="20" cy="8.8" rx="0.7" ry="0.45" fill="#A7F3D0" />

      {/* Crisp Melted Cheddar Accent */}
      <path
        d="M7 13.8H25L23.2 15.6L17.5 16.2L16 17.5L14.5 16.2L8.8 15.6L7 13.8Z"
        fill="#FDE047"
      />

      {/* Grilled Beef Patty */}
      <rect
        x="7"
        y="16.5"
        width="18"
        height="3"
        rx="1.5"
        fill="white"
        fillOpacity="0.95"
      />

      {/* Bottom Bun */}
      <path
        d="M9 20.8H23C23 23 20.4 24.2 16 24.2C11.6 24.2 9 23 9 20.8Z"
        fill="white"
      />
    </svg>
  );
};
