import type {
  ZoneDefinition, ZoneEntitySpawn, GroundItem, Hitsplat, DangerTile,
  ChatLogEntry, InventoryItem, EquipmentSlot, CombatStyle, FarmingPatchState,
  SlayerTask, FightCaveState, HouseState, ActiveClue, RaidState, HouseRoomType,
  DragonSlayerQuestState, ClanState, GrandExchangeOffer
} from "./types";
import { getZone } from "./data/zones";
import {
  COMBAT_NPCS, RESOURCES, FISHING_SPOTS, COOKING_CONFIG, SMELTING_CONFIG,
  SKILLS, HERBLORE_RECIPES, SLAYER_BOUNTY_OPTIONS, FURNITURE_RECIPES,
  CLUE_STEPS_DATABASE, BRINDLE_AGILITY_OBSTACLES, PETS_DATABASE,
  COMBAT_ACHIEVEMENTS, COLLECTION_LOG_CATEGORIES, DRAGON_SLAYER_QUEST_STEPS,
  THIEVING_TARGETS, getLevelForXp, getXpForLevel
} from "./data/gameConfig";
import { getItem, ITEMS } from "./data/items";
import { soundEngine } from "./audio";

export interface WorldEntity {
  id: string;
  name: string;
  emoji: string;
  tileX: number;
  tileY: number;
  type: string;
  examineText: string;
  combatLevel: number;
  currentHp: number;
  maxHp: number;
  attackSpeed: number;
  maxHit: number;
  attackLevel: number;
  strengthLevel: number;
  defenceLevel: number;
  npcId?: string;
  aggressive: boolean;
  aggroRange: number;
  wanderRange: number;
  respawnTicks: number;
  spawnTileX: number;
  spawnTileY: number;
  isDead: boolean;
  deadTicks: number;
  isResource: boolean;
  isCombatNpc: boolean;
  isInteractiveObject: boolean;
  isNpc: boolean;
  isBlocked: boolean;
  depleted: boolean;
  depletedTicks: number;
  attackStyle?: string;
  attackRange?: number;
  chatterLines: string[];
  isBoss?: boolean;
  frozenTicks?: number;
}

export interface PlayerState {
  name: string;
  tileX: number;
  tileY: number;
  hp: number;
  maxHp: number;
  prayer: number;
  maxPrayer: number;
  specEnergy: number;
  specActive: boolean;
  runEnergy: number;
  skills: Record<string, { xp: number; level: number }>;
  inventory: (InventoryItem | null)[];
  equipment: Partial<Record<EquipmentSlot, string>>;
  bank: Record<string, number>;
  combatStyle: CombatStyle;
  combatLevel: number;
  class?: string;
  emoji?: string;
  tutorialStep?: number;
  quests: Record<string, number>;
  questPoints: number;
  activePet?: string | null;
  autocastSpell?: string | null;
  frozenTicks?: number;
  activeClue?: ActiveClue | null;
  completedClues?: Record<string, number>;
  levelUpEvent?: { skillName: string; oldLevel: number; newLevel: number; emoji: string; announced?: boolean } | null;
  farmingPatches: FarmingPatchState[];
  slayerTask: SlayerTask | null;
  slayerPoints: number;
  fightCave: FightCaveState;
  house: HouseState;
  raidState: RaidState | null;
  marksOfGrace: number;
  agilityLapCount: number;
  inWilderness: boolean;
  wildernessLevel: number;
  isSkulled: boolean;
  skullTicks: number;
  collectionLog: Record<string, number>;
  combatAchievements: { completedTasks: string[]; kc: Record<string, number> };
  dragonSlayer: DragonSlayerQuestState;
  clan: ClanState | null;
  geOffers: GrandExchangeOffer[];
  barrowsState: { brothersDefeated: Record<string, boolean>; chestsLooted: number };
  tobRaidState: { active: boolean; currentRoom: number; verzikPhase: number; raidPoints: number; deaths: number; completed: boolean } | null;
}

export interface GameState {
  zoneId: string;
  zone: ZoneDefinition;
  player: PlayerState;
  entities: WorldEntity[];
  groundItems: GroundItem[];
  hitsplats: Hitsplat[];
  dangerTiles: DangerTile[];
  chatLogs: ChatLogEntry[];
  path: { x: number; y: number }[];
  combatTargetId: string | null;
  skillingTargetId: string | null;
  tick: number;
  lastAttackedTick: number;
  npcAttackTick: number;
  isMoving: boolean;
}

export interface ShopItem {
  itemId: string;
  price: number;
}

export const SHOP_INVENTORIES: Record<string, ShopItem[]> = {
  npc_shopkeeper_general: [
    { itemId: "tinderbox", price: 50 },
    { itemId: "hammer", price: 10 },
    { itemId: "knife", price: 10 },
    { itemId: "bucket", price: 10 },
    { itemId: "pot", price: 10 },
    { itemId: "small_fishing_net", price: 100 },
    { itemId: "fly_fishing_rod", price: 500 },
    { itemId: "feathers", price: 5 },
    { itemId: "bread", price: 12 },
    { itemId: "cooked_chicken", price: 60 },
    { itemId: "air_rune", price: 4 },
    { itemId: "water_rune", price: 4 },
    { itemId: "fire_rune", price: 4 },
    { itemId: "earth_rune", price: 4 },
    { itemId: "mind_rune", price: 3 },
    { itemId: "death_rune", price: 240 },
    { itemId: "blood_rune", price: 450 },
  ],
  npc_shopkeeper_weapons: [
    { itemId: "bronze_dagger", price: 10 },
    { itemId: "bronze_sword", price: 26 },
    { itemId: "bronze_scimitar", price: 32 },
    { itemId: "iron_scimitar", price: 112 },
    { itemId: "steel_scimitar", price: 400 },
    { itemId: "anti_dragon_shield", price: 5000 },
    { itemId: "dragon_dagger_p", price: 120000 },
    { itemId: "granite_maul", price: 75000 },
    { itemId: "bronze_full_helm", price: 44 },
    { itemId: "bronze_platebody", price: 160 },
    { itemId: "bronze_platelegs", price: 80 },
    { itemId: "bronze_kiteshield", price: 68 },
    { itemId: "iron_full_helm", price: 150 },
    { itemId: "iron_platebody", price: 560 },
    { itemId: "iron_platelegs", price: 280 },
    { itemId: "iron_kiteshield", price: 238 },
    { itemId: "leather_gloves", price: 6 },
    { itemId: "leather_boots", price: 6 },
    { itemId: "bronze_axe", price: 100 },
    { itemId: "iron_axe", price: 500 },
    { itemId: "bronze_pickaxe", price: 100 },
    { itemId: "iron_pickaxe", price: 500 },
    { itemId: "shortbow", price: 50 },
    { itemId: "magic_shortbow", price: 3500 },
    { itemId: "bronze_arrow", price: 3 },
    { itemId: "iron_arrow", price: 8 },
  ],
  npc_leprechaun: [
    { itemId: "rake", price: 15 },
    { itemId: "seed_dibber", price: 15 },
    { itemId: "watering_can", price: 25 },
    { itemId: "ranarr_seed", price: 25000 },
    { itemId: "toadflax_seed", price: 8000 },
    { itemId: "torstol_seed", price: 75000 },
    { itemId: "magic_seed", price: 120000 },
    { itemId: "vial_of_water", price: 10 },
    { itemId: "eye_of_newt", price: 15 },
    { itemId: "limpwurt_root", price: 150 },
    { itemId: "crushed_nest", price: 2500 },
  ],
  npc_tzhaar_master: [
    { itemId: "fire_cape", price: 10000 },
    { itemId: "obsidian_cape", price: 2500 },
    { itemId: "obsidian_shield", price: 4500 },
    { itemId: "tzhaar_ket_om", price: 6000 },
    { itemId: "super_combat_potion", price: 300 },
  ],
  npc_slayer_master: [
    { itemId: "slayer_helmet", price: 400 },
    { itemId: "slayer_gem", price: 1 },
    { itemId: "slayer_ring", price: 75 },
    { itemId: "herb_sack", price: 250 },
    { itemId: "ranarr_seed", price: 50 },
    { itemId: "torstol_seed", price: 100 },
  ],
  npc_grace: [
    { itemId: "graceful_hood", price: 35 },
    { itemId: "graceful_top", price: 55 },
    { itemId: "graceful_legs", price: 50 },
    { itemId: "graceful_gloves", price: 30 },
    { itemId: "graceful_boots", price: 40 },
    { itemId: "graceful_cape", price: 40 },
    { itemId: "stamina_potion", price: 10 },
  ],
  npc_seed_master: [
    { itemId: "compost", price: 35 },
    { itemId: "supercompost", price: 250 },
    { itemId: "plant_cure", price: 40 },
    { itemId: "watermelon_seed", price: 150 },
    { itemId: "snape_grass_seed", price: 800 },
    { itemId: "papaya_seed", price: 3500 },
    { itemId: "ranarr_seed", price: 25000 },
  ],
  npc_clan_clerk: [
    { itemId: "clan_charter", price: 100000 },
  ],
  npc_estate_agent: [
    { itemId: "saw", price: 25 },
    { itemId: "steel_nails", price: 5 },
    { itemId: "plank_wood", price: 100 },
    { itemId: "plank_oak", price: 350 },
    { itemId: "plank_teak", price: 950 },
    { itemId: "plank_mahogany", price: 2200 },
    { itemId: "bolt_of_cloth", price: 250 },
    { itemId: "marble_block", price: 50000 },
    { itemId: "gold_leaf", price: 130000 },
    { itemId: "house_teleport_tab", price: 800 },
  ],
  npc_kolodion: [
    { itemId: "saradomin_cape", price: 250000 },
    { itemId: "zamorak_cape", price: 250000 },
    { itemId: "guthix_cape", price: 250000 },
    { itemId: "blood_money", price: 100 },
  ],
};

let hitIdCounter = 0;
let chatIdCounter = 0;
let dangerIdCounter = 0;

export function saveGameState(state: GameState): void {
  try {
    const saveData = {
      name: state.player.name,
      tileX: state.player.tileX,
      tileY: state.player.tileY,
      hp: state.player.hp,
      maxHp: state.player.maxHp,
      prayer: state.player.prayer,
      maxPrayer: state.player.maxPrayer,
      specEnergy: state.player.specEnergy,
      specActive: state.player.specActive,
      runEnergy: state.player.runEnergy,
      skills: state.player.skills,
      inventory: state.player.inventory,
      equipment: state.player.equipment,
      bank: state.player.bank,
      combatStyle: state.player.combatStyle,
      combatLevel: state.player.combatLevel,
      class: state.player.class,
      emoji: state.player.emoji,
      zoneId: state.zoneId,
      tutorialStep: state.player.tutorialStep ?? 0,
      quests: state.player.quests ?? {},
      questPoints: state.player.questPoints ?? 0,
      activePet: state.player.activePet ?? null,
      autocastSpell: state.player.autocastSpell ?? null,
      farmingPatches: state.player.farmingPatches ?? [],
      slayerTask: state.player.slayerTask ?? null,
      slayerPoints: state.player.slayerPoints ?? 0,
      fightCave: state.player.fightCave ?? { active: false, wave: 0, totalWaves: 10, killsThisWave: 0, totalKillsNeeded: 0, tokkulEarned: 0 },
      house: state.player.house ?? { hasHouse: true, rooms: [{ id: "room_garden", type: "GARDEN", name: "Garden", gridX: 1, gridY: 1, furniture: {} }, { id: "room_parlour", type: "PARLOUR", name: "Parlour", gridX: 1, gridY: 0, furniture: {} }], housedPets: [] },
      marksOfGrace: state.player.marksOfGrace ?? 0,
      agilityLapCount: state.player.agilityLapCount ?? 0,
    };
    localStorage.setItem("dungeon_quest_player_save", JSON.stringify(saveData));
  } catch (_e) {
    // Ignore storage issues in sandbox
  }
}

