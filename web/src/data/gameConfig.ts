import type { NpcCombatConfig, ResourceNodeDefinition, SkillDefinition } from "../types";

export const SKILLS: SkillDefinition[] = [
  { id: "attack", name: "Attack", iconEmoji: "⚔️", defaultLevel: 1, defaultXp: 0 },
  { id: "strength", name: "Strength", iconEmoji: "💪", defaultLevel: 1, defaultXp: 0 },
  { id: "defence", name: "Defence", iconEmoji: "🛡️", defaultLevel: 1, defaultXp: 0 },
  { id: "hitpoints", name: "Hitpoints", iconEmoji: "❤️", defaultLevel: 10, defaultXp: 1154 },
  { id: "ranged", name: "Ranged", iconEmoji: "🏹", defaultLevel: 1, defaultXp: 0 },
  { id: "prayer", name: "Prayer", iconEmoji: "✨", defaultLevel: 1, defaultXp: 0 },
  { id: "magic", name: "Magic", iconEmoji: "🧙", defaultLevel: 1, defaultXp: 0 },
  { id: "slayer", name: "Slayer", iconEmoji: "💀", defaultLevel: 1, defaultXp: 0 },
  { id: "agility", name: "Agility", iconEmoji: "🏃", defaultLevel: 1, defaultXp: 0 },
  { id: "herblore", name: "Herblore", iconEmoji: "🧪", defaultLevel: 1, defaultXp: 0 },
  { id: "farming", name: "Farming", iconEmoji: "🌱", defaultLevel: 1, defaultXp: 0 },
  { id: "construction", name: "Construction", iconEmoji: "🔨", defaultLevel: 1, defaultXp: 0 },
  { id: "thieving", name: "Thieving", iconEmoji: "🗡️", defaultLevel: 1, defaultXp: 0 },
  { id: "fletching", name: "Fletching", iconEmoji: "🏹", defaultLevel: 1, defaultXp: 0 },
  { id: "crafting", name: "Crafting", iconEmoji: "💎", defaultLevel: 1, defaultXp: 0 },
  { id: "woodcutting", name: "Woodcutting", iconEmoji: "🪓", defaultLevel: 1, defaultXp: 0 },
  { id: "mining", name: "Mining", iconEmoji: "⛏️", defaultLevel: 1, defaultXp: 0 },
  { id: "fishing", name: "Fishing", iconEmoji: "🎣", defaultLevel: 1, defaultXp: 0 },
  { id: "cooking", name: "Cooking", iconEmoji: "🍳", defaultLevel: 1, defaultXp: 0 },
  { id: "smithing", name: "Smithing", iconEmoji: "⚒️", defaultLevel: 1, defaultXp: 0 },
  { id: "firemaking", name: "Firemaking", iconEmoji: "🔥", defaultLevel: 1, defaultXp: 0 },
];

// OSRS XP table
const xpTable: number[] = (() => {
  const table = new Array(100).fill(0);
  let points = 0;
  for (let lvl = 1; lvl < 99; lvl++) {
    points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7));
    table[lvl + 1] = Math.min(Math.floor(points / 4), 200000000);
  }
  return table;
})();

export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level >= 99) return 13034431;
  return xpTable[level] ?? 0;
}

export function getLevelForXp(xp: number): number {
  if (xp >= 13034431) return 99;
  for (let lvl = 99; lvl >= 1; lvl--) {
    if (xp >= getXpForLevel(lvl)) return lvl;
  }
  return 1;
}

