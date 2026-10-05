import React, { useState, useRef, useCallback, useEffect } from "react";
import { createInitialState, findPath, pickupGroundItem, addChat, saveGameState, addToInventory, removeFromInventory, type GameState, type WorldEntity } from "./engine";
import { startGameLoop } from "./tick";
import { GameCanvas } from "./GameCanvas";
import { Hud } from "./Hud";
import { NpcDialog } from "./Dialogs";
import { StartupScreen } from "./components/StartupScreen";
import { LevelUpCelebration } from "./components/LevelUpCelebration";
import { loadSettings, type GameSettings } from "./settings";

export const App: React.FC = () => {
  const [isStartingUp, setIsStartingUp] = useState(true);
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  
  const stateRef = useRef<GameState>(createInitialState());
  const [, setRender] = useState(0);
  const [activeTab, setActiveTab] = useState("");
  const [dialogEntity, setDialogEntity] = useState<WorldEntity | null>(null);

  const forceUpdate = useCallback(() => setRender(r => r + 1), []);

  const setState = useCallback((updater: (s: GameState) => void) => {
    updater(stateRef.current);
    saveGameState(stateRef.current);
  }, []);

  // Update game settings
  const handleSettingsChanged = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    // Propagate playerName to game state player name
    stateRef.current.player.name = newSettings.playerName;
    forceUpdate();
  }, [forceUpdate]);

  // Start game loop
  useEffect(() => {
    // Only run loop if not in startup
    if (isStartingUp) return;

    const stop = startGameLoop(stateRef.current, () => {
      forceUpdate();
    });
    return stop;
  }, [isStartingUp, forceUpdate]);

  const handlePlay = (playerName: string, characterClass: string, characterEmoji: string) => {
    const player = stateRef.current.player;
    player.name = playerName || "Adventurer";
    player.class = characterClass || "Wizard";
    player.emoji = characterEmoji || "🧙‍♂️";

    // Set up custom starter class kits inside inventory if starting fresh
    const hasExistingSave = localStorage.getItem("dungeon_quest_player_save") !== null;
    if (!hasExistingSave) {
      if (characterClass === "Warrior") {
        addToInventory(player, "bronze_scimitar", 1);
        addToInventory(player, "bronze_kiteshield", 1);
        if (player.skills["attack"]) {
          player.skills["attack"].level = 3;
          player.skills["attack"].xp = 175; // XP for level 3
        }
      } else if (characterClass === "Ranger") {
        addToInventory(player, "shortbow", 1);
        addToInventory(player, "bronze_arrow", 50);
        if (player.skills["ranged"]) {
          player.skills["ranged"].level = 3;
          player.skills["ranged"].xp = 175;
        }
      } else if (characterClass === "Wizard") {
        addToInventory(player, "staff_basic", 1);
        addToInventory(player, "air_rune", 100);
        addToInventory(player, "mind_rune", 100);
        if (player.skills["magic"]) {
          player.skills["magic"].level = 3;
          player.skills["magic"].xp = 175;
        }
      }
    }

    // Save character configuration instantly
    saveGameState(stateRef.current);

    setIsStartingUp(false);
    forceUpdate();
  };

  const handleEntityClick = useCallback((entity: WorldEntity) => {
    const state = stateRef.current;

    // Verify and solve active Clue Scroll target match
    const activeClue = state.player.activeClue;
    if (activeClue && activeClue.currentStep && activeClue.currentStep.targetEntityId === entity.id && activeClue.currentStep.targetZone === state.zoneId) {
      setState(s => {
        addChat(s, "🎉 Clue Helper: Congratulations! You solved the riddle step!", "#00FF44");
      });
      forceUpdate();
    }

    // Combat NPC
    if (entity.isCombatNpc || entity.combatLevel > 0) {
      if (entity.isDead) {
        addChat(state, "This creature is dead.", "#888");
        forceUpdate();
        return;
      }
      setState(s => {
        s.combatTargetId = entity.id;
        s.skillingTargetId = null;
        s.path = findPath(s, s.player.tileX, s.player.tileY, entity.tileX, entity.tileY);
      });
      forceUpdate();
      return;
    }
    // Resource node
    if (entity.isResource) {
      setState(s => {
        s.skillingTargetId = entity.id;
        s.combatTargetId = null;
        s.path = findPath(s, s.player.tileX, s.player.tileY, entity.tileX, entity.tileY);
      });
      forceUpdate();
      return;
    }
    // Interactive objects (cooking range, furnace, altar, zone transitions)
    if (entity.isInteractiveObject) {
      setState(s => {
        s.skillingTargetId = entity.id;
        s.combatTargetId = null;
        s.path = findPath(s, s.player.tileX, s.player.tileY, entity.tileX, entity.tileY);
      });
      forceUpdate();
      return;
    }
    // NPC (banker, shopkeeper, etc.)
    if (entity.isNpc) {
      setDialogEntity(entity);
      return;
    }
  }, [setState, forceUpdate]);

  const handleGroundItemClick = useCallback((item: any) => {
    const state = stateRef.current;
    setState(s => {
      // Walk to item first if not adjacent
      const d = Math.max(Math.abs(s.player.tileX - item.tileX), Math.abs(s.player.tileY - item.tileY));
      if (d > 1) {
        s.path = findPath(s, s.player.tileX, s.player.tileY, item.tileX, item.tileY);
      } else {
        pickupGroundItem(s, item);
      }
    });
    forceUpdate();
  }, [setState, forceUpdate]);

  if (isStartingUp) {
    return <StartupScreen onPlay={handlePlay} />;
  }

  // Choose screen filters from Settings
  let filterCss = "none";
  if (settings.screenFilter === "retro") {
    filterCss = "contrast(1.25) brightness(0.95) saturate(1.15)";
  } else if (settings.screenFilter === "vintage") {
    filterCss = "sepia(0.4) contrast(0.95) saturate(0.9)";
  } else if (settings.screenFilter === "crt") {
    filterCss = "brightness(1.05) contrast(1.1)";
  }

  return (
    <div style={{
      width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#1a1a2e",
      filter: filterCss,
    }}>
      {/* CRT Scanline Effect */}
      {settings.screenFilter === "crt" && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.22) 50%)",
          backgroundSize: "100% 4px", zIndex: 999, pointerEvents: "none",
          opacity: 0.3,
        }} />
      )}

      {/* Retro grain or grid effect */}
      {settings.screenFilter === "retro" && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 0), radial-gradient(rgba(0,0,0,0.08) 1px, transparent 0)",
          backgroundSize: "3px 3px", zIndex: 999, pointerEvents: "none",
          opacity: 0.45,
        }} />
      )}

      <GameCanvas
        state={stateRef.current}
        setState={setState}
        forceUpdate={forceUpdate}
        onEntityClick={handleEntityClick}
        onGroundItemClick={handleGroundItemClick}
        settings={settings}
      />
      <Hud
        state={stateRef.current}
        setState={setState}
        forceUpdate={forceUpdate}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onSettingsChanged={handleSettingsChanged}
      />
      {dialogEntity && (
        <NpcDialog
          state={stateRef.current}
          setState={setState}
          forceUpdate={forceUpdate}
          entity={dialogEntity}
          onClose={() => setDialogEntity(null)}
        />
      )}

      {stateRef.current.player.levelUpEvent && (
        <LevelUpCelebration
          skillName={stateRef.current.player.levelUpEvent.skillName}
          newLevel={stateRef.current.player.levelUpEvent.newLevel}
          emoji={stateRef.current.player.levelUpEvent.emoji}
          onClose={() => {
            setState(s => {
              s.player.levelUpEvent = null;
            });
            forceUpdate();
          }}
        />
      )}
    </div>
  );
};
