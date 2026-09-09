import React from 'react';

interface SiemLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const SiemLogo: React.FC<SiemLogoProps> = ({ className = 'h-14', size, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SIEM Official Vector Seal */}
      <svg
        viewBox="0 0 140 140"
        className="h-full w-auto aspect-square shrink-0"
        style={size ? { width: size, height: size } : undefined}
      >
        <defs>
          <linearGradient id="siemBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b2e59" />
            <stop offset="100%" stopColor="#1e5288" />
          </linearGradient>
          <path
            id="textArc"
            d="M 22 70 A 48 48 0 1 1 118 70"
            fill="none"
          />
        </defs>

        {/* Double Outer Rings */}
        <circle cx="70" cy="70" r="66" fill="none" stroke="#0b2e59" strokeWidth="4" />
        <circle cx="70" cy="70" r="59" fill="#f8fafc" stroke="#1e5288" strokeWidth="2" />

        {/* Arc text on top */}
        <text fontSize="7.5" fontWeight="bold" fill="#0b2e59" letterSpacing="1.2">
          <textPath href="#textArc" startOffset="50%" textAnchor="middle">
            INNOVACIÓN EN CADA MEDICIÓN
          </textPath>
        </text>

        {/* Inner Blue Shield / Gauge Disc */}
        <circle cx="70" cy="74" r="38" fill="url(#siemBlueGrad)" stroke="#0b2e59" strokeWidth="2" />
        <circle cx="70" cy="74" r="34" fill="none" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 2" />

        {/* Precision Micrometer / Dial Indicator Needle & Gears in Center */}
        <path
          d="M 52 74 L 88 74 M 70 56 L 70 92"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="70" cy="74" r="10" fill="#ffffff" stroke="#0b2e59" strokeWidth="2" />
        <circle cx="70" cy="74" r="4" fill="#0b2e59" />
        
        {/* Vernier Caliper Jaws hint */}
        <path
          d="M 56 62 L 64 74 L 56 86 M 84 62 L 76 74 L 84 86"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dial ticks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 70 + Math.cos(rad) * 28;
          const y1 = 74 + Math.sin(rad) * 28;
          const x2 = 70 + Math.cos(rad) * 32;
          const y2 = 74 + Math.sin(rad) * 32;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Brand Text Block */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#1e5288] uppercase font-sans">
            INNOVACIÓN EN CADA MEDICIÓN
          </span>
          <span className="text-3xl font-black tracking-tighter text-[#0b2e59] font-serif uppercase">
            SIEM
          </span>
          <span className="text-[8.5px] font-bold tracking-wider text-slate-700 uppercase font-sans">
            SERVICIOS INTEGRALES EN EQUIPOS DE MEDICIÓN
          </span>
        </div>
      )}
    </div>
  );
};

