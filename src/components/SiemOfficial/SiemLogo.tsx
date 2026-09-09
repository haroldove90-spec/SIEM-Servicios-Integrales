import React from 'react';

interface SiemLogoProps {
  className?: string;
  size?: number;
}

export const SiemLogo: React.FC<SiemLogoProps> = ({ className = 'h-14', size }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SIEM Vector Icon */}
      <svg
        viewBox="0 0 120 120"
        className="h-full w-auto aspect-square shrink-0"
        style={size ? { width: size, height: size } : undefined}
      >
        <circle cx="60" cy="60" r="54" fill="none" stroke="#003366" strokeWidth="6" />
        {/* Arc text simulation */}
        <path
          d="M 20 60 A 40 40 0 0 1 100 60"
          fill="none"
          id="curve"
        />
        {/* Stylized Caliper / Micrometer / Gauge Icon */}
        <path
          d="M 38 42 L 72 76 M 34 46 L 68 80 M 64 34 L 84 54 M 40 64 L 60 84"
          stroke="#003366"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="60" cy="60" r="14" fill="#003366" />
        <circle cx="60" cy="60" r="7" fill="#ffffff" />
        <path
          d="M 52 28 L 68 28 M 60 22 L 60 34"
          stroke="#003366"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col justify-center leading-tight">
        <span className="text-[10px] font-bold tracking-widest text-[#003366] uppercase">
          INNOVACIÓN CADA MEDICIÓN
        </span>
        <span className="text-3xl font-black tracking-tight text-[#003366] font-serif">
          SIEM
        </span>
        <span className="text-[9px] font-bold tracking-wider text-slate-600 uppercase">
          SERVICIOS INTEGRALES EN EQUIPOS DE MEDICIÓN
        </span>
      </div>
    </div>
  );
};