export function loadSavedPlayerState(): Partial<PlayerState> | null {
  try {
    const raw = localStorage.getItem("dungeon_quest_player_save");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_e) {
    return null;
  }
}

export function createInitialState(): GameState {
  const saved = loadSavedPlayerState();
  const zoneId = (saved as any)?.zoneId ?? "tutorial_island";
  const zone = getZone(zoneId);

  // Initialize all skills
  const skills: Record<string, { xp: number; level: number }> = {};
  for (const s of SKILLS) {
    skills[s.id] = { xp: s.defaultXp, level: s.defaultLevel };
  }

  // Restore skills if saved
  if (saved?.skills) {
    for (const [k, v] of Object.entries(saved.skills)) {
      if (skills[k]) {
        skills[k] = { xp: v.xp, level: v.level };
      }
    }
  }

  // Starter inventory
  const inv: (InventoryItem | null)[] = new Array(28).fill(null);
  if (saved?.inventory) {
    for (let i = 0; i < 28; i++) {
      inv[i] = saved.inventory[i] ?? null;
    }
  } else {
    inv[0] = { itemId: "bronze_axe", amount: 1 };
    inv[1] = { itemId: "tinderbox", amount: 1 };
    inv[2] = { itemId: "small_fishing_net", amount: 1 };
    inv[3] = { itemId: "bread", amount: 5 };
    inv[4] = { itemId: "coins", amount: 100 };
    inv[5] = { itemId: "bronze_pickaxe", amount: 1 };
    inv[6] = { itemId: "hammer", amount: 1 };
    inv[7] = { itemId: "bucket", amount: 1 };
    inv[8] = { itemId: "pot", amount: 1 };
  }

  const quests: Record<string, number> = saved?.quests ?? {
    tutorial_island: saved?.tutorialStep && saved.tutorialStep >= 8 ? 100 : 0,
    cooks_assistant: 0,
    restless_ghost: 0,
    dragon_slayer: 0,
  };

  const initialPatches: FarmingPatchState[] = saved?.farmingPatches ?? [
    {
      id: "herb_patch_1",
      patchType: "HERB",
      seedId: null,
      stage: 0, // 0 = empty/weeds, 1 = seeded, 2 = growing, 3 = harvestable
      plantedTick: 0,
      harvestItemId: null,
      harvestQty: 0,
    },
    {
      id: "tree_patch_1",
      patchType: "TREE",
      seedId: null,
      stage: 0,
      plantedTick: 0,
      harvestItemId: null,
      harvestQty: 0,
    },
  ];

  const player: PlayerState = {
    name: saved?.name ?? "Adventurer",
    tileX: saved?.tileX ?? zone.spawnTileX,
    tileY: saved?.tileY ?? zone.spawnTileY,
    hp: saved?.hp ?? 10,
    maxHp: saved?.maxHp ?? 10,
    prayer: saved?.prayer ?? 1,
    maxPrayer: saved?.maxPrayer ?? 1,
    specEnergy: saved?.specEnergy ?? 100,
    specActive: false,
    runEnergy: saved?.runEnergy ?? 100,
    skills,
    inventory: inv,
    equipment: saved?.equipment ?? {},
    bank: saved?.bank ?? {},
    combatStyle: saved?.combatStyle ?? "ACCURATE",
    combatLevel: 3,
    class: saved?.class ?? "Wizard",
    emoji: saved?.emoji ?? "🧙‍♂️",
    tutorialStep: saved?.tutorialStep ?? 0,
    quests,
    questPoints: saved?.questPoints ?? 0,
    activePet: saved?.activePet ?? null,
    autocastSpell: saved?.autocastSpell ?? null,
    frozenTicks: 0,
    activeClue: null,
    levelUpEvent: null,
    farmingPatches: initialPatches,
    slayerTask: saved?.slayerTask ?? null,
    slayerPoints: saved?.slayerPoints ?? 0,
    fightCave: saved?.fightCave ?? { active: false, wave: 0, totalWaves: 10, killsThisWave: 0, totalKillsNeeded: 0, tokkulEarned: 0 },
    house: saved?.house ?? {
      hasHouse: true,
      rooms: [
        { id: "room_garden", type: "GARDEN", name: "Formal Garden", gridX: 1, gridY: 1, furniture: {} },
        { id: "room_parlour", type: "PARLOUR", name: "Parlour", gridX: 1, gridY: 0, furniture: {} },
      ],
      housedPets: [],
    },
    raidState: null,
    marksOfGrace: saved?.marksOfGrace ?? 0,
    agilityLapCount: saved?.agilityLapCount ?? 0,
    inWilderness: false,
    wildernessLevel: 0,
    isSkulled: false,
    skullTicks: 0,
    collectionLog: saved?.collectionLog ?? {},
    combatAchievements: saved?.combatAchievements ?? { completedTasks: [], kc: {} },
    dragonSlayer: saved?.dragonSlayer ?? { step: 0, mapPiecesCollected: { p1: false, p2: false, p3: false }, elvargDefeated: false },
    clan: saved?.clan ?? null,
    geOffers: saved?.geOffers ?? [],
    barrowsState: saved?.barrowsState ?? { brothersDefeated: {}, chestsLooted: 0 },
    tobRaidState: null,
  };

  recalcCombatLevel(player);

  const state: GameState = {
    zoneId,
    zone,
    player,
    entities: spawnEntities(zone),
    groundItems: [],
    hitsplats: [],
    dangerTiles: [],
    chatLogs: [
      { id: chatIdCounter++, message: "⚔️ Welcome to Dungeon Quest MMORPG!", color: "#FFD700" },
      { id: chatIdCounter++, message: "💾 Auto-save active: Progress saves to local state.", color: "#4CAF50" },
    ],
    path: [],
    combatTargetId: null,
    skillingTargetId: null,
    tick: 0,
    lastAttackedTick: 0,
    npcAttackTick: 0,
    isMoving: false,
  };

  return state;
}

export function spawnEntities(zone: ZoneDefinition): WorldEntity[] {
  return zone.entities.map(s => {
    const isCombat = !!s.isCombatNpc;
    const isRes = !!s.isResource;
    const isObj = !!s.isInteractiveObject;
    const isNpcOnly = !!s.isNpc && !isCombat;
    const combatConf = COMBAT_NPCS[s.entityType];

    return {
      id: s.id,
      name: s.name,
      emoji: s.emoji,
      tileX: s.tileX,
      tileY: s.tileY,
      type: s.entityType,
      examineText: s.examineText,
      combatLevel: combatConf?.combatLevel ?? s.combatLevel ?? 0,
      currentHp: combatConf?.hp ?? 1,
      maxHp: combatConf?.hp ?? 1,
      attackSpeed: combatConf?.attackSpeed ?? 4,
      maxHit: combatConf?.maxHit ?? 1,
      attackLevel: combatConf?.attackLevel ?? 1,
      strengthLevel: combatConf?.strengthLevel ?? 1,
      defenceLevel: combatConf?.defenceLevel ?? 1,
      npcId: s.entityType in COMBAT_NPCS ? s.entityType : undefined,
      aggressive: combatConf?.aggressive ?? false,
      aggroRange: combatConf?.aggroRange ?? 3,
      wanderRange: s.wanderRadius ?? 0,
      respawnTicks: combatConf?.respawnTicks ?? 20,
      spawnTileX: s.tileX,
      spawnTileY: s.tileY,
      isDead: false,
      deadTicks: 0,
      isResource: isRes,
      isCombatNpc: isCombat,
      isInteractiveObject: isObj,
      isNpc: isNpcOnly,
      isBlocked: s.isBlocked ?? false,
      depleted: false,
      depletedTicks: 0,
      attackStyle: combatConf?.attackStyle ?? "MELEE",
      chatterLines: s.chatterLines ?? [],
      isBoss: combatConf?.isBoss ?? false,
      frozenTicks: 0,
    };
  });
}

export function isBlocked(state: GameState, tx: number, ty: number): boolean {
  if (tx < 0 || ty < 0 || tx >= state.zone.width || ty >= state.zone.height) return true;
  const key = `${tx},${ty}`;
  if (state.zone.blockedTiles.has(key)) return true;
  for (const e of state.entities) {
    if (e.isBlocked && !e.depleted && !e.isDead && e.tileX === tx && e.tileY === ty) return true;
  }
  return false;
}

export function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

// A* pathfinding
export function findPath(state: GameState, sx: number, sy: number, gx: number, gy: number): { x: number; y: number }[] {
  if (sx === gx && sy === gy) return [];
  const startKey = `${sx},${sy}`;
  const openSet = new Set<string>([startKey]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  gScore.set(startKey, 0);

  const fScore = new Map<string, number>();
  fScore.set(startKey, dist(sx, sy, gx, gy));

  let iterations = 0;
  while (openSet.size > 0 && iterations < 500) {
    iterations++;
    let currentKey = "";
    let lowestF = Infinity;
    for (const k of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < lowestF) { lowestF = f; currentKey = k; }
    }
    const [cx, cy] = currentKey.split(",").map(Number);
    if (cx === gx && cy === gy) {
      // Reconstruct
      const path: { x: number; y: number }[] = [];
      let curr = currentKey;
      while (cameFrom.has(curr)) {
        const [px, py] = curr.split(",").map(Number);
        path.unshift({ x: px, y: py });
        curr = cameFrom.get(curr)!;
      }
      return path;
    }

    openSet.delete(currentKey);

    const neighbors = [
      { x: cx + 1, y: cy }, { x: cx - 1, y: cy },
      { x: cx, y: cy + 1 }, { x: cx, y: cy - 1 },
      { x: cx + 1, y: cy + 1 }, { x: cx - 1, y: cy - 1 },
      { x: cx + 1, y: cy - 1 }, { x: cx - 1, y: cy + 1 },
    ];

    for (const n of neighbors) {
      if (n.x !== gx || n.y !== gy) {
        if (isBlocked(state, n.x, n.y)) continue;
      }
      const nKey = `${n.x},${n.y}`;
      const isDiag = n.x !== cx && n.y !== cy;
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + (isDiag ? 1.4 : 1.0);

      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, currentKey);
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + dist(n.x, n.y, gx, gy));
        openSet.add(nKey);
      }
    }
  }

  // Fallback straight line
  const directPath: { x: number; y: number }[] = [];
  let cx = sx, cy = sy;
  while (cx !== gx || cy !== gy) {
    if (cx < gx) cx++; else if (cx > gx) cx--;
    if (cy < gy) cy++; else if (cy > gy) cy--;
    directPath.push({ x: cx, y: cy });
    if (directPath.length > 20) break;
  }
  return directPath;
}