export const COMBAT_NPCS: Record<string, NpcCombatConfig> = {
  chicken: {
    id: "chicken", name: "Chicken", combatLevel: 1, hp: 3, attackSpeed: 4, maxHit: 1,
    attackLevel: 1, strengthLevel: 1, defenceLevel: 1, defBonus: 0,
    aggressive: false, aggroRange: 0, wanderRange: 2, respawnTicks: 25,
    emoji: "🐔", examineText: "A cute little chicken.",
    alwaysDrops: ["bones", "raw_chicken"],
    dropTable: [{ itemId: "feathers", qtyMin: 5, qtyMax: 15, chance: 0.5 }],
  },
  giant_rat: {
    id: "giant_rat", name: "Giant rat", combatLevel: 3, hp: 5, attackSpeed: 4, maxHit: 1,
    attackLevel: 3, strengthLevel: 3, defenceLevel: 3, defBonus: 0,
    aggressive: true, aggroRange: 3, wanderRange: 2, respawnTicks: 30,
    emoji: "🐀", examineText: "A disgusting rodent.",
    alwaysDrops: ["bones"],
    dropTable: [{ itemId: "raw_rat_meat", qtyMin: 1, qtyMax: 1, chance: 0.5 }],
  },
  goblin: {
    id: "goblin", name: "Goblin", combatLevel: 5, hp: 5, attackSpeed: 4, maxHit: 2,
    attackLevel: 5, strengthLevel: 5, defenceLevel: 5, defBonus: 0, magicDefBonus: -5, rangedDefBonus: 2,
    aggressive: false, aggroRange: 0, wanderRange: 2, respawnTicks: 30,
    emoji: "👺", examineText: "An ugly green creature.",
    alwaysDrops: [],
    dropTable: [
      { itemId: "bones", qtyMin: 1, qtyMax: 1, chance: 0.5 },
      { itemId: "coins", qtyMin: 1, qtyMax: 15, chance: 0.6 },
      { itemId: "air_rune", qtyMin: 3, qtyMax: 10, chance: 0.35 },
      { itemId: "mind_rune", qtyMin: 2, qtyMax: 8, chance: 0.25 },
      { itemId: "bronze_dagger", qtyMin: 1, qtyMax: 1, chance: 0.1 },
      { itemId: "bronze_full_helm", qtyMin: 1, qtyMax: 1, chance: 0.05 },
      { itemId: "bronze_sword", qtyMin: 1, qtyMax: 1, chance: 0.05 },
      { itemId: "bronze_scimitar", qtyMin: 1, qtyMax: 1, chance: 1 / 128, isRare: true },
    ],
  },
  cow: {
    id: "cow", name: "Cow", combatLevel: 2, hp: 8, attackSpeed: 4, maxHit: 1,
    attackLevel: 2, strengthLevel: 2, defenceLevel: 2, defBonus: 0, rangedDefBonus: -3,
    aggressive: false, aggroRange: 0, wanderRange: 2, respawnTicks: 30,
    emoji: "🐄", examineText: "Produces milk and beef.",
    alwaysDrops: ["bones", "cowhide", "raw_beef"],
    dropTable: [],
  },
  giant_spider: {
    id: "giant_spider", name: "Giant Spider", combatLevel: 2, hp: 5, attackSpeed: 4, maxHit: 1,
    attackLevel: 2, strengthLevel: 2, defenceLevel: 2, defBonus: 0,
    aggressive: true, aggroRange: 3, wanderRange: 2, respawnTicks: 30,
    emoji: "🕷️", examineText: "A large hairy spider.",
    alwaysDrops: ["bones"],
    dropTable: [{ itemId: "coins", qtyMin: 1, qtyMax: 5, chance: 0.3 }],
  },
  cave_bat: {
    id: "cave_bat", name: "Cave bat", combatLevel: 5, hp: 8, attackSpeed: 3, maxHit: 2,
    attackLevel: 5, strengthLevel: 4, defenceLevel: 5, defBonus: 0, rangedDefBonus: -2,
    aggressive: true, aggroRange: 3, wanderRange: 3, respawnTicks: 25,
    emoji: "🦇", examineText: "An erratic flying cave bat.",
    alwaysDrops: ["bat_bones"],
    dropTable: [{ itemId: "coins", qtyMin: 5, qtyMax: 25, chance: 0.5 }],
  },
  skeleton: {
    id: "skeleton", name: "Skeleton", combatLevel: 22, hp: 25, attackSpeed: 4, maxHit: 5,
    attackLevel: 18, strengthLevel: 19, defenceLevel: 19, defBonus: 5, magicDefBonus: -10, rangedDefBonus: 10,
    attackStyle: "MELEE", aggressive: true, aggroRange: 4, wanderRange: 3, respawnTicks: 35,
    emoji: "💀", examineText: "A reanimated warrior guarding the graveyard.",
    alwaysDrops: ["big_bones"],
    dropTable: [
      { itemId: "coins", qtyMin: 15, qtyMax: 80, chance: 0.8 },
      { itemId: "iron_dagger", qtyMin: 1, qtyMax: 1, chance: 0.25 },
      { itemId: "bronze_arrow", qtyMin: 5, qtyMax: 20, chance: 0.4 },
      { itemId: "prayer_potion_4", qtyMin: 1, qtyMax: 1, chance: 0.05 },
    ],
  },
  boss_grimjaw: {
    id: "boss_grimjaw", name: "Grimjaw, the Goblin Warlord", combatLevel: 45, hp: 160, attackSpeed: 5, maxHit: 14,
    attackLevel: 45, strengthLevel: 48, defenceLevel: 40, defBonus: 20, rangedDefBonus: 15, magicDefBonus: 10,
    attackStyle: "MELEE", aggressive: false, aggroRange: 0, wanderRange: 2, respawnTicks: 100,
    emoji: "👺", examineText: "The fearsome Goblin Warlord of the south.", isBoss: true, bossTitle: "Goblin Warlord",
    alwaysDrops: ["big_bones", "coins"],
    dropTable: [
      { itemId: "coins", qtyMin: 500, qtyMax: 2500, chance: 1.0 },
      { itemId: "granite_maul", qtyMin: 1, qtyMax: 1, chance: 0.25, isRare: true },
      { itemId: "steel_scimitar", qtyMin: 1, qtyMax: 1, chance: 0.35 },
      { itemId: "clue_scroll", qtyMin: 1, qtyMax: 1, chance: 0.15, isRare: true },
      { itemId: "blood_money", qtyMin: 5, qtyMax: 15, chance: 0.8 },
      { itemId: "pet_goblin", qtyMin: 1, qtyMax: 1, chance: 0.08, isRare: true },
    ],
  },
  boss_malakor: {
    id: "boss_malakor", name: "Malakor, the Skeletal Warlord", combatLevel: 35, hp: 180, attackSpeed: 4, maxHit: 10,
    attackLevel: 35, strengthLevel: 38, defenceLevel: 32, defBonus: 15, rangedDefBonus: 15, magicDefBonus: -5,
    attackStyle: "MELEE", aggressive: true, aggroRange: 4, wanderRange: 2, respawnTicks: 80,
    emoji: "💀", examineText: "An ancient fallen warlord cursed to guard the crypt.", isBoss: true, bossTitle: "Restless Crypt Guardian",
    alwaysDrops: ["big_bones", "golden_skull"],
    dropTable: [
      { itemId: "coins", qtyMin: 800, qtyMax: 3500, chance: 1.0 },
      { itemId: "ghostspeak_amulet", qtyMin: 1, qtyMax: 1, chance: 0.6 },
      { itemId: "death_rune", qtyMin: 20, qtyMax: 60, chance: 0.75 },
      { itemId: "blood_rune", qtyMin: 10, qtyMax: 30, chance: 0.5 },
      { itemId: "prayer_potion_4", qtyMin: 1, qtyMax: 2, chance: 0.3 },
      { itemId: "pet_skeleton", qtyMin: 1, qtyMax: 1, chance: 0.06, isRare: true },
    ],
  },
  boss_elvarg: {
    id: "boss_elvarg", name: "Elvarg the Green Dragon", combatLevel: 83, hp: 320, attackSpeed: 4, maxHit: 28,
    attackLevel: 75, strengthLevel: 82, defenceLevel: 70, defBonus: 40, rangedDefBonus: 40, magicDefBonus: 30,
    attackStyle: "MELEE", aggressive: true, aggroRange: 5, wanderRange: 2, respawnTicks: 120,
    emoji: "🐲", examineText: "The legendary fire-breathing dragon of Crandor!", isBoss: true, bossTitle: "Terror of Crandor",
    alwaysDrops: ["dragon_bones", "green_dragonhide"],
    dropTable: [
      { itemId: "coins", qtyMin: 5000, qtyMax: 20000, chance: 1.0 },
      { itemId: "dragon_scimitar", qtyMin: 1, qtyMax: 1, chance: 0.35, isRare: true },
      { itemId: "dragon_platelegs", qtyMin: 1, qtyMax: 1, chance: 0.20, isRare: true },
      { itemId: "draconic_visage", qtyMin: 1, qtyMax: 1, chance: 0.08, isRare: true },
      { itemId: "blood_money", qtyMin: 15, qtyMax: 40, chance: 1.0 },
      { itemId: "clue_scroll", qtyMin: 1, qtyMax: 1, chance: 0.25, isRare: true },
      { itemId: "pet_baby_dragon", qtyMin: 1, qtyMax: 1, chance: 0.05, isRare: true },
    ],
  },
  // Slayer Monsters
  bloodveld: {
    id: "bloodveld", name: "Bloodveld", combatLevel: 76, hp: 120, attackSpeed: 4, maxHit: 12,
    attackLevel: 65, strengthLevel: 70, defenceLevel: 60, defBonus: 20, magicDefBonus: -20,
    attackStyle: "MELEE", aggressive: true, aggroRange: 4, wanderRange: 2, respawnTicks: 40,
    emoji: "👅", examineText: "A disgusting mutated blood beast. Slayer level 50 required.",
    alwaysDrops: ["bones"],
    dropTable: [
      { itemId: "coins", qtyMin: 200, qtyMax: 1200, chance: 0.9 },
      { itemId: "blood_rune", qtyMin: 10, qtyMax: 35, chance: 0.6 },
      { itemId: "grimy_ranarr", qtyMin: 1, qtyMax: 2, chance: 0.25 },
      { itemId: "grimy_torstol", qtyMin: 1, qtyMax: 1, chance: 0.1 },
    ],
  },
  dark_beast: {
    id: "dark_beast", name: "Dark Beast", combatLevel: 182, hp: 220, attackSpeed: 4, maxHit: 22,
    attackLevel: 120, strengthLevel: 130, defenceLevel: 110, defBonus: 45,
    attackStyle: "MELEE", aggressive: true, aggroRange: 5, wanderRange: 3, respawnTicks: 50,
    emoji: "🐂", examineText: "A ferocious predator from the underworld. Slayer level 90 required.",
    alwaysDrops: ["big_bones"],
    dropTable: [
      { itemId: "coins", qtyMin: 1500, qtyMax: 6000, chance: 1.0 },
      { itemId: "death_rune", qtyMin: 30, qtyMax: 80, chance: 0.8 },
      { itemId: "torstol_seed", qtyMin: 1, qtyMax: 2, chance: 0.2 },
      { itemId: "abyssal_whip_blood", qtyMin: 1, qtyMax: 1, chance: 0.05, isRare: true },
    ],
  },
  // TzHaar Fight Cave Monsters
  tz_kih: {
    id: "tz_kih", name: "Tz-Kih (Fire Bat)", combatLevel: 22, hp: 20, attackSpeed: 4, maxHit: 4,
    attackLevel: 25, strengthLevel: 25, defenceLevel: 20, defBonus: 5,
    attackStyle: "MELEE", aggressive: true, aggroRange: 6, wanderRange: 3, respawnTicks: 9999,
    emoji: "🦇", examineText: "A flaming TzHaar bat that drains prayer!",
    alwaysDrops: ["tokkul"],
    dropTable: [{ itemId: "tokkul", qtyMin: 10, qtyMax: 30, chance: 1.0 }],
  },
  tz_kek: {
    id: "tz_kek", name: "Tz-Kek (Lava Slug)", combatLevel: 45, hp: 45, attackSpeed: 4, maxHit: 7,
    attackLevel: 45, strengthLevel: 45, defenceLevel: 40, defBonus: 15,
    attackStyle: "MELEE", aggressive: true, aggroRange: 6, wanderRange: 3, respawnTicks: 9999,
    emoji: "🔥", examineText: "A tough molten volcanic creature.",
    alwaysDrops: ["tokkul"],
    dropTable: [{ itemId: "tokkul", qtyMin: 25, qtyMax: 60, chance: 1.0 }],
  },
  tok_xil: {
    id: "tok_xil", name: "Tok-Xil (Obsidian Ranger)", combatLevel: 90, hp: 90, attackSpeed: 4, maxHit: 14,
    attackLevel: 80, strengthLevel: 85, defenceLevel: 70, defBonus: 30,
    attackStyle: "RANGED", aggressive: true, aggroRange: 7, wanderRange: 3, respawnTicks: 9999,
    emoji: "🏹", examineText: "Throws devastating razor-sharp obsidian rings!",
    alwaysDrops: ["tokkul"],
    dropTable: [{ itemId: "tokkul", qtyMin: 60, qtyMax: 150, chance: 1.0 }],
  },
  yt_mejkot: {
    id: "yt_mejkot", name: "Yt-MejKot (Molten Healer)", combatLevel: 180, hp: 160, attackSpeed: 4, maxHit: 25,
    attackLevel: 140, strengthLevel: 150, defenceLevel: 120, defBonus: 40,
    attackStyle: "MELEE", aggressive: true, aggroRange: 7, wanderRange: 2, respawnTicks: 9999,
    emoji: "👹", examineText: "A massive hulking brute that regenerates health in combat.",
    alwaysDrops: ["tokkul"],
    dropTable: [{ itemId: "tokkul", qtyMin: 150, qtyMax: 350, chance: 1.0 }],
  },
  boss_tztok_jad: {
    id: "boss_tztok_jad", name: "TzTok-Jad", combatLevel: 702, hp: 500, attackSpeed: 6, maxHit: 65,
    attackLevel: 650, strengthLevel: 650, defenceLevel: 480, defBonus: 80, rangedDefBonus: 80, magicDefBonus: 80,
    attackStyle: "MAGIC", aggressive: true, aggroRange: 8, wanderRange: 2, respawnTicks: 9999,
    emoji: "🌋", examineText: "The legendary master of the TzHaar Fight Caves. Slay him for the Fire Cape!", isBoss: true, bossTitle: "Master of the Fight Caves",
    alwaysDrops: ["tokkul", "fire_cape"],
    dropTable: [
      { itemId: "tokkul", qtyMin: 8000, qtyMax: 16000, chance: 1.0 },
      { itemId: "fire_cape", qtyMin: 1, qtyMax: 1, chance: 1.0 },
      { itemId: "pet_tztok_jad", qtyMin: 1, qtyMax: 1, chance: 0.2, isRare: true },
      { itemId: "tzhaar_ket_om", qtyMin: 1, qtyMax: 1, chance: 0.5, isRare: true },
      { itemId: "obsidian_shield", qtyMin: 1, qtyMax: 1, chance: 0.5, isRare: true },
    ],
  },
  // === Chambers of Xeric Raid Bosses ===
  boss_tekton: {
    id: "boss_tekton", name: "Tekton the Obsidian Smith", combatLevel: 650, hp: 450, attackSpeed: 4, maxHit: 38,
    attackLevel: 320, strengthLevel: 350, defenceLevel: 280, defBonus: 90, rangedDefBonus: 70, magicDefBonus: 60,
    attackStyle: "MELEE", aggressive: true, aggroRange: 8, wanderRange: 3, respawnTicks: 9999,
    emoji: "🔨", examineText: "A giant obsidian titan hammering burning anvil meteors!", isBoss: true, bossTitle: "Obsidian Smith",
    alwaysDrops: ["coins"],
    dropTable: [
      { itemId: "coins", qtyMin: 25000, qtyMax: 60000, chance: 1.0 },
      { itemId: "dexterous_prayer_scroll", qtyMin: 1, qtyMax: 1, chance: 0.15, isRare: true },
      { itemId: "stamina_potion", qtyMin: 2, qtyMax: 4, chance: 0.8 },
    ],
  },
  boss_mutadile: {
    id: "boss_mutadile", name: "Mutadile & Tree of Life", combatLevel: 580, hp: 400, attackSpeed: 4, maxHit: 32,
    attackLevel: 280, strengthLevel: 300, defenceLevel: 240, defBonus: 65, rangedDefBonus: 60, magicDefBonus: 50,
    attackStyle: "RANGED", aggressive: true, aggroRange: 8, wanderRange: 3, respawnTicks: 9999,
    emoji: "🐊", examineText: "A ferocious mutated beast that feeds from the sacred Tree of Life.", isBoss: true, bossTitle: "Tree Guardian",
    alwaysDrops: ["coins"],
    dropTable: [
      { itemId: "coins", qtyMin: 20000, qtyMax: 50000, chance: 1.0 },
      { itemId: "arcane_prayer_scroll", qtyMin: 1, qtyMax: 1, chance: 0.15, isRare: true },
      { itemId: "saradomin_brew_4", qtyMin: 3, qtyMax: 6, chance: 0.8 },
    ],
  },
  boss_olm: {
    id: "boss_olm", name: "The Great Olm", combatLevel: 1043, hp: 800, attackSpeed: 4, maxHit: 55,
    attackLevel: 550, strengthLevel: 600, defenceLevel: 420, defBonus: 100, rangedDefBonus: 95, magicDefBonus: 90,
    attackStyle: "MAGIC", aggressive: true, aggroRange: 10, wanderRange: 1, respawnTicks: 9999,
    emoji: "🐉", examineText: "The ancient subterranean dragon wurm of the Chambers of Xeric!", isBoss: true, bossTitle: "The Great Olm",
    alwaysDrops: ["coins"],
    dropTable: [
      { itemId: "twisted_bow", qtyMin: 1, qtyMax: 1, chance: 0.08, isRare: true },
      { itemId: "elder_maul", qtyMin: 1, qtyMax: 1, chance: 0.12, isRare: true },
      { itemId: "ancestral_robe_top", qtyMin: 1, qtyMax: 1, chance: 0.1, isRare: true },
      { itemId: "ancestral_robe_bottom", qtyMin: 1, qtyMax: 1, chance: 0.1, isRare: true },
      { itemId: "ancestral_hat", qtyMin: 1, qtyMax: 1, chance: 0.12, isRare: true },
      { itemId: "pet_olmlet", qtyMin: 1, qtyMax: 1, chance: 0.15, isRare: true },
      { itemId: "clue_scroll_master", qtyMin: 1, qtyMax: 1, chance: 0.6, isRare: true },
      { itemId: "coins", qtyMin: 150000, qtyMax: 500000, chance: 1.0 },
    ],
  },
  // === Wilderness World Bosses ===
  boss_chaos_elemental: {
    id: "boss_chaos_elemental", name: "Chaos Elemental", combatLevel: 305, hp: 250, attackSpeed: 5, maxHit: 28,
    attackLevel: 270, strengthLevel: 250, defenceLevel: 220, defBonus: 50, rangedDefBonus: 50, magicDefBonus: 50,
    attackStyle: "MAGIC", aggressive: true, aggroRange: 7, wanderRange: 4, respawnTicks: 60,
    emoji: "🌌", examineText: "A floating cloud of pure, unbridled chaotic magic in Deep Wilderness!", isBoss: true, bossTitle: "Lord of Chaos",
    alwaysDrops: ["blood_money"],
    dropTable: [
      { itemId: "pet_chaos_elemental", qtyMin: 1, qtyMax: 1, chance: 0.1, isRare: true },
      { itemId: "dragon_pickaxe", qtyMin: 1, qtyMax: 1, chance: 0.25, isRare: true },
      { itemId: "wilderness_loot_key", qtyMin: 1, qtyMax: 1, chance: 0.75 },
      { itemId: "clue_scroll_hard", qtyMin: 1, qtyMax: 1, chance: 0.4 },
      { itemId: "blood_money", qtyMin: 200, qtyMax: 600, chance: 1.0 },
    ],
  },
  boss_venenatis: {
    id: "boss_venenatis", name: "Venenatis the Spider Queen", combatLevel: 464, hp: 350, attackSpeed: 4, maxHit: 50,
    attackLevel: 350, strengthLevel: 380, defenceLevel: 260, defBonus: 70, rangedDefBonus: 60, magicDefBonus: 40,
    attackStyle: "MAGIC", aggressive: true, aggroRange: 7, wanderRange: 3, respawnTicks: 70,
    emoji: "🕷️", examineText: "A giant venomous arachnid residing in the web-covered Wilderness ruins.", isBoss: true, bossTitle: "Spider Queen",
    alwaysDrops: ["blood_money"],
    dropTable: [
      { itemId: "ring_of_the_gods", qtyMin: 1, qtyMax: 1, chance: 0.2, isRare: true },
      { itemId: "pet_venenatis", qtyMin: 1, qtyMax: 1, chance: 0.1, isRare: true },
      { itemId: "dragon_pickaxe", qtyMin: 1, qtyMax: 1, chance: 0.25, isRare: true },
      { itemId: "wilderness_loot_key", qtyMin: 1, qtyMax: 1, chance: 0.8 },
      { itemId: "blood_money", qtyMin: 300, qtyMax: 800, chance: 1.0 },
    ],
  },
  boss_callisto: {
    id: "boss_callisto", name: "Callisto the Elder Bear", combatLevel: 470, hp: 380, attackSpeed: 4, maxHit: 55,
    attackLevel: 360, strengthLevel: 400, defenceLevel: 300, defBonus: 85, rangedDefBonus: 80, magicDefBonus: 35,
    attackStyle: "MELEE", aggressive: true, aggroRange: 7, wanderRange: 3, respawnTicks: 70,
    emoji: "🐻", examineText: "A monstrous rampaging bear with seismic ground slams!", isBoss: true, bossTitle: "The Great Bear",
    alwaysDrops: ["blood_money"],
    dropTable: [
      { itemId: "dragon_pickaxe", qtyMin: 1, qtyMax: 1, chance: 0.25, isRare: true },
      { itemId: "pet_callisto", qtyMin: 1, qtyMax: 1, chance: 0.1, isRare: true },
      { itemId: "wilderness_loot_key", qtyMin: 1, qtyMax: 1, chance: 0.8 },
      { itemId: "clue_scroll_hard", qtyMin: 1, qtyMax: 1, chance: 0.5 },
      { itemId: "blood_money", qtyMin: 350, qtyMax: 900, chance: 1.0 },
    ],
  },
};

