import React from 'react';
import { CharacterConfig } from '../types/game';

interface Props {
  config: CharacterConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inWater?: boolean;
  isCelebrating?: boolean;
}

export const CharacterAvatar: React.FC<Props> = ({
  config,
  size = 'md',
  inWater = false,
  isCelebrating = false,
}) => {
  const { gender, expression, outfit } = config;

  // Dimensions
  const dim = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  }[size];

  return (
    <div className={`relative ${dim} inline-flex items-center justify-center select-none ${isCelebrating ? 'animate-bounce' : ''}`}>
      <svg
        viewBox="0 0 160 180"
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde0c5" />
            <stop offset="100%" stopColor="#f5be98" />
          </linearGradient>
          <linearGradient id="duckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="waterRipples" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Back Hair */}
        {gender === 'female' && (
          <g id="female-back-hair">
            <path
              d="M 50 60 C 30 75, 20 120, 30 135 C 40 125, 45 105, 52 90 Z"
              fill="#292524"
            />
            <path
              d="M 110 60 C 130 75, 140 120, 130 135 C 120 125, 115 105, 108 90 Z"
              fill="#292524"
            />
            {/* Cute Pigtails or Hair Ribbon */}
            <circle cx="36" cy="115" r="7" fill="#f43f5e" />
            <circle cx="124" cy="115" r="7" fill="#f43f5e" />
          </g>
        )}

        {/* Body & Clothing */}
        <g id="body-and-outfit">
          {/* Base Torso */}
          <rect x="52" y="98" width="56" height="58" rx="14" fill="#3b82f6" />

          {/* OUTFIT SPECIFIC RENDERING */}
          {/* 1. Football Jersey + Flip Flops (Male) */}
          {outfit === 'football' && (
            <g id="outfit-football">
              <rect x="52" y="98" width="56" height="52" rx="14" fill="#ef4444" />
              {/* White stripes */}
              <line x1="68" y1="98" x2="68" y2="150" stroke="#ffffff" strokeWidth="4" />
              <line x1="92" y1="98" x2="92" y2="150" stroke="#ffffff" strokeWidth="4" />
              {/* Number 7 */}
              <text x="80" y="130" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
                7
              </text>
              {/* Arms */}
              <rect x="36" y="104" width="18" height="30" rx="8" fill="url(#skinGrad)" />
              <rect x="106" y="104" width="18" height="30" rx="8" fill="url(#skinGrad)" />
            </g>
          )}

          {/* 2. Yellow Duck Floatie (Male) */}
          {outfit === 'yellow_duck' && (
            <g id="outfit-yellow-duck">
              {/* Vest Base */}
              <rect x="52" y="98" width="56" height="50" rx="14" fill="#facc15" />
              {/* Giant Duck Ring around waist */}
              <ellipse cx="80" cy="142" rx="46" ry="24" fill="url(#duckGrad)" stroke="#ca8a04" strokeWidth="2.5" />
              {/* Duck Head on front */}
              <circle cx="48" cy="125" r="14" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="44" cy="122" r="2.5" fill="#18181b" />
              {/* Duck Beak */}
              <polygon points="34,124 44,127 43,132 32,127" fill="#ea580c" />
              {/* Arm holding floatie */}
              <circle cx="114" cy="130" r="10" fill="url(#skinGrad)" />
            </g>
          )}

          {/* 3. Pha Khao Ma + Ngop Farmer Hat (Male) */}
          {outfit === 'pha_khao_ma' && (
            <g id="outfit-pha-khao-ma">
              {/* Bare chest with checkered sash */}
              <rect x="52" y="98" width="56" height="52" rx="14" fill="url(#skinGrad)" />
              {/* Diagonal Checkered cloth */}
              <path
                d="M 50 102 L 72 98 L 108 144 L 92 152 Z"
                fill="#dc2626"
              />
              <path
                d="M 52 104 L 70 100 L 106 146 L 90 152 Z"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />
              {/* Blue shorts */}
              <rect x="54" y="142" width="52" height="18" rx="4" fill="#1e3a8a" />
            </g>
          )}

          {/* 4. Bean Pajamas (Female) */}
          {outfit === 'bean_pajama' && (
            <g id="outfit-bean-pajama">
              <rect x="52" y="98" width="56" height="52" rx="14" fill="#bbf7d0" />
              {/* Cute little peanut/bean pattern */}
              <ellipse cx="64" cy="112" rx="5" ry="3" fill="#15803d" transform="rotate(-20 64 112)" />
              <ellipse cx="94" cy="116" rx="5" ry="3" fill="#15803d" transform="rotate(25 94 116)" />
              <ellipse cx="78" cy="132" rx="5" ry="3" fill="#15803d" transform="rotate(-15 78 132)" />
              <ellipse cx="62" cy="140" rx="5" ry="3" fill="#15803d" transform="rotate(30 62 140)" />
              <ellipse cx="96" cy="142" rx="5" ry="3" fill="#15803d" transform="rotate(-10 96 142)" />
              {/* Arms */}
              <rect x="36" y="104" width="18" height="30" rx="8" fill="#bbf7d0" />
              <rect x="106" y="104" width="18" height="30" rx="8" fill="#bbf7d0" />
            </g>
          )}

          {/* 5. Pink Life Vest (Female) */}
          {outfit === 'pink_vest' && (
            <g id="outfit-pink-vest">
              {/* White inner shirt */}
              <rect x="52" y="98" width="56" height="52" rx="14" fill="#ffffff" />
              {/* Pink vest panels */}
              <path d="M 52 98 L 68 98 L 66 148 L 52 144 Z" fill="#ec4899" />
              <path d="M 108 98 L 92 98 L 94 148 L 108 144 Z" fill="#ec4899" />
              {/* Buckles */}
              <rect x="68" y="114" width="24" height="4" fill="#1f2937" rx="1" />
              <rect x="68" y="130" width="24" height="4" fill="#1f2937" rx="1" />
              {/* Arms */}
              <rect x="36" y="104" width="18" height="30" rx="8" fill="url(#skinGrad)" />
              <rect x="106" y="104" width="18" height="30" rx="8" fill="url(#skinGrad)" />
            </g>
          )}

          {/* 6. Market Vendor (Female) */}
          {outfit === 'vendor' && (
            <g id="outfit-vendor">
              {/* Floral shirt */}
              <rect x="52" y="98" width="56" height="52" rx="14" fill="#fb923c" />
              {/* Blue/Navy Apron with Money pocket */}
              <path d="M 60 112 L 100 112 L 104 150 L 56 150 Z" fill="#0284c7" />
              {/* Apron Money Zipper Pocket */}
              <rect x="66" y="128" width="28" height="15" rx="3" fill="#0369a1" />
              <text x="80" y="139" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fef08a">
                ฿
              </text>
              {/* White towel on neck */}
              <path d="M 64 98 C 68 116, 68 124, 62 134" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          )}
        </g>

        {/* Head */}
        <g id="head">
          {/* Ears */}
          <circle cx="48" cy="62" r="9" fill="url(#skinGrad)" />
          <circle cx="112" cy="62" r="9" fill="url(#skinGrad)" />

          {/* Face Base */}
          <circle cx="80" cy="60" r="32" fill="url(#skinGrad)" />

          {/* Male Front Hair */}
          {gender === 'male' && outfit !== 'pha_khao_ma' && (
            <path
              d="M 46 54 C 48 30, 72 26, 80 26 C 94 26, 114 30, 114 54 C 106 42, 94 40, 84 43 C 74 41, 60 42, 46 54 Z"
              fill="#1c1917"
            />
          )}

          {/* Female Bangs */}
          {gender === 'female' && (
            <path
              d="M 46 52 C 48 34, 70 28, 80 28 C 96 28, 114 34, 114 52 C 106 44, 94 42, 82 46 C 70 42, 58 44, 46 52 Z"
              fill="#292524"
            />
          )}

          {/* Hats: Ngop (Farmer conical hat) */}
          {outfit === 'pha_khao_ma' && (
            <g id="ngop-hat">
              {/* Woven conical hat */}
              <polygon points="80,10 24,48 136,48" fill="#d97706" stroke="#b45309" strokeWidth="2" />
              <line x1="80" y1="10" x2="80" y2="48" stroke="#fef3c7" strokeWidth="1.5" />
              <line x1="80" y1="10" x2="52" y2="48" stroke="#fef3c7" strokeWidth="1.5" />
              <line x1="80" y1="10" x2="108" y2="48" stroke="#fef3c7" strokeWidth="1.5" />
            </g>
          )}

          {/* Eyebrows */}
          {expression === 'smile' && (
            <>
              <path d="M 62 48 Q 69 44 75 48" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 85 48 Q 91 44 98 48" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}
          {expression === 'sleepy' && (
            <>
              <path d="M 62 50 Q 69 52 75 51" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 85 51 Q 91 52 98 50" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}
          {expression === 'pout' && (
            <>
              <path d="M 62 47 L 75 51" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 98 47 L 85 51" stroke="#292524" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Eyes & Expressions */}
          {expression === 'smile' && (
            <g id="face-smile">
              {/* Determined Grinning Eyes */}
              <ellipse cx="68" cy="58" rx="4.5" ry="5.5" fill="#18181b" />
              <ellipse cx="92" cy="58" rx="4.5" ry="5.5" fill="#18181b" />
              {/* Eye sparkle */}
              <circle cx="69.5" cy="56" r="1.5" fill="#ffffff" />
              <circle cx="93.5" cy="56" r="1.5" fill="#ffffff" />
              {/* Big Smiling Mouth */}
              <path d="M 68 70 Q 80 82 92 70 Z" fill="#e11d48" stroke="#881337" strokeWidth="1" />
              <path d="M 72 70 Q 80 74 88 70" fill="#ffffff" />
              {/* Sweat drop of struggling humor */}
              <path d="M 104 46 C 102 43, 105 40, 107 43 C 109 46, 106 48, 104 46 Z" fill="#38bdf8" />
            </g>
          )}

          {expression === 'sleepy' && (
            <g id="face-sleepy">
              {/* Half-closed / droopy eyes */}
              <path d="M 62 60 Q 68 56 74 60" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 86 60 Q 92 56 98 60" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Drool or yawn mouth */}
              <ellipse cx="80" cy="72" rx="4" ry="5" fill="#e11d48" />
              {/* Snot bubble / zzz */}
              <circle cx="86" cy="69" r="3.5" fill="#93c5fd" opacity="0.8" />
            </g>
          )}

          {expression === 'pout' && (
            <g id="face-pout">
              {/* Wide angry/pouting eyes */}
              <ellipse cx="68" cy="58" rx="5" ry="5" fill="#18181b" />
              <ellipse cx="92" cy="58" rx="5" ry="5" fill="#18181b" />
              <circle cx="69" cy="57" r="1.5" fill="#ffffff" />
              <circle cx="93" cy="57" r="1.5" fill="#ffffff" />
              {/* Puffed cheeks */}
              <circle cx="58" cy="66" r="6" fill="#f43f5e" opacity="0.4" />
              <circle cx="102" cy="66" r="6" fill="#f43f5e" opacity="0.4" />
              {/* Inverted / Pouting mouth */}
              <path d="M 72 74 Q 80 67 88 74" stroke="#881337" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          )}
        </g>

        {/* Flood Water Wave Overlap if in water */}
        {inWater && (
          <g id="water-overlay">
            <path
              d="M 10 148 Q 40 142 80 148 Q 120 154 150 148 L 150 178 L 10 178 Z"
              fill="url(#waterRipples)"
            />
            <path
              d="M 10 148 Q 40 142 80 148 Q 120 154 150 148"
              stroke="#e0f2fe"
              strokeWidth="3"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
