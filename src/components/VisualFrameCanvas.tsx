import React, { useState, useId } from 'react';

interface VisualFrameCanvasProps {
  title: string;
  caption?: string;
  aspectRatio?: '2.39:1' | '1.85:1' | '1.66:1' | '16:9' | '4:3' | '3:4' | '1:1';
  mediaType?: 'photo' | 'video';
  mediaUrl?: string;
  videoUrl?: string;
  monochrome?: boolean;
  objectPosition?: string;
  compositionType?:
    | 'monsoon-courtyard'
    | 'dusk-streetlamp'
    | 'window-blinds'
    | 'train-platform'
    | 'fincher-symmetry'
    | 'low-key-practical'
    | 'deep-focus-corridor'
    | 'natural-window-frame';
  showGridOverlay?: boolean;
  onManageClick?: () => void;
  className?: string;
}

export const VisualFrameCanvas: React.FC<VisualFrameCanvasProps> = ({
  title,
  caption,
  aspectRatio = '16:9',
  mediaType = 'photo',
  mediaUrl,
  videoUrl,
  monochrome = false,
  objectPosition = '50% 50%',
  compositionType = 'dusk-streetlamp',
  showGridOverlay = false,
  onManageClick,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const uid = useId().replace(/:/g, '');

  const aspectClass =
    aspectRatio === '2.39:1'
      ? 'aspect-[239/100]'
      : aspectRatio === '1.85:1'
        ? 'aspect-[185/100]'
        : aspectRatio === '16:9'
          ? 'aspect-video'
          : aspectRatio === '4:3'
            ? 'aspect-[4/3]'
            : aspectRatio === '3:4'
              ? 'aspect-[3/4]'
              : 'aspect-square';

  if (mediaType === 'video' && videoUrl) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-[#101824] border border-[var(--border-hairline)] ${aspectClass} ${className}`}
      >
        <video
          src={videoUrl}
          controls
          playsInline
          loop
          muted
          preload="metadata"
          style={{ objectPosition }}
          className={`w-full h-full object-cover portrait-theme-grade ${
            monochrome ? 'grayscale contrast-125' : ''
          }`}
          aria-label={caption || title}
        />
      </div>
    );
  }

  if (mediaUrl && !imgError) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-[#101824] border border-[var(--border-hairline)] ${aspectClass} ${className}`}
      >
        <img
          src={mediaUrl}
          alt={caption ? `${title} — ${caption}` : title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          style={{ objectPosition, imageOrientation: 'from-image' }}
          className={`w-full h-full object-cover portrait-theme-grade transition-transform duration-300 ${
            monochrome ? 'grayscale contrast-115' : ''
          }`}
        />
        {showGridOverlay && (
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            <div className="border-r border-b border-[#241C19]/30" />
            <div className="border-r border-b border-[#241C19]/30" />
            <div className="border-b border-[#241C19]/30" />
            <div className="border-r border-b border-[#241C19]/30" />
            <div className="border-r border-b border-[#241C19]/30" />
            <div className="border-b border-[#241C19]/30" />
            <div className="border-r border-[#241C19]/30" />
            <div className="border-r border-[#241C19]/30" />
            <div />
          </div>
        )}
      </div>
    );
  }

  // Wes Anderson Kodak Vision3 50D / 2383 Print Film Color-Graded Light Studies
  // Palette: #C84B31 (Terracotta), #D99B26 (Mustard), #4F7CAC (Powder Blue), #5B7A57 (Pistachio Sage), #E29597 (Mendl's Pink), #F7F1E3 (Parchment)
  const isGrandBudapestCorridor =
    compositionType === 'train-platform' ||
    compositionType === 'deep-focus-corridor' ||
    compositionType === 'fincher-symmetry';

  const isBelafonteCoast =
    compositionType === 'monsoon-courtyard' || compositionType === 'natural-window-frame';

  return (
    <div
      className={`group relative w-full overflow-hidden border border-[var(--border-hairline)] bg-[#EFE5CE] ${aspectClass} ${
        monochrome ? 'grayscale' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 960 400"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        role="img"
        aria-label={caption || title}
      >
        <defs>
          <filter id={`halation-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="32" result="blur" />
          </filter>
          <filter id={`softblur-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          {/* 35mm Kodak Celluloid Grain */}
          <filter id={`grain-${uid}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.78"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.055 0"
              in="noise"
              result="coloredNoise"
            />
          </filter>

          <linearGradient id={`skyGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={
                isGrandBudapestCorridor
                  ? '#E29597'
                  : isBelafonteCoast
                    ? '#4F7CAC'
                    : '#F7F1E3'
              }
            />
            <stop
              offset="58%"
              stopColor={
                isGrandBudapestCorridor
                  ? '#F4DCDD'
                  : isBelafonteCoast
                    ? '#E8DFCB'
                    : '#E29597'
              }
              stopOpacity="0.85"
            />
            <stop offset="100%" stopColor="#D99B26" stopOpacity="0.55" />
          </linearGradient>

          <radialGradient id={`sunBloom-${uid}`} cx="50%" cy="42%" r="48%">
            <stop offset="0%" stopColor="#F7F1E3" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#D99B26" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#C84B31" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Warm Kodak Print Film Base Sky */}
        <rect width="960" height="400" fill={`url(#skyGrad-${uid})`} />

        {/* Symmetrical Pastel & Jewel-Tone Light Pools */}
        <g filter={`url(#halation-${uid})`} className="ambient-light-drift">
          <ellipse cx="480" cy="175" rx="320" ry="145" fill={`url(#sunBloom-${uid})`} />
          <ellipse
            cx="220"
            cy="210"
            rx="220"
            ry="120"
            fill={isGrandBudapestCorridor ? '#C84B31' : '#4F7CAC'}
            fillOpacity="0.38"
          />
          <ellipse
            cx="740"
            cy="210"
            rx="220"
            ry="120"
            fill={isGrandBudapestCorridor ? '#C84B31' : '#5B7A57'}
            fillOpacity="0.38"
          />
        </g>

        {/* Symmetrical Planimetric Architectural Planes (Wes Anderson Dollhouse / Diorama Framing) */}
        {isGrandBudapestCorridor ? (
          <g>
            {/* Outer Zubrowka Crimson Flanking Walls */}
            <rect x="0" y="0" width="170" height="305" fill="#C84B31" fillOpacity="0.78" />
            <rect x="790" y="0" width="170" height="305" fill="#C84B31" fillOpacity="0.78" />
            {/* Inner Mendl's Pink & Mustard Pilasters */}
            <rect x="170" y="24" width="110" height="281" fill="#E29597" fillOpacity="0.82" />
            <rect x="680" y="24" width="110" height="281" fill="#E29597" fillOpacity="0.82" />
            {/* Central Deep-Focus Archway */}
            <rect x="370" y="56" width="220" height="249" fill="#F7F1E3" fillOpacity="0.88" />
            <rect x="415" y="92" width="130" height="213" fill="#D99B26" fillOpacity="0.52" />
            {/* Carpet Runner */}
            <polygon
              points="370,305 590,305 740,400 220,400"
              fill="#C84B31"
              fillOpacity="0.88"
            />
            <polygon
              points="400,305 560,305 680,400 280,400"
              fill="#D99B26"
              fillOpacity="0.72"
            />
          </g>
        ) : isBelafonteCoast ? (
          <g>
            {/* Horizon Sea Band in Belafonte Powder Blue & Pistachio Sage */}
            <rect x="0" y="220" width="960" height="85" fill="#4F7CAC" fillOpacity="0.78" />
            <rect x="0" y="305" width="960" height="95" fill="#5B7A57" fillOpacity="0.82" />
            {/* Symmetrical Observation Window Frame */}
            <rect x="350" y="48" width="260" height="257" fill="#F7F1E3" fillOpacity="0.35" stroke="#241C19" strokeOpacity="0.25" strokeWidth="2" />
            <line x1="480" y1="48" x2="480" y2="305" stroke="#241C19" strokeOpacity="0.22" strokeWidth="2" />
            <line x1="350" y1="176" x2="610" y2="176" stroke="#241C19" strokeOpacity="0.22" strokeWidth="2" />
          </g>
        ) : (
          <g>
            {/* Warm Mustard & Pistachio Wainscoting */}
            <rect x="0" y="285" width="960" height="115" fill="#5B7A57" fillOpacity="0.78" />
            <rect x="0" y="277" width="960" height="8" fill="#D99B26" fillOpacity="0.88" />
            {/* Symmetrical Diptych Window Frames */}
            <rect x="180" y="44" width="240" height="200" fill="#4F7CAC" fillOpacity="0.48" />
            <rect x="540" y="44" width="240" height="200" fill="#4F7CAC" fillOpacity="0.48" />
            {/* Terracotta Center Mullion */}
            <rect x="468" y="0" width="24" height="285" fill="#C84B31" fillOpacity="0.75" />
          </g>
        )}

        {/* Subtle Center-Axis Planimetric Registration Hairlines */}
        <line
          x1="480"
          y1="0"
          x2="480"
          y2="400"
          stroke="#241C19"
          strokeOpacity="0.14"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="200"
          x2="960"
          y2="200"
          stroke="#241C19"
          strokeOpacity="0.12"
          strokeDasharray="4 6"
          strokeWidth="1"
        />

        {/* 35mm Kodak Celluloid Grain Texture Overlay */}
        <rect width="960" height="400" filter={`url(#grain-${uid})`} />
      </svg>

      {/* Optional Rule-of-Thirds Optical Crosshair Overlay */}
      {showGridOverlay && (
        <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
          <div className="border-r border-b border-[#241C19]/25" />
          <div className="border-r border-b border-[#241C19]/25" />
          <div className="border-b border-[#241C19]/25" />
          <div className="border-r border-b border-[#241C19]/25" />
          <div className="border-r border-b border-[#241C19]/25" />
          <div className="border-b border-[#241C19]/25" />
          <div className="border-r border-[#241C19]/25" />
          <div className="border-r border-[#241C19]/25" />
          <div />
        </div>
      )}

      {/* 35mm Kodak Print Film Rebate Bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#241C19]/88 px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-[10px] font-mono-meta tracking-wider text-[#F7F1E3]/90 uppercase">
          <span>KODAK 2383 PRINT</span>
          <span className="text-[#D99B26]">·</span>
          <span className="text-[#E29597]">{aspectRatio}</span>
        </div>

        {/* Five-color Wes Anderson tonal reference strip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" aria-hidden="true">
            <span className="w-2.5 h-2.5 bg-[#C84B31]" />
            <span className="w-2.5 h-2.5 bg-[#D99B26]" />
            <span className="w-2.5 h-2.5 bg-[#4F7CAC]" />
            <span className="w-2.5 h-2.5 bg-[#5B7A57]" />
            <span className="w-2.5 h-2.5 bg-[#E29597]" />
          </div>
          {onManageClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onManageClick();
              }}
              className="pointer-events-auto text-[11px] font-mono-meta text-[#D99B26] underline underline-offset-4 hover:text-[#E29597] transition-colors whitespace-nowrap shrink-0"
            >
              Replace still →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