export const HERBLORE_RECIPES = [
  {
    id: "clean_ranarr",
    name: "Clean Ranarr Weed",
    herbId: "grimy_ranarr",
    secondaryId: "",
    resultId: "clean_ranarr",
    levelReq: 32,
    xp: 7.5,
    desc: "Cleans a grimy Ranarr weed for potion making.",
  },
  {
    id: "clean_toadflax",
    name: "Clean Toadflax",
    herbId: "grimy_toadflax",
    secondaryId: "",
    resultId: "clean_toadflax",
    levelReq: 38,
    xp: 8.0,
    desc: "Cleans a grimy Toadflax.",
  },
  {
    id: "clean_torstol",
    name: "Clean Torstol",
    herbId: "grimy_torstol",
    secondaryId: "",
    resultId: "clean_torstol",
    levelReq: 85,
    xp: 15.0,
    desc: "Cleans the legendary Torstol herb.",
  },
  {
    id: "brew_prayer_pot",
    name: "Prayer Potion (4)",
    herbId: "clean_ranarr",
    secondaryId: "vial_of_water",
    resultId: "prayer_potion_4",
    levelReq: 38,
    xp: 87.5,
    desc: "Mix Clean Ranarr with Vial of Water to brew Prayer Potion.",
  },
  {
    id: "brew_super_attack",
    name: "Super Attack (4)",
    herbId: "clean_toadflax",
    secondaryId: "eye_of_newt",
    resultId: "super_attack_potion",
    levelReq: 45,
    xp: 100.0,
    desc: "Mix Clean Toadflax with Eye of Newt to brew Super Attack.",
  },
  {
    id: "brew_super_strength",
    name: "Super Strength (4)",
    herbId: "clean_ranarr",
    secondaryId: "limpwurt_root",
    resultId: "super_strength_potion",
    levelReq: 55,
    xp: 125.0,
    desc: "Mix Clean Ranarr with Limpwurt Root to brew Super Strength.",
  },
  {
    id: "brew_saradomin_brew",
    name: "Saradomin Brew (4)",
    herbId: "clean_toadflax",
    secondaryId: "crushed_nest",
    resultId: "saradomin_brew_4",
    levelReq: 81,
    xp: 180.0,
    desc: "Mix Clean Toadflax with Crushed Bird Nest to brew Saradomin Brew.",
  },
  {
    id: "brew_super_combat",
    name: "Super Combat Potion",
    herbId: "clean_torstol",
    secondaryId: "super_attack_potion",
    resultId: "super_combat_potion",
    levelReq: 90,
    xp: 250.0,
    desc: "Combine Clean Torstol with Super Potions to brew Super Combat.",
  },
];

