// Settings manager for Dungeon Quest

export type VideoQuality = "low" | "medium" | "high" | "ultra";
export type ScreenFilter = "none" | "retro" | "vintage" | "crt";

export interface GameSettings {
  videoQuality: VideoQuality;
  volumeMusic: number;
  volumeSfx: number;
  screenFilter: ScreenFilter;
  playerName: string;
  socialAccounts: {
    gmail: boolean;
    apple: boolean;
    facebook: boolean;
    x: boolean;
    steam: boolean;
  };
  plugins: {
    trueTile: boolean;
    groundItems: boolean;
    entityHider: boolean;
    xpTracker: boolean;
    idleNotifier: boolean;
    clueHelper: boolean;
  };
}

const DEFAULT_SETTINGS: GameSettings = {
  videoQuality: "high",
  volumeMusic: 70,
  volumeSfx: 80,
  screenFilter: "none",
  playerName: "Adventurer",
  socialAccounts: {
    gmail: false,
    apple: false,
    facebook: false,
    x: false,
    steam: false,
  },
  plugins: {
    trueTile: true,
    groundItems: true,
    entityHider: false,
    xpTracker: true,
    idleNotifier: true,
    clueHelper: true,
  },
};

export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem("dungeon_quest_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        socialAccounts: { ...DEFAULT_SETTINGS.socialAccounts, ...parsed.socialAccounts },
        plugins: { ...DEFAULT_SETTINGS.plugins, ...parsed.plugins },
      };
    }
  } catch (e) {
    console.error("Failed to load settings:", e);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem("dungeon_quest_settings", JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings:", e);
  }
}
