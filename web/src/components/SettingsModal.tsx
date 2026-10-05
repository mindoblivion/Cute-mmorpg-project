import React, { useState } from "react";
import { loadSettings, saveSettings, type GameSettings, type VideoQuality, type ScreenFilter } from "../settings";

interface SettingsModalProps {
  onClose: () => void;
  onSettingsChanged: (s: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSettingsChanged }) => {
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [activeTab, setActiveTab] = useState<"video" | "audio" | "social" | "runelite">("video");

  const updateSetting = (updater: (s: GameSettings) => void) => {
    const copy = JSON.parse(JSON.stringify(settings)) as GameSettings;
    updater(copy);
    setSettings(copy);
    saveSettings(copy);
    onSettingsChanged(copy);
  };

  const tabs = [
    { id: "video", label: "📺 Display", emoji: "📺" },
    { id: "audio", label: "🔊 Audio", emoji: "🔊" },
    { id: "social", label: "👤 Social", emoji: "👤" },
    { id: "runelite", label: "⚔️ RuneLite", emoji: "⚔️" },
  ] as const;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <span style={{ fontSize: 18 }}>⚙️ Custom Game Options</span>
          <button style={closeButtonStyle} onClick={onClose}>✕</button>
        </div>

        {/* Tabs and Body wrapper */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar Tabs */}
          <div style={sidebarStyle}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...tabButtonStyle,
                  background: activeTab === tab.id ? "#5A4833" : "#28211A",
                  borderColor: activeTab === tab.id ? "#FFEE33" : "#42372A",
                  color: activeTab === tab.id ? "#FFEE33" : "#C0B29F",
                }}
              >
                <span style={{ marginRight: 6 }}>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
            <div style={{ marginTop: "auto", padding: 8, fontSize: 10, color: "#8C8070", textAlign: "center" }}>
              v1.2.4 (Alpha)
            </div>
          </div>

          {/* Content Pane */}
          <div style={contentPaneStyle}>
            {activeTab === "video" && (
              <div>
                <h3 style={sectionTitleStyle}>Video & Quality Settings</h3>
                <div style={controlRowStyle}>
                  <label style={labelStyle}>Player Display Name:</label>
                  <input
                    type="text"
                    value={settings.playerName}
                    onChange={(e) => updateSetting(s => { s.playerName = e.target.value; })}
                    maxLength={15}
                    style={inputStyle}
                  />
                </div>

                <div style={controlRowStyle}>
                  <label style={labelStyle}>Video Quality Level:</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["low", "medium", "high", "ultra"] as const).map(quality => (
                      <button
                        key={quality}
                        onClick={() => updateSetting(s => { s.videoQuality = quality; })}
                        style={{
                          ...buttonStyle,
                          background: settings.videoQuality === quality ? "#4caf50" : "#2e251f",
                          borderColor: settings.videoQuality === quality ? "#FFEE33" : "#5a4a3a",
                        }}
                      >
                        {quality.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ ...controlRowStyle, marginTop: 16 }}>
                  <label style={labelStyle}>Custom Screen Filter:</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {([
                      { id: "none", name: "Normal (3D Dynamic)" },
                      { id: "retro", name: "Retro Pixel Grid" },
                      { id: "vintage", name: "Warm Vintage Sepia" },
                      { id: "crt", name: "Classic CRT Scanlines" },
                    ] as const).map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => updateSetting(s => { s.screenFilter = filter.id; })}
                        style={{
                          ...buttonStyle,
                          background: settings.screenFilter === filter.id ? "#2196F3" : "#2e251f",
                          borderColor: settings.screenFilter === filter.id ? "#FFEE33" : "#5a4a3a",
                        }}
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: 9, color: "#8a7a6a", marginTop: 12 }}>
                  💡 Display settings apply instantly to improve framerates on low-end mobile devices and tablets.
                </p>

                <div style={{ marginTop: 24, borderTop: "1px solid #42372A", paddingTop: 12 }}>
                  <label style={{ ...labelStyle, color: "#FF4444" }}>⚠️ Reset Character State:</label>
                  <p style={{ fontSize: 8.5, color: "#8a7a6a", margin: "2px 0 6px 0" }}>
                    Permanently wipe your adventurer save, items, equipment, and levels to start fresh.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to completely reset your character? This will delete all skills, inventory items, bank slots, and positions permanently!")) {
                        localStorage.removeItem("dungeon_quest_player_save");
                        window.location.reload();
                      }
                    }}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(180deg, #d32f2f 0%, #b71c1c 100%)",
                      borderColor: "#FFEE33",
                      color: "#FFF",
                    }}
                  >
                    WIPE & RESET ADVENTURER DATA ❌
                  </button>
                </div>
              </div>
            )}

            {activeTab === "audio" && (
              <div>
                <h3 style={sectionTitleStyle}>Audio & Music Controls</h3>
                
                <div style={sliderContainerStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#FFF", fontSize: 11 }}>
                    <span>🎵 Music Volume</span>
                    <span>{settings.volumeMusic}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volumeMusic}
                    onChange={(e) => updateSetting(s => { s.volumeMusic = parseInt(e.target.value); })}
                    style={sliderStyle}
                  />
                </div>

                <div style={{ ...sliderContainerStyle, marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#FFF", fontSize: 11 }}>
                    <span>⚔️ SFX Volume</span>
                    <span>{settings.volumeSfx}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volumeSfx}
                    onChange={(e) => updateSetting(s => { s.volumeSfx = parseInt(e.target.value); })}
                    style={sliderStyle}
                  />
                </div>

                <p style={{ fontSize: 9, color: "#8a7a6a", marginTop: 16 }}>
                  🔊 Rest assured that ambient noises and battle hitsplats scale directly with SFX options.
                </p>
              </div>
            )}

            {activeTab === "social" && (
              <div>
                <h3 style={sectionTitleStyle}>Linked Social Accounts</h3>
                <p style={{ fontSize: 10, color: "#aaa", marginBottom: 12 }}>
                  Securely link your social accounts for cross-platform cloud saves on both PC and Mobile.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {([
                    { id: "gmail", name: "Google / Gmail", icon: "📧", color: "#DB4437" },
                    { id: "apple", name: "Apple ID", icon: "🍏", color: "#555555" },
                    { id: "facebook", name: "Facebook", icon: "👥", color: "#3B5998" },
                    { id: "x", name: "X / Twitter", icon: "🐦", color: "#1DA1F2" },
                    { id: "steam", name: "Steam Store", icon: "🎮", color: "#171a21" },
                  ] as const).map(account => {
                    const isLinked = settings.socialAccounts[account.id];
                    return (
                      <div key={account.id} style={socialRowStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16 }}>{account.icon}</span>
                          <span style={{ color: "#FFF", fontSize: 11, fontWeight: "bold" }}>{account.name}</span>
                        </div>
                        <button
                          onClick={() => updateSetting(s => { s.socialAccounts[account.id] = !isLinked; })}
                          style={{
                            ...socialLinkBtnStyle,
                            background: isLinked ? "#4caf50" : "transparent",
                            borderColor: isLinked ? "#FFEE33" : "#6B583E",
                          }}
                        >
                          {isLinked ? "Connected ✅" : "Link Account 🔗"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "runelite" && (
              <div>
                <h3 style={sectionTitleStyle}>RuneLite Custom Plug-ins</h3>
                <p style={{ fontSize: 10, color: "#aaa", marginBottom: 10 }}>
                  Customize the MMORPG game experience with client features imported directly from RuneLite.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
                  {[
                    {
                      id: "trueTile",
                      title: "📍 Player True Tile Highlight",
                      desc: "Draws a colored indicator outlining the exact tile the server recognizes you are standing on.",
                    },
                    {
                      id: "groundItems",
                      title: "🎒 Ground Items List Overlay",
                      desc: "Highlights and labels dropped items directly on the floor with tiers, rarities, and stack counts.",
                    },
                    {
                      id: "entityHider",
                      title: "👥 Performance Entity Hider",
                      desc: "Hides other idle adventurers and passive background ambient characters for optimized framerates.",
                    },
                    {
                      id: "xpTracker",
                      title: "📊 Interactive XP Tracker Panel",
                      desc: "Renders an onscreen floating widget showing total XP, levels gained, and hourly skill projections.",
                    },
                    {
                      id: "idleNotifier",
                      title: "⚡ Idle skilling Alert Flashes",
                      desc: "Briefly flashes the canvas edges to notify you when woodcutting or fishing spots are finished.",
                    },
                    {
                      id: "clueHelper",
                      title: "📜 Quest Clue Helper Guide",
                      desc: "Provides clear guide recommendations and highlights correct interactive nodes during conversation.",
                    },
                  ].map(plugin => {
                    const enabled = settings.plugins[plugin.id as keyof typeof settings.plugins];
                    return (
                      <div key={plugin.id} style={pluginRowStyle}>
                        <div style={{ flex: 1, paddingRight: 8 }}>
                          <div style={{ color: "#FFEE33", fontSize: 11, fontWeight: "bold" }}>{plugin.title}</div>
                          <div style={{ color: "#bbb", fontSize: 8.5, marginTop: 2 }}>{plugin.desc}</div>
                        </div>
                        <div style={{ alignSelf: "center" }}>
                          <button
                            onClick={() => updateSetting(s => {
                              const key = plugin.id as keyof typeof settings.plugins;
                              s.plugins[key] = !enabled;
                            })}
                            style={{
                              ...pluginToggleBtnStyle,
                              background: enabled ? "#4caf50" : "#2e251f",
                              color: enabled ? "#FFF" : "#8a7a6a",
                            }}
                          >
                            {enabled ? "ACTIVE" : "DISABLED"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button style={saveButtonStyle} onClick={onClose}>
            Back to Game ⚔️
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
  backdropFilter: "blur(2px)",
};

const modalStyle: React.CSSProperties = {
  width: "90%",
  maxWidth: 580,
  height: 350,
  background: "#1E1813",
  border: "2px solid #6B583E",
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily: "monospace, sans-serif",
  boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
};

const headerStyle: React.CSSProperties = {
  background: "#15100C",
  borderBottom: "1.5px solid #6B583E",
  padding: "8px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#FFEE33",
  fontWeight: "bold",
};

const closeButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#C0B29F",
  fontSize: 16,
  cursor: "pointer",
  padding: 4,
};

const sidebarStyle: React.CSSProperties = {
  width: 140,
  background: "#15100C",
  borderRight: "1.5px solid #6B583E",
  display: "flex",
  flexDirection: "column",
  padding: 4,
  gap: 4,
};

const tabButtonStyle: React.CSSProperties = {
  border: "1px solid transparent",
  borderRadius: 4,
  padding: "8px 10px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "all 0.1s ease",
};

const contentPaneStyle: React.CSSProperties = {
  flex: 1,
  padding: 12,
  overflowY: "auto",
  background: "#1E1813",
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#FFEE33",
  fontSize: 13,
  marginTop: 0,
  marginBottom: 12,
  borderBottom: "1px solid #42372A",
  paddingBottom: 4,
};

const controlRowStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  marginBottom: 10,
};

const labelStyle: React.CSSProperties = {
  color: "#C0B29F",
  fontSize: 10.5,
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  background: "#120D0A",
  border: "1.5px solid #6B583E",
  color: "#FFF",
  padding: "6px 8px",
  borderRadius: 4,
  fontSize: 11,
  fontFamily: "monospace",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  border: "1.5px solid #5a4a3a",
  color: "#FFF",
  padding: "5px 10px",
  borderRadius: 4,
  fontSize: 10,
  fontWeight: "bold",
  cursor: "pointer",
  outline: "none",
};

const sliderContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
};

const sliderStyle: React.CSSProperties = {
  width: "100%",
  accentColor: "#FFEE33",
  background: "#120D0A",
  height: 5,
  borderRadius: 3,
  outline: "none",
  cursor: "pointer",
};

const socialRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#15100C",
  border: "1px solid #42372A",
  borderRadius: 4,
  padding: "6px 10px",
};

const socialLinkBtnStyle: React.CSSProperties = {
  border: "1.5px solid #6B583E",
  color: "#FFEE33",
  fontSize: 9.5,
  fontWeight: "bold",
  padding: "4px 8px",
  borderRadius: 4,
  cursor: "pointer",
  minWidth: 105,
  textAlign: "center",
};

const pluginRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  background: "#15100C",
  border: "1px solid #42372A",
  borderRadius: 4,
  padding: "8px 10px",
  alignItems: "stretch",
};

const pluginToggleBtnStyle: React.CSSProperties = {
  border: "1px solid #FFEE33",
  fontSize: 9,
  fontWeight: "bold",
  padding: "4px 8px",
  borderRadius: 4,
  cursor: "pointer",
  minWidth: 70,
  textAlign: "center",
};

const footerStyle: React.CSSProperties = {
  background: "#15100C",
  borderTop: "1.5px solid #6B583E",
  padding: "8px 12px",
  display: "flex",
  justifyContent: "flex-end",
};

const saveButtonStyle: React.CSSProperties = {
  background: "#5A4833",
  border: "1.5px solid #FFEE33",
  color: "#FFEE33",
  fontWeight: "bold",
  fontSize: 11,
  padding: "6px 16px",
  borderRadius: 4,
  cursor: "pointer",
};
