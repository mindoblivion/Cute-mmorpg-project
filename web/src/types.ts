// Core type definitions for Dungeon Quest web port

export type EquipmentSlot =
  | "HEAD" | "CAPE" | "AMULET" | "WEAPON" | "BODY"
  | "SHIELD" | "LEGS" | "GLOVES" | "BOOTS" | "RING" | "AMMO";

export type ItemTier = "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY" | "MYTHIC";

export interface ItemDefinition {
  id: string;
  name: string;
  examine: string;
  tier: ItemTier;
  value: number;
  slot?: EquipmentSlot;
  isConsumable?: boolean;
  isStackable?: boolean;
  isMysteryBox?: boolean;
  isPet?: boolean;
  isSeed?: boolean;
  isHerb?: boolean;
  isPotion?: boolean;
  healAmount?: number;
  prayerRestore?: number;
  prayerXp?: number;
  farmingXp?: number;
  herbloreXp?: number;
  boostStat?: string;
  levelRequirement?: number;
  skillRequirement?: string;
  attackBonus?: number;
  defenceBonus?: number;
  attackSlash?: number;
  attackCrush?: number;
  attackStab?: number;
  attackRanged?: number;
  attackMagic?: number;
  defenceMelee?: number;
  defenceRanged?: number;
  defenceMagic?: number;
  strengthBonus?: number;
  rangedStrengthBonus?: number;
  magicDamageBonusPercent?: number;
  prayerBonus?: number;
  attackSpeedTicks?: number;
  specialAttackCost?: number;
  specialAttackName?: string;
  specialAttackDescription?: string;
  iconEmoji: string;
}

export interface NpcDropEntry {
  itemId: string;
  qtyMin: number;
  qtyMax: number;
  chance: number;
  isRare?: boolean;
}

export interface NpcCombatConfig {
  id: string;
  name: string;
  combatLevel: number;
  hp: number;
  attackSpeed: number;
  maxHit: number;
  attackLevel?: number;
  strengthLevel?: number;
  defenceLevel?: number;
  rangedLevel?: number;
  magicLevel?: number;
  defBonus?: number;
  magicDefBonus?: number;
  rangedDefBonus?: number;
  attackStyle?: "MELEE" | "RANGED" | "MAGIC";
  attackRange?: number;
  aggressive?: boolean;
  aggroRange?: number;
  wanderRange?: number;
  respawnTicks?: number;
  emoji: string;
  examineText: string;
  alwaysDrops: string[];
  dropTable: NpcDropEntry[];
  isBoss?: boolean;
  bossTitle?: string;
}

export interface ResourceNodeDefinition {
  id: string;
  skillName: string;
  requiredLevel: number;
  xpAwarded: number;
  rewardedItem: string;
  lowChance: number;
  highChance: number;
  baseIntervalTicks: number;
  toolRequiredPrefix: string;
  depletionChance: number;
  respawnTicks: number;
  actionName: string;
}

export type ZoneTileType =
  | "GRASS" | "PATH_COBBLE" | "DIRT" | "SAND" | "WATER" | "BRIDGE"
  | "FLOOR_WOOD" | "FLOOR_STONE" | "WALL_STONE" | "WALL_WOOD" | "FENCE"
  | "JUNGLE" | "OCEAN_WATER" | "BEACH_SAND" | "LAVA" | "SWAMP_MUCK"
  | "MARBLE_STONE" | "AUTUMN_DIRT" | "SNOW";

export interface ZoneEntitySpawn {
  id: string;
  entityType: string;
  name: string;
  emoji: string;
  tileX: number;
  tileY: number;
  examineText: string;
  combatLevel?: number;
  wanderRadius?: number;
  isBlocked?: boolean;
  isNpc?: boolean;
  isCombatNpc?: boolean;
  isResource?: boolean;
  isInteractiveObject?: boolean;
  chatterLines?: string[];
}

export interface ZoneDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  spawnTileX: number;
  spawnTileY: number;
  musicTrack: string;
  blockedTiles: Set<string>;
  customTileMap: Map<string, ZoneTileType>;
  entities: ZoneEntitySpawn[];
}

export interface SkillDefinition {
  id: string;
  name: string;
  iconEmoji: string;
  defaultLevel: number;
  defaultXp: number;
}

export interface GroundItem {
  id: string;
  itemId: string;
  name: string;
  qty: number;
  tileX: number;
  tileY: number;
  value: number;
  despawnTick: number;
}

export interface Hitsplat {
  id: number;
  damage: number;
  isHeal?: boolean;
  isMax?: boolean;
  isSpec?: boolean;
  tileX: number;
  tileY: number;
  timestamp: number;
}

export interface DangerTile {
  id: string;
  x: number;
  y: number;
  explodeTick: number;
  damage: number;
  label: string;
  sourceNpcName: string;
}

export interface ChatLogEntry {
  id: number;
  message: string;
  color: string;
}

export interface InventoryItem {
  itemId: string;
  amount: number;
}

export type CombatStyle = "ACCURATE" | "AGGRESSIVE" | "DEFENSIVE";

export interface FarmingPatchState {
  id: string;
  patchType: "HERB" | "ALLOTMENT" | "TREE";
  seedId: string | null;
  stage: number; // 0 = empty, 1 = seeded, 2 = growing, 3 = harvestable
  plantedTick: number;
  harvestItemId: string | null;
  harvestQty: number;
}

