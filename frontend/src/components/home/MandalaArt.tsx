import { cn } from '@/lib/utils'

interface MandalaArtProps {
  /** Variant of the mandala design */
  variant?: 'lotus' | 'bridal'
  /** Additional CSS classes for sizing and positioning */
  className?: string
}

export default function MandalaArt({
  variant = 'lotus',
  className,
}: MandalaArtProps) {
  // Pre-calculated rotation angles for clean, hardware-accelerated SVG reuse
  const angles12 = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
  const angles16 = [
    0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5,
  ]
  const angles24 = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285,
    300, 315, 330, 345,
  ]

  const isLotus = variant === 'lotus'

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none pointer-events-none',
        className
      )}
      aria-hidden="true"
    >
      {/* Soft warm antique-gold atmospheric radial glow */}
      <div
        className="absolute inset-0 rounded-full bg-radial from-antique-gold/25 via-antique-gold/10 to-transparent blur-2xl transform scale-110"
        aria-hidden="true"
      />

      <svg
        viewBox="-250 -250 500 500"
        className="relative w-full h-full drop-shadow-[0_4px_24px_rgba(212,175,55,0.28)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Gold Linear Gradients */}
          <linearGradient id={`goldGrad-${variant}`} x1="-200" y1="-200" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF2B8" />
            <stop offset="25%" stopColor="#E5C158" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="75%" stopColor="#A67C1E" />
            <stop offset="100%" stopColor="#E5C158" />
          </linearGradient>

          <linearGradient id={`goldAccent-${variant}`} x1="0" y1="-250" x2="0" y2="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFECA0" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C6514" />
          </linearGradient>

          {/* Reusable Petal / Flourish Definitions for Variant 1: Lotus Tradition */}
          <g id={`innerPetal-lotus`}>
            {/* Scalloped floral teardrop petal */}
            <path
              d="M 0 -58 C 12 -75, 18 -98, 0 -118 C -18 -98, -12 -75, 0 -58 Z"
              fill={`url(#goldGrad-${variant})`}
              fillOpacity="0.12"
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="1.4"
            />
            {/* Inner filigree vein */}
            <path
              d="M 0 -64 Q 0 -88 0 -112"
              stroke={`url(#goldAccent-${variant})`}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Mini internal teardrop dot */}
            <circle cx="0" cy="-90" r="2" fill={`url(#goldGrad-${variant})`} />
          </g>

          <g id={`outerCrown-lotus`}>
            {/* Grand pointed lotus flame petal */}
            <path
              d="M -12 -126 C -20 -150, -18 -180, 0 -210 C 18 -180, 20 -150, 12 -126 Q 0 -134 -12 -126 Z"
              fill={`url(#goldGrad-${variant})`}
              fillOpacity="0.08"
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="1.5"
            />
            {/* Internal leaf ribbing */}
            <path
              d="M 0 -138 Q 0 -168 0 -200"
              stroke={`url(#goldAccent-${variant})`}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M -5 -160 Q 0 -170 5 -160"
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="1"
            />
            <path
              d="M -7 -146 Q 0 -156 7 -146"
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="1"
            />
            {/* Tip Pearl Finial */}
            <circle cx="0" cy="-215" r="3" fill="#FFF4C2" stroke={`url(#goldGrad-${variant})`} strokeWidth="1" />
          </g>

          <g id={`sunRay-lotus`}>
            {/* Fine sunburst ray with teardrop bead */}
            <line x1="0" y1="-222" x2="0" y2="-236" stroke={`url(#goldGrad-${variant})`} strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="0" cy="-240" r="1.8" fill={`url(#goldGrad-${variant})`} />
          </g>

          {/* Reusable Petal / Flourish Definitions for Variant 2: Bridal Masterpiece */}
          <g id={`innerPetal-bridal`}>
            {/* Ornate Indian Paisley / Mango arch */}
            <path
              d="M -7 -54 C -16 -70, -14 -96, 0 -115 C 14 -96, 16 -70, 7 -54 Z"
              fill={`url(#goldGrad-${variant})`}
              fillOpacity="0.14"
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="1.4"
            />
            <path
              d="M 0 -60 L 0 -108"
              stroke={`url(#goldAccent-${variant})`}
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            <circle cx="0" cy="-86" r="2.4" fill={`url(#goldAccent-${variant})`} />
          </g>

          <g id={`outerCrown-bridal`}>
            {/* Royal bridal scalloped palace arch crown */}
            <path
              d="M -16 -124 C -28 -148, -26 -182, 0 -214 C 26 -182, 28 -148, 16 -124 C 8 -130, -8 -130, -16 -124 Z"
              fill={`url(#goldGrad-${variant})`}
              fillOpacity="0.09"
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="1.5"
            />
            {/* Ornate concentric chevron arch */}
            <path
              d="M -9 -140 Q 0 -160 9 -140"
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="1.2"
            />
            <path
              d="M -12 -158 Q 0 -182 12 -158"
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="1.2"
            />
            <circle cx="0" cy="-196" r="2.2" fill={`url(#goldGrad-${variant})`} />
            {/* Finial Lotus Blossom Crown Tip */}
            <circle cx="0" cy="-219" r="3.2" fill="#FFF4C2" stroke={`url(#goldGrad-${variant})`} strokeWidth="1" />
          </g>

          <g id={`sunRay-bridal`}>
            <line x1="0" y1="-224" x2="0" y2="-242" stroke={`url(#goldGrad-${variant})`} strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="0" cy="-245" r="2" fill={`url(#goldGrad-${variant})`} />
          </g>
        </defs>

        {/* ── Rotating Mandala Outer & Middle Layers ── */}
        <g className="animate-spin-slow origin-center">
          {/* Subtle Outer Boundary Halo Rings */}
          <circle cx="0" cy="0" r="236" stroke={`url(#goldGrad-${variant})`} strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 4" />
          <circle cx="0" cy="0" r="222" stroke={`url(#goldGrad-${variant})`} strokeWidth="1.2" strokeOpacity="0.65" />
          <circle cx="0" cy="0" r="126" stroke={`url(#goldGrad-${variant})`} strokeWidth="1.2" strokeOpacity="0.75" />
          <circle cx="0" cy="0" r="118" stroke={`url(#goldGrad-${variant})`} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 3" />
          <circle cx="0" cy="0" r="56" stroke={`url(#goldGrad-${variant})`} strokeWidth="1.4" strokeOpacity="0.8" />
          <circle cx="0" cy="0" r="48" stroke={`url(#goldGrad-${variant})`} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="2 2" />

          {/* Outer Sunburst Ray Points */}
          {(isLotus ? angles24 : angles16).map((angle, i) => (
            <use
              key={`ray-${i}`}
              href={isLotus ? `#sunRay-lotus` : `#sunRay-bridal`}
              transform={`rotate(${angle + (isLotus ? 7.5 : 11.25)})`}
            />
          ))}

          {/* Outer Grand Petal Crowns */}
          {(isLotus ? angles24 : angles16).map((angle, i) => (
            <use
              key={`outer-${i}`}
              href={isLotus ? `#outerCrown-lotus` : `#outerCrown-bridal`}
              transform={`rotate(${angle})`}
            />
          ))}

          {/* Middle Dotted Bead Ring (Pearls of Sojat) */}
          {angles24.map((angle, i) => (
            <g key={`bead-${i}`} transform={`rotate(${angle})`}>
              <circle cx="0" cy="-122" r="2.2" fill={`url(#goldGrad-${variant})`} />
            </g>
          ))}

          {/* Inner Petal Ring */}
          {(isLotus ? angles12 : angles16).map((angle, i) => (
            <use
              key={`inner-${i}`}
              href={isLotus ? `#innerPetal-lotus` : `#innerPetal-bridal`}
              transform={`rotate(${angle + (isLotus ? 15 : 0)})`}
            />
          ))}

          {/* Center Beaded Pearl Ring */}
          {angles24.map((angle, i) => (
            <g key={`innerBead-${i}`} transform={`rotate(${angle})`}>
              <circle cx="0" cy="-52" r="1.8" fill={`url(#goldGrad-${variant})`} />
            </g>
          ))}
        </g>

        {/* ── Center Emblem: Lotus Flower Centerpiece (Remains Gracefully Upright) ── */}
        <g className="origin-center">
          {/* Inner Golden Medallion Disc */}
          <circle cx="0" cy="0" r="44" fill="#1B3322" stroke={`url(#goldGrad-${variant})`} strokeWidth="2" />
          <circle cx="0" cy="0" r="40" fill="none" stroke={`url(#goldGrad-${variant})`} strokeWidth="0.8" strokeDasharray="3 2" />

          {isLotus ? (
            /* Sacred Henna Lotus Flower (Similar to brand logo emblem) */
            <g transform="translate(0, 3) scale(0.92)">
              {/* Central Tall Petal */}
              <path
                d="M 0 -34 C 11 -24, 13 -9, 0 11 C -13 -9, -11 -24, 0 -34 Z"
                fill={`url(#goldGrad-${variant})`}
                stroke="#FFF2B8"
                strokeWidth="1.2"
              />
              {/* Left Main Lotus Petal */}
              <path
                d="M -2 0 C -15 -14, -26 -8, -22 6 C -18 16, -7 13, 0 11"
                fill={`url(#goldGrad-${variant})`}
                fillOpacity="0.88"
                stroke="#FFF2B8"
                strokeWidth="1.2"
              />
              {/* Right Main Lotus Petal */}
              <path
                d="M 2 0 C 15 -14, 26 -8, 22 6 C 18 16, 7 13, 0 11"
                fill={`url(#goldGrad-${variant})`}
                fillOpacity="0.88"
                stroke="#FFF2B8"
                strokeWidth="1.2"
              />
              {/* Left Outer Accent Wing */}
              <path
                d="M -8 8 C -22 3, -30 14, -18 20 C -10 22, -3 15, 0 12"
                fill={`url(#goldGrad-${variant})`}
                fillOpacity="0.75"
                stroke="#FFECA0"
                strokeWidth="1"
              />
              {/* Right Outer Accent Wing */}
              <path
                d="M 8 8 C 22 3, 30 14, 18 20 C 10 22, 3 15, 0 12"
                fill={`url(#goldGrad-${variant})`}
                fillOpacity="0.75"
                stroke="#FFECA0"
                strokeWidth="1"
              />
              {/* Ornamental Base Lotus Throne */}
              <path
                d="M -16 18 Q 0 24 16 18 Q 0 15 -16 18 Z"
                fill="#FFF4C2"
                stroke={`url(#goldGrad-${variant})`}
                strokeWidth="1"
              />
              {/* Golden Pollen Core Dot */}
              <circle cx="0" cy="-6" r="2.5" fill="#FFF9DF" />
            </g>
          ) : (
            /* Bridal Royal Star Lotus Medallion */
            <g transform="scale(0.92)">
              {/* 8-point royal flower medallion */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <g key={`starPetal-${i}`} transform={`rotate(${angle})`}>
                  <path
                    d="M 0 0 C 6 -12, 10 -22, 0 -30 C -10 -22, -6 -12, 0 0 Z"
                    fill={`url(#goldGrad-${variant})`}
                    stroke="#FFF2B8"
                    strokeWidth="1.2"
                  />
                  <circle cx="0" cy="-18" r="1.5" fill="#FFF9DF" />
                </g>
              ))}
              {/* Center Royal Jewel */}
              <circle cx="0" cy="0" r="10" fill="#243F2A" stroke={`url(#goldGrad-${variant})`} strokeWidth="1.5" />
              <circle cx="0" cy="0" r="5" fill={`url(#goldAccent-${variant})`} />
              <circle cx="0" cy="0" r="2" fill="#FFFDF0" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}