export function recalcCombatLevel(player: PlayerState) {
  const atk = getSkillLevel(player, "attack");
  const str = getSkillLevel(player, "strength");
  const def = getSkillLevel(player, "defence");
  const hp = getSkillLevel(player, "hitpoints");
  const pray = getSkillLevel(player, "prayer");
  const rng = getSkillLevel(player, "ranged");
  const mag = getSkillLevel(player, "magic");

  const base = 0.25 * (def + hp + Math.floor(pray / 2));
  const melee = 0.325 * (atk + str);
  const ranged = 0.325 * (Math.floor(rng * 1.5));
  const magic = 0.325 * (Math.floor(mag * 1.5));

  player.combatLevel = Math.max(3, Math.floor(base + Math.max(melee, ranged, magic)));
  player.maxHp = hp;
  player.maxPrayer = pray;
}

export function getSkillLevel(player: PlayerState, skill: string): number {
  return player.skills[skill.toLowerCase()]?.level ?? 1;
}

export function addXp(player: PlayerState, skillName: string, xp: number) {
  const sk = skillName.toLowerCase();
  if (!player.skills[sk]) player.skills[sk] = { xp: 0, level: 1 };
  const oldLevel = player.skills[sk].level;
  player.skills[sk].xp += xp;
  const newLevel = getLevelForXp(player.skills[sk].xp);
  if (newLevel > oldLevel) {
    player.skills[sk].level = newLevel;
    recalcCombatLevel(player);
    const def = SKILLS.find(s => s.id === sk);
    player.levelUpEvent = {
      skillName: def?.name ?? skillName,
      oldLevel,
      newLevel,
      emoji: def?.iconEmoji ?? "✨",
      announced: false,
    };
    soundEngine.playLevelUpJingle();
  }
}

export function getEquipmentBonus(player: PlayerState, bonusKey: keyof typeof ITEMS["bronze_dagger"]): number {
  let total = 0;
  for (const itemId of Object.values(player.equipment)) {
    if (!itemId) continue;
    const def = getItem(itemId);
    const val = (def as any)[bonusKey];
    if (typeof val === "number") total += val;
  }
  return total;
}

export function getWeaponDef(player: PlayerState) {
  const weaponId = player.equipment.WEAPON;
  return weaponId ? getItem(weaponId) : null;
}

export function addToInventory(player: PlayerState, itemId: string, amount = 1): boolean {
  const def = getItem(itemId);
  if (def.isStackable) {
    const existing = player.inventory.find(s => s && s.itemId === itemId);
    if (existing) {
      existing.amount += amount;
      return true;
    }
  }
  // Find empty slot
  const emptyIdx = player.inventory.findIndex(s => s === null);
  if (emptyIdx === -1) return false;
  player.inventory[emptyIdx] = { itemId, amount };
  return true;
}

export function removeFromInventory(player: PlayerState, itemId: string, amount = 1): boolean {
  const def = getItem(itemId);
  if (def.isStackable) {
    const slot = player.inventory.find(s => s && s.itemId === itemId);
    if (!slot || slot.amount < amount) return false;
    slot.amount -= amount;
    if (slot.amount <= 0) {
      const idx = player.inventory.indexOf(slot);
      player.inventory[idx] = null;
    }
    return true;
  }
  // Remove individual non-stackable items
  let remaining = amount;
  for (let i = player.inventory.length - 1; i >= 0; i--) {
    if (player.inventory[i]?.itemId === itemId) {
      player.inventory[i] = null;
      remaining--;
      if (remaining === 0) return true;
    }
  }
  return remaining === 0;
}

export function countItem(player: PlayerState, itemId: string): number {
  let count = 0;
  for (const s of player.inventory) {
    if (s && s.itemId === itemId) count += s.amount;
  }
  return count;
}

export function addChat(state: GameState, message: string, color = "#FFF") {
  state.chatLogs.push({ id: chatIdCounter++, message, color });
  if (state.chatLogs.length > 50) state.chatLogs.shift();
}

export function addHitsplat(state: GameState, tileX: number, tileY: number, damage: number, isHeal = false, isSpec = false) {
  state.hitsplats.push({ id: hitIdCounter++, damage, tileX, tileY, isHeal, isSpec, timestamp: Date.now() });
  if (state.hitsplats.length > 30) state.hitsplats.shift();
}

export function addDangerTile(state: GameState, x: number, y: number, explodeTick: number, damage: number, label: string, sourceNpcName: string) {
  state.dangerTiles.push({
    id: `danger_${dangerIdCounter++}`,
    x,
    y,
    explodeTick,
    damage,
    label,
    sourceNpcName,
  });
}

// Combat formulas
export function calcMaxHit(player: PlayerState): number {
  const strLevel = getSkillLevel(player, "strength");
  const strBonus = getEquipmentBonus(player, "strengthBonus");
  return Math.max(1, Math.floor((strLevel * (strBonus + 64)) / 640 + 1));
}

export function calcHitChance(player: PlayerState, target: WorldEntity): number {
  const atkLevel = getSkillLevel(player, "attack");
  const atkBonus = getEquipmentBonus(player, "attackBonus") + getEquipmentBonus(player, "attackSlash");
  const defLevel = target.defenceLevel;
  const baseChance = 0.6 + (atkLevel + atkBonus - defLevel) * 0.003;
  return Math.max(0.2, Math.min(0.95, baseChance));
}

export function playerAttackNpc(state: GameState, target: WorldEntity) {
  if (target.isDead) return;
  const player = state.player;
  const weapon = getWeaponDef(player);

  // Check Magic Autocasting
  if (player.autocastSpell) {
    castSpell(state, player.autocastSpell, target);
    return;
  }

  let hitCount = 1;
  let accuracyMult = 1.0;
  let damageMult = 1.0;
  let isSpecHit = false;

  // Execute Special Attack
  if (player.specActive && weapon?.specialAttackCost) {
    if (player.specEnergy >= weapon.specialAttackCost) {
      player.specEnergy -= weapon.specialAttackCost;
      isSpecHit = true;
      addChat(state, `⚡ Special Attack: ${weapon.specialAttackName}!`, "#FFD700");

      if (weapon.id === "dragon_dagger_p") {
        hitCount = 2;
        accuracyMult = 1.15;
        damageMult = 1.15;
      } else if (weapon.id === "dragon_scimitar") {
        accuracyMult = 1.25;
        damageMult = 1.15;
      } else if (weapon.id === "granite_maul") {
        hitCount = 2;
        damageMult = 1.10;
      } else if (weapon.id === "armadyl_godsword") {
        accuracyMult = 1.25;
        damageMult = 1.375;
      } else if (weapon.id === "ancient_godsword") {
        accuracyMult = 1.20;
        damageMult = 1.25;
      } else if (weapon.id === "magic_shortbow") {
        hitCount = 2;
        accuracyMult = 1.0;
        damageMult = 1.0;
      }
    } else {
      addChat(state, "You don't have enough Special Attack energy!", "#FF4444");
      player.specActive = false;
    }
  }

  const baseMaxHit = calcMaxHit(player);
  const maxHit = Math.floor(baseMaxHit * damageMult);
  const baseHitChance = calcHitChance(player, target);
  const hitChance = Math.min(0.98, baseHitChance * accuracyMult);

  let totalDamage = 0;
  for (let i = 0; i < hitCount; i++) {
    let damage = 0;
    if (Math.random() < hitChance) {
      damage = Math.floor(Math.random() * (maxHit + 1));
    }
    target.currentHp -= damage;
    totalDamage += damage;
    addHitsplat(state, target.tileX, target.tileY, damage, false, isSpecHit);

    // Ancient Godsword heal
    if (isSpecHit && weapon?.id === "ancient_godsword" && damage > 0) {
      player.hp = Math.min(player.maxHp, player.hp + Math.floor(damage * 0.5));
      addChat(state, `🩸 Blood Siphon healed you for ${Math.floor(damage * 0.5)} HP!`, "#E040FB");
    }
  }

  soundEngine.playAttackSound(isSpecHit ? "spec" : (weapon?.attackRanged ? "ranged" : "melee"));
  if (totalDamage > 0) {
    soundEngine.playHitSound(isSpecHit, false);
    const style = player.combatStyle;
    if (style === "ACCURATE") addXp(player, "attack", totalDamage * 4);
    else if (style === "AGGRESSIVE") addXp(player, "strength", totalDamage * 4);
    else if (style === "DEFENSIVE") addXp(player, "defence", totalDamage * 4);
    addXp(player, "hitpoints", Math.floor(totalDamage * 1.33));
  }

  if (target.currentHp <= 0) {
    target.currentHp = 0;
    target.isDead = true;
    target.deadTicks = 0;
    handleNpcDeath(state, target);
  }
}

export function castSpell(state: GameState, spellId: string, target: WorldEntity) {
  const player = state.player;
  if (target.isDead) return;

  if (spellId === "ice_barrage") {
    if (countItem(player, "water_rune") < 6 || countItem(player, "death_rune") < 4 || countItem(player, "blood_rune") < 2) {
      addChat(state, "You need 6 Water, 4 Death, and 2 Blood runes for Ice Barrage!", "#FF4444");
      return;
    }
    removeFromInventory(player, "water_rune", 6);
    removeFromInventory(player, "death_rune", 4);
    removeFromInventory(player, "blood_rune", 2);

    const magLevel = getSkillLevel(player, "magic");
    const maxDamage = 26 + Math.floor(magLevel / 5);
    const damage = Math.floor(Math.random() * (maxDamage + 1));

    target.currentHp -= damage;
    target.frozenTicks = 8; // Freeze for 8 ticks
    soundEngine.playMagicCast("ice_barrage");
    addHitsplat(state, target.tileX, target.tileY, damage, false, true);
    addXp(player, "magic", damage * 4 + 52);
    addXp(player, "hitpoints", Math.floor(damage * 1.33));
    addChat(state, `❄️ Ice Barrage froze ${target.name} for 8 ticks! (Hit: ${damage})`, "#00E5FF");
  } else if (spellId === "fire_blast") {
    if (countItem(player, "fire_rune") < 4 || countItem(player, "air_rune") < 3 || countItem(player, "chaos_rune") < 1) {
      addChat(state, "You need 4 Fire, 3 Air, and 1 Chaos rune for Fire Blast!", "#FF4444");
      return;
    }
    removeFromInventory(player, "fire_rune", 4);
    removeFromInventory(player, "air_rune", 3);
    removeFromInventory(player, "chaos_rune", 1);

    const magLevel = getSkillLevel(player, "magic");
    const maxDamage = 16 + Math.floor(magLevel / 6);
    const damage = Math.floor(Math.random() * (maxDamage + 1));

    target.currentHp -= damage;
    soundEngine.playMagicCast("fire_blast");
    addHitsplat(state, target.tileX, target.tileY, damage, false, true);
    addXp(player, "magic", damage * 4 + 35);
    addXp(player, "hitpoints", Math.floor(damage * 1.33));
    addChat(state, `🔥 Fire Blast struck ${target.name} for ${damage} damage!`, "#FF5722");
  } else {
    // Wind Strike
    if (countItem(player, "air_rune") < 1 || countItem(player, "mind_rune") < 1) {
      addChat(state, "You need 1 Air and 1 Mind rune for Wind Strike!", "#FF4444");
      return;
    }
    removeFromInventory(player, "air_rune", 1);
    removeFromInventory(player, "mind_rune", 1);

    const magLevel = getSkillLevel(player, "magic");
    const maxDamage = 8 + Math.floor(magLevel / 8);
    const damage = Math.floor(Math.random() * (maxDamage + 1));

    target.currentHp -= damage;
    soundEngine.playMagicCast("wind_strike");
    addHitsplat(state, target.tileX, target.tileY, damage, false, false);
    addXp(player, "magic", damage * 4 + 10);
    addXp(player, "hitpoints", Math.floor(damage * 1.33));
    addChat(state, `💨 Wind Strike dealt ${damage} damage!`, "#81D4FA");
  }

  if (target.currentHp <= 0) {
    target.currentHp = 0;
    target.isDead = true;
    target.deadTicks = 0;
    handleNpcDeath(state, target);
  }
}

