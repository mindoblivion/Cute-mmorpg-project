import React, { useState, useEffect } from "react";
import type { GameState } from "./engine";
import { getLevelForXp, getXpForLevel, SKILLS } from "./data/gameConfig";
import { getItem } from "./data/items";
import type { EquipmentSlot } from "./types";
import { equipItem, unequipItem, consumeItem, findPath, cleanHerb } from "./engine";
import { StatusOrb } from "./components/StatusOrb";
import { Minimap } from "./components/Minimap";
import { Chatbox } from "./components/Chatbox";
import { SettingsModal } from "./components/SettingsModal";
import { HerbloreDialog, ClueScrollDialog, HouseBuilderDialog, RaidPartyDialog, PetMenagerieDialog, GrandExchangeDialog, DragonSlayerQuestDialog, CombatAchievementsDialog, CollectionLogDialog, ClanHallDialog, BarrowsDialog, ToBRaidDialog, HighscoresLeaderboardDialog } from "./Dialogs";
import { soundEngine } from "./audio";
import { openClueScroll, openRewardCasket, changeZone, summonPet } from "./engine";
import type { GameSettings } from "./settings";

interface Props {
  state: GameState;
  setState: (updater: (s: GameState) => void) => void;
  forceUpdate: () => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  settings: GameSettings;
  onSettingsChanged: (s: GameSettings) => void;
}

const MAIN_TABS = [
  { id: "inventory", icon: "🎒", label: "Inv" },
  { id: "worn_equipment", icon: "🛡️", label: "Equip" },
  { id: "combat_stats", icon: "⚔️", label: "Combat" },
  { id: "magic_spellbook", icon: "🧙", label: "Mage" },
  { id: "prayer", icon: "✝️", label: "Pray" },
  { id: "skills", icon: "📊", label: "Stats" },
  { id: "quest_journal", icon: "📜", label: "Quest" },
];

const UTILITY_TABS = [
  { id: "settings", icon: "⚙️", label: "Options" },
  { id: "music_player", icon: "🎵", label: "Music" },
  { id: "clan_chat", icon: "👥", label: "Clan" },
  { id: "friends_list", icon: "😊", label: "Friends" },
  { id: "emotes", icon: "🕺", label: "Emotes" },
];

const EQUIP_SLOTS: { slot: EquipmentSlot; label: string; emoji: string }[] = [
  { slot: "HEAD", label: "Head", emoji: "🪖" },
  { slot: "CAPE", label: "Cape", emoji: "🧣" },
  { slot: "AMULET", label: "Amulet", emoji: "📿" },
  { slot: "WEAPON", label: "Weapon", emoji: "⚔️" },
  { slot: "BODY", label: "Body", emoji: "🛡️" },
  { slot: "SHIELD", label: "Shield", emoji: "🛡️" },
  { slot: "LEGS", label: "Legs", emoji: "👖" },
  { slot: "GLOVES", label: "Gloves", emoji: "🧤" },
  { slot: "BOOTS", label: "Boots", emoji: "👢" },
  { slot: "RING", label: "Ring", emoji: "💍" },
  { slot: "AMMO", label: "Ammo", emoji: "🎯" },
];

const MUSIC_TRACKS = [
  { id: "Harmony", name: "Harmony", area: "Brindle Mainland", emoji: "🏰" },
  { id: "NewbieMelody", name: "Newbie Melody", area: "Starter Isle", emoji: "🏝️" },
  { id: "Inferno", name: "Inferno (Fight Caves)", area: "TzHaar Wave Arena", emoji: "🌋" },
  { id: "Dragonfire", name: "Dragonfire", area: "Crandor Volcano Crypt", emoji: "🐲" },
  { id: "Warpath", name: "Warpath", area: "Slayer Crypt & Grimjaw Den", emoji: "⚔️" },
  { id: "Spooky", name: "Spooky", area: "Restless Graveyard Crypt", emoji: "💀" },
  { id: "Garden", name: "Garden", area: "Farming Allotments", emoji: "🌱" },
];

function countCoins(player: any): number {
  return player.inventory.reduce((sum: number, s: any) => sum + (s?.itemId === "coins" ? s.amount : 0), 0);
}

