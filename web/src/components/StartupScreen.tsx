import React, { useState, useEffect, useRef } from "react";
import { loadSettings, type GameSettings } from "../settings";
import { SettingsModal } from "./SettingsModal";
import titleBg from "../assets/title_bg.jpg";

interface StartupScreenProps {
  onPlay: (playerName: string, characterClass: string, characterEmoji: string) => void;
}

const AVATAR_OPTIONS = [
  { emoji: "🧙‍♂️", label: "Mage", title: "Arcane Sorcerer" },
  { emoji: "🪖", label: "Knight", title: "Iron Vanguard" },
  { emoji: "🥷", label: "Rogue", title: "Shadow Assassin" },
  { emoji: "👑", label: "Hero", title: "Eldara Champion" },
  { emoji: "🤠", label: "Ranger", title: "Wildlands Marksman" },
];

const CLASS_OPTIONS = [
  {
    id: "Warrior",
    name: "Warrior",
    icon: "⚔️",
    desc: "Trained in the martial discipline of Lumbridge. Heavy armor & close-range combat.",
    bonus: "+2 Attack • Bronze Scimitar & Kiteshield",
    color: "#FF9800",
  },
  {
    id: "Ranger",
    name: "Ranger",
    icon: "🏹",
    desc: "Wilderness scout armed with swift archery weapons. Deadly from range.",
    bonus: "+2 Ranged • Shortbow & 50 Bronze Arrows",
    color: "#4CAF50",
  },
  {
    id: "Wizard",
    name: "Wizard",
    icon: "🧙‍♂️",
    desc: "Master of primordial elemental magic. Casts strike spells from afar.",
    bonus: "+2 Magic • Elemental Staff & 100 Runes",
    color: "#2196F3",
  },
] as const;