export function npcAttackPlayer(state: GameState, npc: WorldEntity) {
  const player = state.player;
  if (player.hp <= 0) return;

  // Boss Dragonfire handling for Elvarg
  if (npc.type === "boss_elvarg") {
    const hasAntiDragonShield = player.equipment.SHIELD === "anti_dragon_shield";
    let damage = Math.floor(Math.random() * 26) + 4;
    if (hasAntiDragonShield) {
      damage = Math.floor(damage * 0.15); // Shield absorbs 85% of dragonfire!
      addChat(state, "🛡️ Your Anti-Dragon Shield absorbs the incinerating dragonfire!", "#4CAF50");
    } else {
      addChat(state, "🔥 ELVARG'S DRAGONFIRE ROASTS YOU! Equip an Anti-Dragon Shield!", "#FF1744");
    }
    player.hp -= damage;
    soundEngine.playHitSound(false, true);
    addHitsplat(state, player.tileX, player.tileY, damage);
    if (player.hp <= 0) { player.hp = 0; handlePlayerDeath(state); }
    return;
  }

  let damage = 0;
  if (Math.random() < 0.6) {
    damage = Math.floor(Math.random() * (npc.maxHit + 1));
  }
  const defBonus = getEquipmentBonus(player, "defenceMelee");
  if (defBonus > 0 && damage > 0) {
    damage = Math.max(0, damage - Math.floor(defBonus / 10));
  }
  player.hp -= damage;
  if (damage > 0) {
    soundEngine.playHitSound(false, true);
  }
  addHitsplat(state, player.tileX, player.tileY, damage);
  if (player.hp <= 0) {
    player.hp = 0;
    handlePlayerDeath(state);
  }
}

function handleNpcDeath(state: GameState, npc: WorldEntity) {
  const config = COMBAT_NPCS[npc.npcId ?? npc.type];
  if (!config) return;
  addChat(state, `🏆 ${npc.name} has been defeated!`, "#4CAF50");
  
  if (npc.type === "giant_rat" && state.player.tutorialStep === 6) {
    state.player.tutorialStep = 7;
    addChat(state, "Tutorial Update: You defeated a Giant Rat! Talk to the Combat Instructor.", "#FFD700");
  }

  // Slayer Task Tracker Hook
  if (state.player.slayerTask && (state.player.slayerTask.monsterType === npc.type || state.player.slayerTask.monsterType === npc.npcId)) {
    state.player.slayerTask.countRemaining--;
    addXp(state.player, "slayer", Math.floor(config.hp * 1.5));
    if (state.player.slayerTask.countRemaining <= 0) {
      const pts = state.player.slayerTask.pointsReward;
      const xp = state.player.slayerTask.xpReward;
      state.player.slayerPoints += pts;
      addXp(state.player, "slayer", xp);
      addChat(state, `🎉 SLAYER TASK COMPLETE: You earned +${pts} Slayer Points and +${xp} Slayer XP!`, "#FFD700");
      soundEngine.playQuestCompleteFanfare();
      state.player.slayerTask = null;
    } else {
      addChat(state, `🗡️ Slayer Bounty: ${state.player.slayerTask.countRemaining}x ${state.player.slayerTask.monsterName} remaining.`, "#00E5FF");
    }
  }

  // TzHaar Fight Caves Wave Progress Hook
  if (state.zoneId === "tzhaar_fight_caves" && state.player.fightCave.active) {
    state.player.fightCave.killsThisWave++;
    if (state.player.fightCave.killsThisWave >= state.player.fightCave.totalKillsNeeded) {
      // Wave cleared!
      const currentWave = state.player.fightCave.wave;
      if (currentWave >= state.player.fightCave.totalWaves) {
        // Defeated TzTok-Jad on Wave 10!
        addChat(state, "🏆 INCREDIBLE TRIUMPH! You conquered the TzHaar Fight Caves and defeated TzTok-Jad!", "#FFD700");
        addToInventory(state.player, "fire_cape", 1);
        addToInventory(state.player, "tokkul", 8000);
        soundEngine.playQuestCompleteFanfare();
        state.player.fightCave.active = false;
        state.player.fightCave.wave = 0;
      } else {
        addChat(state, `🔥 Wave ${currentWave} Cleared! Preparing next wave...`, "#00FF80");
        state.player.fightCave.tokkulEarned += currentWave * 50;
        addToInventory(state.player, "tokkul", currentWave * 50);
        soundEngine.playMinigameWave();
        setTimeout(() => {
          spawnFightCavesWave(state, currentWave + 1);
        }, 1500);
      }
    }
  }

  // Quest milestone hooks
  if (npc.type === "boss_elvarg") {
    if (state.player.quests.dragon_slayer === 1) {
      state.player.quests.dragon_slayer = 2; // Slew Elvarg, ready to claim reward
      addChat(state, "👑 QUEST UPDATE: You have slain Elvarg the Dragon! Return to Guildmaster Brian.", "#FFD700");
      soundEngine.playQuestCompleteFanfare();
    }
  }

  if (npc.type === "boss_malakor") {
    if (state.player.quests.restless_ghost === 1) {
      addChat(state, "💀 QUEST UPDATE: Malakor dropped the Golden Skull! Take it to the Restless Spirit.", "#FFD700");
      soundEngine.playQuestCompleteFanfare();
    }
  }

  // Drops
  const drops: { itemId: string; qty: number }[] = [];
  for (const itemId of config.alwaysDrops) {
    drops.push({ itemId, qty: 1 });
  }
  for (const entry of config.dropTable) {
    if (Math.random() < entry.chance) {
      const qty = entry.qtyMin + Math.floor(Math.random() * (entry.qtyMax - entry.qtyMin + 1));
      drops.push({ itemId: entry.itemId, qty });
    }
  }
  for (const drop of drops) {
    const itemDef = getItem(drop.itemId);
    if (itemDef.isPet) {
      addChat(state, `🐾 UNBELIEVABLE LUCK! You unlocked ${itemDef.name}!`, "#FF33FF");
    }
    state.groundItems.push({
      id: `${drop.itemId}_${Date.now()}_${Math.random()}`,
      itemId: drop.itemId,
      name: itemDef.name,
      qty: drop.qty,
      tileX: npc.tileX,
      tileY: npc.tileY,
      value: itemDef.value,
      despawnTick: 200,
    });
  }
}

function handlePlayerDeath(state: GameState) {
  const player = state.player;
  addChat(state, "Oh dear, you have died! Respawning in Brindle Plaza...", "#FF4444");
  player.hp = player.maxHp;
  player.prayer = player.maxPrayer;
  // Keep 3 most valuable items
  const items: { itemId: string; amount: number; value: number }[] = [];
  for (const slot of player.inventory) {
    if (slot) items.push({ ...slot, value: getItem(slot.itemId).value });
  }
  items.sort((a, b) => b.value - a.value);
  player.inventory = new Array(28).fill(null);
  for (let i = 0; i < Math.min(3, items.length); i++) {
    addToInventory(player, items[i].itemId, items[i].amount);
  }
  // Teleport to safe mainland spawn
  changeZone(state, "brindle_mainland");
  player.tileX = state.zone.spawnTileX;
  player.tileY = state.zone.spawnTileY;
  state.path = [];
  state.combatTargetId = null;
}

export function changeZone(state: GameState, zoneId: string) {
  const zone = getZone(zoneId);
  state.zoneId = zoneId;
  state.zone = zone;
  state.entities = spawnEntities(zone);
  state.groundItems = [];
  state.hitsplats = [];
  state.dangerTiles = [];
  state.path = [];
  state.combatTargetId = null;
  state.skillingTargetId = null;
  state.player.tileX = zone.spawnTileX;
  state.player.tileY = zone.spawnTileY;
  addChat(state, `📍 Entered ${zone.name}`, "#FFD700");
}

export function pickupGroundItem(state: GameState, item: GroundItem) {
  const player = state.player;
  if (!addToInventory(player, item.itemId, item.qty)) {
    addChat(state, "Your inventory is full!", "#FF4444");
    return;
  }
  state.groundItems = state.groundItems.filter(g => g.id !== item.id);
  addChat(state, `You picked up ${item.qty}x ${item.name}.`, "#FFD700");
}

export function equipItem(state: GameState, slotIndex: number) {
  const player = state.player;
  const slot = player.inventory[slotIndex];
  if (!slot) return;
  const def = getItem(slot.itemId);
  if (!def.slot) return;
  // Check level requirement
  if (def.skillRequirement && def.levelRequirement) {
    const lvl = getSkillLevel(player, def.skillRequirement);
    if (lvl < def.levelRequirement) {
      addChat(state, `You need ${def.levelRequirement} ${def.skillRequirement} to equip this.`, "#FF4444");
      return;
    }
  }
  // Dragon equipment check for Dragon Slayer quest
  if (slot.itemId.startsWith("dragon_") && player.quests.dragon_slayer !== 100) {
    addChat(state, "You must complete the 'Dragon Slayer' quest to equip Dragon weaponry and plate armor!", "#FF4444");
    return;
  }
  // Swap
  const currentEquipped = player.equipment[def.slot];
  player.equipment[def.slot] = slot.itemId;
  player.inventory[slotIndex] = currentEquipped ? { itemId: currentEquipped, amount: 1 } : null;
  recalcCombatLevel(player);
}