export const SLAYER_BOUNTY_OPTIONS = [
  { monsterType: "goblin", monsterName: "Goblins", minCount: 5, maxCount: 15, minLevel: 1, xpPerKill: 25, points: 5 },
  { monsterType: "skeleton", monsterName: "Skeletons", minCount: 4, maxCount: 10, minLevel: 10, xpPerKill: 65, points: 10 },
  { monsterType: "cave_bat", monsterName: "Cave Bats", minCount: 5, maxCount: 12, minLevel: 1, xpPerKill: 35, points: 5 },
  { monsterType: "bloodveld", monsterName: "Bloodvelds", minCount: 4, maxCount: 8, minLevel: 40, xpPerKill: 150, points: 15 },
  { monsterType: "boss_grimjaw", monsterName: "Grimjaw the Warlord", minCount: 1, maxCount: 1, minLevel: 25, xpPerKill: 450, points: 25 },
  { monsterType: "boss_elvarg", monsterName: "Elvarg the Dragon", minCount: 1, maxCount: 1, minLevel: 50, xpPerKill: 850, points: 40 },
  { monsterType: "boss_tztok_jad", monsterName: "TzTok-Jad (Fight Caves)", minCount: 1, maxCount: 1, minLevel: 70, xpPerKill: 2500, points: 100 },
];


