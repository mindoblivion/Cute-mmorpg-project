import type { ZoneDefinition, ZoneTileType, ZoneEntitySpawn } from "../types";

function key(x: number, y: number): string { return `${x},${y}`; }

function createTutorialIsland(): ZoneDefinition {
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < 20; x++) {
    for (let y = 0; y < 20; y++) {
      if (x === 0 || x === 19 || y === 0 || y === 19) {
        customTiles.set(key(x, y), "WATER");
        blocked.add(key(x, y));
      } else {
        customTiles.set(key(x, y), "GRASS");
      }
    }
  }
  // Cobblestone path
  for (let y = 8; y <= 15; y++) customTiles.set(key(9, y), "PATH_COBBLE");
  for (let x = 6; x <= 14; x++) customTiles.set(key(x, 12), "PATH_COBBLE");
  // Water fishing area
  for (let y = 8; y <= 12; y++) {
    customTiles.set(key(16, y), "WATER"); customTiles.set(key(17, y), "WATER");
    blocked.add(key(16, y)); blocked.add(key(17, y));
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "tut_guide", entityType: "npc_guide", name: "Starter Isle Guide", emoji: "🧙", tileX: 9, tileY: 12, examineText: "Teaches newcomers how to play.", isNpc: true },
    { id: "tut_combat", entityType: "npc_combat_tutor", name: "Combat Instructor", emoji: "⚔️", tileX: 6, tileY: 8, examineText: "Teaches combat.", isNpc: true },
    { id: "tut_mining", entityType: "npc_mining_tutor", name: "Mining & Smithing Tutor", emoji: "⛏️", tileX: 5, tileY: 12, examineText: "Teaches Mining and Smithing.", isNpc: true },
    { id: "tut_fishing", entityType: "npc_fishing_tutor", name: "Fishing & Cooking Tutor", emoji: "🎣", tileX: 14, tileY: 12, examineText: "Teaches Fishing and Cooking.", isNpc: true },
    { id: "tut_banker", entityType: "npc_banker", name: "Banker", emoji: "🧑‍💼", tileX: 10, tileY: 14, examineText: "A helpful banker.", isNpc: true },
    { id: "tut_bank_booth", entityType: "bank_booth", name: "Bank Booth", emoji: "🏦", tileX: 10, tileY: 13, examineText: "A secure bank booth.", isInteractiveObject: true, isBlocked: true },
    { id: "tut_tree_1", entityType: "tree", name: "Tree", emoji: "🌲", tileX: 13, tileY: 12, examineText: "A healthy tree.", isResource: true, isBlocked: true },
    { id: "tut_tree_2", entityType: "tree", name: "Tree", emoji: "🌲", tileX: 14, tileY: 13, examineText: "A standard tree.", isResource: true, isBlocked: true },
    { id: "tut_fish_spot", entityType: "net_spot", name: "Fishing Spot", emoji: "🐟", tileX: 15, tileY: 10, examineText: "Shrimps and anchovies swim here.", isResource: true },
    { id: "tut_cooking_range", entityType: "cooking_range", name: "Cooking Range", emoji: "🍳", tileX: 12, tileY: 10, examineText: "A warm stove for cooking.", isInteractiveObject: true, isBlocked: true },
    { id: "tut_copper_rock", entityType: "copper_rock", name: "Copper Rock", emoji: "🪨", tileX: 5, tileY: 13, examineText: "A rock vein rich in copper.", isResource: true, isBlocked: true },
    { id: "tut_tin_rock", entityType: "tin_rock", name: "Tin Rock", emoji: "🪨", tileX: 4, tileY: 13, examineText: "A rock vein containing tin.", isResource: true, isBlocked: true },
    { id: "tut_furnace", entityType: "furnace", name: "Furnace", emoji: "🔥", tileX: 6, tileY: 11, examineText: "A furnace for smelting.", isInteractiveObject: true, isBlocked: true },
    { id: "tut_anvil", entityType: "anvil", name: "Anvil", emoji: "⚒️", tileX: 7, tileY: 12, examineText: "An anvil for smithing.", isInteractiveObject: true, isBlocked: true },
    { id: "tut_rat_1", entityType: "giant_rat", name: "Giant rat", emoji: "🐀", tileX: 5, tileY: 8, examineText: "A vicious rodent.", combatLevel: 3, wanderRadius: 2, isCombatNpc: true },
    { id: "tut_chicken_1", entityType: "chicken", name: "Chicken", emoji: "🐔", tileX: 12, tileY: 14, examineText: "A feathery bird.", combatLevel: 1, wanderRadius: 2, isCombatNpc: true },
    { id: "tut_altar", entityType: "altar", name: "Altar", emoji: "✨", tileX: 13, tileY: 5, examineText: "Pray here to recharge prayer.", isInteractiveObject: true, isBlocked: true },
    { id: "tut_dock", entityType: "dock_landmark", name: "Departure Dock", emoji: "⛵", tileX: 9, tileY: 17, examineText: "Take the ferry to the mainland.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "tutorial_island", name: "Starter Isle", width: 20, height: 20,
    spawnTileX: 9, spawnTileY: 12, musicTrack: "Newbie Melody",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createBrindleMainland(): ZoneDefinition {
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();
  const width = 40, height = 40;

  for (let x = 0; x < width; x++)
    for (let y = 0; y < height; y++)
      customTiles.set(key(x, y), "GRASS");

  // Borders
  for (let x = 0; x < width; x++) { blocked.add(key(x, 0)); blocked.add(key(x, height - 1)); }
  for (let y = 0; y < height; y++) { blocked.add(key(0, y)); blocked.add(key(width - 1, y)); }

  // Roads
  for (let y = 5; y <= 28; y++) { customTiles.set(key(19, y), "PATH_COBBLE"); customTiles.set(key(20, y), "PATH_COBBLE"); customTiles.set(key(21, y), "PATH_COBBLE"); }
  for (let x = 10; x <= 32; x++) { customTiles.set(key(x, 19), "PATH_COBBLE"); customTiles.set(key(x, 20), "PATH_COBBLE"); customTiles.set(key(x, 21), "PATH_COBBLE"); }
  for (let x = 17; x <= 23; x++) for (let y = 17; y <= 23; y++) customTiles.set(key(x, y), "PATH_COBBLE");

  // River
  for (let x = 33; x <= 36; x++)
    for (let y = 0; y < height; y++) {
      if (y >= 19 && y <= 21 && x >= 33 && x <= 36) { customTiles.set(key(x, y), "BRIDGE"); }
      else { customTiles.set(key(x, y), "WATER"); blocked.add(key(x, y)); }
    }

  // Graveyard area in the Northwest
  for (let x = 4; x <= 9; x++)
    for (let y = 4; y <= 10; y++) {
      customTiles.set(key(x, y), "DIRT");
    }

  // Buildings
  function buildHouse(sx: number, sy: number, w: number, h: number, dx: number, dy: number) {
    for (let x = sx; x < sx + w; x++)
      for (let y = sy; y < sy + h; y++) {
        const isPer = x === sx || x === sx + w - 1 || y === sy || y === sy + h - 1;
        if (isPer) {
          if (x === dx && y === dy) { customTiles.set(key(x, y), "FLOOR_WOOD"); }
          else { customTiles.set(key(x, y), "WALL_STONE"); blocked.add(key(x, y)); }
        } else { customTiles.set(key(x, y), "FLOOR_WOOD"); }
      }
  }
  buildHouse(23, 14, 5, 5, 23, 17); // Bank
  buildHouse(13, 14, 5, 5, 17, 17); // Kitchen
  buildHouse(13, 22, 5, 5, 17, 23); // General Store
  buildHouse(23, 22, 5, 5, 23, 23); // Weapon Shop
  buildHouse(13, 8, 5, 5, 15, 12); // Church
  buildHouse(23, 8, 5, 5, 25, 12); // Champions Guildhall

  // Cow pasture
  for (let x = 9; x <= 17; x++) { customTiles.set(key(x, 30), "FENCE"); blocked.add(key(x, 30)); customTiles.set(key(x, 37), "FENCE"); blocked.add(key(x, 37)); }
  for (let y = 30; y <= 37; y++) { customTiles.set(key(9, y), "FENCE"); blocked.add(key(9, y)); customTiles.set(key(17, y), "FENCE"); blocked.add(key(17, y)); }
  customTiles.set(key(17, 33), "PATH_COBBLE"); blocked.delete(key(17, 33));

  // Chicken coop
  for (let x = 23; x <= 29; x++) { customTiles.set(key(x, 30), "FENCE"); blocked.add(key(x, 30)); customTiles.set(key(x, 35), "FENCE"); blocked.add(key(x, 35)); }
  for (let y = 30; y <= 35; y++) { customTiles.set(key(23, y), "FENCE"); blocked.add(key(23, y)); customTiles.set(key(29, y), "FENCE"); blocked.add(key(29, y)); }
  customTiles.set(key(23, 32), "PATH_COBBLE"); blocked.delete(key(23, 32));

  // Town wall south
  for (let x = 1; x <= 32; x++) { if (x < 19 || x > 21) { customTiles.set(key(x, 28), "WALL_STONE"); blocked.add(key(x, 28)); } }

  const spawns: ZoneEntitySpawn[] = [
    { id: "brindle_fountain", entityType: "fountain", name: "Plaza Fountain", emoji: "⛲", tileX: 20, tileY: 20, examineText: "A decorative stone fountain.", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_banker", entityType: "npc_banker", name: "Banker", emoji: "🧑‍💼", tileX: 25, tileY: 16, examineText: "A trustworthy banker.", isNpc: true },
    { id: "brindle_ge_clerk", entityType: "npc_ge_clerk", name: "Grand Exchange Clerk", emoji: "⚖️", tileX: 21, tileY: 16, examineText: "Operates the global market trading board.", isNpc: true },
    { id: "brindle_captain_ned", entityType: "npc_captain_ned", name: "Captain Ned", emoji: "👨‍✈️", tileX: 32, tileY: 9, examineText: "Experienced sea captain who offers the Dragon Slayer voyage to Crandor Isle!", isNpc: true },
    { id: "brindle_clan_clerk", entityType: "npc_clan_clerk", name: "Clan Registrar", emoji: "📜", tileX: 27, tileY: 8, examineText: "Registers new Clan Charters and manages Clan Guild Halls.", isNpc: true },
    { id: "brindle_seed_master", entityType: "npc_seed_master", name: "Seed Master Martin", emoji: "🌾", tileX: 11, tileY: 8, examineText: "Sells seeds, compost, plant cure, and grants access to the Farming Guild.", isNpc: true },
    { id: "brindle_bank_booth_1", entityType: "bank_booth", name: "Bank Booth", emoji: "🏦", tileX: 24, tileY: 15, examineText: "A secure bank counter.", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_bank_booth_2", entityType: "bank_booth", name: "Bank Booth", emoji: "🏦", tileX: 26, tileY: 15, examineText: "A secure bank counter.", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_cook", entityType: "npc_cook", name: "Head Cook", emoji: "👨‍🍳", tileX: 15, tileY: 16, examineText: "The head chef of Brindle. Has a quest!", isNpc: true },
    { id: "brindle_kitchen_range", entityType: "cooking_range", name: "Cook's Range", emoji: "🍳", tileX: 14, tileY: 15, examineText: "A top-tier culinary range.", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_flour_bin", entityType: "flour_bin", name: "Flour Dispenser", emoji: "🌾", tileX: 14, tileY: 16, examineText: "Collect fine Top-quality Flour for the Cook.", isInteractiveObject: true },
    // Farming & Agriculture
    { id: "farming_herb_patch", entityType: "farming_herb_patch", name: "Herb Farming Patch", emoji: "🌱", tileX: 10, tileY: 10, examineText: "A fertile farming patch for growing medicinal herbs.", isInteractiveObject: true },
    { id: "farming_tree_patch", entityType: "farming_tree_patch", name: "Tree Farming Patch", emoji: "🌳", tileX: 10, tileY: 6, examineText: "A large soil plot for cultivating Magic and Oak trees.", isInteractiveObject: true },
    { id: "npc_leprechaun", entityType: "npc_leprechaun", name: "Tool Leprechaun", emoji: "🧝", tileX: 11, tileY: 9, examineText: "Provides farming tools and advice on crop cultivation.", isNpc: true },
    // Slayer Master
    { id: "npc_slayer_master", entityType: "npc_slayer_master", name: "Slayer Master Vannaka", emoji: "🗡️", tileX: 26, tileY: 9, examineText: "Assigns dangerous monster hunting bounties and trades Slayer rewards.", isNpc: true },
    // Agility Master Grace & Rooftop Wall
    { id: "npc_grace", entityType: "npc_grace", name: "Grace (Agility Master)", emoji: "🏃", tileX: 13, tileY: 15, examineText: "Exchanges Marks of Grace for lightweight Graceful outfits.", isNpc: true },
    { id: "brindle_agility_start", entityType: "agility_start_wall", name: "Rough Wall (Agility)", emoji: "🧗", tileX: 12, tileY: 14, examineText: "Climb the rough wall to begin the Brindle Rooftop Agility Course!", isInteractiveObject: true },
    // Housing & Raids & Wilderness Portals
    { id: "house_portal_mainland", entityType: "house_portal", name: "House Portal", emoji: "🏠", tileX: 8, tileY: 20, examineText: "Enter your Player-Owned House (POH)!", isInteractiveObject: true, isBlocked: true },
    { id: "raid_cox_portal", entityType: "raid_portal", name: "Chambers of Xeric Portal", emoji: "🐉", tileX: 34, tileY: 28, examineText: "Form a raid expedition and face Tekton, Mutadile, and the Great Olm!", isInteractiveObject: true, isBlocked: true },
    { id: "raid_tob_portal", entityType: "tob_portal", name: "Theatre of Blood Portal", emoji: "🩸", tileX: 32, tileY: 28, examineText: "Enter Morytania's sanguinary raid against Verzik Vitur!", isInteractiveObject: true, isBlocked: true },
    { id: "barrows_crypt_portal", entityType: "barrows_portal", name: "Barrows Crypts Mound Portal", emoji: "⚰️", tileX: 6, tileY: 28, examineText: "Descend into the tombs of the 6 Barrows Brothers!", isInteractiveObject: true, isBlocked: true },
    { id: "gwd_entrance_portal", entityType: "gwd_portal", name: "God Wars Dungeon Entrance", emoji: "⚔️", tileX: 2, tileY: 28, examineText: "Enter the frozen battleground of General Graardor & Commander Zilyana!", isInteractiveObject: true, isBlocked: true },
    { id: "wilderness_ditch", entityType: "wilderness_ditch", name: "Wilderness Ditch", emoji: "🚧", tileX: 20, tileY: 2, examineText: "Cross into Deep Wilderness (High-Risk PvP & Wilderness Bosses)!", isInteractiveObject: true },
    // Minigame & Crypt Portals
    { id: "tzhaar_arena_portal", entityType: "tzhaar_portal", name: "TzHaar Fight Caves Portal", emoji: "🌋", tileX: 29, tileY: 28, examineText: "Step into the TzHaar Wave Survival Arena for the Fire Cape!", isInteractiveObject: true, isBlocked: true },
    { id: "slayer_dungeon_portal", entityType: "slayer_dungeon_portal", name: "Slayer Dungeon Cave", emoji: "🕳️", tileX: 4, tileY: 28, examineText: "Enter the depths of the Slayer Crypt (Bloodvelds & Dark Beasts).", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_general_shopkeeper", entityType: "npc_shopkeeper_general", name: "Shopkeeper", emoji: "🏪", tileX: 15, tileY: 24, examineText: "Runs the General Store.", isNpc: true },
    { id: "brindle_weapon_shopkeeper", entityType: "npc_shopkeeper_weapons", name: "Guildmaster Brian", emoji: "⚔️", tileX: 25, tileY: 24, examineText: "Sells weaponry and offers the legendary Dragon Slayer quest!", isNpc: true },
    { id: "brindle_furnace", entityType: "furnace", name: "Furnace", emoji: "🔥", tileX: 26, tileY: 23, examineText: "A roaring town furnace.", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_anvil", entityType: "anvil", name: "Anvil", emoji: "⚒️", tileX: 27, tileY: 24, examineText: "A heavy iron anvil.", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_altar", entityType: "altar", name: "Altar of Eldara", emoji: "✨", tileX: 15, tileY: 9, examineText: "Pray here to recharge prayer.", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_priest", entityType: "npc_priest", name: "Father Joshua", emoji: "👴", tileX: 14, tileY: 9, examineText: "Priest of the Church. Has a quest about a Restless Ghost!", isNpc: true },
    { id: "brindle_ghost", entityType: "npc_ghost", name: "Restless Spirit", emoji: "👻", tileX: 6, tileY: 8, examineText: "A translucent spirit wandering among the graves.", isNpc: true },
    { id: "crypt_entrance", entityType: "crypt_entrance", name: "Graveyard Crypt", emoji: "🕳️", tileX: 7, tileY: 5, examineText: "Descend into the Restless Crypt (Skeleton Warlord Boss).", isInteractiveObject: true, isBlocked: true },
    { id: "crandor_ferry_dock", entityType: "crandor_ferry", name: "Crandor Expedition Ship", emoji: "⛵", tileX: 33, tileY: 9, examineText: "Sail to the Crandor Volcano Crypt (Elvarg Boss).", isInteractiveObject: true, isBlocked: true },
    { id: "brindle_town_guard", entityType: "npc_town_guard", name: "Town Guard", emoji: "💂", tileX: 20, tileY: 28, examineText: "A vigilant town watchman.", isNpc: true },
    // Trees
    { id: "tree_n1", entityType: "tree", name: "Tree", emoji: "🌲", tileX: 16, tileY: 5, examineText: "An ordinary tree.", isResource: true, isBlocked: true },
    { id: "tree_n2", entityType: "tree", name: "Tree", emoji: "🌲", tileX: 19, tileY: 4, examineText: "An ordinary tree.", isResource: true, isBlocked: true },
    { id: "tree_oak1", entityType: "oak_tree", name: "Oak Tree", emoji: "🌳", tileX: 22, tileY: 4, examineText: "A sturdy oak tree.", isResource: true, isBlocked: true },
    { id: "tree_oak2", entityType: "oak_tree", name: "Oak Tree", emoji: "🌳", tileX: 25, tileY: 5, examineText: "A sturdy oak tree.", isResource: true, isBlocked: true },
    // Mining rocks
    { id: "rock_iron1", entityType: "iron_rock", name: "Iron Rock", emoji: "🪨", tileX: 11, tileY: 4, examineText: "A rich vein of iron ore.", isResource: true, isBlocked: true },
    { id: "rock_iron2", entityType: "iron_rock", name: "Iron Rock", emoji: "🪨", tileX: 29, tileY: 4, examineText: "A rich vein of iron ore.", isResource: true, isBlocked: true },
    // Fishing spots
    { id: "brindle_fish_net_1", entityType: "net_spot", name: "Net Fishing Spot", emoji: "🐟", tileX: 33, tileY: 16, examineText: "Fresh shrimps and anchovies.", isResource: true },
    { id: "brindle_fish_fly_1", entityType: "fly_fishing_spot", name: "Fly Fishing Spot", emoji: "🎣", tileX: 33, tileY: 24, examineText: "River trout and salmon!", isResource: true },
    // Cows & Milk
    { id: "cow_1", entityType: "cow", name: "Dairy Cow", emoji: "🐄", tileX: 12, tileY: 32, examineText: "A dairy cow. Click to milk Fresh Milk!", combatLevel: 2, wanderRadius: 2, isCombatNpc: true },
    { id: "cow_2", entityType: "cow", name: "Dairy Cow", emoji: "🐄", tileX: 15, tileY: 33, examineText: "A dairy cow. Click to milk Fresh Milk!", combatLevel: 2, wanderRadius: 2, isCombatNpc: true },
    // Chickens & Eggs
    { id: "chicken_1", entityType: "chicken", name: "Hen", emoji: "🐔", tileX: 24, tileY: 31, examineText: "A laying hen. Spawns Super-fresh Eggs!", combatLevel: 1, wanderRadius: 1, isCombatNpc: true },
    { id: "egg_nest", entityType: "egg_nest", name: "Egg Nest", emoji: "🪺", tileX: 27, tileY: 31, examineText: "Collect a Super-fresh Egg.", isInteractiveObject: true },
    // Goblins & South Cave
    { id: "goblin_1", entityType: "goblin", name: "Goblin", emoji: "🧌", tileX: 19, tileY: 36, examineText: "An ugly goblin scout.", combatLevel: 5, wanderRadius: 2, isCombatNpc: true },
    { id: "goblin_2", entityType: "goblin", name: "Goblin", emoji: "🧌", tileX: 22, tileY: 36, examineText: "A grumpy green goblin.", combatLevel: 5, wanderRadius: 2, isCombatNpc: true },
    { id: "grimjaw_cave_entrance", entityType: "grimjaw_cave_entrance", name: "Grimjaw's Lair", emoji: "🕳️", tileX: 21, tileY: 38, examineText: "Enter Grimjaw's Lair (Goblin Warlord Boss).", isInteractiveObject: true, isBlocked: true },
    // Villagers
    { id: "brindle_villager_1", entityType: "npc_villager", name: "Brindle Villager", emoji: "🧑", tileX: 19, tileY: 19, examineText: "A citizen of Brindle.", wanderRadius: 3, isNpc: true, chatterLines: ["Did you hear the Chef is preparing a royal banquet?", "The graveyard crypt has been cursed recently..."] },
    { id: "brindle_villager_2", entityType: "npc_villager", name: "Brindle Villager", emoji: "👩", tileX: 21, tileY: 21, examineText: "A local townsperson.", wanderRadius: 3, isNpc: true, chatterLines: ["Only true heroes dare venture to Crandor to slay Elvarg!", "Equip an Anti-Dragon shield before facing dragons!"] },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "brindle_mainland", name: "Brindle (Mainland)", width, height,
    spawnTileX: 20, spawnTileY: 21, musicTrack: "Harmony",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createGrimjawLair(): ZoneDefinition {
  const width = 25, height = 25;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++)
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "WATER"); blocked.add(key(x, y));
      } else if (x >= 3 && x <= 21 && y >= 3 && y <= 21) {
        customTiles.set(key(x, y), "PATH_COBBLE");
      } else {
        customTiles.set(key(x, y), "DIRT");
      }
    }

  const spawns: ZoneEntitySpawn[] = [
    { id: "boss_grimjaw_1", entityType: "boss_grimjaw", name: "Grimjaw, the Goblin Warlord", emoji: "👺", tileX: 12, tileY: 10, examineText: "The fearsome Goblin Warlord.", combatLevel: 45, wanderRadius: 2, isCombatNpc: true },
    { id: "grimjaw_exit_ladder", entityType: "cave_exit", name: "Cave Exit", emoji: "🪜", tileX: 12, tileY: 22, examineText: "Climb to exit Grimjaw's Lair.", isInteractiveObject: true, isBlocked: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "grimjaw_lair", name: "Grimjaw's Lair", width, height,
    spawnTileX: 12, spawnTileY: 21, musicTrack: "Warpath",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createSkeletonCrypt(): ZoneDefinition {
  const width = 24, height = 24;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "WALL_STONE");
        blocked.add(key(x, y));
      } else if (x >= 4 && x <= 19 && y >= 4 && y <= 19) {
        customTiles.set(key(x, y), "FLOOR_STONE");
      } else {
        customTiles.set(key(x, y), "DIRT");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "boss_malakor_1", entityType: "boss_malakor", name: "Malakor, the Skeletal Warlord", emoji: "💀", tileX: 12, tileY: 9, examineText: "Ancient fallen warlord cursed to guard the crypt.", combatLevel: 35, wanderRadius: 2, isCombatNpc: true },
    { id: "crypt_skel_1", entityType: "skeleton", name: "Restless Skeleton", emoji: "💀", tileX: 9, tileY: 12, examineText: "A crypt guardian.", combatLevel: 22, wanderRadius: 2, isCombatNpc: true },
    { id: "crypt_skel_2", entityType: "skeleton", name: "Restless Skeleton", emoji: "💀", tileX: 15, tileY: 12, examineText: "A crypt guardian.", combatLevel: 22, wanderRadius: 2, isCombatNpc: true },
    { id: "crypt_altar_skull", entityType: "crypt_altar", name: "Dark Skull Altar", emoji: "✨", tileX: 12, tileY: 6, examineText: "Contains the stolen Golden Skull of the restless spirit.", isInteractiveObject: true, isBlocked: true },
    { id: "crypt_exit_ladder", entityType: "crypt_exit", name: "Crypt Ladder", emoji: "🪜", tileX: 12, tileY: 20, examineText: "Climb up to the Graveyard.", isInteractiveObject: true, isBlocked: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "skeleton_crypt", name: "Restless Graveyard Crypt", width, height,
    spawnTileX: 12, spawnTileY: 19, musicTrack: "Spooky",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createDragonCrypt(): ZoneDefinition {
  const width = 28, height = 28;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "LAVA");
        blocked.add(key(x, y));
      } else if ((x <= 2 || x >= 25 || y <= 2 || y >= 25) && Math.random() < 0.4) {
        customTiles.set(key(x, y), "LAVA");
        blocked.add(key(x, y));
      } else if (x >= 5 && x <= 22 && y >= 5 && y <= 22) {
        customTiles.set(key(x, y), "AUTUMN_DIRT");
      } else {
        customTiles.set(key(x, y), "DIRT");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "boss_elvarg_1", entityType: "boss_elvarg", name: "Elvarg the Green Dragon", emoji: "🐲", tileX: 14, tileY: 10, examineText: "The legendary fire-breathing dragon of Crandor!", combatLevel: 83, wanderRadius: 3, isCombatNpc: true },
    { id: "dragon_exit_portal", entityType: "dragon_exit", name: "Escape Portal", emoji: "🌀", tileX: 14, tileY: 24, examineText: "Teleport safely back to Brindle Harbor.", isInteractiveObject: true, isBlocked: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "dragon_crypt", name: "Crandor Dragon Crypt", width, height,
    spawnTileX: 14, spawnTileY: 23, musicTrack: "Dragonfire",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createTzhaarFightCaves(): ZoneDefinition {
  const width = 26, height = 26;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "LAVA");
        blocked.add(key(x, y));
      } else if ((x <= 2 || x >= 23 || y <= 2 || y >= 23) && (x + y) % 2 === 0) {
        customTiles.set(key(x, y), "LAVA");
        blocked.add(key(x, y));
      } else if (x >= 4 && x <= 21 && y >= 4 && y <= 21) {
        customTiles.set(key(x, y), "FLOOR_STONE");
      } else {
        customTiles.set(key(x, y), "DIRT");
      }
    }
  }

  // Four defensive obsidian pillars in corners for Jad lure/safespotting!
  const pillars = [
    { x: 7, y: 7 }, { x: 18, y: 7 },
    { x: 7, y: 18 }, { x: 18, y: 18 },
  ];
  for (const p of pillars) {
    customTiles.set(key(p.x, p.y), "WALL_STONE");
    blocked.add(key(p.x, p.y));
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "tzhaar_master", entityType: "npc_tzhaar_master", name: "TzHaar-Mej-Jal", emoji: "🌋", tileX: 13, tileY: 20, examineText: "Coordinator of the Fight Caves survival waves and Tokkul rewards.", isNpc: true },
    { id: "tzhaar_exit_portal", entityType: "tzhaar_exit", name: "Cave Exit Portal", emoji: "🌀", tileX: 13, tileY: 23, examineText: "Exit the TzHaar Fight Caves.", isInteractiveObject: true, isBlocked: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "tzhaar_fight_caves", name: "TzHaar Fight Caves", width, height,
    spawnTileX: 13, spawnTileY: 21, musicTrack: "Inferno",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createSlayerCrypt(): ZoneDefinition {
  const width = 26, height = 26;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "WALL_STONE");
        blocked.add(key(x, y));
      } else if (x >= 4 && x <= 21 && y >= 4 && y <= 21) {
        customTiles.set(key(x, y), "FLOOR_STONE");
      } else {
        customTiles.set(key(x, y), "SWAMP_MUCK");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "slayer_bloodveld_1", entityType: "bloodveld", name: "Mutated Bloodveld", emoji: "👅", tileX: 9, tileY: 9, examineText: "A disgusting mutated blood beast.", combatLevel: 76, wanderRadius: 3, isCombatNpc: true },
    { id: "slayer_bloodveld_2", entityType: "bloodveld", name: "Mutated Bloodveld", emoji: "👅", tileX: 16, tileY: 9, examineText: "A disgusting mutated blood beast.", combatLevel: 76, wanderRadius: 3, isCombatNpc: true },
    { id: "slayer_darkbeast_1", entityType: "dark_beast", name: "Dark Beast", emoji: "🐂", tileX: 13, tileY: 14, examineText: "A ferocious predator from the underworld.", combatLevel: 182, wanderRadius: 3, isCombatNpc: true },
    { id: "slayer_crypt_exit", entityType: "slayer_exit", name: "Crypt Exit Ladder", emoji: "🪜", tileX: 13, tileY: 22, examineText: "Climb out of the Slayer Crypt.", isInteractiveObject: true, isBlocked: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "slayer_crypt", name: "Slayer Dungeon", width, height,
    spawnTileX: 13, spawnTileY: 21, musicTrack: "Warpath",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createPlayerHouse(): ZoneDefinition {
  const width = 24, height = 24;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "FENCE");
        blocked.add(key(x, y));
      } else if (x >= 4 && x <= 19 && y >= 4 && y <= 19) {
        customTiles.set(key(x, y), "FLOOR_WOOD");
      } else {
        customTiles.set(key(x, y), "GRASS");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "poh_exit_portal", entityType: "house_exit_portal", name: "House Exit Portal", emoji: "🌀", tileX: 12, tileY: 20, examineText: "Exit your house to Brindle Mainland.", isInteractiveObject: true, isBlocked: true },
    { id: "poh_estate_agent", entityType: "npc_estate_agent", name: "Estate Butler", emoji: "🤵", tileX: 10, tileY: 18, examineText: "Helps you construct rooms and manage your estate furniture.", isNpc: true },
    { id: "poh_altar_chapel", entityType: "poh_altar", name: "Sacred Chapel Altar", emoji: "✨", tileX: 12, tileY: 6, examineText: "Offer bones here for massive bonus Prayer XP!", isInteractiveObject: true, isBlocked: true },
    { id: "poh_portal_mainland", entityType: "poh_teleport_portal", name: "Mainland Nexus Portal", emoji: "🔮", tileX: 6, tileY: 8, examineText: "Teleport to Brindle Town.", isInteractiveObject: true, isBlocked: true },
    { id: "poh_combat_dummy", entityType: "poh_dummy", name: "Undead Combat Dummy", emoji: "🎯", tileX: 18, tileY: 8, examineText: "Attack to test weapon hits and recharge special attack energy!", isCombatNpc: true, combatLevel: 1 },
    { id: "poh_pet_menagerie", entityType: "poh_menagerie_bed", name: "Pet Menagerie Cushion", emoji: "🛋️", tileX: 16, tileY: 16, examineText: "Manage your pet collection and house companions.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "player_house", name: "Player-Owned House", width, height,
    spawnTileX: 12, spawnTileY: 18, musicTrack: "HomeSweetHome",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createChambersOfXeric(): ZoneDefinition {
  const width = 28, height = 28;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "WALL_STONE");
        blocked.add(key(x, y));
      } else if (x >= 4 && x <= 23 && y >= 4 && y <= 23) {
        customTiles.set(key(x, y), "FLOOR_STONE");
      } else {
        customTiles.set(key(x, y), "LAVA");
      }
    }
  }

  // Tactical raid pillars for avoiding Olm lightning and Tekton meteors
  const pillars = [{ x: 8, y: 8 }, { x: 19, y: 8 }, { x: 8, y: 19 }, { x: 19, y: 19 }];
  for (const p of pillars) {
    customTiles.set(key(p.x, p.y), "WALL_STONE");
    blocked.add(key(p.x, p.y));
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "cox_tekton", entityType: "boss_tekton", name: "Tekton the Obsidian Smith", emoji: "🔨", tileX: 14, tileY: 9, examineText: "The Chamber 1 guardian!", combatLevel: 650, wanderRadius: 2, isCombatNpc: true },
    { id: "cox_mutadile", entityType: "boss_mutadile", name: "Mutadile & Tree of Life", emoji: "🐊", tileX: 14, tileY: 13, examineText: "The Chamber 2 guardian!", combatLevel: 580, wanderRadius: 2, isCombatNpc: true },
    { id: "cox_olm", entityType: "boss_olm", name: "The Great Olm", emoji: "🐉", tileX: 14, tileY: 6, examineText: "The final ancient Dragon Wurm of the Chambers of Xeric!", combatLevel: 1043, wanderRadius: 1, isCombatNpc: true },
    { id: "cox_chest_reward", entityType: "cox_reward_chest", name: "Chambers of Xeric Reward Chest", emoji: "💎", tileX: 14, tileY: 22, examineText: "Search your raid spoils (Twisted Bow, Elder Maul, Ancestral)!", isInteractiveObject: true, isBlocked: true },
    { id: "cox_exit_portal", entityType: "cox_exit", name: "Raid Exit Portal", emoji: "🌀", tileX: 14, tileY: 24, examineText: "Exit the Chambers of Xeric.", isInteractiveObject: true, isBlocked: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "chambers_of_xeric", name: "Chambers of Xeric", width, height,
    spawnTileX: 14, spawnTileY: 22, musicTrack: "ChambersOfXeric",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createDeepWilderness(): ZoneDefinition {
  const width = 32, height = 32;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "LAVA");
        blocked.add(key(x, y));
      } else if (y >= 26) {
        customTiles.set(key(x, y), "DIRT"); // Safe border near ditch
      } else {
        customTiles.set(key(x, y), "AUTUMN_DIRT"); // Scorched Wilderness
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "wildy_chaos_ele", entityType: "boss_chaos_elemental", name: "Chaos Elemental (Lvl 50 Wildy)", emoji: "🌌", tileX: 16, tileY: 6, examineText: "Floating cosmic terror of the deep wilderness.", combatLevel: 305, wanderRadius: 3, isCombatNpc: true },
    { id: "wildy_venenatis", entityType: "boss_venenatis", name: "Venenatis (Lvl 38 Wildy)", emoji: "🕷️", tileX: 24, tileY: 12, examineText: "Giant deadly spider queen.", combatLevel: 464, wanderRadius: 3, isCombatNpc: true },
    { id: "wildy_callisto", entityType: "boss_callisto", name: "Callisto (Lvl 42 Wildy)", emoji: "🐻", tileX: 8, tileY: 12, examineText: "Ancient raging elder bear.", combatLevel: 470, wanderRadius: 3, isCombatNpc: true },
    { id: "wildy_mage_arena_kolodion", entityType: "npc_kolodion", name: "Kolodion (Mage Arena II)", emoji: "🧙", tileX: 16, tileY: 16, examineText: "Imbues God Capes and teaches sacred God Spells.", isNpc: true },
    { id: "wildy_return_ditch", entityType: "wildy_return_ditch", name: "Wilderness Ditch (Return to Safety)", emoji: "🚧", tileX: 16, tileY: 30, examineText: "Step south to return safely to Brindle Mainland.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "deep_wilderness", name: "Deep Wilderness (PvP Area)", width, height,
    spawnTileX: 16, spawnTileY: 28, musicTrack: "Wilderness",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createCrandorIsle(): ZoneDefinition {
  const width = 24, height = 24;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "LAVA");
        blocked.add(key(x, y));
      } else if (x >= 8 && x <= 16 && y >= 8 && y <= 16) {
        customTiles.set(key(x, y), "LAVA");
      } else {
        customTiles.set(key(x, y), "AUTUMN_DIRT");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "elvarg_dragon", entityType: "boss_elvarg", name: "Elvarg the Green Dragon", emoji: "🐉", tileX: 12, tileY: 12, examineText: "The legendary dragon of Crandor Isle!", combatLevel: 280, wanderRadius: 2, isCombatNpc: true },
    { id: "crandor_return_ship", entityType: "crandor_return_ship", name: "Lady Lumbridge Ship (Return to Port)", emoji: "⛵", tileX: 12, tileY: 22, examineText: "Board Captain Ned's ship to return to Brindle Port.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "crandor_isle", name: "Crandor Volcanic Isle", width, height,
    spawnTileX: 12, spawnTileY: 20, musicTrack: "Dragonfire",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createFarmingGuild(): ZoneDefinition {
  const width = 20, height = 20;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "FENCE");
        blocked.add(key(x, y));
      } else {
        customTiles.set(key(x, y), "DIRT");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "guild_herb_patch_1", entityType: "farming_herb_patch", name: "Guild Herb Patch 1", emoji: "🌱", tileX: 5, tileY: 5, examineText: "High-yield disease-free herb plot.", isInteractiveObject: true },
    { id: "guild_herb_patch_2", entityType: "farming_herb_patch", name: "Guild Herb Patch 2", emoji: "🌱", tileX: 14, tileY: 5, examineText: "High-yield disease-free herb plot.", isInteractiveObject: true },
    { id: "guild_allotment_1", entityType: "farming_allotment_patch", name: "Guild Allotment Plot (Watermelons)", emoji: "🍉", tileX: 5, tileY: 12, examineText: "Allotment plot for watermelons and snape grass.", isInteractiveObject: true },
    { id: "guild_tree_1", entityType: "farming_tree_patch", name: "Guild Fruit Tree Plot (Papaya Trees)", emoji: "🥭", tileX: 14, tileY: 12, examineText: "Tree patch for papayas and palm trees.", isInteractiveObject: true },
    { id: "compost_bin", entityType: "compost_bin", name: "Supercompost Bin", emoji: "🟤", tileX: 10, tileY: 8, examineText: "Deposit weeds and pine ash to make Supercompost!", isInteractiveObject: true },
    { id: "guild_exit_portal", entityType: "guild_exit", name: "Guild Exit Gate", emoji: "🚪", tileX: 10, tileY: 18, examineText: "Return to Brindle Mainland.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "farming_guild", name: "Farming Guild Sanctuary", width, height,
    spawnTileX: 10, spawnTileY: 16, musicTrack: "Garden",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createClanHall(): ZoneDefinition {
  const width = 18, height = 18;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "WALL_WOOD");
        blocked.add(key(x, y));
      } else {
        customTiles.set(key(x, y), "FLOOR_WOOD");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "clan_banner", entityType: "clan_banner", name: "Clan Grand Banner", emoji: "🚩", tileX: 9, tileY: 4, examineText: "Your registered Clan Crest and Motto!", isInteractiveObject: true },
    { id: "clan_bank_chest", entityType: "clan_bank_chest", name: "Shared Clan Coffer", emoji: "🪙", tileX: 9, tileY: 9, examineText: "Shared bank storage for clan members.", isInteractiveObject: true },
    { id: "clan_exit_door", entityType: "clan_exit", name: "Guild Hall Exit Door", emoji: "🚪", tileX: 9, tileY: 16, examineText: "Exit Clan Guild Hall.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "clan_hall", name: "Clan Guild Hall", width, height,
    spawnTileX: 9, spawnTileY: 14, musicTrack: "Harmony",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createBarrowsCrypts(): ZoneDefinition {
  const width = 24, height = 24;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "WALL_STONE");
        blocked.add(key(x, y));
      } else {
        customTiles.set(key(x, y), "FLOOR_STONE");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "barrows_chest", entityType: "barrows_chest", name: "Barrows Rewards Chest", emoji: "⚰️", tileX: 12, tileY: 12, examineText: "Open to claim Barrows armor and death runes!", isInteractiveObject: true, isBlocked: true },
    { id: "barrows_exit", entityType: "barrows_exit", name: "Crypt Stairs Exit", emoji: "🪜", tileX: 12, tileY: 22, examineText: "Exit the Barrows Crypts.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "barrows_crypts", name: "Barrows Crypts", width, height,
    spawnTileX: 12, spawnTileY: 20, musicTrack: "Spooky",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createTheatreOfBlood(): ZoneDefinition {
  const width = 24, height = 24;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "WALL_STONE");
        blocked.add(key(x, y));
      } else {
        customTiles.set(key(x, y), "FLOOR_STONE");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "tob_verzik", entityType: "boss_verzik", name: "Verzik Vitur", emoji: "🩸", tileX: 12, tileY: 8, examineText: "Sanguine queen of the Theatre of Blood!", combatLevel: 1040, wanderRadius: 1, isCombatNpc: true },
    { id: "tob_chest", entityType: "tob_chest", name: "Theatre Sanguine Chest", emoji: "🎁", tileX: 12, tileY: 18, examineText: "Contains Scythe of Vitur, Sanguinesti Staff, Avernic Defender!", isInteractiveObject: true, isBlocked: true },
    { id: "tob_exit", entityType: "tob_exit", name: "Theatre Portal Exit", emoji: "🌀", tileX: 12, tileY: 22, examineText: "Exit Theatre of Blood.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "theatre_of_blood", name: "Theatre of Blood (ToB)", width, height,
    spawnTileX: 12, spawnTileY: 20, musicTrack: "Warpath",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

function createGodWarsDungeon(): ZoneDefinition {
  const width = 28, height = 28;
  const blocked = new Set<string>();
  const customTiles = new Map<string, ZoneTileType>();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        customTiles.set(key(x, y), "WALL_STONE");
        blocked.add(key(x, y));
      } else {
        customTiles.set(key(x, y), "FLOOR_STONE");
      }
    }
  }

  const spawns: ZoneEntitySpawn[] = [
    { id: "gwd_graardor", entityType: "boss_graardor", name: "General Graardor", emoji: "🛡️", tileX: 8, tileY: 8, examineText: "Bandos High Warlord!", combatLevel: 624, wanderRadius: 2, isCombatNpc: true },
    { id: "gwd_zilyana", entityType: "boss_zilyana", name: "Commander Zilyana", emoji: "⚔️", tileX: 20, tileY: 8, examineText: "Saradomin High Commander!", combatLevel: 596, wanderRadius: 2, isCombatNpc: true },
    { id: "gwd_exit", entityType: "gwd_exit", name: "GWD Exit Portal", emoji: "🌀", tileX: 14, tileY: 25, examineText: "Exit God Wars Dungeon.", isInteractiveObject: true },
  ];
  spawns.filter(s => s.isBlocked).forEach(s => blocked.add(key(s.tileX, s.tileY)));

  return {
    id: "god_wars_dungeon", name: "God Wars Dungeon (GWD)", width, height,
    spawnTileX: 14, spawnTileY: 22, musicTrack: "Warpath",
    blockedTiles: blocked, customTileMap: customTiles, entities: spawns,
  };
}

export const ZONES: Record<string, ZoneDefinition> = {
  tutorial_island: createTutorialIsland(),
  brindle_mainland: createBrindleMainland(),
  grimjaw_lair: createGrimjawLair(),
  skeleton_crypt: createSkeletonCrypt(),
  dragon_crypt: createDragonCrypt(),
  tzhaar_fight_caves: createTzhaarFightCaves(),
  slayer_crypt: createSlayerCrypt(),
  player_house: createPlayerHouse(),
  chambers_of_xeric: createChambersOfXeric(),
  deep_wilderness: createDeepWilderness(),
  crandor_isle: createCrandorIsle(),
  farming_guild: createFarmingGuild(),
  clan_hall: createClanHall(),
  barrows_crypts: createBarrowsCrypts(),
  theatre_of_blood: createTheatreOfBlood(),
  god_wars_dungeon: createGodWarsDungeon(),
};



export function getZone(id: string): ZoneDefinition {
  return ZONES[id] ?? ZONES["brindle_mainland"];
}