export function unequipItem(state: GameState, slot: EquipmentSlot) {
  const player = state.player;
  const itemId = player.equipment[slot];
  if (!itemId) return;
  const emptyIdx = player.inventory.findIndex(s => s === null);
  if (emptyIdx === -1) {
    addChat(state, "Your inventory is full!", "#FF4444");
    return;
  }
  player.inventory[emptyIdx] = { itemId, amount: 1 };
  delete player.equipment[slot];
  recalcCombatLevel(player);
}

export function consumeItem(state: GameState, slotIndex: number) {
  const player = state.player;
  const slot = player.inventory[slotIndex];
  if (!slot) return;
  const def = getItem(slot.itemId);

  // Boss Follower Pets toggle
  if (def.isPet) {
    if (player.activePet === slot.itemId) {
      player.activePet = null;
      addChat(state, `🐾 You dismissed your follower pet.`, "#FFD700");
    } else {
      player.activePet = slot.itemId;
      addChat(state, `🐾 ${def.name} is now following you everywhere!`, "#FF33FF");
    }
    return;
  }

  if (slot.itemId.startsWith("clue_scroll")) {
    openClueScroll(state, slot.itemId);
    return;
  }

  if (def.isMysteryBox) {
    removeFromInventory(player, slot.itemId, 1);
    const loot = [
      "armadyl_godsword", "ancient_godsword", "abyssal_whip_blood",
      "dragon_dagger_p", "dragon_scimitar", "blood_money", "cooked_shark",
    ];
    const dropId = loot[Math.floor(Math.random() * loot.length)];
    addToInventory(player, dropId, dropId === "blood_money" ? 500 : dropId === "cooked_shark" ? 100 : 1);
    addChat(state, `🎁 You opened ${def.name} and got ${getItem(dropId).name}!`, "#E040FB");
    return;
  }

  if (def.isConsumable) {
    if (def.healAmount) {
      player.hp = Math.min(player.maxHp, player.hp + def.healAmount);
      soundEngine.playEatFood();
      addChat(state, `You eat the ${def.name}. HP restored to ${player.hp}.`, "#4CAF50");
    }
    if (def.prayerRestore) {
      player.prayer = Math.min(player.maxPrayer, player.prayer + def.prayerRestore);
      soundEngine.playPotionDrink();
      addChat(state, `You drink the ${def.name}. Prayer restored to ${player.prayer}.`, "#00E5FF");
    }
    if (def.boostStat) {
      soundEngine.playPotionDrink();
      addChat(state, `✨ The potion surges through your veins! Your ${def.boostStat} stats are elevated.`, "#FFD700");
    }
    removeFromInventory(player, slot.itemId, 1);
  } else if (def.prayerXp) {
    addXp(player, "prayer", def.prayerXp);
    soundEngine.playPrayerSound();
    addChat(state, `You bury the ${def.name}.`, "#81C784");
    removeFromInventory(player, slot.itemId, 1);
  }
}

export function depositToBank(state: GameState, itemId: string, amount: number) {
  const player = state.player;
  if (!removeFromInventory(player, itemId, amount)) return;
  player.bank[itemId] = (player.bank[itemId] ?? 0) + amount;
}

export function withdrawFromBank(state: GameState, itemId: string, amount: number) {
  const player = state.player;
  const have = player.bank[itemId] ?? 0;
  const take = Math.min(have, amount);
  if (take <= 0) return;
  if (!addToInventory(player, itemId, take)) {
    addChat(state, "Your inventory is full!", "#FF4444");
    return;
  }
  player.bank[itemId] = have - take;
  if (player.bank[itemId] <= 0) delete player.bank[itemId];
}

export function buyFromShop(state: GameState, itemId: string, price: number, amount: number = 1) {
  const player = state.player;
  const cost = price * amount;
  if (countItem(player, "coins") < cost) {
    addChat(state, "You don't have enough coins!", "#FF4444");
    return;
  }
  removeFromInventory(player, "coins", cost);
  addToInventory(player, itemId, amount);
  addChat(state, `You bought ${amount}x ${getItem(itemId).name} for ${cost} coins.`, "#FFD700");
}

export function sellToShop(state: GameState, itemId: string, amount: number = 1) {
  const player = state.player;
  if (!removeFromInventory(player, itemId, amount)) return;
  const reward = Math.floor(getItem(itemId).value * 0.6) * amount;
  addToInventory(player, "coins", reward);
  addChat(state, `You sold ${amount}x ${getItem(itemId).name} for ${reward} coins.`, "#FFD700");
}

// === FARMING SKILL SYSTEM ===
export function plantSeed(state: GameState, patchId: string, seedId: string): boolean {
  const player = state.player;
  const patch = player.farmingPatches.find(p => p.id === patchId);
  if (!patch) return false;

  const seedDef = getItem(seedId);
  if (!seedDef.isSeed) {
    addChat(state, "That is not a plantable seed.", "#FF4444");
    return false;
  }

  const farmLevel = getSkillLevel(player, "farming");
  if (seedDef.levelRequirement && farmLevel < seedDef.levelRequirement) {
    addChat(state, `You need level ${seedDef.levelRequirement} Farming to plant ${seedDef.name}.`, "#FF4444");
    return false;
  }

  const hasDibber = player.inventory.some(s => s && s.itemId === "seed_dibber");
  if (!hasDibber) {
    addChat(state, "You need a Seed Dibber to plant seeds into the patch.", "#FF4444");
    return false;
  }

  if (!removeFromInventory(player, seedId, 1)) return false;

  patch.seedId = seedId;
  patch.stage = 1; // Seeded
  patch.plantedTick = state.tick;

  if (seedId === "ranarr_seed") {
    patch.harvestItemId = "grimy_ranarr";
    patch.harvestQty = Math.floor(Math.random() * 4) + 4; // 4-7 herbs
  } else if (seedId === "toadflax_seed") {
    patch.harvestItemId = "grimy_toadflax";
    patch.harvestQty = Math.floor(Math.random() * 5) + 5;
  } else if (seedId === "torstol_seed") {
    patch.harvestItemId = "grimy_torstol";
    patch.harvestQty = Math.floor(Math.random() * 4) + 3;
  } else if (seedId === "magic_seed") {
    patch.harvestItemId = "magic_logs";
    patch.harvestQty = Math.floor(Math.random() * 6) + 6;
  }

  addXp(player, "farming", seedDef.farmingXp ?? 25);
  soundEngine.playFarmingAction();
  addChat(state, `🌱 You planted the ${seedDef.name} into the fertile patch!`, "#4CAF50");
  return true;
}

export function harvestPatch(state: GameState, patchId: string): boolean {
  const player = state.player;
  const patch = player.farmingPatches.find(p => p.id === patchId);
  if (!patch || patch.stage < 3 || !patch.harvestItemId) {
    addChat(state, "This patch is not ready for harvest yet.", "#FF9800");
    return false;
  }

  const harvestDef = getItem(patch.harvestItemId);
  if (!addToInventory(player, patch.harvestItemId, patch.harvestQty)) {
    addChat(state, "Your inventory is full!", "#FF4444");
    return false;
  }

  const xpGain = (harvestDef.herbloreXp ?? 15) * patch.harvestQty * 4;
  addXp(player, "farming", xpGain);
  soundEngine.playFarmingAction();
  addChat(state, `🌿 You harvested ${patch.harvestQty}x ${harvestDef.name} from the patch! (+${xpGain} Farming XP)`, "#00FF80");

  patch.stage = 0;
  patch.seedId = null;
  patch.harvestItemId = null;
  patch.harvestQty = 0;
  return true;
}

// === HERBLORE SKILL SYSTEM ===
export function cleanHerb(state: GameState, slotIndex: number): boolean {
  const player = state.player;
  const slot = player.inventory[slotIndex];
  if (!slot) return false;

  const recipe = HERBLORE_RECIPES.find(r => r.herbId === slot.itemId && r.secondaryId === "");
  if (!recipe) return false;

  const herbLvl = getSkillLevel(player, "herblore");
  if (herbLvl < recipe.levelReq) {
    addChat(state, `You need level ${recipe.levelReq} Herblore to clean this herb.`, "#FF4444");
    return false;
  }

  removeFromInventory(player, slot.itemId, 1);
  addToInventory(player, recipe.resultId, 1);
  addXp(player, "herblore", recipe.xp);
  soundEngine.playSkillSound("Herblore");
  addChat(state, `🍃 You cleaned the herb into a ${getItem(recipe.resultId).name}. (+${recipe.xp} Herblore XP)`, "#4CAF50");
  return true;
}

export function mixPotion(state: GameState, recipeId: string): boolean {
  const player = state.player;
  const recipe = HERBLORE_RECIPES.find(r => r.id === recipeId);
  if (!recipe) return false;

  const herbLvl = getSkillLevel(player, "herblore");
  if (herbLvl < recipe.levelReq) {
    addChat(state, `You need level ${recipe.levelReq} Herblore to brew ${recipe.name}.`, "#FF4444");
    return false;
  }

  if (countItem(player, recipe.herbId) < 1 || (recipe.secondaryId && countItem(player, recipe.secondaryId) < 1)) {
    addChat(state, `Missing ingredients for ${recipe.name}! Need ${getItem(recipe.herbId).name} and ${getItem(recipe.secondaryId).name}.`, "#FF4444");
    return false;
  }

  removeFromInventory(player, recipe.herbId, 1);
  if (recipe.secondaryId) removeFromInventory(player, recipe.secondaryId, 1);
  addToInventory(player, recipe.resultId, 1);
  addXp(player, "herblore", recipe.xp);
  soundEngine.playSkillSound("Herblore");
  addChat(state, `⚗️ You carefully brewed a ${recipe.name}! (+${recipe.xp} Herblore XP)`, "#00E5FF");
  return true;
}

// === SLAYER MASTER & BOUNTIES ===
export function assignSlayerTask(state: GameState): SlayerTask {
  const player = state.player;
  const cbLvl = player.combatLevel;
  const eligible = SLAYER_BOUNTY_OPTIONS.filter(o => cbLvl >= o.minLevel);
  const choice = eligible[Math.floor(Math.random() * eligible.length)];
  const count = Math.floor(Math.random() * (choice.maxCount - choice.minCount + 1)) + choice.minCount;

  const task: SlayerTask = {
    monsterType: choice.monsterType,
    monsterName: choice.monsterName,
    countRemaining: count,
    totalCount: count,
    xpReward: choice.xpPerKill * count * 2,
    pointsReward: choice.points,
  };

  player.slayerTask = task;
  soundEngine.playQuestCompleteFanfare();
  addChat(state, `🗡️ Slayer Master Vannaka assigned: Slay ${count}x ${choice.monsterName}!`, "#FFD700");
  return task;
}

export function cancelSlayerTask(state: GameState): boolean {
  const player = state.player;
  if (!player.slayerTask) return false;
  if (player.slayerPoints < 30) {
    addChat(state, "You need 30 Slayer Points to cancel an active Slayer task!", "#FF4444");
    return false;
  }
  player.slayerPoints -= 30;
  player.slayerTask = null;
  addChat(state, "Slayer Task cancelled. (Cost: 30 Slayer Points)", "#FF9800");
  return true;
}