export const RESOURCES: Record<string, ResourceNodeDefinition> = {
  tree: { id: "tree", skillName: "Woodcutting", requiredLevel: 1, xpAwarded: 25, rewardedItem: "logs", lowChance: 0.25, highChance: 0.9, baseIntervalTicks: 4, toolRequiredPrefix: "axe", depletionChance: 1.0, respawnTicks: 10, actionName: "Chop down" },
  oak_tree: { id: "oak_tree", skillName: "Woodcutting", requiredLevel: 15, xpAwarded: 37.5, rewardedItem: "oak_logs", lowChance: 0.15, highChance: 0.6, baseIntervalTicks: 4, toolRequiredPrefix: "axe", depletionChance: 0.12, respawnTicks: 25, actionName: "Chop down" },
  willow_tree: { id: "willow_tree", skillName: "Woodcutting", requiredLevel: 30, xpAwarded: 67.5, rewardedItem: "willow_logs", lowChance: 0.12, highChance: 0.5, baseIntervalTicks: 4, toolRequiredPrefix: "axe", depletionChance: 0.10, respawnTicks: 20, actionName: "Chop down" },
  copper_rock: { id: "copper_rock", skillName: "Mining", requiredLevel: 1, xpAwarded: 17.5, rewardedItem: "copper_ore", lowChance: 0.3, highChance: 0.85, baseIntervalTicks: 3, toolRequiredPrefix: "pickaxe", depletionChance: 1.0, respawnTicks: 4, actionName: "Mine" },
  tin_rock: { id: "tin_rock", skillName: "Mining", requiredLevel: 1, xpAwarded: 17.5, rewardedItem: "tin_ore", lowChance: 0.3, highChance: 0.85, baseIntervalTicks: 3, toolRequiredPrefix: "pickaxe", depletionChance: 1.0, respawnTicks: 4, actionName: "Mine" },
  iron_rock: { id: "iron_rock", skillName: "Mining", requiredLevel: 15, xpAwarded: 35, rewardedItem: "iron_ore", lowChance: 0.2, highChance: 0.6, baseIntervalTicks: 3, toolRequiredPrefix: "pickaxe", depletionChance: 1.0, respawnTicks: 6, actionName: "Mine" },
};

export interface FishingSpotConfig {
  id: string;
  skillName: string;
  requiredLevel: number;
  toolRequired: string;
  catches: { itemId: string; level: number; xp: number; chance: number }[];
}

export const FISHING_SPOTS: Record<string, FishingSpotConfig> = {
  net_spot: {
    id: "net_spot", skillName: "Fishing", requiredLevel: 1, toolRequired: "small_fishing_net",
    catches: [
      { itemId: "raw_shrimp", level: 1, xp: 10, chance: 0.5 },
      { itemId: "raw_anchovies", level: 15, xp: 20, chance: 0.2 },
    ],
  },
  fly_fishing_spot: {
    id: "fly_fishing_spot", skillName: "Fishing", requiredLevel: 20, toolRequired: "fly_fishing_rod",
    catches: [
      { itemId: "raw_trout", level: 20, xp: 50, chance: 0.5 },
      { itemId: "raw_salmon", level: 30, xp: 70, chance: 0.25 },
    ],
  },
};

export interface CookingConfig {
  rawId: string;
  cookedId: string;
  burntId: string;
  requiredLevel: number;
  xp: number;
  burnChance: number;
}

export const COOKING_CONFIG: Record<string, CookingConfig> = {
  raw_shrimp: { rawId: "raw_shrimp", cookedId: "shrimps", burntId: "burnt_fish", requiredLevel: 1, xp: 10, burnChance: 0.3 },
  raw_anchovies: { rawId: "raw_anchovies", cookedId: "shrimps", burntId: "burnt_fish", requiredLevel: 1, xp: 10, burnChance: 0.3 },
  raw_trout: { rawId: "raw_trout", cookedId: "trout", burntId: "burnt_fish", requiredLevel: 15, xp: 70, burnChance: 0.2 },
  raw_salmon: { rawId: "raw_salmon", cookedId: "salmon", burntId: "burnt_fish", requiredLevel: 25, xp: 90, burnChance: 0.15 },
  raw_chicken: { rawId: "raw_chicken", cookedId: "cooked_chicken", burntId: "burnt_meat", requiredLevel: 1, xp: 30, burnChance: 0.3 },
  raw_beef: { rawId: "raw_beef", cookedId: "cooked_beef", burntId: "burnt_meat", requiredLevel: 1, xp: 30, burnChance: 0.3 },
  raw_rat_meat: { rawId: "raw_rat_meat", cookedId: "cooked_rat_meat", burntId: "burnt_meat", requiredLevel: 1, xp: 30, burnChance: 0.35 },
};

