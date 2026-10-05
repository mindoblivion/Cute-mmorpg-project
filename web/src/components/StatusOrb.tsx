import React from "react";

interface Props {
  icon: string;
  currentVal: number;
  maxVal: number;
  fillColor: string;
  borderColor: string;
  size?: number;
  onClick?: () => void;
  isActive?: boolean;
  tooltip?: string;
}

export const StatusOrb: React.FC<Props> = ({
  icon, currentVal, maxVal, fillColor, borderColor, size = 30, onClick, isActive, tooltip
}) => {
  const pct = Math.max(0, Math.min(1, currentVal / maxVal));
  const r = size / 2;
  const innerR = r - 3.5;
  const circ = 2 * Math.PI * innerR;
  const dash = circ * pct;

  return (
    <div
      onClick={onClick}
      title={tooltip}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        boxShadow: isActive ? "0 0 10px #00FF80, 0 0 4px #FFD700" : "0 2px 6px rgba(0,0,0,0.8)",
        borderRadius: "50%",
        transition: "transform 0.1s ease, box-shadow 0.2s ease",
      }}
    >
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Stone bezel */}
        <defs>
          <radialGradient id={`bezel-${icon}-${size}`}>
            <stop offset="0%" stopColor="#5C4A38" />
            <stop offset="60%" stopColor="#30241B" />
            <stop offset="100%" stopColor="#140E0A" />
          </radialGradient>
        </defs>
        <circle cx={r} cy={r} r={r} fill={`url(#bezel-${icon}-${size})`} />
        <circle cx={r} cy={r} r={r - 0.5} fill="none" stroke={isActive ? "#00FF80" : borderColor} strokeWidth={1.8} />
        {/* Inner void */}
        <circle cx={r} cy={r} r={innerR} fill="#0A0805" />
        {/* Fluid arc */}
        <circle
          cx={r} cy={r} r={innerR}
          fill="none"
          stroke={fillColor}
          strokeWidth={3.5}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${r} ${r})`}
        />
        {/* Specular highlight */}
        <circle cx={r} cy={r} r={innerR} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      </svg>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
        <span style={{ fontSize: Math.round(size * 0.36), lineHeight: 1 }}>{icon}</span>
        <span style={{ fontSize: Math.round(size * 0.26), fontWeight: "900", color: pct < 0.25 ? "#FF4444" : "#FFF", textShadow: "1px 1px 2px #000" }}>
          {currentVal}
        </span>
      </div>
    </div>
  );
};