export function buySlayerReward(state: GameState, itemId: string, costPoints: number): boolean {
  const player = state.player;
  if (player.slayerPoints < costPoints) {
    addChat(state, `You need ${costPoints} Slayer Points for this item! (You have ${player.slayerPoints})`, "#FF4444");
    return false;
  }
  if (!addToInventory(player, itemId, 1)) {
    addChat(state, "Your inventory is full!", "#FF4444");
    return false;
  }
  player.slayerPoints -= costPoints;
  addChat(state, `🏆 Unlocked Slayer Reward: ${getItem(itemId).name} for ${costPoints} Slayer Points!`, "#FFD700");
  soundEngine.playQuestCompleteFanfare();
  return true;
}

// === TZHAAR FIGHT CAVES MINIGAME SYSTEM ===
export function startFightCaves(state: GameState) {
  changeZone(state, "tzhaar_fight_caves");
  state.player.fightCave = {
    active: true,
    wave: 1,
    totalWaves: 10,
    killsThisWave: 0,
    totalKillsNeeded: 1,
    tokkulEarned: 0,
  };
  addChat(state, "🔥 TzHaar Fight Caves Survival Begins! Wave 1 incoming!", "#FF5722");
  soundEngine.playMinigameWave();
  spawnFightCavesWave(state, 1);
}

export function spawnFightCavesWave(state: GameState, wave: number) {
  if (state.zoneId !== "tzhaar_fight_caves") return;
  state.player.fightCave.wave = wave;
  state.player.fightCave.killsThisWave = 0;

  // Clear previous wave combat entities except master and portals
  state.entities = state.entities.filter(e => !e.isCombatNpc);

  const newEntities: WorldEntity[] = [];

  if (wave === 1) {
    newEntities.push(createWaveEntity("tz_kih_1", "tz_kih", "Tz-Kih (Fire Bat)", "🦇", 9, 9));
    state.player.fightCave.totalKillsNeeded = 1;
  } else if (wave === 2) {
    newEntities.push(createWaveEntity("tz_kih_1", "tz_kih", "Tz-Kih (Fire Bat)", "🦇", 9, 9));
    newEntities.push(createWaveEntity("tz_kih_2", "tz_kih", "Tz-Kih (Fire Bat)", "🦇", 17, 9));
    state.player.fightCave.totalKillsNeeded = 2;
  } else if (wave === 3) {
    newEntities.push(createWaveEntity("tz_kek_1", "tz_kek", "Tz-Kek (Lava Slug)", "🔥", 13, 10));
    state.player.fightCave.totalKillsNeeded = 1;
  } else if (wave === 4) {
    newEntities.push(createWaveEntity("tz_kek_1", "tz_kek", "Tz-Kek (Lava Slug)", "🔥", 9, 10));
    newEntities.push(createWaveEntity("tz_kih_1", "tz_kih", "Tz-Kih (Fire Bat)", "🦇", 17, 10));
    state.player.fightCave.totalKillsNeeded = 2;
  } else if (wave === 5) {
    newEntities.push(createWaveEntity("tok_xil_1", "tok_xil", "Tok-Xil (Obsidian Ranger)", "🏹", 13, 9));
    state.player.fightCave.totalKillsNeeded = 1;
  } else if (wave === 6) {
    newEntities.push(createWaveEntity("tok_xil_1", "tok_xil", "Tok-Xil (Obsidian Ranger)", "🏹", 9, 9));
    newEntities.push(createWaveEntity("tz_kek_1", "tz_kek", "Tz-Kek (Lava Slug)", "🔥", 17, 9));
    state.player.fightCave.totalKillsNeeded = 2;
  } else if (wave === 7) {
    newEntities.push(createWaveEntity("yt_mejkot_1", "yt_mejkot", "Yt-MejKot (Molten Healer)", "👹", 13, 9));
    state.player.fightCave.totalKillsNeeded = 1;
  } else if (wave === 8) {
    newEntities.push(createWaveEntity("yt_mejkot_1", "yt_mejkot", "Yt-MejKot (Molten Healer)", "👹", 9, 9));
    newEntities.push(createWaveEntity("tok_xil_1", "tok_xil", "Tok-Xil (Obsidian Ranger)", "🏹", 17, 9));
    state.player.fightCave.totalKillsNeeded = 2;
  } else if (wave === 9) {
    newEntities.push(createWaveEntity("yt_mejkot_1", "yt_mejkot", "Yt-MejKot (Molten Healer)", "👹", 8, 8));
    newEntities.push(createWaveEntity("tok_xil_1", "tok_xil", "Tok-Xil (Obsidian Ranger)", "🏹", 18, 8));
    newEntities.push(createWaveEntity("tz_kek_1", "tz_kek", "Tz-Kek (Lava Slug)", "🔥", 13, 9));
    state.player.fightCave.totalKillsNeeded = 3;
  } else if (wave === 10) {
    // FINAL WAVE: TZTOK-JAD!
    newEntities.push(createWaveEntity("boss_jad_1", "boss_tztok_jad", "TzTok-Jad", "🌋", 13, 9));
    state.player.fightCave.totalKillsNeeded = 1;
    addChat(state, "🌋 FINAL WAVE: TZTOK-JAD HAS RISEN! Prepare for devastating attacks!", "#FF1744");
    soundEngine.playBossRoar();
  }

  state.entities.push(...newEntities);
  addChat(state, `⚔️ WAVE ${wave}/${state.player.fightCave.totalWaves}: Slay all enemies to proceed!`, "#FFD700");
}

function createWaveEntity(id: string, npcId: string, name: string, emoji: string, tileX: number, tileY: number): WorldEntity {
  const conf = COMBAT_NPCS[npcId];
  return {
    id,
    name,
    emoji,
    tileX,
    tileY,
    type: npcId,
    examineText: conf?.examineText ?? "A Fight Caves enemy.",
    combatLevel: conf?.combatLevel ?? 50,
    currentHp: conf?.hp ?? 50,
    maxHp: conf?.hp ?? 50,
    attackSpeed: conf?.attackSpeed ?? 4,
    maxHit: conf?.maxHit ?? 10,
    attackLevel: conf?.attackLevel ?? 50,
    strengthLevel: conf?.strengthLevel ?? 50,
    defenceLevel: conf?.defenceLevel ?? 50,
    npcId,
    aggressive: true,
    aggroRange: 8,
    wanderRange: 2,
    respawnTicks: 9999,
    spawnTileX: tileX,
    spawnTileY: tileY,
    isDead: false,
    deadTicks: 0,
    isResource: false,
    isCombatNpc: true,
    isInteractiveObject: false,
    isNpc: false,
    isBlocked: false,
    depleted: false,
    depletedTicks: 0,
    attackStyle: conf?.attackStyle ?? "MELEE",
    chatterLines: [],
    isBoss: conf?.isBoss ?? false,
    frozenTicks: 0,
  };
}

export function exitFightCaves(state: GameState) {
  state.player.fightCave.active = false;
  state.player.fightCave.wave = 0;
  changeZone(state, "brindle_mainland");
  addChat(state, "You returned safely to Brindle village from the Fight Caves.", "#00FF80");
}

export function buyFromTokkulShop(state: GameState, itemId: string, tokkulCost: number): boolean {
  const player = state.player;
  if (countItem(player, "tokkul") < tokkulCost) {
    addChat(state, `You need ${tokkulCost} Tokkul! You have ${countItem(player, "tokkul")}.`, "#FF4444");
    return false;
  }
  if (!removeFromInventory(player, "tokkul", tokkulCost)) return false;
  addToInventory(player, itemId, 1);
  addChat(state, `🌋 Traded ${tokkulCost} Tokkul for ${getItem(itemId).name}!`, "#FFD700");
  soundEngine.playQuestCompleteFanfare();
  return true;
}

// ============================================================================
// 1. PLAYER-OWNED HOUSING (POH) & CONSTRUCTION
// ============================================================================

export function buildHouseRoom(state: GameState, roomType: HouseRoomType, gridX: number, gridY: number): boolean {
  const player = state.player;
  const conLevel = getSkillLevel(player, "construction");

  const roomCosts: Record<HouseRoomType, { gold: number; conLvl: number; name: string }> = {
    GARDEN: { gold: 1000, conLvl: 1, name: "Formal Garden" },
    PARLOUR: { gold: 5000, conLvl: 1, name: "Parlour" },
    WORKSHOP: { gold: 10000, conLvl: 15, name: "Workshop" },
    MENAGERIE: { gold: 30000, conLvl: 37, name: "Pet Menagerie" },
    CHAPEL: { gold: 50000, conLvl: 45, name: "Chapel" },
    PORTAL_CHAMBER: { gold: 100000, conLvl: 50, name: "Portal Chamber" },
  };

  const req = roomCosts[roomType];
  if (conLevel < req.conLvl) {
    addChat(state, `🔨 Requires Level ${req.conLvl} Construction to build a ${req.name}!`, "#FF4444");
    return false;
  }
  if (countItem(player, "coins") < req.gold) {
    addChat(state, `Requires ${req.gold.toLocaleString()} Coins to build a ${req.name}!`, "#FF4444");
    return false;
  }

  // Deduct gold
  removeFromInventory(player, "coins", req.gold);
  const roomId = `room_${roomType.toLowerCase()}_${Date.now()}`;
  player.house.rooms.push({
    id: roomId,
    type: roomType,
    name: req.name,
    gridX,
    gridY,
    furniture: {},
  });

  addXp(player, "construction", req.conLvl * 65);
  soundEngine.playConstructionHammer();
  addChat(state, `🏠 Built a new ${req.name} room in your estate!`, "#00FF80");
  return true;
}

export function buildFurniture(state: GameState, recipeId: string): boolean {
  const player = state.player;
  const recipe = FURNITURE_RECIPES.find(r => r.id === recipeId);
  if (!recipe) return false;

  const conLvl = getSkillLevel(player, "construction");
  if (conLvl < recipe.levelReq) {
    addChat(state, `Requires Level ${recipe.levelReq} Construction to build ${recipe.name}!`, "#FF4444");
    return false;
  }

  if (countItem(player, "saw") <= 0) {
    addChat(state, "You need a Saw in your inventory to construct furniture!", "#FF4444");
    return false;
  }
  if (countItem(player, "hammer") <= 0) {
    addChat(state, "You need a Hammer in your inventory to construct furniture!", "#FF4444");
    return false;
  }

  // Check materials
  for (const mat of recipe.materials) {
    if (countItem(player, mat.itemId) < mat.qty) {
      addChat(state, `Requires ${mat.qty}x ${getItem(mat.itemId).name} to build this!`, "#FF4444");
      return false;
    }
  }

  // Consume materials
  for (const mat of recipe.materials) {
    removeFromInventory(player, mat.itemId, mat.qty);
  }

  // Find target room to attach furniture
  const targetRoom = player.house.rooms.find(r => r.type === recipe.roomType) ?? player.house.rooms[0];
  if (targetRoom) {
    targetRoom.furniture[recipe.slotName] = recipe.id;
  }

  addXp(player, "construction", recipe.xp);
  soundEngine.playConstructionHammer();
  addChat(state, `🔨 Built ${recipe.name}! (+${recipe.xp} Construction XP)`, "#00FF80");
  return true;
}