export interface SmeltingConfig {
  barId: string;
  requiredLevel: number;
  xp: number;
  ores: { itemId: string; qty: number }[];
}

export const SMELTING_CONFIG: SmeltingConfig[] = [
  { barId: "bronze_bar", requiredLevel: 1, xp: 6.2, ores: [{ itemId: "copper_ore", qty: 1 }, { itemId: "tin_ore", qty: 1 }] },
  { barId: "iron_bar", requiredLevel: 15, xp: 12.5, ores: [{ itemId: "iron_ore", qty: 1 }] },
  { barId: "steel_bar", requiredLevel: 30, xp: 17.5, ores: [{ itemId: "iron_ore", qty: 1 }, { itemId: "coal_ore", qty: 2 }] },
];

// === Construction Blueprints & Furniture Recipes ===
export interface FurnitureRecipe {
  id: string;
  name: string;
  roomType: string;
  slotName: string;
  levelReq: number;
  xp: number;
  emoji: string;
  materials: { itemId: string; qty: number }[];
  bonusDescription: string;
}

export const FURNITURE_RECIPES: FurnitureRecipe[] = [
  { id: "wooden_chair", name: "Crude Wooden Chair", roomType: "PARLOUR", slotName: "chair", levelReq: 1, xp: 29, emoji: "🪑", materials: [{ itemId: "plank_wood", qty: 3 }, { itemId: "steel_nails", qty: 3 }], bonusDescription: "Cozy basic chair for visitors." },
  { id: "oak_armchair", name: "Oak Armchair", roomType: "PARLOUR", slotName: "chair", levelReq: 25, xp: 90, emoji: "🪑", materials: [{ itemId: "plank_oak", qty: 3 }, { itemId: "steel_nails", qty: 3 }], bonusDescription: "Comfortable polished oak armchair." },
  { id: "teak_dining_table", name: "Teak Dining Table", roomType: "PARLOUR", slotName: "table", levelReq: 38, xp: 180, emoji: "🪵", materials: [{ itemId: "plank_teak", qty: 4 }], bonusDescription: "Banquet dining table for housing parties." },
  { id: "oak_altar", name: "Oak Altar", roomType: "CHAPEL", slotName: "altar", levelReq: 45, xp: 195, emoji: "✝️", materials: [{ itemId: "plank_oak", qty: 4 }, { itemId: "bolt_of_cloth", qty: 2 }], bonusDescription: "Provides +150% Prayer XP when offering bones!" },
  { id: "gilded_altar", name: "Gilded Altar", roomType: "CHAPEL", slotName: "altar", levelReq: 75, xp: 650, emoji: "✨", materials: [{ itemId: "plank_mahogany", qty: 4 }, { itemId: "gold_leaf", qty: 2 }], bonusDescription: "Provides massive +350% Prayer XP when offering bones!" },
  { id: "workbench", name: "Plank Workbench", roomType: "WORKSHOP", slotName: "workbench", levelReq: 15, xp: 75, emoji: "⚒️", materials: [{ itemId: "plank_wood", qty: 5 }, { itemId: "steel_nails", qty: 5 }], bonusDescription: "Allows crafting advanced materials in your house." },
  { id: "repair_stand", name: "Armour Repair Stand", roomType: "WORKSHOP", slotName: "repair", levelReq: 55, xp: 240, emoji: "🛡️", materials: [{ itemId: "plank_oak", qty: 4 }, { itemId: "limestone_brick", qty: 2 }], bonusDescription: "Repairs damaged Barrows armor at a 50% gold discount." },
  { id: "teleport_portal_lumbridge", name: "Mainland Teleport Portal", roomType: "PORTAL_CHAMBER", slotName: "portal_1", levelReq: 50, xp: 200, emoji: "🌀", materials: [{ itemId: "plank_teak", qty: 3 }, { itemId: "marble_block", qty: 1 }], bonusDescription: "Free unlimited instant teleport to Brindle Mainland!" },
  { id: "teleport_portal_volcano", name: "Volcano Teleport Portal", roomType: "PORTAL_CHAMBER", slotName: "portal_2", levelReq: 70, xp: 350, emoji: "🌋", materials: [{ itemId: "plank_mahogany", qty: 3 }, { itemId: "marble_block", qty: 1 }], bonusDescription: "Free instant teleport straight to Crandor Volcano!" },
  { id: "pet_bed_cushion", name: "Luxury Pet Cushion", roomType: "MENAGERIE", slotName: "pet_bed", levelReq: 37, xp: 140, emoji: "🛋️", materials: [{ itemId: "plank_oak", qty: 2 }, { itemId: "bolt_of_cloth", qty: 4 }], bonusDescription: "Houses and feeds your pet companions in comfort." },
  { id: "combat_dummy", name: "Undead Combat Dummy", roomType: "GARDEN", slotName: "dummy", levelReq: 53, xp: 220, emoji: "🎯", materials: [{ itemId: "plank_oak", qty: 3 }, { itemId: "bones", qty: 5 }], bonusDescription: "Practice weapon special attacks with infinite spec energy!" },
];