export const Hud: React.FC<Props> = ({ state, setState, forceUpdate, activeTab, setActiveTab, settings, onSettingsChanged }) => {
  const player = state.player;
  const isMainTabOpen = MAIN_TABS.some(t => t.id === activeTab);
  const isUtilityTabOpen = UTILITY_TABS.some(t => t.id === activeTab);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHerbloreLab, setShowHerbloreLab] = useState(false);
  const [showClueDialog, setShowClueDialog] = useState(false);
  const [showHouseBuilder, setShowHouseBuilder] = useState(false);
  const [showRaidDialog, setShowRaidDialog] = useState(false);
  const [showPetDialog, setShowPetDialog] = useState(false);
  const [showGe, setShowGe] = useState(false);
  const [showDragonSlayer, setShowDragonSlayer] = useState(false);
  const [showCa, setShowCa] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [showClan, setShowClan] = useState(false);
  const [showBarrows, setShowBarrows] = useState(false);
  const [showTob, setShowTob] = useState(false);
  const [showHighscores, setShowHighscores] = useState(false);
  const [musicVol, setMusicVol] = useState(0.5);
  const [sfxVol, setSfxVol] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackPlaying, setCurrentTrackPlaying] = useState<string>("Harmony");

  useEffect(() => {
    if (state.zone?.musicTrack) {
      setCurrentTrackPlaying(state.zone.musicTrack);
    }
  }, [state.zoneId]);

  // Determine current active objective and target entity
  let currentGoalText = "Explore the realm of Eldara!";
  let targetEntityId: string | null = null;
  let targetLocationHint = "";

  if (state.zoneId === "tutorial_island") {
    const step = player.tutorialStep ?? 0;
    if (step === 0) {
      currentGoalText = "Speak to Starter Isle Guide (🧙)";
      targetEntityId = "tut_guide";
      targetLocationHint = "Center of Island";
    } else if (step === 1) {
      currentGoalText = "Chop a Tree (🌲) for Logs";
      targetEntityId = "tut_tree_1";
      targetLocationHint = "East path";
    } else if (step === 2) {
      currentGoalText = "Fish Raw Shrimps (🐟) & Cook on Range (🍳)";
      targetEntityId = "tut_fish_spot";
      targetLocationHint = "South-east shore";
    } else if (step === 3) {
      currentGoalText = "Mine Copper/Tin & Smelt Bronze Bar (🔥)";
      targetEntityId = "tut_copper_rock";
      targetLocationHint = "West smithy";
    } else if (step === 4) {
      currentGoalText = "Forge Bronze Dagger at Anvil (⚒️)";
      targetEntityId = "tut_anvil";
      targetLocationHint = "Beside Furnace";
    } else if (step === 5) {
      currentGoalText = "Equip Bronze Dagger & speak to Combat Instructor (⚔️)";
      targetEntityId = "tut_combat";
      targetLocationHint = "North gate";
    } else if (step === 6) {
      currentGoalText = "Defeat a Giant Rat (🐀) in combat!";
      targetEntityId = "tut_rat_1";
      targetLocationHint = "Combat pit";
    } else if (step >= 7) {
      currentGoalText = "Board the Departure Ferry (⛵) to Mainland";
      targetEntityId = "tut_dock";
      targetLocationHint = "South dock";
    }
  } else if (state.zoneId === "tzhaar_fight_caves") {
    currentGoalText = `Survive Fight Caves Wave ${player.fightCave?.wave ?? 1}/10! (Defeat TzTok-Jad for Fire Cape)`;
    targetLocationHint = "Volcanic Arena";
  } else if (state.zoneId === "slayer_crypt") {
    currentGoalText = "Slay Bloodvelds (👅) & Dark Beasts (🐂) in the Slayer Dungeon!";
    targetLocationHint = "Dungeon Depths";
  } else if (state.zoneId === "brindle_mainland") {
    if (player.quests.cooks_assistant === 1) {
      currentGoalText = "Gather Flour (🌾), Egg (🥚), & Milk (🥛) for Head Cook";
      targetEntityId = "brindle_cook";
      targetLocationHint = "Kitchen (North-West)";
    } else if (player.quests.restless_ghost === 1) {
      currentGoalText = "Enter Graveyard Crypt (🕳️) to recover Golden Skull";
      targetEntityId = "crypt_entrance";
      targetLocationHint = "North-West Graveyard";
    } else if (player.quests.dragon_slayer === 1) {
      currentGoalText = "Board Crandor Ship (⛵) & Slay Elvarg the Dragon";
      targetEntityId = "crandor_ferry_dock";
      targetLocationHint = "Eastern Harbor";
    } else if (player.quests.dragon_slayer === 2) {
      currentGoalText = "👑 Return to Guildmaster Brian (⚔️) to claim Dragon Slayer reward!";
      targetEntityId = "brindle_weapon_shopkeeper";
      targetLocationHint = "Weaponry Shop";
    } else if (player.slayerTask) {
      currentGoalText = `🗡️ Slayer Bounty: ${player.slayerTask.countRemaining}x ${player.slayerTask.monsterName}!`;
      targetLocationHint = "World Dungeons";
    } else {
      currentGoalText = "Start Quests at Cook (👨‍🍳), Priest (👴), or Guildmaster (⚔️)!";
      targetEntityId = "brindle_cook";
      targetLocationHint = "Town Center";
    }
  } else if (state.zoneId === "skeleton_crypt") {
    currentGoalText = "Defeat Skeleton Warlord Malakor (💀) & loot Golden Skull!";
    targetEntityId = "boss_malakor_1";
    targetLocationHint = "Crypt Sanctum";
  } else if (state.zoneId === "dragon_crypt") {
    currentGoalText = "Slay Elvarg the Green Dragon (🐲)! (Use Anti-Dragon Shield)";
    targetEntityId = "boss_elvarg_1";
    targetLocationHint = "Volcanic Heart";
  } else if (state.zoneId === "grimjaw_lair") {
    currentGoalText = "Defeat Goblin Warlord Grimjaw (👺)! Dodge Ground Slams!";
    targetEntityId = "boss_grimjaw_1";
    targetLocationHint = "Goblin Den";
  }

  const handleWalkToGoal = () => {
    if (!targetEntityId) return;
    const target = state.entities.find(e => e.id === targetEntityId || e.type === targetEntityId);
    if (target) {
      setState(s => {
        s.path = findPath(s, s.player.tileX, s.player.tileY, target.tileX, target.tileY);
      });
      forceUpdate();
    }
  };

  const handleInvClick = (slotIndex: number) => {
    const slot = player.inventory[slotIndex];
    if (!slot) return;
    const def = getItem(slot.itemId);

    if (slot.itemId.startsWith("clue_scroll")) {
      setState(s => { openClueScroll(s, slot.itemId); });
      setShowClueDialog(true);
    } else if (slot.itemId.startsWith("reward_casket")) {
      setState(s => { openRewardCasket(s, slot.itemId); });
    } else if (slot.itemId === "house_teleport_tab") {
      setState(s => {
        changeZone(s, "player_house");
      });
    } else if (def.isPet) {
      setState(s => { summonPet(s, slot.itemId); });
    } else if (slot.itemId.startsWith("grimy_")) {
      setState(s => { cleanHerb(s, slotIndex); });
    } else if (def.slot) {
      setState(s => { equipItem(s, slotIndex); });
    } else if (def.isConsumable || def.prayerXp || def.isMysteryBox) {
      setState(s => { consumeItem(s, slotIndex); });
    }
    forceUpdate();
  };

  const handleEquipClick = (slot: EquipmentSlot) => {
    setState(s => { unequipItem(s, slot); });
    forceUpdate();
  };

  const toggleTab = (id: string) => setActiveTab(activeTab === id ? "" : id);

  const togglePlugin = (key: keyof typeof settings.plugins) => {
    const updated = {
      ...settings,
      plugins: {
        ...settings.plugins,
        [key]: !settings.plugins[key],
      },
    };
    onSettingsChanged(updated);
  };

  const weaponDef = player.equipment.WEAPON ? getItem(player.equipment.WEAPON) : null;

  return (
    <>
      {/* === TOP-CENTER: Direct On-Boarding & Active Goal Banner === */}
      <div style={{
        position: "absolute",
        top: 6,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 25,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "linear-gradient(180deg, rgba(32, 22, 14, 0.96) 0%, rgba(18, 12, 8, 0.98) 100%)",
        border: "1.5px solid #FFD700",
        borderRadius: 6,
        padding: "4px 10px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.8), 0 0 10px rgba(255, 215, 0, 0.25)",
        maxWidth: "92%",
      }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: "#FFD700", fontSize: 9, fontWeight: 900, letterSpacing: 0.5 }}>
              🎯 OBJECTIVE:
            </span>
            <span style={{ color: "#00E5FF", fontSize: 9, fontWeight: "bold" }}>
              {currentGoalText}
            </span>
          </div>
          {targetLocationHint && (
            <span style={{ color: "#D7CCC8", fontSize: 7.5, opacity: 0.85 }}>
              📍 Hint: {targetLocationHint}
            </span>
          )}
        </div>

        {targetEntityId && (
          <button
            onClick={handleWalkToGoal}
            title="Auto-walk directly to active goal"
            style={{
              background: "linear-gradient(180deg, #FFB300 0%, #E65100 100%)",
              border: "1px solid #FFE082",
              color: "#211406",
              fontWeight: 900,
              fontSize: 8.5,
              padding: "3px 7px",
              borderRadius: 3,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            Walk to Goal 🧭
          </button>
        )}
      </div>

      {/* === TOP-LEFT: Status strip & Utility Toolbar === */}
      <div style={{
        position: "absolute", top: 4, left: 4, zIndex: 20,
        display: "flex", flexDirection: "column", gap: 3,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(27,22,17,0.92)", border: "1px solid #423525",
          borderRadius: 4, padding: "2px 6px",
        }}>
          <span style={{ color: "#FFEE33", fontSize: 9, fontWeight: "bold", textShadow: "1px 1px 1px #000" }}>⚔️ Dungeon Quest</span>
          <span style={{ color: "#FFF", fontSize: 8, textShadow: "1px 1px 1px #000" }}>{state.zone.name}</span>
          <span style={{ color: "#FFD700", fontSize: 8, textShadow: "1px 1px 1px #000" }}>🪙 {countCoins(player)}</span>
          <span style={{ color: "#00E5FF", fontSize: 8, textShadow: "1px 1px 1px #000" }}>CB: {player.combatLevel}</span>
          <span style={{ color: "#00FF80", fontSize: 8, textShadow: "1px 1px 1px #000" }}>⭐ QP: {player.questPoints ?? 0}</span>
          {player.slayerPoints > 0 && (
            <span style={{ color: "#E040FB", fontSize: 8, textShadow: "1px 1px 1px #000" }}>💀 Pts: {player.slayerPoints}</span>
          )}
        </div>

        {/* Quick System Action Buttons */}
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowHouseBuilder(true)}
            style={{ background: "#4A3A2A", border: "1px solid #8D6E63", color: "#FFD700", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Player-Owned House Builder"
          >
            🏠 POH Estate
          </button>
          <button
            onClick={() => setShowRaidDialog(true)}
            style={{ background: "#311B92", border: "1px solid #7B1FA2", color: "#E040FB", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Chambers of Xeric Raid"
          >
            🐉 CoX Raid
          </button>
          {player.activeClue && (
            <button
              onClick={() => setShowClueDialog(true)}
              style={{ background: "#E65100", border: "1px solid #FF9800", color: "#FFF", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
              title="View Active Clue Scroll Step"
            >
              📜 Clue Step {player.activeClue.stepNumber}/{player.activeClue.totalSteps}
            </button>
          )}
          <button
            onClick={() => setShowGe(true)}
            style={{ background: "#1B5E20", border: "1px solid #4CAF50", color: "#FFD700", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Grand Exchange Market"
          >
            ⚖️ GE
          </button>
          <button
            onClick={() => setShowDragonSlayer(true)}
            style={{ background: "#B71C1C", border: "1px solid #FF5252", color: "#FFF", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Dragon Slayer Quest"
          >
            🐉 Quest
          </button>
          <button
            onClick={() => setShowCa(true)}
            style={{ background: "#E65100", border: "1px solid #FF9800", color: "#FFF", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Combat Achievements"
          >
            🏆 CA
          </button>
          <button
            onClick={() => setShowLog(true)}
            style={{ background: "#4A148C", border: "1px solid #AB47BC", color: "#EA80FC", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Collection Log"
          >
            📖 Log
          </button>
          <button
            onClick={() => setShowClan(true)}
            style={{ background: "#3E2723", border: "1px solid #8D6E63", color: "#FFD700", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Clan & Guild Hall"
          >
            🚩 Clan
          </button>
          <button
            onClick={() => setShowTob(true)}
            style={{ background: "#B71C1C", border: "1px solid #FF1744", color: "#FFF", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Theatre of Blood Raid"
          >
            🩸 ToB
          </button>
          <button
            onClick={() => setShowBarrows(true)}
            style={{ background: "#3E2723", border: "1px solid #D7CCC8", color: "#FFD700", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="Barrows Crypts"
          >
            ⚰️ Barrows
          </button>
          <button
            onClick={() => setShowHighscores(true)}
            style={{ background: "#004D40", border: "1px solid #00BFA5", color: "#00E5FF", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3, cursor: "pointer" }}
            title="World Highscores"
          >
            🥇 Ranks
          </button>
          {state.zoneId === "deep_wilderness" && (
            <span style={{ background: "#B71C1C", border: "1px solid #FF1744", color: "#FFF", fontSize: 7.5, fontWeight: "bold", padding: "1px 5px", borderRadius: 3 }}>
              ⚠️ WILDERNESS LVL 45 (SKULLED)
            </span>
          )}
        </div>

        {/* Compact Utility Toolbar (Options, Music, Friends, Clan) */}
        <div style={{
          display: "flex", gap: 2, background: "rgba(20,16,12,0.92)",
          border: "1px solid #423525", borderRadius: 4, padding: "2px 4px",
          width: "fit-content",
        }}>
          {UTILITY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => toggleTab(tab.id)}
              style={{
                background: activeTab === tab.id ? "#5A442E" : "transparent",
                border: activeTab === tab.id ? "1.5px solid #FFD700" : "1.5px solid transparent",
                borderRadius: 3, padding: "1px 4px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 2,
              }}
              title={tab.label}
            >
              <span style={{ fontSize: 10 }}>{tab.icon}</span>
              <span style={{ color: activeTab === tab.id ? "#FFD700" : "#AAA", fontSize: 7, fontWeight: "bold" }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* === TOP-RIGHT: OSRS Minimap & Status Orbs Frame === */}
      <div style={{
        position: "absolute", top: 4, right: 4, zIndex: 15,
        pointerEvents: "auto",
      }}>
        <div style={{ position: "relative", width: 122, height: 112 }}>
          {/* Minimap Circle */}
          <div style={{ position: "absolute", top: 8, right: 0 }}>
            <Minimap state={state} size={88} />
          </div>

          {/* OSRS Status Orbs wrapping around the circular Minimap rim */}
          {/* 1. Hitpoints Orb (Top-Left of Minimap) */}
          <div style={{ position: "absolute", top: 2, left: 4, zIndex: 2 }}>
            <StatusOrb
              icon="❤️"
              currentVal={player.hp}
              maxVal={player.maxHp}
              fillColor="#00D13B"
              borderColor="#D32F2F"
              size={30}
              tooltip="Hitpoints (Click to view Inventory/Eat)"
              onClick={() => setActiveTab("inventory")}
            />
          </div>

          {/* 2. Prayer Orb (Mid-Left of Minimap) */}
          <div style={{ position: "absolute", top: 36, left: -4, zIndex: 2 }}>
            <StatusOrb
              icon="✝️"
              currentVal={player.prayer}
              maxVal={player.maxPrayer}
              fillColor="#00E5FF"
              borderColor="#0288D1"
              size={30}
              tooltip="Prayer Points (Click to open Prayer Tab)"
              onClick={() => setActiveTab("prayer")}
            />
          </div>

          {/* 3. Run Energy Orb (Bottom-Left of Minimap) */}
          <div style={{ position: "absolute", top: 70, left: 8, zIndex: 2 }}>
            <StatusOrb
              icon="⚡"
              currentVal={player.runEnergy}
              maxVal={100}
              fillColor="#FFD700"
              borderColor="#2E7D32"
              size={28}
              tooltip="Run Energy"
            />
          </div>

          {/* 4. Special Attack Orb (Bottom-Right of Minimap) */}
          <div style={{ position: "absolute", top: 70, right: 10, zIndex: 2 }}>
            <StatusOrb
              icon="⚔️"
              currentVal={player.specEnergy ?? 100}
              maxVal={100}
              fillColor="#00E5FF"
              borderColor="#0D47A1"
              size={28}
              isActive={player.specActive}
              tooltip="Special Attack Energy (Click to Toggle Spec)"
              onClick={() => {
                setState(s => { s.player.specActive = !s.player.specActive; });
                forceUpdate();
              }}
            />
          </div>
        </div>
      </div>

      {/* === BOTTOM-LEFT: Chatbox === */}
      <Chatbox messages={state.chatLogs} width="240px" />

      {/* === BOTTOM-RIGHT: Unified Non-Overlapping HUD Panel & Tab Bar === */}
      <div style={{
        position: "absolute",
        bottom: 6,
        right: 6,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}>
        {/* Content Drawer (sits cleanly ABOVE the tab bar) */}
        {isMainTabOpen && (
          <div style={{
            width: 228,
            maxHeight: 275,
            background: "linear-gradient(180deg, rgba(28, 20, 14, 0.98) 0%, rgba(16, 12, 8, 0.99) 100%)",
            border: "1.5px solid #8D6E63",
            borderBottom: "1px solid #4A3A2A",
            borderRadius: "6px 6px 0 0",
            overflowY: "auto",
            padding: 8,
            boxShadow: "0 -4px 16px rgba(0,0,0,0.85)",
            marginBottom: 2,
          }}>
            {/* Tab Header with Close Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, paddingBottom: 2, borderBottom: "1px solid #4A3A2A" }}>
              <span style={{ color: "#FFD700", fontSize: 8.5, fontWeight: "bold" }}>
                {MAIN_TABS.find(t => t.id === activeTab)?.icon} {MAIN_TABS.find(t => t.id === activeTab)?.label}
              </span>
              <button
                onClick={() => setActiveTab("")}
                style={{ background: "none", border: "none", color: "#FF4444", cursor: "pointer", fontSize: 10, fontWeight: "bold" }}
                title="Close Tab"
              >
                ✕
              </button>
            </div>

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <div>
                <button
                  onClick={() => setShowHerbloreLab(true)}
                  style={{
                    width: "100%",
                    background: "linear-gradient(180deg, #00897B 0%, #004D40 100%)",
                    border: "1px solid #4DB6AC",
                    color: "#E0F2F1",
                    fontSize: 8,
                    fontWeight: "bold",
                    padding: "3px 0",
                    borderRadius: 3,
                    cursor: "pointer",
                    marginBottom: 4,
                  }}
                >
                  🧪 Open Herblore Laboratory ⚗️
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                  {player.inventory.map((slot, i) => (
                    <div key={i} onClick={() => handleInvClick(i)} style={invSlotStyle} title={slot ? getItem(slot.itemId).name : `Empty (${i + 1})`}>
                      {slot && (
                        <>
                          <span style={{ fontSize: 14 }}>{getItem(slot.itemId).iconEmoji}</span>
                          {slot.amount > 1 && <span style={stackCountStyle}>{slot.amount}</span>}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Worn Equipment Tab */}
            {activeTab === "worn_equipment" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                  {EQUIP_SLOTS.map(({ slot, label, emoji }) => {
                    const itemId = player.equipment[slot];
                    const def = itemId ? getItem(itemId) : null;
                    return (
                      <div key={slot} onClick={() => itemId && handleEquipClick(slot)} style={equipSlotStyle} title={def ? `${def.name} (tap to unequip)` : label}>
                        {def ? <span style={{ fontSize: 14 }}>{def.iconEmoji}</span> : <span style={{ fontSize: 10, opacity: 0.3 }}>{emoji}</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Follower Pet */}
                <div style={{ marginTop: 6, background: "rgba(0,0,0,0.4)", padding: 4, borderRadius: 3, border: "1px solid #4A3A2A" }}>
                  <span style={{ color: "#FFD700", fontSize: 8, fontWeight: "bold" }}>🐾 Follower Pet: </span>
                  <span style={{ color: player.activePet ? "#00FF80" : "#888", fontSize: 8 }}>
                    {player.activePet ? getItem(player.activePet).name : "None (Summon from inv)"}
                  </span>
                </div>
              </div>
            )}

            {/* Combat Tab */}
            {activeTab === "combat_stats" && (
              <div>
                <div style={{ color: "#FFF", fontSize: 7.5, marginBottom: 3 }}>Combat Level: <span style={{ color: "#FFEE33", fontWeight: "bold" }}>{player.combatLevel}</span></div>
                
                {/* Special Attack Bar */}
                <div style={{ marginBottom: 4, background: "rgba(0,0,0,0.5)", padding: 4, borderRadius: 4, border: "1px solid #4A3A2A" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ color: "#FFD700", fontSize: 8, fontWeight: "bold" }}>⚡ SPECIAL ATTACK</span>
                    <span style={{ color: "#00E5FF", fontSize: 8, fontWeight: "bold" }}>{player.specEnergy ?? 100}%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "#1a1a0a", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ width: `${player.specEnergy ?? 100}%`, height: "100%", background: "linear-gradient(90deg, #00C853, #00E5FF)" }} />
                  </div>

                  {weaponDef?.specialAttackCost ? (
                    <button
                      onClick={() => {
                        setState(s => { s.player.specActive = !s.player.specActive; });
                        forceUpdate();
                      }}
                      style={{
                        width: "100%",
                        padding: "3px 0",
                        background: player.specActive ? "linear-gradient(180deg, #00C853 0%, #007E33 100%)" : "#2A1E14",
                        border: player.specActive ? "1.5px solid #00FF80" : "1px solid #5A442E",
                        color: player.specActive ? "#FFF" : "#FFD700",
                        fontSize: 8,
                        fontWeight: "bold",
                        cursor: "pointer",
                        borderRadius: 3,
                      }}
                    >
                      {player.specActive ? `⚡ SPEC ACTIVE: ${weaponDef.specialAttackName}` : `Activate Spec (${weaponDef.specialAttackCost}%)`}
                    </button>
                  ) : (
                    <div style={{ color: "#888", fontSize: 7, textAlign: "center" }}>
                      Equip Dragon weaponry or Godsword for special attacks!
                    </div>
                  )}
                </div>

                {/* Slayer Active Bounty Banner */}
                {player.slayerTask && (
                  <div style={{ marginBottom: 4, background: "rgba(224,64,251,0.12)", border: "1px solid #AB47BC", padding: 4, borderRadius: 3 }}>
                    <div style={{ color: "#E040FB", fontSize: 7.5, fontWeight: "bold" }}>🗡️ Slayer Bounty</div>
                    <div style={{ color: "#FFF", fontSize: 7 }}>
                      {player.slayerTask.countRemaining}/{player.slayerTask.totalCount} {player.slayerTask.monsterName}
                    </div>
                  </div>
                )}

                <div style={{ color: "#FFF", fontSize: 7.5, marginBottom: 2 }}>Combat Style:</div>
                {(["ACCURATE", "AGGRESSIVE", "DEFENSIVE"] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => { setState(s => { s.player.combatStyle = style; }); forceUpdate(); }}
                    style={{
                      display: "block", width: "100%", padding: "2px 4px", marginBottom: 2,
                      color: "#FFF", fontSize: 7.5, cursor: "pointer", borderRadius: 3,
                      background: player.combatStyle === style ? "#4a3a2a" : "#2a2a1a",
                      border: player.combatStyle === style ? "1px solid #FFEE33" : "1px solid #555",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            )}

            {/* Magic Tab */}
            {activeTab === "magic_spellbook" && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    { id: "wind_strike", name: "Wind Strike", icon: "💨", desc: "1 Air, 1 Mind rune", max: "8 dmg", color: "#81D4FA" },
                    { id: "fire_blast", name: "Fire Blast", icon: "🔥", desc: "4 Fire, 3 Air, 1 Chaos", max: "18 dmg", color: "#FF7043" },
                    { id: "ice_barrage", name: "Ice Barrage", icon: "❄️", desc: "6 Water, 4 Death, 2 Blood", max: "30 dmg + Freeze", color: "#00E5FF" },
                  ].map(spell => {
                    const isAutocasting = player.autocastSpell === spell.id;
                    return (
                      <div
                        key={spell.id}
                        onClick={() => {
                          setState(s => {
                            s.player.autocastSpell = isAutocasting ? null : spell.id;
                          });
                          forceUpdate();
                        }}
                        style={{
                          background: isAutocasting ? "rgba(0, 229, 255, 0.25)" : "#1C1610",
                          border: isAutocasting ? "1.5px solid #00E5FF" : "1px solid #4A3A2A",
                          borderRadius: 3,
                          padding: "3px 5px",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: spell.color, fontSize: 8, fontWeight: "bold" }}>
                            {spell.icon} {spell.name}
                          </span>
                          <span style={{ fontSize: 7, color: isAutocasting ? "#00FF80" : "#AAA", fontWeight: "bold" }}>
                            {isAutocasting ? "AUTOCASTING" : spell.max}
                          </span>
                        </div>
                        <div style={{ color: "#888", fontSize: 6.5 }}>{spell.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prayer Tab */}
            {activeTab === "prayer" && (
              <div>
                <div style={{ color: "#FFF", fontSize: 7.5, marginBottom: 2 }}>Points: {player.prayer}/{player.maxPrayer}</div>
                <div style={{ color: "#4CAF50", fontSize: 7 }}>✨ Pray at Altars to recharge holy prayer power!</div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "skills" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px 4px" }}>
                {SKILLS.map(skill => {
                  const s = player.skills[skill.id];
                  if (!s) return null;
                  const level = getLevelForXp(s.xp);
                  return (
                    <div key={skill.id} style={{ display: "flex", alignItems: "center", gap: 2, padding: "1px 0" }} title={`${skill.name}: ${s.xp.toLocaleString()} XP`}>
                      <span style={{ fontSize: 9 }}>{skill.iconEmoji}</span>
                      <span style={{ color: "#FFF", fontSize: 7, width: 42, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{skill.name}</span>
                      <span style={{ color: "#FFEE33", fontSize: 7.5, fontWeight: "bold" }}>{level}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quests Tab */}
            {activeTab === "quest_journal" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ color: "#FFD700", fontSize: 8, fontWeight: "bold" }}>📜 Quests</span>
                  <span style={{ color: "#00FF80", fontSize: 7.5, fontWeight: "bold" }}>⭐ {player.questPoints ?? 0} QP</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {[
                    {
                      id: "tutorial_island",
                      name: "🗺️ Tutorial Island",
                      status: (player.tutorialStep ?? 0) >= 8 || player.quests.tutorial_island === 100 ? "Completed" : "In Progress",
                      color: (player.tutorialStep ?? 0) >= 8 ? "#4CAF50" : "#FF9800",
                      reward: "Access to Mainland",
                    },
                    {
                      id: "cooks_assistant",
                      name: "👨‍🍳 Cook's Assistant",
                      status: player.quests.cooks_assistant === 100 ? "Completed" : player.quests.cooks_assistant === 1 ? "In Progress" : "Not Started",
                      color: player.quests.cooks_assistant === 100 ? "#4CAF50" : player.quests.cooks_assistant === 1 ? "#FF9800" : "#FF4444",
                      reward: "+1 QP • 500 Cooking XP • Coins",
                    },
                    {
                      id: "restless_ghost",
                      name: "👻 The Restless Ghost",
                      status: player.quests.restless_ghost === 100 ? "Completed" : player.quests.restless_ghost === 1 ? "In Progress" : "Not Started",
                      color: player.quests.restless_ghost === 100 ? "#4CAF50" : player.quests.restless_ghost === 1 ? "#FF9800" : "#FF4444",
                      reward: "+1 QP • 1,125 Prayer XP • Amulet",
                    },
                    {
                      id: "dragon_slayer",
                      name: "🐲 Dragon Slayer",
                      status: player.quests.dragon_slayer === 100 ? "Completed" : player.quests.dragon_slayer >= 1 ? "In Progress" : "Not Started",
                      color: player.quests.dragon_slayer === 100 ? "#4CAF50" : player.quests.dragon_slayer >= 1 ? "#FF9800" : "#FF4444",
                      reward: "+2 QP • Dragon Scimitar & Armor",
                    },
                  ].map(q => (
                    <div key={q.id} style={{ background: "#1C1610", padding: "3px 5px", borderRadius: 3, border: "1px solid #4A3A2A" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: q.color, fontSize: 7.5, fontWeight: "bold" }}>{q.name}</span>
                        <span style={{ color: q.color, fontSize: 6.5, fontWeight: "bold" }}>{q.status}</span>
                      </div>
                      <div style={{ color: "#888", fontSize: 6.5 }}>{q.reward}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Permanently Visible Main Gameplay Tab Buttons Row */}
        <div style={{
          display: "flex",
          gap: 2,
          background: "rgba(20, 16, 12, 0.96)",
          border: "1.5px solid #5A442E",
          borderRadius: isMainTabOpen ? "0 0 6px 6px" : "6px",
          padding: "2px 3px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.75)",
        }}>
          {MAIN_TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => toggleTab(tab.id)}
                style={{
                  background: isActive ? "linear-gradient(180deg, #5A442E 0%, #2D2015 100%)" : "transparent",
                  border: isActive ? "1.5px solid #FFD700" : "1.5px solid transparent",
                  borderRadius: 4,
                  padding: "3px 4px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 26,
                  boxShadow: isActive ? "0 0 6px rgba(255, 215, 0, 0.4)" : "none",
                }}
                title={tab.label}
              >
                <span style={{ fontSize: 13 }}>{tab.icon}</span>
                <span style={{ color: isActive ? "#FFD700" : "#AAA", fontSize: 6.5, fontWeight: "bold" }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Utility Tab Modals (Options, Music Player, Friends, Clan) */}
      {isUtilityTabOpen && (
        <div style={{
          position: "absolute",
          top: 36,
          left: 6,
          width: 235,
          background: "linear-gradient(180deg, rgba(28, 20, 14, 0.98) 0%, rgba(16, 12, 8, 0.99) 100%)",
          border: "1.5px solid #8D6E63",
          borderRadius: 6,
          padding: 8,
          zIndex: 35,
          boxShadow: "0 8px 24px rgba(0,0,0,0.85)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, borderBottom: "1px solid #4A3A2A", paddingBottom: 2 }}>
            <span style={{ color: "#FFD700", fontSize: 8.5, fontWeight: "bold" }}>
              {UTILITY_TABS.find(t => t.id === activeTab)?.icon} {UTILITY_TABS.find(t => t.id === activeTab)?.label}
            </span>
            <button onClick={() => setActiveTab("")} style={{ background: "none", border: "none", color: "#FF4444", cursor: "pointer", fontSize: 10, fontWeight: "bold" }}>✕</button>
          </div>

          {activeTab === "music_player" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, background: "#120D0A", padding: "4px 6px", borderRadius: 4, border: "1px solid #4A3A2A" }}>
                <div>
                  <span style={{ color: "#00E5FF", fontSize: 8, fontWeight: "bold" }}>Now Playing: </span>
                  <span style={{ color: "#FFF", fontSize: 8 }}>{currentTrackPlaying}</span>
                </div>
                <button
                  onClick={() => {
                    const newMute = !isMuted;
                    setIsMuted(newMute);
                    soundEngine.setMuted(newMute);
                  }}
                  style={{
                    background: isMuted ? "#B71C1C" : "#2E7D32",
                    border: "none",
                    color: "#FFF",
                    fontSize: 7.5,
                    fontWeight: "bold",
                    padding: "2px 6px",
                    borderRadius: 3,
                    cursor: "pointer",
                  }}
                >
                  {isMuted ? "🔇 Unmute" : "🔊 Mute"}
                </button>
              </div>

              {/* Volume sliders */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#AAA", fontSize: 7 }}>Music Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVol}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setMusicVol(v);
                      soundEngine.setMusicVolume(v);
                    }}
                    style={{ width: 110, accentColor: "#FFD700" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#AAA", fontSize: 7 }}>SFX Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={sfxVol}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setSfxVol(v);
                      soundEngine.setSfxVolume(v);
                    }}
                    style={{ width: 110, accentColor: "#00E5FF" }}
                  />
                </div>
              </div>

              {/* Track list */}
              <div style={{ maxHeight: 130, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                {MUSIC_TRACKS.map(t => {
                  const isCurrent = currentTrackPlaying.replace(/\s+/g, "") === t.id.replace(/\s+/g, "");
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setCurrentTrackPlaying(t.name);
                        soundEngine.startBackgroundMusic(t.id);
                      }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: isCurrent ? "#3A2A1A" : "#120D0A",
                        border: isCurrent ? "1px solid #FFD700" : "1px solid #33271C",
                        padding: "3px 6px",
                        borderRadius: 3,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 10 }}>{t.emoji}</span>
                        <span style={{ color: isCurrent ? "#FFD700" : "#FFF", fontSize: 7.5, fontWeight: isCurrent ? "bold" : "normal" }}>
                          {t.name}
                        </span>
                      </div>
                      <span style={{ color: "#888", fontSize: 6.5 }}>{t.area}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <button
                onClick={() => setShowAdvanced(true)}
                style={{
                  width: "100%", background: "#5a4833", border: "1px solid #FFEE33",
                  color: "#FFEE33", fontSize: 8, fontWeight: "bold", padding: "4px 2px",
                  borderRadius: 3, cursor: "pointer", marginBottom: 6,
                }}
              >
                ⚙️ OPEN ADVANCED CONFIG
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { key: "trueTile", label: "📍 Player True Tile" },
                  { key: "groundItems", label: "🎒 Ground Items labels" },
                  { key: "entityHider", label: "👥 Entity Hider toggle" },
                  { key: "xpTracker", label: "📊 XP Tracker widget" },
                ].map(item => {
                  const enabled = settings.plugins[item.key as keyof typeof settings.plugins];
                  return (
                    <div
                      key={item.key}
                      onClick={() => togglePlugin(item.key as keyof typeof settings.plugins)}
                      style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        background: "#120D0A", padding: "3px 4px", borderRadius: 2,
                        cursor: "pointer", fontSize: 7, border: "1px solid #42372A",
                      }}
                    >
                      <span style={{ color: "#C0B29F" }}>{item.label}</span>
                      <span style={{ color: enabled ? "#00FF44" : "#FF3333", fontWeight: "bold" }}>
                        {enabled ? "ON" : "OFF"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {["clan_chat", "friends_list", "emotes"].includes(activeTab) && (
            <div style={{ color: "#AAA", fontSize: 7.5, textAlign: "center", padding: 12 }}>
              Feature active & synced with World 1 server.
            </div>
          )}
        </div>
      )}

      {showHerbloreLab && (
        <HerbloreDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowHerbloreLab(false)}
        />
      )}

      {showClueDialog && (
        <ClueScrollDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowClueDialog(false)}
        />
      )}

      {showHouseBuilder && (
        <HouseBuilderDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowHouseBuilder(false)}
        />
      )}

      {showRaidDialog && (
        <RaidPartyDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowRaidDialog(false)}
        />
      )}

      {showPetDialog && (
        <PetMenagerieDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowPetDialog(false)}
        />
      )}

      {showGe && (
        <GrandExchangeDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowGe(false)}
        />
      )}

      {showDragonSlayer && (
        <DragonSlayerQuestDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowDragonSlayer(false)}
        />
      )}

      {showCa && (
        <CombatAchievementsDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowCa(false)}
        />
      )}

      {showLog && (
        <CollectionLogDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowLog(false)}
        />
      )}

      {showClan && (
        <ClanHallDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowClan(false)}
        />
      )}

      {showBarrows && (
        <BarrowsDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowBarrows(false)}
        />
      )}

      {showTob && (
        <ToBRaidDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowTob(false)}
        />
      )}

      {showHighscores && (
        <HighscoresLeaderboardDialog
          state={state}
          setState={setState}
          forceUpdate={forceUpdate}
          onClose={() => setShowHighscores(false)}
        />
      )}

      {showAdvanced && (
        <SettingsModal
          onClose={() => setShowAdvanced(false)}
          onSettingsChanged={onSettingsChanged}
        />
      )}
    </>
  );
};

const invSlotStyle: React.CSSProperties = {
  width: "100%", aspectRatio: "1", background: "rgba(20,15,10,0.85)",
  border: "1px solid #423525", borderRadius: 3,
  display: "flex", alignItems: "center", justifyContent: "center",
  position: "relative", cursor: "pointer",
};

const equipSlotStyle: React.CSSProperties = {
  width: "100%", aspectRatio: "1", background: "rgba(20,15,10,0.85)",
  border: "1px solid #423525", borderRadius: 3,
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
};

const stackCountStyle: React.CSSProperties = {
  position: "absolute", top: 1, left: 2, color: "#FFD700",
  fontSize: 7, fontWeight: "bold", textShadow: "1px 1px 1px #000",
};