export function offerBonesAtPohAltar(state: GameState, boneItemId: string): boolean {
  const player = state.player;
  const boneDef = getItem(boneItemId);
  if (!boneDef.prayerXp) {
    addChat(state, "You can only offer bones at the sacred Chapel Altar.", "#FF4444");
    return false;
  }

  // Determine bonus from built altar
  const hasGilded = player.house.rooms.some(r => Object.values(r.furniture).includes("gilded_altar"));
  const multiplier = hasGilded ? 3.5 : 2.5;

  if (!removeFromInventory(player, boneItemId, 1)) return false;
  const bonusXp = Math.floor(boneDef.prayerXp * multiplier);
  addXp(player, "prayer", bonusXp);
  player.prayer = player.maxPrayer;
  soundEngine.playSkillSound("Prayer");
  addChat(state, `✨ The gods are pleased with your offering! (+${bonusXp} Prayer XP, Multiplier: x${multiplier})`, "#00E5FF");
  return true;
}

// ============================================================================
// 2. CHAMBERS OF XERIC RAID SYSTEM
// ============================================================================

export function startRaid(state: GameState) {
  state.player.raidState = {
    active: true,
    currentRoom: 1, // 1: Tekton, 2: Mutadile, 3: Great Olm
    raidPoints: 0,
    bossHp: COMBAT_NPCS.boss_tekton.hp,
    bossMaxHp: COMBAT_NPCS.boss_tekton.hp,
    olmPhase: 1,
    olmLeftHandHp: 300,
    olmRightHandHp: 300,
    deaths: 0,
    completed: false,
  };

  changeZone(state, "chambers_of_xeric");
  soundEngine.startBackgroundMusic("ChambersOfXeric");
  soundEngine.playBossRoar();
  addChat(state, "⚔️ EXPEDITION BEGUN: Chambers of Xeric! Defeat Tekton, Mutadile, and the Great Olm!", "#FFD700");
}

export function progressRaid(state: GameState) {
  const raid = state.player.raidState;
  if (!raid || !raid.active) return;

  if (raid.currentRoom === 1) {
    // Tekton defeated -> Move to Room 2 (Mutadile)
    raid.currentRoom = 2;
    raid.bossHp = COMBAT_NPCS.boss_mutadile.hp;
    raid.bossMaxHp = COMBAT_NPCS.boss_mutadile.hp;
    raid.raidPoints += 7500;
    addChat(state, "🏆 Tekton has fallen! Chamber 2 unlocked: Mutadile & Tree of Life!", "#00FF80");
    soundEngine.playLevelUpJingle();
  } else if (raid.currentRoom === 2) {
    // Mutadile defeated -> Move to Room 3 (The Great Olm)
    raid.currentRoom = 3;
    raid.bossHp = COMBAT_NPCS.boss_olm.hp;
    raid.bossMaxHp = COMBAT_NPCS.boss_olm.hp;
    raid.raidPoints += 12000;
    addChat(state, "🐉 Mutadile defeated! FINAL CHAMBER: THE GREAT OLM EMERGES!", "#FF1744");
    soundEngine.playBossRoar();
  } else if (raid.currentRoom === 3) {
    // Great Olm defeated!
    finishRaidAndReward(state);
  }
}

export function finishRaidAndReward(state: GameState) {
  const raid = state.player.raidState;
  if (!raid) return;

  raid.completed = true;
  raid.raidPoints += 25000;
  addChat(state, "🎉 CONGRATULATIONS! You have conquered the Chambers of Xeric!", "#FFD700");
  soundEngine.playQuestCompleteFanfare();

  // Determine rewards based on raid points
  const points = raid.raidPoints;
  addToInventory(state.player, "coins", Math.min(250000, points * 5));

  const roll = Math.random();
  if (roll < 0.12) {
    addToInventory(state.player, "twisted_bow", 1);
    addChat(state, "🌟 MYTHIC UNIQUE DROP: Twisted Bow!", "#E040FB");
  } else if (roll < 0.25) {
    addToInventory(state.player, "elder_maul", 1);
    addChat(state, "🌟 MYTHIC UNIQUE DROP: Elder Maul!", "#E040FB");
  } else if (roll < 0.40) {
    addToInventory(state.player, "ancestral_robe_top", 1);
    addChat(state, "🌟 UNIQUE DROP: Ancestral Robe Top!", "#00E5FF");
  } else if (roll < 0.55) {
    addToInventory(state.player, "dexterous_prayer_scroll", 1);
    addChat(state, "📜 UNIQUE DROP: Dexterous Prayer Scroll (Rigour)!", "#FFD700");
  } else {
    addToInventory(state.player, "saradomin_brew_4", 5);
    addToInventory(state.player, "super_combat_potion", 3);
    addChat(state, "🎁 Rewards: Supplies and Coins added to your inventory.", "#4CAF50");
  }

  if (Math.random() < 0.15) {
    addToInventory(state.player, "pet_olmlet", 1);
    addChat(state, "🐉 YOU HAVE A FUNNY FEELING LIKE YOU'RE BEING FOLLOWED! (Pet Olmlet)", "#E040FB");
  }
}

// ============================================================================
// 3. TREASURE TRAILS & CLUE SCROLLS
// ============================================================================

export function openClueScroll(state: GameState, itemId: string) {
  const player = state.player;
  const tier: "EASY" | "MEDIUM" | "HARD" | "MASTER" =
    itemId.includes("master") ? "MASTER" :
    itemId.includes("hard") ? "HARD" :
    itemId.includes("medium") ? "MEDIUM" : "EASY";

  const pool = CLUE_STEPS_DATABASE[tier] ?? CLUE_STEPS_DATABASE.EASY;
  const step = pool[Math.floor(Math.random() * pool.length)];

  player.activeClue = {
    itemId,
    tier,
    stepNumber: 1,
    totalSteps: tier === "EASY" ? 2 : tier === "MEDIUM" ? 3 : tier === "HARD" ? 4 : 5,
    currentStep: step,
  };

  addChat(state, `📜 Clue Opened (${tier}): "${step.clueText}"`, "#FFD700");
}

export function solveClueStep(state: GameState): boolean {
  const player = state.player;
  const clue = player.activeClue;
  if (!clue) return false;

  soundEngine.playClueCompletion();
  if (clue.stepNumber >= clue.totalSteps) {
    // Completed full clue scroll -> Award Reward Casket!
    removeFromInventory(player, clue.itemId, 1);
    const casketId = `reward_casket_${clue.tier.toLowerCase()}`;
    addToInventory(player, casketId, 1);
    player.activeClue = null;
    addChat(state, `🎉 Clue Trail Complete! You received a ${getItem(casketId).name}!`, "#00FF80");
    soundEngine.playQuestCompleteFanfare();
    return true;
  } else {
    // Advance to next step
    clue.stepNumber++;
    const pool = CLUE_STEPS_DATABASE[clue.tier] ?? CLUE_STEPS_DATABASE.EASY;
    clue.currentStep = pool[Math.floor(Math.random() * pool.length)];
    addChat(state, `📜 Clue Step ${clue.stepNumber}/${clue.totalSteps}: "${clue.currentStep.clueText}"`, "#00E5FF");
    return true;
  }
}

export function openRewardCasket(state: GameState, casketId: string) {
  const player = state.player;
  if (!removeFromInventory(player, casketId, 1)) return;

  soundEngine.playQuestCompleteFanfare();
  const tier = casketId.replace("reward_casket_", "").toUpperCase();

  const goldReward = tier === "EASY" ? 5000 : tier === "MEDIUM" ? 25000 : tier === "HARD" ? 100000 : 500000;
  addToInventory(player, "coins", goldReward);

  const roll = Math.random();
  if (tier === "MEDIUM" && roll < 0.25) {
    addToInventory(player, "ranger_boots", 1);
    addChat(state, "🥾 INCREDIBLE LUCK! You pulled Ranger Boots from the Medium Casket!", "#E040FB");
  } else if (tier === "HARD" && roll < 0.2) {
    addToInventory(player, "saradomin_rune_plate", 1);
    addChat(state, "🛡️ Unique Reward: Saradomin Rune Platebody!", "#00E5FF");
  } else if (tier === "MASTER" && roll < 0.15) {
    addToInventory(player, "third_age_platebody", 1);
    addChat(state, "🥋 3RD AGE RELIC DROP: 3rd Age Platebody!", "#E040FB");
  } else if (tier === "MASTER" && roll < 0.3) {
    addToInventory(player, "third_age_bow", 1);
    addChat(state, "🏹 3RD AGE RELIC DROP: 3rd Age Bow!", "#E040FB");
  } else {
    addToInventory(player, "cooked_shark", 15);
    addToInventory(player, "prayer_potion_4", 3);
    addChat(state, `🎁 Casket opened: +${goldReward.toLocaleString()} Coins, Sharks & Prayer Potions!`, "#4CAF50");
  }
}

// ============================================================================
// 4. ROOFTOP AGILITY & MARKS OF GRACE
// ============================================================================

export function doAgilityObstacle(state: GameState, obstacleId: string): boolean {
  const player = state.player;
  const obs = BRINDLE_AGILITY_OBSTACLES.find(o => o.id === obstacleId);
  if (!obs) return false;

  const agiLvl = getSkillLevel(player, "agility");
  if (agiLvl < obs.levelReq) {
    addChat(state, `Requires Level ${obs.levelReq} Agility to traverse this obstacle!`, "#FF4444");
    return false;
  }

  player.tileX = obs.endX;
  player.tileY = obs.endY;
  addXp(player, "agility", obs.xpAward);
  soundEngine.playAgilityJump();
  addChat(state, `🏃 ${obs.actionText}! (+${obs.xpAward} Agility XP)`, "#81D4FA");

  if (obs.lapFinish) {
    completeAgilityLap(state);
  }
  return true;
}

export function completeAgilityLap(state: GameState) {
  const player = state.player;
  player.agilityLapCount = (player.agilityLapCount ?? 0) + 1;
  addXp(player, "agility", 75);

  // Mark of Grace drop chance
  if (Math.random() < 0.65) {
    addToInventory(player, "mark_of_grace", 1);
    player.marksOfGrace = (player.marksOfGrace ?? 0) + 1;
    addChat(state, "🌟 You spotted a Mark of Grace on the rooftop tiles!", "#FFD700");
  }

  soundEngine.playLevelUpJingle();
  addChat(state, `🏁 Rooftop Lap Complete! (Total Laps: ${player.agilityLapCount})`, "#00FF80");
}

// ============================================================================
// 5. WILDERNESS HIGH-RISK PVP & BOSSES
// ============================================================================