export interface SlayerTask {
  monsterType: string;
  monsterName: string;
  countRemaining: number;
  totalCount: number;
  xpReward: number;
  pointsReward: number;
}

export interface FightCaveState {
  active: boolean;
  wave: number;
  totalWaves: number;
  killsThisWave: number;
  totalKillsNeeded: number;
  tokkulEarned: number;
}

export interface HerbloreRecipe {
  id: string;
  name: string;
  herbId: string;
  secondaryId: string;
  resultId: string;
  levelReq: number;
  xp: number;
  desc: string;
}

export interface GrandExchangeOffer {
  id: string;
  itemId: string;
  itemName: string;
  pricePerItem: number;
  totalQty: number;
  fulfilledQty: number;
  isBuyOffer: boolean;
  isCompleted: boolean;
  timestamp: number;
}

// === Construction & Player-Owned Housing (POH) ===
export type HouseRoomType = "GARDEN" | "PARLOUR" | "CHAPEL" | "PORTAL_CHAMBER" | "WORKSHOP" | "MENAGERIE";

export interface HouseRoom {
  id: string;
  type: HouseRoomType;
  name: string;
  gridX: number; // 0..2
  gridY: number; // 0..2
  furniture: Record<string, string>; // slot -> furnitureItemId
}

export interface HouseState {
  hasHouse: boolean;
  rooms: HouseRoom[];
  housedPets: string[];
}

// === Treasure Trails & Clue Scrolls ===
export type ClueTier = "EASY" | "MEDIUM" | "HARD" | "MASTER";

export interface ClueStep {
  id: string;
  tier: ClueTier;
  type: "RIDDLE" | "COORDINATE" | "ANAGRAM" | "SEARCH";
  clueText: string;
  targetZone: string;
  targetX?: number;
  targetY?: number;
  targetEntityId?: string;
  hint: string;
  answer?: string;
}

export interface ActiveClue {
  itemId: string;
  tier: ClueTier;
  stepNumber: number;
  totalSteps: number;
  currentStep: ClueStep;
}

// === Chambers of Xeric Raid ===
export interface RaidState {
  active: boolean;
  currentRoom: number; // 1: Tekton, 2: Mutadile, 3: Great Olm
  raidPoints: number;
  bossHp: number;
  bossMaxHp: number;
  olmPhase: number; // 1: Left Hand, 2: Right Hand, 3: Head/Core
  olmLeftHandHp: number;
  olmRightHandHp: number;
  deaths: number;
  completed: boolean;
}

// === Agility & Obstacles ===
export interface AgilityObstacle {
  id: string;
  name: string;
  levelReq: number;
  xpAward: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  actionText: string;
  lapFinish?: boolean;
}

// === Pet Menagerie & Perks ===
export interface PetData {
  id: string;
  name: string;
  emoji: string;
  dialogue: string;
  trick: string;
  perkDescription: string;
}

// === Barrows Crypts Minigame ===
export interface BarrowsState {
  brothersDefeated: Record<string, boolean>; // dharok, guthan, ahrim, karil, torag, verac
  chestsLooted: number;
}

// === Theatre of Blood Raid II ===
export interface ToBRaidState {
  active: boolean;
  currentRoom: number; // 1: Maiden, 2: Bloat, 3: Sotetseg, 4: Verzik
  verzikPhase: number; // 1: Pillar throne, 2: Bounce webs, 3: Spider form
  raidPoints: number;
  deaths: number;
  completed: boolean;
}

// === Thieving & Stalls ===
export interface ThievingTarget {
  id: string;
  name: string;
  reqLevel: number;
  xpAward: number;
  failDamage: number;
  emoji: string;
  lootTable: { itemId: string; qtyMin: number; qtyMax: number; chance: number }[];
}

// === Crafting & Fletching Recipes ===
export interface ProductionRecipe {
  id: string;
  name: string;
  skillName: "Fletching" | "Crafting";
  reqLevel: number;
  xp: number;
  emoji: string;
  inputs: { itemId: string; qty: number }[];
  outputItemId: string;
  outputQty: number;
}

// === Clan Wars & Highscores Leaderboard ===
export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  combatLevel: number;
  totalLevel: number;
  totalXp: number;
  bossKills: number;
  raidsCompleted: number;
  cluesSolved: number;
}

// === Combat Achievements & Task Tiers ===
export type CombatAchievementTier = "EASY" | "MEDIUM" | "HARD" | "ELITE" | "MASTER";

export interface CombatAchievementTask {
  id: string;
  name: string;
  tier: CombatAchievementTier;
  desc: string;
  targetNpcId?: string;
  reqKc?: number;
  points: number;
}

// === Dragon Slayer Quest ===
export interface DragonSlayerQuestState {
  step: number; // 0: Not started, 1: Talked to Ned, 2: Collect 3 map pieces, 3: Ship ready, 4: Sailed to Crandor, 5: Defeated Elvarg
  mapPiecesCollected: { p1: boolean; p2: boolean; p3: boolean };
  elvargDefeated: boolean;
}

// === Clan & Guild Hall ===
export interface ClanState {
  name: string;
  bannerEmoji: string;
  rank: string;
  memberCount: number;
  clanBank: InventoryItem[];
}

// === Collection Log ===
export interface CollectionLogCategory {
  id: string;
  name: string;
  emoji: string;
  items: string[]; // itemIds
}

