import type { GameState, WorldEntity } from "./engine";
import {
  addChat, addXp, addToInventory, changeZone, dist, findPath, getSkillLevel,
  isBlocked, npcAttackPlayer, playerAttackNpc, removeFromInventory, getWeaponDef,
  saveGameState, addHitsplat, addDangerTile, plantSeed, harvestPatch, startFightCaves,
  exitFightCaves, countItem, startRaid, progressRaid, finishRaidAndReward,
  doAgilityObstacle, crossWildernessDitch, solveClueStep, offerBonesAtPohAltar,
  addToCollectionLog, recordNpcKill, progressDragonSlayer
} from "./engine";
import { COMBAT_NPCS, RESOURCES, FISHING_SPOTS, COOKING_CONFIG, SMELTING_CONFIG, BRINDLE_AGILITY_OBSTACLES } from "./data/gameConfig";
import { getItem } from "./data/items";
import { soundEngine } from "./audio";

const TICK_MS = 600;

export interface TickActions {
  moveToTile: (x: number, y: number) => void;
  interactEntity: (entity: WorldEntity) => void;
  pickupItem: (id: string) => void;
}

let skillingCooldown = 0;

export function gameTick(state: GameState): string | null {
  state.tick++;
  const player = state.player;

  // Background music track management
  if (state.zone?.musicTrack) {
    soundEngine.startBackgroundMusic(state.zone.musicTrack);
  }

  // Farming Crop Growth Ticks (every 12 ticks / 7.2 seconds)
  if (state.tick % 12 === 0 && player.farmingPatches) {
    for (const patch of player.farmingPatches) {
      if (patch.stage === 1) {
        patch.stage = 2; // Growing
      } else if (patch.stage === 2) {
        patch.stage = 3; // Fully grown / Harvestable!
        const cropName = patch.harvestItemId ? getItem(patch.harvestItemId).name : "crops";
        addChat(state, `🌱 Your ${cropName} in Brindle are fully grown and ready to harvest!`, "#00FF80");
        soundEngine.playFarmingAction();
      }
    }
  }

  // HP/Prayer regen (every 5 ticks for HP, slowly)
  if (state.tick % 5 === 0 && player.hp < player.maxHp) {
    player.hp = Math.min(player.maxHp, player.hp + 1);
  }

  // Special Attack energy regen (+10% every 16 ticks / 10 seconds)
  if (state.tick % 16 === 0 && player.specEnergy < 100) {
    player.specEnergy = Math.min(100, player.specEnergy + 10);
  }

  // Decrement freeze on player
  if (player.frozenTicks && player.frozenTicks > 0) {
    player.frozenTicks--;
  }

  // Resolve Boss Danger Tiles
  if (state.dangerTiles && state.dangerTiles.length > 0) {
    const remainingDangers = [];
    for (const d of state.dangerTiles) {
      if (state.tick >= d.explodeTick) {
        // Danger tile detonates!
        if (player.tileX === d.x && player.tileY === d.y) {
          let dmg = d.damage;
          if (d.label.includes("Dragonfire") && player.equipment.SHIELD === "anti_dragon_shield") {
            dmg = Math.floor(dmg * 0.15);
            addChat(state, "🛡️ Your Anti-Dragon Shield protected you from the Dragonfire blast!", "#4CAF50");
          } else {
            addChat(state, `💥 ${d.sourceNpcName}'s ${d.label} struck you for ${dmg} damage!`, "#FF1744");
          }
          player.hp = Math.max(0, player.hp - dmg);
          soundEngine.playHitSound(false, true);
          addHitsplat(state, player.tileX, player.tileY, dmg);
        }
      } else {
        remainingDangers.push(d);
      }
    }
    state.dangerTiles = remainingDangers;
  }

  // Movement: step along path (unless player is frozen)
  if (state.path.length > 0) {
    if (player.frozenTicks && player.frozenTicks > 0) {
      addChat(state, "You are frozen and cannot move!", "#00E5FF");
      state.path = [];
      state.isMoving = false;
    } else {
      const next = state.path[0];
      if (!isBlocked(state, next.x, next.y) || (next.x === state.path[state.path.length - 1]?.x && next.y === state.path[state.path.length - 1]?.y && state.path.length === 1)) {
        if (!isBlocked(state, next.x, next.y)) {
          player.tileX = next.x;
          player.tileY = next.y;
          state.path.shift();
        } else {
          state.path = [];
        }
      } else {
        player.tileX = next.x;
        player.tileY = next.y;
        state.path.shift();
      }
      state.isMoving = true;
    }
  } else {
    state.isMoving = false;
  }

  // Combat: player attacks target
  if (state.combatTargetId) {
    const target = state.entities.find(e => e.id === state.combatTargetId && !e.isDead);
    if (!target) {
      state.combatTargetId = null;
    } else {
      const isMagicOrRanged = !!player.autocastSpell || player.equipment.WEAPON?.includes("bow") || player.equipment.WEAPON?.includes("staff");
      const attackRange = isMagicOrRanged ? 4 : 1;
      const d = dist(player.tileX, player.tileY, target.tileX, target.tileY);

      if (d > attackRange) {
        if (state.path.length === 0 && (!player.frozenTicks || player.frozenTicks <= 0)) {
          state.path = findPath(state, player.tileX, player.tileY, target.tileX, target.tileY);
        }
      } else {
        const weapon = getWeaponDef(player);
        const attackSpeed = weapon?.attackSpeedTicks ?? (player.autocastSpell ? 5 : 4);
        if (state.tick - state.lastAttackedTick >= attackSpeed) {
          state.lastAttackedTick = state.tick;
          playerAttackNpc(state, target);
        }
      }
    }
  }

  // Skilling & Object interactions
  if (state.skillingTargetId) {
    const target = state.entities.find(e => e.id === state.skillingTargetId);
    if (!target || target.depleted) {
      state.skillingTargetId = null;
    } else {
      handleSkilling(state, target);
    }
  }

  // NPC AI: Boss abilities, aggression, attacks, wandering, respawns
  for (const npc of state.entities) {
    if (npc.isDead) {
      npc.deadTicks++;
      if (npc.deadTicks >= npc.respawnTicks) {
        npc.isDead = false;
        npc.deadTicks = 0;
        npc.currentHp = npc.maxHp;
        npc.tileX = npc.spawnTileX;
        npc.tileY = npc.spawnTileY;
      }
      continue;
    }

    if (npc.frozenTicks && npc.frozenTicks > 0) {
      npc.frozenTicks--;
      continue; // Frozen NPCs cannot move or trigger melee attacks
    }

    // Boss Telegraphed AoE mechanics
    if (npc.type === "boss_grimjaw" && player.hp > 0) {
      if (state.tick % 14 === 0) {
        // Grimjaw Ground Slam
        addChat(state, "⚠️ Grimjaw winds up a seismic Ground Slam! Move away from the red danger zone!", "#FF9800");
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            addDangerTile(state, player.tileX + dx, player.tileY + dy, state.tick + 3, 18, "Ground Slam", "Grimjaw");
          }
        }
      }
    } else if (npc.type === "boss_elvarg" && player.hp > 0) {
      if (state.tick % 11 === 0) {
        // Elvarg Dragonfire Torrent
        addChat(state, "🔥 Elvarg inhales deeply to unleash an incinerating Dragonfire Torrent!", "#FF1744");
        const px = player.tileX, py = player.tileY;
        addDangerTile(state, px, py, state.tick + 3, 35, "Dragonfire Torrent", "Elvarg");
        addDangerTile(state, px + 1, py, state.tick + 3, 35, "Dragonfire Torrent", "Elvarg");
        addDangerTile(state, px - 1, py, state.tick + 3, 35, "Dragonfire Torrent", "Elvarg");
        addDangerTile(state, px, py + 1, state.tick + 3, 35, "Dragonfire Torrent", "Elvarg");
        addDangerTile(state, px, py - 1, state.tick + 3, 35, "Dragonfire Torrent", "Elvarg");
      }
    } else if (npc.type === "boss_malakor" && player.hp > 0) {
      if (state.tick % 13 === 0) {
        // Malakor Bone Spikes
        addChat(state, "💀 Malakor raises sharp necrotic bone spikes from beneath the crypt!", "#E040FB");
        for (let i = 0; i < 4; i++) {
          const rx = npc.tileX + Math.floor(Math.random() * 5) - 2;
          const ry = npc.tileY + Math.floor(Math.random() * 5) - 2;
          addDangerTile(state, rx, ry, state.tick + 3, 15, "Bone Spikes", "Malakor");
        }
      }
    } else if (npc.type === "boss_tztok_jad" && player.hp > 0) {
      if (state.tick % 8 === 0) {
        // TzTok-Jad telegraphed attack
        const isMage = Math.random() < 0.5;
        if (isMage) {
          addChat(state, "🌋 JAD WINDS UP A METEORIC FIREBALL! (Magic Attack - Move away!)", "#FF1744");
          soundEngine.playMagicCast("fire_blast");
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              addDangerTile(state, player.tileX + dx, player.tileY + dy, state.tick + 3, 45, "Jad Fireball", "TzTok-Jad");
            }
          }
        } else {
          addChat(state, "🪨 JAD SLAMS HIS HEELS FOR A SEISMIC ROCKFALL! (Ranged Attack - Move away!)", "#FF9800");
          soundEngine.playAttackSound("melee");
          for (let i = 0; i < 4; i++) {
            const rx = player.tileX + Math.floor(Math.random() * 3) - 1;
            const ry = player.tileY + Math.floor(Math.random() * 3) - 1;
            addDangerTile(state, rx, ry, state.tick + 3, 40, "Jad Rockfall", "TzTok-Jad");
          }
        }
      }
    } else if (npc.type === "boss_tekton" && player.hp > 0) {
      if (state.tick % 7 === 0) {
        addChat(state, "🔨 Tekton hammers burning obsidian sparks across the forge floor!", "#FF5722");
        for (let i = 0; i < 3; i++) {
          const rx = player.tileX + Math.floor(Math.random() * 5) - 2;
          const ry = player.tileY + Math.floor(Math.random() * 5) - 2;
          addDangerTile(state, rx, ry, state.tick + 2, 28, "Obsidian Spark", "Tekton");
        }
      }
    } else if (npc.type === "boss_mutadile" && player.hp > 0) {
      if (state.tick % 8 === 0) {
        addChat(state, "🐊 Mutadile unleashes a sweeping tidal chomp from the water!", "#00BCD4");
        for (let i = 0; i < 3; i++) {
          addDangerTile(state, player.tileX, player.tileY + i - 1, state.tick + 2, 25, "Water Surge", "Mutadile");
        }
      }
    } else if (npc.type === "boss_olm" && player.hp > 0) {
      if (state.tick % 6 === 0) {
        const roll = Math.random();
        if (roll < 0.5) {
          addChat(state, "🐉 THE GREAT OLM SUMMONS FALLING CRYSTAL SPIKES!", "#E040FB");
          soundEngine.playBossRoar();
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              addDangerTile(state, player.tileX + dx, player.tileY + dy, state.tick + 3, 38, "Falling Crystal", "The Great Olm");
            }
          }
        } else {
          addChat(state, "⚡ THE GREAT OLM CHARGES A LIGHTNING SURGE WALL!", "#00E5FF");
          for (let i = -2; i <= 2; i++) {
            addDangerTile(state, player.tileX + i, player.tileY, state.tick + 2, 32, "Lightning Surge", "The Great Olm");
          }
        }
      }
    } else if (npc.type === "boss_chaos_elemental" && player.hp > 0) {
      if (state.tick % 9 === 0) {
        addChat(state, "🌌 Chaos Elemental warps space and fires chaotic vortexes!", "#9C27B0");
        addDangerTile(state, player.tileX, player.tileY, state.tick + 2, 25, "Chaos Vortex", "Chaos Elemental");
      }
    } else if (npc.type === "boss_venenatis" && player.hp > 0) {
      if (state.tick % 8 === 0) {
        addChat(state, "🕷️ Venenatis shoots a sticky suffocating web blast!", "#4CAF50");
        addDangerTile(state, player.tileX, player.tileY, state.tick + 2, 35, "Toxic Web", "Venenatis");
      }
    } else if (npc.type === "boss_callisto" && player.hp > 0) {
      if (state.tick % 8 === 0) {
        addChat(state, "🐻 Callisto slams the earth with a terrifying shockwave!", "#795548");
        for (let dx = -1; dx <= 1; dx++) {
          addDangerTile(state, player.tileX + dx, player.tileY, state.tick + 2, 36, "Seismic Roar", "Callisto");
        }
      }
    }

    if (!npc.npcId || !COMBAT_NPCS[npc.npcId]) continue;
    const config = COMBAT_NPCS[npc.npcId];
    const d = dist(player.tileX, player.tileY, npc.tileX, npc.tileY);

    // Aggression
    if (config.aggressive && d <= (config.aggroRange ?? 3) && player.hp > 0) {
      if (d > 1) {
        // Move toward player
        if (state.tick % 2 === 0) {
          const dx = Math.sign(player.tileX - npc.tileX);
          const dy = Math.sign(player.tileY - npc.tileY);
          const nx = npc.tileX + dx, ny = npc.tileY + dy;
          if (!isBlocked(state, nx, ny)) {
            npc.tileX = nx; npc.tileY = ny;
          } else if (!isBlocked(state, npc.tileX + dx, npc.tileY)) {
            npc.tileX += dx;
          } else if (!isBlocked(state, npc.tileX, npc.tileY + dy)) {
            npc.tileY += dy;
          }
        }
      } else {
        // Attack player
        if (state.tick - state.npcAttackTick >= npc.attackSpeed) {
          if (state.tick % npc.attackSpeed === Math.abs(npc.id.charCodeAt(0)) % npc.attackSpeed) {
            npcAttackPlayer(state, npc);
            state.npcAttackTick = state.tick;
          }
        }
      }
    } else if (npc.wanderRange > 0 && state.tick % 10 === 0 && Math.random() < 0.3) {
      // Wander
      const cx = npc.tileX + Math.floor(Math.random() * 3) - 1;
      const cy = npc.tileY + Math.floor(Math.random() * 3) - 1;
      if (Math.abs(cx - npc.spawnTileX) <= npc.wanderRange && Math.abs(cy - npc.spawnTileY) <= npc.wanderRange) {
        if (!isBlocked(state, cx, cy)) { npc.tileX = cx; npc.tileY = cy; }
      }
    }
  }

  return null;
}

