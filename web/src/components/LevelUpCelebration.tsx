import React, { useEffect, useState } from "react";

interface LevelUpCelebrationProps {
  skillName: string;
  newLevel: number;
  emoji: string;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ skillName, newLevel, emoji, onClose }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Initialize confetti particle physics explosion
  useEffect(() => {
    const colors = ["#FFD700", "#FF4444", "#00FF44", "#00E5FF", "#FF33FF", "#FFEE33", "#FF9100"];
    const pList: Particle[] = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      // Spawn near the center of the screen
      pList.push({
        id: i,
        x: 50, // screen width %
        y: 40, // screen height %
        vx: (Math.random() - 0.5) * 6, // horizontal speed
        vy: (Math.random() - 0.7) * 8 - 3, // vertical burst speed (upwards)
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    setParticles(pList);

    // High performance animation frame tick loop
    let rafId: number;
    let lastTime = Date.now();

    const updatePhysics = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 16; // Normalization
      lastTime = now;

      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx * dt * 0.25,
            y: p.y + p.vy * dt * 0.25,
            vy: p.vy + 0.15 * dt, // gravity
            rotation: p.rotation + p.rotationSpeed * dt,
          }))
          // Keep particles inside or falling off screen
          .filter(p => p.y < 110 && p.x > -10 && p.x < 110)
      );

      rafId = requestAnimationFrame(updatePhysics);
    };

    rafId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceBadge {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }
        @keyframes pulseGlow {
          0% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
      {/* Particle rendering container */}
      <div style={particleContainerStyle}>
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              borderRadius: p.id % 3 === 0 ? "50%" : "2px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* Main retro dialog parchment container */}
      <div style={celebrationCardStyle}>
        {/* Glow behind emoji */}
        <div style={glowEffectStyle} />

        {/* Pulsing Skill Badge Icon */}
        <div style={emojiContainerStyle}>
          <span style={emojiStyle}>{emoji}</span>
          <div style={badgeValueStyle}>{newLevel}</div>
        </div>

        <h2 style={congratsTitleStyle}>Congratulations!</h2>
        <p style={subTextStyle}>
          You have just advanced your <strong style={{ color: "#FFEE33" }}>{skillName}</strong> level.
        </p>
        <p style={achievementTextStyle}>
          You have reached level <span style={levelHighlightStyle}>{newLevel}</span>!
        </p>

        {/* Continue click action button */}
        <button onClick={onClose} style={continueButtonStyle}>
          Click here to continue ⚔️
        </button>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0, 0, 0, 0.65)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1500,
  fontFamily: "monospace, sans-serif",
  backdropFilter: "blur(1.5px)",
};

const particleContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: 1510,
};

const celebrationCardStyle: React.CSSProperties = {
  position: "relative",
  width: "90%",
  maxWidth: 340,
  background: "linear-gradient(180deg, #3A2D1F 0%, #1A120B 100%)",
  border: "3px solid #6B583E",
  borderRadius: 8,
  padding: 24,
  textAlign: "center",
  boxSizing: "border-box",
  boxShadow: "0 15px 35px rgba(0,0,0,0.9)",
  zIndex: 1520,
  animation: "scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
};

const glowEffectStyle: React.CSSProperties = {
  position: "absolute",
  top: "15%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 90,
  height: 90,
  background: "radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, rgba(255, 215, 0, 0) 70%)",
  borderRadius: "50%",
  pointerEvents: "none",
  animation: "pulseGlow 2s infinite alternate",
};

const emojiContainerStyle: React.CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 68,
  height: 68,
  background: "#120D0A",
  border: "2px solid #FFEE33",
  borderRadius: "50%",
  marginBottom: 16,
  boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
  animation: "bounceBadge 1.2s infinite alternate",
};

const emojiStyle: React.CSSProperties = {
  fontSize: 34,
};

const badgeValueStyle: React.CSSProperties = {
  position: "absolute",
  bottom: -4,
  right: -4,
  background: "#4CAF50",
  border: "1.5px solid #FFEE33",
  borderRadius: "50%",
  width: 22,
  height: 22,
  color: "#FFF",
  fontSize: 10,
  fontWeight: "bold",
  lineHeight: "20px",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
};

const congratsTitleStyle: React.CSSProperties = {
  color: "#FFEE33",
  fontSize: 22,
  margin: "0 0 10px 0",
  textShadow: "2px 2px 0px #000",
  letterSpacing: 1,
};

const subTextStyle: React.CSSProperties = {
  color: "#C0B29F",
  fontSize: 12,
  margin: "0 0 4px 0",
};

const achievementTextStyle: React.CSSProperties = {
  color: "#FFF",
  fontSize: 14,
  fontWeight: "bold",
  margin: "0 0 20px 0",
};

const levelHighlightStyle: React.CSSProperties = {
  color: "#00FF44",
  fontSize: 18,
  fontWeight: "black",
  textShadow: "1px 1px 2px #000",
};

const continueButtonStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #8A6E4F 0%, #5A4833 100%)",
  border: "1.5px solid #FFEE33",
  color: "#FFEE33",
  fontWeight: "bold",
  fontSize: 12,
  padding: "8px 18px",
  borderRadius: 4,
  cursor: "pointer",
  textShadow: "1px 1px 1px #000",
  boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
  outline: "none",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
