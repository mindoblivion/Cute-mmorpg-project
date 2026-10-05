import React from "react";
import type { GameState } from "../engine";

interface Props {
  state: GameState;
  size?: number;
}

export const Minimap: React.FC<Props> = ({ state, size = 76 }) => {
  const r = size / 2;
  const scale = (size - 8) / Math.max(state.zone.width, state.zone.height);

  return (
    <div style={{ width: size, height: size, position: "relative", cursor: "pointer" }}>
      {/* OSRS Rotating Compass Indicator */}
      <div style={{
        position: "absolute",
        top: -3,
        left: -3,
        width: 16,
        height: 16,
        zIndex: 12,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        background: "#120D0A",
        border: "1px solid #FFEE33",
        borderRadius: "50%",
        boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
        textShadow: "1px 1px 0px #000",
      }} title="Compass pointing North">
        🧭
      </div>
      <svg width={size} height={size}>
        <defs>
          <clipPath id="minimap-clip">
            <circle cx={r} cy={r} r={r - 2} />
          </clipPath>
          <radialGradient id="minimap-bg">
            <stop offset="0%" stopColor="#2E3A24" />
            <stop offset="100%" stopColor="#161E12" />
          </radialGradient>
        </defs>

        {/* Outer stone border */}
        <circle cx={r} cy={r} r={r} fill="#13110E" stroke="#6B583E" strokeWidth={2} />

        {/* Radar surface */}
        <g clipPath="url(#minimap-clip)">
          <rect x={0} y={0} width={size} height={size} fill="url(#minimap-bg)" />

          {/* Crosshair */}
          <line x1={r} y1={2} x2={r} y2={size - 2} stroke="rgba(0,255,0,0.15)" strokeWidth={1} />
          <line x1={2} y1={r} x2={size - 2} y2={r} stroke="rgba(0,255,0,0.15)" strokeWidth={1} />

          {/* Entity dots */}
          {state.entities.filter(e => !e.isDead).map(e => {
            const ex = 4 + e.tileX * scale;
            const ey = 4 + e.tileY * scale;
            const isCombat = e.combatLevel > 0;
            const color = isCombat ? "#FFEE00" : e.isResource ? "#4CAF50" : "#FFF";
            return <circle key={e.id} cx={ex} cy={ey} r={1.5} fill={color} />;
          })}

          {/* Ground items */}
          {state.groundItems.map(g => (
            <circle key={g.id} cx={4 + g.tileX * scale} cy={4 + g.tileY * scale} r={1} fill="#FF0000" />
          ))}

          {/* Player */}
          <circle cx={4 + state.player.tileX * scale} cy={4 + state.player.tileY * scale} r={2.5} fill="#FFF" stroke="#00E5FF" strokeWidth={1} />
        </g>

        {/* Compass N */}
        <text x={r} y={7} textAnchor="middle" fill="#FFEE33" fontSize={7} fontWeight="bold" style={{ textShadow: "1px 1px 1px #000" }}>N</text>
      </svg>
    </div>
  );
};