function handleSkilling(state: GameState, target: WorldEntity) {
  const player = state.player;
  const d = dist(player.tileX, player.tileY, target.tileX, target.tileY);
  if (d > 1) {
    if (state.path.length === 0) {
      state.path = findPath(state, player.tileX, player.tileY, target.tileX, target.tileY);
    }
    return;
  }

  // Resource gathering
  const resConfig = RESOURCES[target.type];
  if (resConfig) {
    const skillLevel = getSkillLevel(player, resConfig.skillName);
    if (skillLevel < resConfig.requiredLevel) {
      addChat(state, `You need ${resConfig.requiredLevel} ${resConfig.skillName} to do this.`, "#FF4444");
      state.skillingTargetId = null;
      return;
    }
    if (resConfig.toolRequiredPrefix && !checkTool(player, resConfig.toolRequiredPrefix)) {
      addChat(state, `You need a ${resConfig.toolRequiredPrefix} to harvest this.`, "#FF4444");
      state.skillingTargetId = null;
      return;
    }
    skillingCooldown++;
    if (skillingCooldown >= resConfig.baseIntervalTicks) {
      skillingCooldown = 0;
      const successChance = resConfig.lowChance + (resConfig.highChance - resConfig.lowChance) * ((skillLevel - resConfig.requiredLevel) / 99);
      if (Math.random() <= successChance) {
        addToInventory(player, resConfig.rewardedItem, 1);
        addXp(player, resConfig.skillName, resConfig.xpAwarded);
        addChat(state, `You got some ${getItem(resConfig.rewardedItem).name}.`, "#4CAF50");

        if (player.tutorialStep === 1 && resConfig.rewardedItem === "logs") {
          player.tutorialStep = 2;
          addChat(state, "Tutorial Update: You chopped logs! Head south-east to the Fishing & Cooking Tutor.", "#FFD700");
        }

        if (Math.random() < resConfig.depletionChance) {
          target.depleted = true;
          target.depletedTicks = 0;
          state.skillingTargetId = null;
        }
      }
    }
    return;
  }

  // Fishing spots
  const fishConfig = FISHING_SPOTS[target.type];
  if (fishConfig) {
    const skillLevel = getSkillLevel(player, "fishing");
    const eligible = fishConfig.catches.filter(f => skillLevel >= f.level);
    if (eligible.length === 0) {
      addChat(state, `You need higher Fishing level to fish here.`, "#FF4444");
      state.skillingTargetId = null;
      return;
    }
    if (!checkTool(player, fishConfig.toolRequired)) {
      addChat(state, `You need a ${getItem(fishConfig.toolRequired).name} to fish here.`, "#FF4444");
      state.skillingTargetId = null;
      return;
    }
    skillingCooldown++;
    if (skillingCooldown >= 3) {
      skillingCooldown = 0;
      const fish = eligible[Math.floor(Math.random() * eligible.length)];
      if (Math.random() <= fish.chance) {
        addToInventory(player, fish.itemId, 1);
        addXp(player, "fishing", fish.xp);
        addChat(state, `You caught a ${getItem(fish.itemId).name}.`, "#4CAF50");
      }
    }
    return;
  }

  // Cooking range
  if (target.type === "cooking_range") {
    for (const cook of Object.values(COOKING_CONFIG)) {
      if (countItemInInventory(player, cook.rawId) > 0) {
        const skillLevel = getSkillLevel(player, "cooking");
        if (skillLevel < cook.requiredLevel) continue;
        skillingCooldown++;
        if (skillingCooldown >= 3) {
          skillingCooldown = 0;
          removeFromInventory(player, cook.rawId, 1);
          const burnChance = Math.max(0.05, 0.5 - (skillLevel - cook.requiredLevel) * 0.03);
          if (Math.random() < burnChance) {
            addToInventory(player, cook.burntId, 1);
            addChat(state, `You accidentally burnt the ${getItem(cook.rawId).name}!`, "#FF4444");
          } else {
            addToInventory(player, cook.cookedId, 1);
            addXp(player, "cooking", cook.xp);
            addChat(state, `You successfully cooked the ${getItem(cook.cookedId).name}.`, "#4CAF50");

            if (player.tutorialStep === 2 && cook.cookedId === "shrimps") {
              player.tutorialStep = 3;
              addChat(state, "Tutorial Update: You cooked shrimps! Head west to the Mining & Smithing Tutor.", "#FFD700");
            }
          }
        }
        return;
      }
    }
    addChat(state, "You have no raw food to cook.", "#FF4444");
    state.skillingTargetId = null;
    return;
  }

  // Smelting (at furnace)
  if (target.type === "furnace") {
    for (const smelt of SMELTING_CONFIG) {
      const skillLevel = getSkillLevel(player, "smithing");
      if (skillLevel < smelt.requiredLevel) continue;
      let canSmelt = true;
      for (const ore of smelt.ores) {
        if (countItemInInventory(player, ore.itemId) < ore.qty) { canSmelt = false; break; }
      }
      if (canSmelt) {
        skillingCooldown++;
        if (skillingCooldown >= 3) {
          skillingCooldown = 0;
          for (const ore of smelt.ores) {
            removeFromInventory(player, ore.itemId, ore.qty);
          }
          addToInventory(player, smelt.barId, 1);
          addXp(player, "smithing", smelt.xp);
          addChat(state, `You smelted a ${getItem(smelt.barId).name}.`, "#4CAF50");
          if (player.tutorialStep === 3) {
            player.tutorialStep = 4;
            addChat(state, "Tutorial Update: You smelted a Bronze bar! Use the anvil nearby with a hammer.", "#FFD700");
          }
        }
        return;
      }
    }
    addChat(state, "You don't have the right ores to smelt.", "#FF4444");
    state.skillingTargetId = null;
    return;
  }

  // Altar
  if (target.type === "altar") {
    player.prayer = player.maxPrayer;
    addChat(state, "You pray at the altar. Prayer points restored!", "#00E5FF");
    state.skillingTargetId = null;
    return;
  }

  // Smithing
  if (target.type === "anvil") {
    const hasHammer = player.inventory.some((s: any) => s?.itemId === "hammer");
    if (!hasHammer) {
      addChat(state, "You need a Hammer to smith items.", "#FF4444");
      state.skillingTargetId = null;
      return;
    }
    const barCount = countItemInInventory(player, "bronze_bar");
    if (barCount < 1) {
      addChat(state, "You need a Bronze bar to smith a Bronze dagger.", "#FF4444");
      state.skillingTargetId = null;
      return;
    }
    skillingCooldown++;
    if (skillingCooldown >= 3) {
      skillingCooldown = 0;
      removeFromInventory(player, "bronze_bar", 1);
      addToInventory(player, "bronze_dagger", 1);
      addXp(player, "smithing", 12.5);
      addChat(state, "You hammer the bronze bar on the anvil and forge a Bronze dagger.", "#4CAF50");
      if (player.tutorialStep === 4) {
        player.tutorialStep = 5;
        addChat(state, "Tutorial Update: You forged a Bronze dagger! Equip it and speak to the Combat Instructor.", "#FFD700");
      }
    }
    return;
  }

  // Quest Gathering Objects: Milk, Eggs, Flour, Golden Skull
  if (target.type === "cow") {
    if (countItemInInventory(player, "bucket") > 0) {
      removeFromInventory(player, "bucket", 1);
      addToInventory(player, "fresh_milk", 1);
      addChat(state, "🥛 You milk the cow and obtain a bucket of Fresh Milk!", "#00E5FF");
    } else {
      addToInventory(player, "fresh_milk", 1);
      addChat(state, "🥛 You milk the dairy cow and obtain Fresh Milk for the Chef!", "#00E5FF");
    }
    state.skillingTargetId = null;
    return;
  }

  if (target.type === "egg_nest") {
    addToInventory(player, "super_fresh_egg", 1);
    addChat(state, "🥚 You collected a Super-fresh Egg from the nest!", "#FFD700");
    state.skillingTargetId = null;
    return;
  }

  if (target.type === "flour_bin") {
    if (countItemInInventory(player, "pot") > 0) {
      removeFromInventory(player, "pot", 1);
    }
    addToInventory(player, "top_quality_flour", 1);
    addChat(state, "🌾 You collected Top-quality Flour in a pot!", "#FFD700");
    state.skillingTargetId = null;
    return;
  }

  if (target.type === "crypt_altar") {
    if (player.quests.restless_ghost === 1) {
      addToInventory(player, "golden_skull", 1);
      addChat(state, "💀 You retrieved the sacred Golden Skull! Return it to the Restless Spirit.", "#FFD700");
    } else {
      addChat(state, "An ancient dark altar. Whispers echo through the chamber.", "#8C8070");
    }
    state.skillingTargetId = null;
    return;
  }

  // Farming Patches Interaction
  if (target.type === "farming_herb_patch") {
    const patch = player.farmingPatches.find(p => p.patchType === "HERB");
    if (!patch) return;

    if (patch.stage === 3) {
      harvestPatch(state, patch.id);
    } else if (patch.stage === 0) {
      // Find seed to plant
      const seeds = ["torstol_seed", "toadflax_seed", "ranarr_seed"];
      let planted = false;
      for (const sId of seeds) {
        if (countItem(player, sId) > 0) {
          plantSeed(state, patch.id, sId);
          planted = true;
          break;
        }
      }
      if (!planted) {
        addChat(state, "🌱 You have no herb seeds to plant! Buy Ranarr or Toadflax seeds from the Tool Leprechaun.", "#FF9800");
      }
    } else {
      const cropName = patch.harvestItemId ? getItem(patch.harvestItemId).name : "crops";
      addChat(state, `🌱 Herb patch is currently growing ${cropName}... (Stage ${patch.stage}/3)`, "#00E5FF");
    }
    state.skillingTargetId = null;
    return;
  }

  if (target.type === "farming_tree_patch") {
    const patch = player.farmingPatches.find(p => p.patchType === "TREE");
    if (!patch) return;

    if (patch.stage === 3) {
      harvestPatch(state, patch.id);
    } else if (patch.stage === 0) {
      if (countItem(player, "magic_seed") > 0) {
        plantSeed(state, patch.id, "magic_seed");
      } else {
        addChat(state, "🌳 You have no tree seeds to plant! Buy Magic Tree Seeds from the Tool Leprechaun.", "#FF9800");
      }
    } else {
      addChat(state, `🌳 Tree patch is currently growing Magic Trees... (Stage ${patch.stage}/3)`, "#00E5FF");
    }
    state.skillingTargetId = null;
    return;
  }

  // Housing & POH Interactions
  if (target.type === "house_portal") {
    changeZone(state, "player_house");
    addChat(state, "🏡 Entered your Player-Owned House.", "#00FF80");
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "house_exit_portal" || target.type === "poh_teleport_portal") {
    changeZone(state, "brindle_mainland");
    addChat(state, "Teleported to Brindle mainland village.", "#00FF80");
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "poh_altar") {
    const bones = ["dragon_bones", "bones"];
    let offered = false;
    for (const b of bones) {
      if (countItem(player, b) > 0) {
        offerBonesAtPohAltar(state, b);
        offered = true;
        break;
      }
    }
    if (!offered) {
      addChat(state, "You have no bones to offer! Bring Bones or Dragon Bones to offer on your sacred altar.", "#FF9800");
    }
    state.skillingTargetId = null;
    return;
  }

  // Chambers of Xeric Raid Interactions
  if (target.type === "raid_portal") {
    startRaid(state);
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "cox_exit") {
    changeZone(state, "brindle_mainland");
    state.player.raidState = null;
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "cox_reward_chest") {
    finishRaidAndReward(state);
    state.skillingTargetId = null;
    return;
  }

  // Wilderness Ditch Transitions
  if (target.type === "wilderness_ditch" || target.type === "wildy_return_ditch") {
    crossWildernessDitch(state);
    state.skillingTargetId = null;
    return;
  }

  // Agility Rooftop Course
  if (target.type === "agility_start_wall") {
    doAgilityObstacle(state, "brindle_roof_1");
    state.skillingTargetId = null;
    return;
  }

  // Dungeons & Zone Transitions
  if (target.type === "grimjaw_cave_entrance") {
    changeZone(state, "grimjaw_lair");
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "tzhaar_portal") {
    startFightCaves(state);
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "tzhaar_exit") {
    exitFightCaves(state);
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "slayer_dungeon_portal") {
    changeZone(state, "slayer_crypt");
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "slayer_exit") {
    changeZone(state, "brindle_mainland");
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "cave_exit" || target.type === "crypt_exit" || target.type === "dragon_exit") {
    changeZone(state, "brindle_mainland");
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "crypt_entrance") {
    changeZone(state, "skeleton_crypt");
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "crandor_ferry") {
    if (player.equipment.SHIELD !== "anti_dragon_shield") {
      addChat(state, "⚠️ Warning: You do not have an Anti-Dragon Shield equipped! Slaying Elvarg will be perilous!", "#FF9800");
    }
    changeZone(state, "dragon_crypt");
    state.skillingTargetId = null;
    return;
  }
  if (target.type === "dock_landmark") {
    const step = player.tutorialStep ?? 0;
    if (step < 7) {
      addChat(state, "You must complete your tutorial island training with the Combat Instructor before departing.", "#FF4444");
    } else {
      player.quests.tutorial_island = 100;
      changeZone(state, "brindle_mainland");
      addChat(state, "You board the ferry and set sail to the mainland! Welcome to Brindle village.", "#00FF80");
    }
    state.skillingTargetId = null;
    return;
  }
}

function checkTool(player: any, prefix: string): boolean {
  const equipped = player.equipment["WEAPON"];
  if (equipped && equipped.includes(prefix)) return true;
  return player.inventory.some((s: any) => s && s.itemId.includes(prefix));
}

function countItemInInventory(player: any, itemId: string): number {
  return player.inventory.reduce((sum: number, s: any) => sum + (s?.itemId === itemId ? s.amount : 0), 0);
}

export function startGameLoop(state: GameState, onTick: () => void): () => void {
  const interval = setInterval(() => {
    gameTick(state);
    onTick();
    saveGameState(state);
  }, TICK_MS);
  return () => clearInterval(interval);
}