// === Treasure Trails Clue Steps Pool ===
export const CLUE_STEPS_DATABASE: Record<string, any[]> = {
  EASY: [
    { id: "easy_1", tier: "EASY", type: "RIDDLE", clueText: "Speak to the chef whose banquet was in peril.", targetZone: "brindle_mainland", targetEntityId: "brindle_cook", hint: "Check the kitchen in Brindle Village." },
    { id: "easy_2", tier: "EASY", type: "SEARCH", clueText: "Search the coop where feathers fly and fresh eggs are laid.", targetZone: "brindle_mainland", targetX: 18, targetY: 17, hint: "Look inside the chicken pen to the south." },
    { id: "easy_3", tier: "EASY", type: "COORDINATE", clueText: "Dig near the sparkling shore where trout leap in the river.", targetZone: "brindle_mainland", targetX: 17, targetY: 5, hint: "River fishing spot in north-east." },
  ],
  MEDIUM: [
    { id: "med_1", tier: "MEDIUM", type: "RIDDLE", clueText: "Seek the priest who guards the sanctum of the restless spirit.", targetZone: "brindle_mainland", targetEntityId: "brindle_priest", hint: "Father Joshua at the church." },
    { id: "med_2", tier: "MEDIUM", type: "ANAGRAM", clueText: "Anagram: 'KARA NNAV' assigns bloody combat bounties across the realm.", targetZone: "brindle_mainland", targetEntityId: "npc_slayer_master", hint: "Vannaka the Slayer Master!" },
    { id: "med_3", tier: "MEDIUM", type: "SEARCH", clueText: "Search deep in the Goblin Den where Grimjaw hoards his stolen treasures.", targetZone: "grimjaw_lair", targetX: 10, targetY: 10, hint: "The boss chamber of Grimjaw's Lair." },
  ],
  HARD: [
    { id: "hard_1", tier: "HARD", type: "SEARCH", clueText: "Delve into the ancient Graveyard Crypt and search the altar of bones.", targetZone: "skeleton_crypt", targetX: 13, targetY: 7, hint: "Near Skeleton Warlord Malakor." },
    { id: "hard_2", tier: "HARD", type: "COORDINATE", clueText: "Stand on the volcanic shores of Crandor Isle where Elvarg nests.", targetZone: "dragon_crypt", targetX: 12, targetY: 12, hint: "Crandor Dragon Crypt." },
    { id: "hard_3", tier: "HARD", type: "RIDDLE", clueText: "Find the obsidian creature who sells obsidian weaponry for Tokkul.", targetZone: "tzhaar_fight_caves", targetEntityId: "npc_tzhaar_master", hint: "TzHaar Wave Arena." },
  ],
  MASTER: [
    { id: "master_1", tier: "MASTER", type: "RIDDLE", clueText: "Descend into the Chambers of Xeric and face Tekton the Obsidian Smith.", targetZone: "chambers_of_xeric", targetX: 12, targetY: 12, hint: "Raid Chamber 1." },
    { id: "master_2", tier: "MASTER", type: "SEARCH", clueText: "Search the deep web-covered ruins of the Wilderness where Venenatis lurks.", targetZone: "deep_wilderness", targetX: 18, targetY: 6, hint: "Deep Wilderness Level 45." },
    { id: "master_3", tier: "MASTER", type: "COORDINATE", clueText: "Stand beside the cosmic vortex of the Chaos Elemental in the Deep Wilderness.", targetZone: "deep_wilderness", targetX: 10, targetY: 4, hint: "Deep Wilderness Level 50." },
  ],
};

// === Rooftop Agility Obstacles (Brindle Course) ===
export const BRINDLE_AGILITY_OBSTACLES = [
  { id: "brindle_roof_1", name: "Rough Wall Climb", levelReq: 1, xpAward: 15, startX: 12, startY: 14, endX: 12, endY: 11, actionText: "Climb up the rough wall" },
  { id: "brindle_roof_2", name: "Tightrope Walk", levelReq: 1, xpAward: 20, startX: 12, startY: 11, endX: 16, endY: 11, actionText: "Walk across the narrow tightrope" },
  { id: "brindle_roof_3", name: "Rooftop Vault", levelReq: 1, xpAward: 25, startX: 16, startY: 11, endX: 16, endY: 14, actionText: "Vault over the roof gap" },
  { id: "brindle_roof_4", name: "Flagpole Slide", levelReq: 1, xpAward: 40, startX: 16, startY: 14, endX: 12, endY: 14, actionText: "Slide down flagpole to ground", lapFinish: true },
];

// === Pet Menagerie & Perks Registry ===
export const PETS_DATABASE: Record<string, { id: string; name: string; emoji: string; dialogue: string; trick: string; perkDescription: string }> = {
  pet_baby_dragon: { id: "pet_baby_dragon", name: "Baby Green Dragon", emoji: "🐲", dialogue: "*Tiny roar!* Rawr!", trick: "Breathes a cute puff of green smoke rings!", perkDescription: "+5% Firemaking & Cooking success." },
  pet_tztok_jad: { id: "pet_tztok_jad", name: "TzTok-Jad", emoji: "🌋", dialogue: "*Stomps feet angrily!* Tok-tok!", trick: "Drops a fiery meteor pebble with a heroic pose!", perkDescription: "+2 Max Hit in Fight Caves minigame." },
  pet_skeleton: { id: "pet_skeleton", name: "Tiny Skeleton", emoji: "💀", dialogue: "*Rattles ribs merrily!* Clack clack!", trick: "Does an adorable moonwalk dance while rattling bones!", perkDescription: "+10% Prayer XP from burying bones." },
  pet_goblin: { id: "pet_goblin", name: "Mini Grimjaw", emoji: "👺", dialogue: "*Swings tiny club!* Goblins rule!", trick: "Does a joyful victory flip!", perkDescription: "+5% Coin drops from monsters." },
  pet_olmlet: { id: "pet_olmlet", name: "Olmlet", emoji: "🐉", dialogue: "*Chirps with ancient draconic wisdom!*", trick: "Summons a mini crystal lightning storm!", perkDescription: "+10% Raid Points in Chambers of Xeric." },
  pet_chaos_elemental: { id: "pet_chaos_elemental", name: "Chaos Elemental", emoji: "🌌", dialogue: "*Flashes with multicolored chaotic lights!*", trick: "Teleports playfully around in circles!", perkDescription: "+5% Magic accuracy in Wilderness." },
  pet_venenatis: { id: "pet_venenatis", name: "Venenatis Spiderling", emoji: "🕷️", dialogue: "*Skitters happily!*", trick: "Spins a sparkling silk web hammock!", perkDescription: "+10% Poison resistance." },
  pet_callisto: { id: "pet_callisto", name: "Callisto Cub", emoji: "🐻", dialogue: "*Playful bear growl!* Grrr!", trick: "Stands on hind legs and roars fiercely!", perkDescription: "+5% Melee defence against wild beasts." },
};

// === Dragon Slayer Quest Steps ===
export const DRAGON_SLAYER_QUEST_STEPS = [
  { step: 0, title: "Unspoken Legend", desc: "Speak with Captain Ned at Brindle Wharf to ask about sailing to Crandor Isle." },
  { step: 1, title: "Chart of Crandor", desc: "Collect the 3 ancient map pieces from Melzar, Thalzar, and Lozar across dungeons." },
  { step: 2, title: "Preparing the Ship", desc: "Bring 3 Oak Planks, 10 Steel Nails, and an Anti-Dragon Shield to Captain Ned." },
  { step: 3, title: "Voyage to Crandor", desc: "Board Ned's vessel at Brindle Port to sail to the volcanic Crandor Isle." },
  { step: 4, title: "Slay Elvarg", desc: "Enter Crandor Dragon Crypt and slay Elvarg the Green Dragon!" },
  { step: 5, title: "Dragon Slayer Victorious", desc: "Quest Complete! Unlocked ability to equip Rune Platebodies and earned 10,000 XP!" },
];