export function crossWildernessDitch(state: GameState) {
  if (state.zoneId === "deep_wilderness") {
    changeZone(state, "brindle_mainland");
    state.player.inWilderness = false;
    state.player.wildernessLevel = 0;
    addChat(state, "🛡️ You crossed back over the ditch into the safety of Brindle Mainland.", "#00FF80");
  } else {
    changeZone(state, "deep_wilderness");
    state.player.inWilderness = true;
    state.player.wildernessLevel = 45;
    state.player.isSkulled = true;
    state.player.skullTicks = 500;
    soundEngine.playWildernessAlarm();
    addChat(state, "⚠️ WARNING: You have entered Deep Wilderness (Level 45+)! You are now SKULLED.", "#FF1744");
  }
}

// ============================================================================
// 6. PET MENAGERIE & COMPANIONS
// ============================================================================

export function summonPet(state: GameState, petId: string) {
  const player = state.player;
  if (player.activePet === petId) {
    player.activePet = null;
    addChat(state, `Dismissed your follower companion.`, "#AAA");
  } else {
    player.activePet = petId;
    const pet = PETS_DATABASE[petId] ?? { name: "Pet Companion", emoji: "🐾" };
    soundEngine.playPetTrick();
    addChat(state, `🐾 Summoned ${pet.emoji} ${pet.name} to follow your footsteps!`, "#00E5FF");
  }
}

export function interactPet(state: GameState, action: "trick" | "feed" | "dialogue"): void {
  const player = state.player;
  if (!player.activePet) {
    addChat(state, "You do not currently have an active follower pet summoned!", "#FF4444");
    return;
  }

  const pet = PETS_DATABASE[player.activePet] ?? { name: "Companion", emoji: "🐾", dialogue: "*Blinks happily!*", trick: "Does a joyful spin!" };

  if (action === "trick") {
    soundEngine.playPetTrick();
    addChat(state, `${pet.emoji} ${pet.name}: ${pet.trick}`, "#FFD700");
  } else if (action === "feed") {
    if (countItem(player, "pet_treat") > 0) {
      removeFromInventory(player, "pet_treat", 1);
      soundEngine.playPetTrick();
      addChat(state, `🍖 You fed a delicious treat to ${pet.name}! ${pet.name} is energized!`, "#00FF80");
    } else {
      addChat(state, `Feed requires a Gourmet Pet Treat. ${pet.name} nudges your bag hungrily.`, "#FF9800");
    }
  } else {
    addChat(state, `${pet.emoji} ${pet.name}: "${pet.dialogue}"`, "#00E5FF");
  }
}

// ============================================================================
// NEW SYSTEMS HANDLERS: Collection Log, Combat Achievements, Dragon Slayer, GE, Clan
// ============================================================================

export function addToCollectionLog(state: GameState, itemId: string, qty: number = 1): void {
  const log = state.player.collectionLog;
  const oldVal = log[itemId] ?? 0;
  log[itemId] = oldVal + qty;
  if (oldVal === 0) {
    const item = getItem(itemId);
    soundEngine.playLevelUpJingle();
    addChat(state, `📖 COLLECTION LOG UNLOCKED: New Item ${item.iconEmoji} ${item.name}!`, "#FFD700");
  }
}

export function recordNpcKill(state: GameState, npcId: string): void {
  const ca = state.player.combatAchievements;
  ca.kc[npcId] = (ca.kc[npcId] ?? 0) + 1;
  const currentKc = ca.kc[npcId];

  // Check Combat Achievements for this NPC
  COMBAT_ACHIEVEMENTS.forEach(task => {
    if (task.targetNpcId === npcId && task.reqKc && currentKc >= task.reqKc) {
      if (!ca.completedTasks.includes(task.id)) {
        ca.completedTasks.push(task.id);
        soundEngine.playLevelUpJingle();
        addChat(state, `🏆 COMBAT ACHIEVEMENT COMPLETED [${task.tier}]: ${task.name}! (+${task.points} Points)`, "#00FF80");
        addToInventory(state.player, "combat_hilt", 1);
      }
    }
  });
}

export function progressDragonSlayer(state: GameState): void {
  const ds = state.player.dragonSlayer;
  if (ds.step === 0) {
    ds.step = 1;
    addChat(state, "📜 DRAGON SLAYER QUEST: Captain Ned asked you to collect the 3 ancient Map Pieces!", "#FFD700");
  } else if (ds.step === 1) {
    // Check map pieces in inventory
    if (countItem(state.player, "map_piece_1") > 0 && countItem(state.player, "map_piece_2") > 0 && countItem(state.player, "map_piece_3") > 0) {
      removeFromInventory(state.player, "map_piece_1", 1);
      removeFromInventory(state.player, "map_piece_2", 1);
      removeFromInventory(state.player, "map_piece_3", 1);
      ds.step = 2;
      addChat(state, "📜 DRAGON SLAYER QUEST: Assembled Crandor Sea Chart! Bring 3 Oak Planks & Anti-Dragon Shield to Captain Ned.", "#00FF80");
    } else {
      addChat(state, "Captain Ned: 'You still need all 3 Map Pieces from Melzar, Thalzar, and Lozar!'", "#FF9800");
    }
  } else if (ds.step === 2) {
    if (countItem(state.player, "plank_oak") >= 3 && countItem(state.player, "steel_nails") >= 10 && countItem(state.player, "anti_dragon_shield") >= 1) {
      removeFromInventory(state.player, "plank_oak", 3);
      removeFromInventory(state.player, "steel_nails", 10);
      ds.step = 3;
      addChat(state, "⛵ Captain Ned: 'The Lady Lumbridge is repaired! Board ship at Brindle Dock to sail to Crandor Isle!'", "#00FF80");
    } else {
      addChat(state, "Captain Ned: 'I need 3 Oak Planks, 10 Steel Nails, and an Anti-Dragon Shield!'", "#FF9800");
    }
  } else if (ds.step === 3) {
    changeZone(state, "crandor_isle");
    ds.step = 4;
    soundEngine.playWildernessAlarm();
    addChat(state, "🌋 SAILED TO CRANDOR ISLE: Prepare to slay Elvarg the Green Dragon!", "#FF3333");
  }
}

export function createGeOffer(state: GameState, itemId: string, pricePerItem: number, qty: number, isBuyOffer: boolean): boolean {
  const player = state.player;
  if (isBuyOffer) {
    const totalCost = pricePerItem * qty;
    if (countItem(player, "coins") < totalCost) {
      addChat(state, `You need ${totalCost} Coins to create this buy offer!`, "#FF4444");
      return false;
    }
    removeFromInventory(player, "coins", totalCost);
  } else {
    if (countItem(player, itemId) < qty) {
      addChat(state, `You do not have ${qty} of this item in inventory!`, "#FF4444");
      return false;
    }
    removeFromInventory(player, itemId, qty);
  }

  const offer: GrandExchangeOffer = {
    id: "ge_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    itemId,
    itemName: getItem(itemId).name,
    pricePerItem,
    totalQty: qty,
    fulfilledQty: qty, // GE instant market fulfillment
    isBuyOffer,
    isCompleted: true,
    timestamp: Date.now(),
  };

  player.geOffers.push(offer);

  if (isBuyOffer) {
    addToInventory(player, itemId, qty);
    addChat(state, `⚖️ GE BUY MATCHED INSTANTLY: Received ${qty}x ${offer.itemName}!`, "#00FF80");
  } else {
    addToInventory(player, "coins", pricePerItem * qty);
    addChat(state, `⚖️ GE SELL MATCHED INSTANTLY: Sold ${qty}x ${offer.itemName} for ${pricePerItem * qty} Coins!`, "#00FF80");
  }
  soundEngine.playLevelUpJingle();
  return true;
}

export function createClan(state: GameState, clanName: string, bannerEmoji: string): boolean {
  const player = state.player;
  if (countItem(player, "clan_charter") < 1) {
    addChat(state, "You need a Clan Charter Scroll from the Clan Registrar to establish a clan!", "#FF4444");
    return false;
  }
  removeFromInventory(player, "clan_charter", 1);
  player.clan = {
    name: clanName,
    bannerEmoji,
    rank: "Owner",
    memberCount: 1,
    clanBank: [],
  };
  soundEngine.playLevelUpJingle();
  addChat(state, `🚩 CLAN FOUNDED: Welcome Leader of [${clanName}]! Entrance to Clan Guild Hall unlocked!`, "#00FF80");
  return true;
}

export function pickpocketTarget(state: GameState, targetId: string): void {
  const player = state.player;
  const target = THIEVING_TARGETS.find(t => t.id === targetId) ?? THIEVING_TARGETS[0];
  const thievingLvl = getSkillLevel(player, "thieving");

  if (thievingLvl < target.reqLevel) {
    addChat(state, `Requires Level ${target.reqLevel} Thieving to pickpocket ${target.name}!`, "#FF4444");
    return;
  }

  const success = Math.random() < Math.min(0.95, 0.4 + (thievingLvl - target.reqLevel) * 0.02);
  if (success) {
    target.lootTable.forEach(l => {
      if (Math.random() <= l.chance) {
        const qty = Math.floor(Math.random() * (l.qtyMax - l.qtyMin + 1)) + l.qtyMin;
        addToInventory(player, l.itemId, qty);
        addToCollectionLog(state, l.itemId, qty);
      }
    });
    addXp(player, "thieving", target.xpAward);
    soundEngine.playLevelUpJingle();
    addChat(state, `🗡️ Pickpocketed ${target.name}! (+${target.xpAward} Thieving XP)`, "#00FF80");
  } else {
    addHitsplat(state, target.failDamage, player.tileX, player.tileY);
    player.hp = Math.max(0, player.hp - target.failDamage);
    addChat(state, `💥 You failed to pickpocket ${target.name} and took ${target.failDamage} damage!`, "#FF1744");
  }
}

export function openBarrowsChest(state: GameState): void {
  const player = state.player;
  const bs = player.barrowsState;
  bs.chestsLooted++;
  const rewards = ["dharoks_greataxe", "dharoks_helm", "dharoks_platebody", "dharoks_platelegs", "guthans_warspear", "death_rune", "blood_rune", "coins"];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  const qty = reward.includes("rune") ? 100 : reward === "coins" ? 50000 : 1;

  addToInventory(player, reward, qty);
  addToCollectionLog(state, reward, qty);
  soundEngine.playLevelUpJingle();
  addChat(state, `⚰️ BARROWS CHEST OPENED: Received ${qty}x ${getItem(reward).name}! (Chests Looted: ${bs.chestsLooted})`, "#00FF80");
}

export function finishToBRaid(state: GameState): void {
  const player = state.player;
  const rewards = ["scythe_of_vitur", "sanguinesti_staff", "avernic_defender", "coins"];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  const qty = reward === "coins" ? 250000 : 1;

  addToInventory(player, reward, qty);
  addToCollectionLog(state, reward, qty);
  soundEngine.playLevelUpJingle();
  addChat(state, `🩸 THEATRE OF BLOOD CONQUERED: Received ${qty}x ${getItem(reward).name}!`, "#FFD700");
}