export const StartupScreen: React.FC<StartupScreenProps> = ({ onPlay }) => {
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [selectedClass, setSelectedClass] = useState<"Warrior" | "Ranger" | "Wizard">("Wizard");
  const [selectedEmoji, setSelectedEmoji] = useState("🧙‍♂️");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Floating golden ember particles animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; color: string }[] = [];
    const colors = ["#FFA726", "#FF7043", "#FFD54F", "#FFE082", "#FF5722"];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1,
        speedY: Math.random() * 1.2 + 0.4,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleSettingsChanged = (newSettings: GameSettings) => {
    setSettings(newSettings);
  };

  const handlePlayNow = () => {
    onPlay(settings.playerName, selectedClass, selectedEmoji);
  };

  return (
    <div style={startupContainerStyle}>
      {/* Background Cinematic Art Layer */}
      <img
        src={titleBg}
        alt=""
        decoding="async"
        loading="eager"
        style={bgImageStyle}
      />

      {/* Dynamic Animated Ember Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Dark Vignette Overlay for Cinematic Contrast */}
      <div style={vignetteOverlayStyle} />

      {/* Top Bar with Settings and World Indicator */}
      <div style={topBarStyle}>
        <div style={serverStatusBadgeStyle}>
          <span style={{ color: "#4CAF50", fontSize: 10, marginRight: 6 }}>●</span>
          <span>World 1 (Eldara Core) • Online (18ms)</span>
        </div>

        <button
          style={cogButtonStyle}
          onClick={() => setShowSettings(true)}
          title="Open Video/Audio Options & Social Accounts"
        >
          ⚙️ Options & Audio
        </button>
      </div>

      {/* Main Content Area */}
      <div style={mainContentGridStyle}>
        {/* Left Column: Epic Game Brand, Lore & Live Preview */}
        <div style={leftColStyle}>
          {/* Logo Banner */}
          <div style={logoCrestStyle}>
            <div style={emblemRowStyle}>
              <span style={{ fontSize: 26, filter: "drop-shadow(0 0 10px #FF9800)" }}>🔥</span>
              <span style={{ fontSize: 44, margin: "0 8px", filter: "drop-shadow(0 0 16px #FFD700)" }}>🐲</span>
              <span style={{ fontSize: 26, filter: "drop-shadow(0 0 10px #FF9800)" }}>🔥</span>
            </div>
            <h1 style={logoTitleStyle}>DUNGEON QUEST</h1>
            <div style={goldenDividerStyle} />
            <div style={logoSubtitleStyle}>
              AN OLDSCHOOL FANTASY MMORPG ADVENTURE
            </div>
          </div>

          {/* Lore / Highlights Card */}
          <div style={featuresCardStyle}>
            <div style={{ color: "#FFD700", fontSize: 11, fontWeight: "bold", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚔️</span>
              <span>CHRONICLES OF ELDARA</span>
            </div>
            <p style={{ fontSize: 9.5, color: "#D7CCC8", lineHeight: 1.5, margin: "0 0 8px 0" }}>
              Explore Tutorial Island, conquer deep cavern dungeons, master 12 distinct gathering and combat skills, and trade with players in a persistent sandbox realm.
            </p>
            <div style={tagsRowStyle}>
              <span style={tagStyle}>🛡️ RuneLite HUD</span>
              <span style={tagStyle}>💾 Real-time Cloud Save</span>
              <span style={tagStyle}>🌅 Day-Night Cycle</span>
              <span style={tagStyle}>⚔️ Full Tick Combat</span>
            </div>
          </div>
        </div>

        {/* Right Column: Ornate Stone Character Creator */}
        <div style={creatorBoxStyle}>
          <div style={creatorHeaderStyle}>
            <span style={{ fontSize: 16 }}>📜</span>
            <span style={creatorTitleStyle}>CREATE YOUR HERO</span>
            <span style={{ fontSize: 16 }}>🗡️</span>
          </div>

          {/* Adventurer Name input */}
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>ADVENTURER NAME:</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={settings.playerName}
                onChange={(e) => {
                  const name = e.target.value.substring(0, 15);
                  setSettings((prev) => {
                    const updated = { ...prev, playerName: name };
                    localStorage.setItem("dungeon_quest_settings", JSON.stringify(updated));
                    return updated;
                  });
                }}
                style={inputStyle}
                placeholder="Enter character name..."
              />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#FFD700", fontSize: 12 }}>
                ✍️
              </span>
            </div>
          </div>

          {/* Avatar customizer */}
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>CHOOSE YOUR CREST / AVATAR:</label>
            <div style={avatarRowStyle}>
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = selectedEmoji === opt.emoji;
                return (
                  <button
                    key={opt.emoji}
                    onClick={() => setSelectedEmoji(opt.emoji)}
                    style={{
                      ...avatarBtnStyle,
                      background: isSelected ? "linear-gradient(180deg, #5A442E 0%, #2D2015 100%)" : "#140F0B",
                      borderColor: isSelected ? "#FFD700" : "#4A3A2A",
                      boxShadow: isSelected ? "0 0 10px rgba(255, 215, 0, 0.45)" : "none",
                    }}
                    title={`${opt.label} - ${opt.title}`}
                  >
                    <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Starter Class Selection */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>SELECT STARTER COMBAT DISCIPLINE:</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {CLASS_OPTIONS.map((opt) => {
                const isSelected = selectedClass === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setSelectedClass(opt.id);
                      if (opt.id === "Warrior") setSelectedEmoji("🪖");
                      else if (opt.id === "Ranger") setSelectedEmoji("🥷");
                      else if (opt.id === "Wizard") setSelectedEmoji("🧙‍♂️");
                    }}
                    style={{
                      ...classCardStyle,
                      background: isSelected ? "linear-gradient(90deg, rgba(85, 60, 35, 0.7) 0%, rgba(35, 25, 15, 0.8) 100%)" : "rgba(20, 15, 11, 0.85)",
                      borderColor: isSelected ? "#FFD700" : "#4A3A2A",
                      boxShadow: isSelected ? "0 0 12px rgba(255, 215, 0, 0.25)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ ...classTitleStyle, color: isSelected ? "#FFD700" : "#E0D5C1" }}>
                        {opt.icon} {opt.name}
                      </span>
                      <span style={{ fontSize: 7.5, color: opt.color, fontWeight: "bold", background: "rgba(0,0,0,0.5)", padding: "2px 6px", borderRadius: 3 }}>
                        {opt.bonus}
                      </span>
                    </div>
                    <div style={classDescStyle}>{opt.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Play Button */}
          <button onClick={handlePlayNow} style={playButtonStyle}>
            <span style={{ letterSpacing: 2 }}>ENTER REALM</span>
            <span style={{ fontSize: 16 }}>⚔️</span>
          </button>

          {/* Quick Config Badges */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: 8, color: "#A1887F" }}>
              DISPLAY: <strong style={{ color: "#4CAF50" }}>{settings.videoQuality.toUpperCase()}</strong>
            </span>
            <span style={{ fontSize: 8, color: "#A1887F" }}>
              AUDIO: <strong style={{ color: "#FFD54F" }}>{settings.volumeMusic > 0 ? "ENABLED" : "MUTED"}</strong>
            </span>
            <span style={{ fontSize: 8, color: "#A1887F" }}>
              FILTER: <strong style={{ color: "#81D4FA" }}>{settings.screenFilter.toUpperCase()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Settings Modal Dialog Overlay */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSettingsChanged={handleSettingsChanged}
        />
      )}

      {/* Bottom Footer Ribbon */}
      <div style={bottomBannerStyle}>
        <span>DUNGEON QUEST MMORPG • OLD SCHOOL RUNESCAPE & RUNELITE INSPIRED • PC & MOBILE READY</span>
      </div>
    </div>
  );
};

// Styling definitions
const startupContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "#140E0A",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
  fontFamily: "'Segoe UI', Tahoma, sans-serif",
  overflowY: "auto",
  color: "#FFF",
  padding: "16px 20px",
  boxSizing: "border-box",
};

const bgImageStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0.35,
  zIndex: 0,
  pointerEvents: "none",
};

const vignetteOverlayStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.85) 100%)",
  pointerEvents: "none",
  zIndex: 2,
};