// === Combat Achievements Tasks ===
export const COMBAT_ACHIEVEMENTS = [
  { id: "ca_goblin", name: "Goblin Exterminator", tier: "EASY", desc: "Slay 10 Goblins in Brindle Village.", reqKc: 10, targetNpcId: "goblin", points: 1 },
  { id: "ca_grimjaw", name: "Grimjaw's Demise", tier: "EASY", desc: "Defeat Goblin Boss Grimjaw in his lair.", reqKc: 1, targetNpcId: "grimjaw", points: 2 },
  { id: "ca_malakor", name: "Bone Crusher", tier: "MEDIUM", desc: "Defeat Skeleton Warlord Malakor.", reqKc: 1, targetNpcId: "skeleton_warlord", points: 3 },
  { id: "ca_jad_1", tier: "HARD", name: "Fight Cave Survivor", desc: "Conquer all 10 waves and slay TzTok-Jad in the TzHaar Arena.", reqKc: 1, targetNpcId: "boss_tztok_jad", points: 5 },
  { id: "ca_tekton", tier: "ELITE", name: "Hammer & Anvil", desc: "Slay Tekton the Obsidian Smith in Chambers of Xeric.", reqKc: 1, targetNpcId: "boss_tekton", points: 6 },
  { id: "ca_olm", tier: "MASTER", name: "Dragon Slayer of Xeric", desc: "Defeat The Great Olm in Chambers of Xeric.", reqKc: 1, targetNpcId: "boss_olm", points: 10 },
  { id: "ca_elvarg", tier: "HARD", name: "Crandor Fireproof", desc: "Slay Elvarg the Green Dragon.", reqKc: 1, targetNpcId: "boss_elvarg", points: 5 },
  { id: "ca_wildy_boss", tier: "ELITE", name: "Wilderness Sovereign", desc: "Defeat Chaos Elemental in Deep Wilderness.", reqKc: 1, targetNpcId: "boss_chaos_elemental", points: 7 },
];

// === Collection Log Categories ===
export const COLLECTION_LOG_CATEGORIES = [
  {
    id: "raids_cox",
    name: "Chambers of Xeric",
    emoji: "🐉",
    items: ["twisted_bow", "elder_maul", "ancestral_robe_top", "ancestral_robe_bottom", "ancestral_hat", "pet_olmlet", "dexterous_prayer_scroll", "arcane_prayer_scroll"],
  },
  {
    id: "raids_tob",
    name: "Theatre of Blood",
    emoji: "🩸",
    items: ["scythe_of_vitur", "sanguinesti_staff", "avernic_defender"],
  },
  {
    id: "bosses_barrows",
    name: "Barrows Crypts",
    emoji: "⚰️",
    items: ["dharoks_greataxe", "dharoks_helm", "dharoks_platebody", "dharoks_platelegs", "guthans_warspear"],
  },
  {
    id: "bosses_gwd",
    name: "God Wars Dungeon",
    emoji: "⚔️",
    items: ["bandos_godsword", "saradomin_godsword", "armadyl_godsword", "bandos_chestplate", "bandos_tassets"],
  },
  {
    id: "bosses_wildy",
    name: "Wilderness Bosses",
    emoji: "🌌",
    items: ["pet_chaos_elemental", "pet_venenatis", "pet_callisto", "dragon_pickaxe", "tyrannical_ring", "voidwaker_blade", "wilderness_loot_key", "blood_money"],
  },
  {
    id: "minigame_fightcaves",
    name: "TzHaar Fight Caves",
    emoji: "🌋",
    items: ["fire_cape", "pet_tztok_jad", "tzhaar_ket_om", "obsidian_shield", "tokkul"],
  },
  {
    id: "treasure_trails",
    name: "Treasure Trails",
    emoji: "📜",
    items: ["partyhat_set", "trimmed_rune_armor", "third_age_platebody", "gilded_scimitar", "god_book_saradomin"],
  },
  {
    id: "pets",
    name: "Pet Followers",
    emoji: "🐾",
    items: ["pet_baby_dragon", "pet_tztok_jad", "pet_skeleton", "pet_goblin", "pet_olmlet", "pet_chaos_elemental", "pet_venenatis", "pet_callisto"],
  },
];
export const DEFAULT_LEADERBOARD = [
  { rank: 1, playerName: "Zezima", combatLevel: 126, totalLevel: 2277, totalXp: 460000000, bossKills: 1450, raidsCompleted: 320, cluesSolved: 450 },
  { rank: 2, playerName: "Woox", combatLevel: 126, totalLevel: 2277, totalXp: 420000000, bossKills: 2800, raidsCompleted: 850, cluesSolved: 210 },
  { rank: 3, playerName: "Lynx Titan", combatLevel: 126, totalLevel: 2277, totalXp: 500000000, bossKills: 920, raidsCompleted: 180, cluesSolved: 110 },
  { rank: 4, playerName: "Bonis", combatLevel: 124, totalLevel: 2150, totalXp: 280000000, bossKills: 650, raidsCompleted: 140, cluesSolved: 310 },
  { rank: 5, playerName: "BarrowsKing", combatLevel: 115, totalLevel: 1980, totalXp: 150000000, bossKills: 1200, raidsCompleted: 95, cluesSolved: 190 },
];

// === Thieving Targets ===
export const THIEVING_TARGETS = [
  { id: "man", name: "Village Man", reqLevel: 1, xpAward: 8, failDamage: 1, emoji: "🧔", lootTable: [{ itemId: "coins", qtyMin: 3, qtyMax: 12, chance: 1.0 }] },
  { id: "farmer", name: "Master Farmer", reqLevel: 38, xpAward: 43, failDamage: 3, emoji: "👨‍🌾", lootTable: [{ itemId: "ranarr_seed", qtyMin: 1, qtyMax: 1, chance: 0.15 }, { itemId: "watermelon_seed", qtyMin: 1, qtyMax: 3, chance: 0.4 }] },
  { id: "knight", name: "Ardougne Knight", reqLevel: 55, xpAward: 84, failDamage: 4, emoji: "🛡️", lootTable: [{ itemId: "coins", qtyMin: 50, qtyMax: 150, chance: 1.0 }] },
  { id: "gem_stall", name: "Market Gem Stall", reqLevel: 75, xpAward: 160, failDamage: 5, emoji: "💎", lootTable: [{ itemId: "stolen_gem", qtyMin: 1, qtyMax: 2, chance: 1.0 }, { itemId: "uncut_dragonstone", qtyMin: 1, qtyMax: 1, chance: 0.1 }] },
];

// === Production Recipes ===
export const CRAFTING_RECIPES = [
  { id: "craft_green_body", name: "Green D'hide Body", skillName: "Crafting" as const, reqLevel: 63, xp: 186, emoji: "🥋", inputs: [{ itemId: "green_dragonhide", qty: 3 }], outputItemId: "green_dhide_body", outputQty: 1 },
  { id: "craft_black_body", name: "Black D'hide Body", skillName: "Crafting" as const, reqLevel: 84, xp: 258, emoji: "🥋", inputs: [{ itemId: "black_dhide", qty: 3 }], outputItemId: "black_dhide_body", outputQty: 1 },
];

export const FLETCHING_RECIPES = [
  { id: "fletch_yew_shortbow", name: "Yew Shortbow", skillName: "Fletching" as const, reqLevel: 65, xp: 135, emoji: "🏹", inputs: [{ itemId: "unstrung_yew_bow", qty: 1 }, { itemId: "bow_string", qty: 1 }], outputItemId: "yew_shortbow", outputQty: 1 },
];