const topBarStyle: React.CSSProperties = {
  position: "absolute",
  top: 12,
  left: 16,
  right: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 10,
};

const serverStatusBadgeStyle: React.CSSProperties = {
  background: "rgba(18, 14, 10, 0.85)",
  border: "1px solid #5A442E",
  borderRadius: 4,
  padding: "4px 10px",
  fontSize: 9,
  color: "#D7CCC8",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
};

const cogButtonStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #3A2B1D 0%, #20170F 100%)",
  border: "1.5px solid #FFD700",
  color: "#FFD700",
  fontWeight: "bold",
  fontSize: 10,
  padding: "5px 12px",
  borderRadius: 4,
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const mainContentGridStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 28,
  width: "100%",
  maxWidth: 820,
  zIndex: 10,
  flexWrap: "wrap",
};

const leftColStyle: React.CSSProperties = {
  flex: "1 1 320px",
  maxWidth: 380,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const logoCrestStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 16,
};

const emblemRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 4,
};

const logoTitleStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 900,
  letterSpacing: 3,
  margin: 0,
  background: "linear-gradient(180deg, #FFF59D 0%, #FFD700 45%, #FF8F00 80%, #795548 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(255, 193, 7, 0.4))",
  textTransform: "uppercase",
};

const goldenDividerStyle: React.CSSProperties = {
  height: 2,
  width: 180,
  margin: "6px auto",
  background: "linear-gradient(90deg, transparent, #FFD700, transparent)",
};

const logoSubtitleStyle: React.CSSProperties = {
  fontSize: 8.5,
  color: "#FFD54F",
  letterSpacing: 2,
  fontWeight: "bold",
  textTransform: "uppercase",
  textShadow: "0 2px 4px rgba(0,0,0,0.9)",
};

const featuresCardStyle: React.CSSProperties = {
  background: "rgba(18, 13, 9, 0.85)",
  border: "1.5px solid #5A442E",
  borderRadius: 6,
  padding: "10px 14px",
  width: "100%",
  boxSizing: "border-box",
  boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
};

const tagsRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
};

const tagStyle: React.CSSProperties = {
  background: "rgba(35, 25, 17, 0.85)",
  border: "1px solid #4A3A2A",
  color: "#D7CCC8",
  fontSize: 7.5,
  padding: "2px 6px",
  borderRadius: 3,
};

const creatorBoxStyle: React.CSSProperties = {
  flex: "1 1 330px",
  maxWidth: 370,
  background: "linear-gradient(180deg, rgba(28, 20, 14, 0.94) 0%, rgba(18, 13, 9, 0.96) 100%)",
  border: "2px solid #8D6E63",
  borderTopColor: "#FFD700",
  borderRadius: 8,
  padding: "14px 18px",
  boxSizing: "border-box",
  boxShadow: "0 16px 40px rgba(0,0,0,0.9), 0 0 20px rgba(255, 152, 0, 0.15)",
};

const creatorHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginBottom: 10,
  borderBottom: "1px solid #4A3A2A",
  paddingBottom: 6,
};

const creatorTitleStyle: React.CSSProperties = {
  color: "#FFD700",
  fontSize: 13,
  fontWeight: "bold",
  letterSpacing: 1.5,
  margin: 0,
};

const labelStyle: React.CSSProperties = {
  color: "#D7CCC8",
  fontSize: 8.5,
  fontWeight: "bold",
  letterSpacing: 1,
  display: "block",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#140F0B",
  border: "1.5px solid #5A442E",
  color: "#FFF",
  padding: "7px 12px",
  borderRadius: 4,
  fontSize: 11,
  fontFamily: "monospace",
  outline: "none",
  textAlign: "left",
};

const avatarRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 6,
};

const avatarBtnStyle: React.CSSProperties = {
  flex: 1,
  height: 38,
  border: "1.5px solid #4A3A2A",
  borderRadius: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  outline: "none",
  transition: "all 0.15s ease",
};

const classCardStyle: React.CSSProperties = {
  border: "1.5px solid #4A3A2A",
  borderRadius: 4,
  padding: "6px 9px",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const classTitleStyle: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: "bold",
};

const classDescStyle: React.CSSProperties = {
  color: "#A1887F",
  fontSize: 8,
  marginTop: 2,
  lineHeight: 1.25,
};

const playButtonStyle: React.CSSProperties = {
  width: "100%",
  background: "linear-gradient(180deg, #FFB300 0%, #FF8F00 50%, #E65100 100%)",
  border: "1.5px solid #FFE082",
  color: "#211406",
  fontWeight: 900,
  fontSize: 14,
  padding: "10px 14px",
  borderRadius: 4,
  cursor: "pointer",
  marginTop: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textShadow: "0 1px 1px rgba(255, 255, 255, 0.4)",
  boxShadow: "0 6px 18px rgba(255, 143, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
  transition: "transform 0.1s ease, filter 0.1s ease",
};

const bottomBannerStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 8,
  fontSize: 7.5,
  color: "#8D6E63",
  textAlign: "center",
  letterSpacing: 1,
  zIndex: 10,
};
