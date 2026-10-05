import type { ItemDefinition, EquipmentSlot, ItemTier } from "../types";

function item(
  id: string, name: string, examine: string, tier: ItemTier, value: number,
  opts: Partial<ItemDefinition> = {}
): ItemDefinition {
  return { id, name, examine, tier, value, iconEmoji: opts.iconEmoji ?? "❓", ...opts };
}

export const ITEMS: Record<string, ItemDefinition> = {};

function register(def: ItemDefinition) {
  ITEMS[def.id] = def;
}

// Currencies
register(item("coins", "Coins", "Lovely money!", "COMMON", 1, { isStackable: true, iconEmoji: "🪙" }));
register(item("blood_money", "Bounty Tokens", "A dark currency from slaying bosses.", "RARE", 150000, { isStackable: true, iconEmoji: "🪙" }));

// Runes
register(item("air_rune", "Air rune", "One of the 4 basic elemental Runes.", "COMMON", 4, { isStackable: true, iconEmoji: "💨" }));
register(item("mind_rune", "Mind rune", "Used for basic combat magic.", "COMMON", 3, { isStackable: true, iconEmoji: "🧠" }));
register(item("water_rune", "Water rune", "One of the 4 basic elemental Runes.", "COMMON", 4, { isStackable: true, iconEmoji: "💧" }));
register(item("earth_rune", "Earth rune", "One of the 4 basic elemental Runes.", "COMMON", 4, { isStackable: true, iconEmoji: "🪨" }));
register(item("fire_rune", "Fire rune", "One of the 4 basic elemental Runes.", "COMMON", 4, { isStackable: true, iconEmoji: "🔥" }));
register(item("chaos_rune", "Chaos rune", "Used for medium-level combat magic.", "UNCOMMON", 100, { isStackable: true, iconEmoji: "🌀" }));
register(item("nature_rune", "Nature rune", "Used for alchemy and transmutation.", "UNCOMMON", 180, { isStackable: true, iconEmoji: "🌿" }));
register(item("law_rune", "Law rune", "Used for teleportation magic.", "UNCOMMON", 200, { isStackable: true, iconEmoji: "⚖️" }));
register(item("death_rune", "Death rune", "A powerful catalyst of necrotic death magic.", "UNCOMMON", 240, { isStackable: true, iconEmoji: "💀" }));
register(item("blood_rune", "Blood rune", "The dark essence of ancient blood magic.", "RARE", 450, { isStackable: true, iconEmoji: "🩸" }));

// Bones & Drops
register(item("bones", "Bones", "Bones are for burying.", "COMMON", 10, { prayerXp: 4.5, iconEmoji: "🦴" }));
register(item("big_bones", "Big bones", "Bones are for burying.", "COMMON", 120, { prayerXp: 15.0, iconEmoji: "🦴" }));
register(item("bat_bones", "Bat bones", "Bones from a bat.", "COMMON", 35, { prayerXp: 5.3, iconEmoji: "🦴" }));
register(item("dragon_bones", "Dragon bones", "Bones of a fearsome dragon.", "RARE", 2500, { prayerXp: 72.0, iconEmoji: "🦴" }));
register(item("green_dragonhide", "Green dragonhide", "Tough, fire-resistant dragon scales.", "UNCOMMON", 1500, { iconEmoji: "🐉" }));

// Food - Raw
register(item("raw_chicken", "Raw chicken", "I should cook this before eating it.", "COMMON", 30, { iconEmoji: "🍗" }));
register(item("raw_beef", "Raw beef", "I should cook this before eating it.", "COMMON", 35, { iconEmoji: "🥩" }));
register(item("raw_rat_meat", "Raw rat meat", "A piece of raw meat from a rat.", "COMMON", 5, { iconEmoji: "🍖" }));
register(item("raw_shrimp", "Raw Shrimps", "Freshly caught raw shrimps.", "COMMON", 12, { iconEmoji: "🦐" }));
register(item("raw_anchovies", "Raw Anchovies", "Freshly caught raw anchovies.", "COMMON", 25, { iconEmoji: "🐟" }));
register(item("raw_trout", "Raw Trout", "Freshly caught raw trout.", "COMMON", 50, { iconEmoji: "🐟" }));
register(item("raw_salmon", "Raw Salmon", "Freshly caught raw salmon.", "COMMON", 85, { iconEmoji: "🐟" }));

// Food - Cooked
register(item("cooked_chicken", "Cooked chicken", "A piece of nicely cooked chicken.", "COMMON", 60, { isConsumable: true, healAmount: 3, iconEmoji: "🍗" }));
register(item("cooked_beef", "Cooked meat", "A nicely cooked piece of beef.", "COMMON", 60, { isConsumable: true, healAmount: 3, iconEmoji: "🥩" }));
register(item("cooked_rat_meat", "Cooked meat", "A piece of cooked meat.", "COMMON", 20, { isConsumable: true, healAmount: 3, iconEmoji: "🍖" }));
register(item("shrimps", "Shrimps", "Some cooked shrimps.", "COMMON", 15, { isConsumable: true, healAmount: 3, iconEmoji: "🦐" }));
register(item("trout", "Trout", "Some cooked trout.", "COMMON", 60, { isConsumable: true, healAmount: 7, iconEmoji: "🐟" }));
register(item("salmon", "Salmon", "Some cooked salmon.", "COMMON", 100, { isConsumable: true, healAmount: 9, iconEmoji: "🐟" }));
register(item("cooked_shark", "Shark", "Freshly cooked shark. Restores 20 Hitpoints.", "COMMON", 1800, { isConsumable: true, healAmount: 20, iconEmoji: "🦈" }));
register(item("bread", "Bread", "Freshly baked bread.", "COMMON", 12, { isConsumable: true, healAmount: 5, iconEmoji: "🍞" }));
register(item("burnt_fish", "Burnt Fish", "Some burnt fish.", "COMMON", 0, { iconEmoji: "🐟" }));

// Potions
register(item("prayer_potion_4", "Prayer potion(4)", "Restores prayer points.", "UNCOMMON", 8000, { isConsumable: true, prayerRestore: 30, iconEmoji: "🧪" }));
register(item("super_combat_potion", "Super Battle Potion (4)", "Boosts combat stats.", "RARE", 24000, { isConsumable: true, boostStat: "COMBAT", iconEmoji: "⚗️" }));

// Materials & Quest Ingredients
register(item("feathers", "Feather", "Stackable feathers for fly fishing.", "COMMON", 5, { isStackable: true, iconEmoji: "🪶" }));
register(item("cowhide", "Cowhide", "The hide of a cow.", "COMMON", 150, { iconEmoji: "📜" }));
register(item("leather", "Leather", "Tanned leather hide.", "COMMON", 20, { iconEmoji: "📜" }));
register(item("logs", "Logs", "A bundle of standard logs.", "COMMON", 10, { iconEmoji: "🪵" }));
register(item("oak_logs", "Oak Logs", "Logs cut from an oak tree.", "COMMON", 40, { iconEmoji: "🪵" }));
register(item("willow_logs", "Willow Logs", "Logs cut from a willow tree.", "COMMON", 80, { iconEmoji: "🪵" }));
register(item("copper_ore", "Copper Ore", "A chunk of unrefined copper ore.", "COMMON", 15, { iconEmoji: "🪨" }));
register(item("tin_ore", "Tin Ore", "A chunk of unrefined tin ore.", "COMMON", 15, { iconEmoji: "🪨" }));
register(item("iron_ore", "Iron Ore", "A chunk of unrefined iron ore.", "COMMON", 45, { iconEmoji: "🪨" }));
register(item("coal_ore", "Coal", "A lump of coal.", "COMMON", 120, { iconEmoji: "🪨" }));
register(item("bronze_bar", "Bronze bar", "A bar of smelted bronze.", "COMMON", 30, { iconEmoji: "🥉" }));
register(item("iron_bar", "Iron bar", "A bar of smelted iron.", "COMMON", 80, { iconEmoji: "⚪" }));
register(item("steel_bar", "Steel bar", "A bar of smelted steel.", "COMMON", 250, { iconEmoji: "🔩" }));
register(item("tinderbox", "Tinderbox", "Used to light fires.", "COMMON", 50, { iconEmoji: "🔥" }));
register(item("hammer", "Hammer", "A hammer for smithing.", "COMMON", 10, { iconEmoji: "🔨" }));
register(item("knife", "Knife", "A sharp knife for fletching.", "COMMON", 10, { iconEmoji: "🔪" }));
register(item("bucket", "Bucket", "An empty wooden bucket for collecting milk.", "COMMON", 10, { iconEmoji: "🪣" }));
register(item("pot", "Pot", "An empty ceramic pot for collecting flour.", "COMMON", 10, { iconEmoji: "🏺" }));

// Quest Items
register(item("top_quality_flour", "Top-quality Flour", "Extra fine milled flour for the Chef's feast.", "UNCOMMON", 100, { iconEmoji: "🌾" }));
register(item("super_fresh_egg", "Super-fresh Egg", "A pristine fresh egg from the chicken coop.", "UNCOMMON", 100, { iconEmoji: "🥚" }));
register(item("fresh_milk", "Fresh Milk", "A bucket of creamy milk fresh from the dairy cow.", "UNCOMMON", 100, { iconEmoji: "🥛" }));
register(item("ghostspeak_amulet", "Ghostspeak Amulet", "Allows clear communication with restless spirits.", "RARE", 5000, { slot: "AMULET", prayerBonus: 2, iconEmoji: "🧿" }));
register(item("golden_skull", "Golden Skull", "The stolen sacred skull of the restless spirit.", "RARE", 15000, { iconEmoji: "💀" }));
register(item("draconic_visage", "Draconic Visage", "A legendary dragon skeletal faceplate.", "LEGENDARY", 25000000, { iconEmoji: "🐲" }));

// Tools
register(item("bronze_axe", "Bronze axe", "A basic woodcutting axe.", "COMMON", 100, { slot: "WEAPON", attackBonus: 3, strengthBonus: 3, levelRequirement: 1, iconEmoji: "🪓" }));
register(item("iron_axe", "Iron axe", "An iron woodcutting axe.", "COMMON", 500, { slot: "WEAPON", attackBonus: 5, strengthBonus: 4, levelRequirement: 1, iconEmoji: "🪓" }));
register(item("steel_axe", "Steel axe", "A steel woodcutting axe.", "COMMON", 1200, { slot: "WEAPON", attackBonus: 9, strengthBonus: 7, levelRequirement: 5, skillRequirement: "Attack", iconEmoji: "🪓" }));
register(item("bronze_pickaxe", "Bronze pickaxe", "A basic mining pickaxe.", "COMMON", 100, { slot: "WEAPON", attackBonus: 2, strengthBonus: 2, levelRequirement: 1, iconEmoji: "⛏️" }));
register(item("iron_pickaxe", "Iron pickaxe", "An iron mining pickaxe.", "COMMON", 500, { slot: "WEAPON", attackBonus: 4, strengthBonus: 3, levelRequirement: 1, iconEmoji: "⛏️" }));
register(item("steel_pickaxe", "Steel pickaxe", "A steel mining pickaxe.", "COMMON", 1200, { slot: "WEAPON", attackBonus: 8, strengthBonus: 6, levelRequirement: 5, skillRequirement: "Attack", iconEmoji: "⛏️" }));
register(item("small_fishing_net", "Small Fishing Net", "A small net for catching shrimps.", "COMMON", 100, { iconEmoji: "🕸️" }));
register(item("fly_fishing_rod", "Fly Fishing Rod", "A fishing rod for fly fishing.", "COMMON", 500, { iconEmoji: "🎣" }));

// Weapons - Bronze & Iron
register(item("bronze_dagger", "Bronze dagger", "A short bronze dagger.", "COMMON", 10, { slot: "WEAPON", attackBonus: 4, attackStab: 4, attackSlash: 2, strengthBonus: 3, attackSpeedTicks: 4, levelRequirement: 1, skillRequirement: "Attack", iconEmoji: "🗡️" }));
register(item("bronze_sword", "Bronze sword", "A razor sharp bronze sword.", "COMMON", 26, { slot: "WEAPON", attackBonus: 6, attackStab: 5, attackSlash: 6, strengthBonus: 5, attackSpeedTicks: 4, levelRequirement: 1, skillRequirement: "Attack", iconEmoji: "🗡️" }));
register(item("bronze_scimitar", "Bronze scimitar", "A vicious curved bronze sword.", "COMMON", 32, { slot: "WEAPON", attackBonus: 7, attackSlash: 7, attackStab: 1, strengthBonus: 6, attackSpeedTicks: 4, levelRequirement: 1, skillRequirement: "Attack", iconEmoji: "🗡️" }));
register(item("iron_scimitar", "Iron scimitar", "A vicious curved iron sword.", "COMMON", 112, { slot: "WEAPON", attackBonus: 10, attackSlash: 10, attackStab: 2, strengthBonus: 9, attackSpeedTicks: 4, levelRequirement: 1, skillRequirement: "Attack", iconEmoji: "⚔️" }));
register(item("steel_scimitar", "Steel scimitar", "A vicious curved steel sword.", "COMMON", 400, { slot: "WEAPON", attackBonus: 15, attackSlash: 15, attackStab: 3, strengthBonus: 14, attackSpeedTicks: 4, levelRequirement: 5, skillRequirement: "Attack", iconEmoji: "⚔️" }));
register(item("iron_dagger", "Iron dagger", "A short iron dagger.", "COMMON", 35, { slot: "WEAPON", attackBonus: 7, attackStab: 7, attackSlash: 3, strengthBonus: 5, attackSpeedTicks: 4, levelRequirement: 1, skillRequirement: "Attack", iconEmoji: "🗡️" }));
register(item("shortbow", "Shortbow", "A short wooden bow.", "COMMON", 50, { slot: "WEAPON", levelRequirement: 1, skillRequirement: "Ranged", attackRanged: 8, attackSpeedTicks: 4, iconEmoji: "🏹" }));
register(item("magic_shortbow", "Magic Shortbow", "Carved from mystical magic wood.", "UNCOMMON", 3500, { slot: "WEAPON", levelRequirement: 20, skillRequirement: "Ranged", attackRanged: 35, rangedStrengthBonus: 20, attackSpeedTicks: 3, specialAttackCost: 55, specialAttackName: "Snap Shot", specialAttackDescription: "Fires two swift arrows in a single tick!", iconEmoji: "🏹" }));
register(item("staff_basic", "Staff", "A basic wooden staff.", "COMMON", 15, { slot: "WEAPON", attackMagic: 4, attackSpeedTicks: 5, iconEmoji: "🦯" }));

// High-tier weapons with Special Attacks
register(item("granite_maul", "Granite Maul", "A hefty two-handed warhammer carved from solid granite.", "RARE", 75000, { slot: "WEAPON", attackCrush: 55, strengthBonus: 58, attackSpeedTicks: 5, specialAttackCost: 50, specialAttackName: "Quick Smash", specialAttackDescription: "Instantly delivers a crushing blow with +10% strength!", iconEmoji: "🔨" }));
register(item("dragon_scimitar", "Dragon Scimitar", "A legendary scimitar forged in the heart of Ape Atoll.", "RARE", 100000, { slot: "WEAPON", attackSlash: 45, attackStab: 8, strengthBonus: 44, attackSpeedTicks: 4, specialAttackCost: 55, specialAttackName: "Sever", specialAttackDescription: "Strikes with +25% accuracy and pierces through enemy defenses!", iconEmoji: "🗡️" }));
register(item("dragon_dagger_p", "Dragon Dagger (p++)", "A deadly poisoned dragon dagger.", "UNCOMMON", 120000, { slot: "WEAPON", attackStab: 40, attackSlash: 25, strengthBonus: 40, attackSpeedTicks: 4, specialAttackCost: 25, specialAttackName: "Puncture", specialAttackDescription: "Attacks twice rapidly with +15% accuracy and +15% max damage!", iconEmoji: "🗡️" }));
register(item("abyssal_whip_blood", "Abyssal Whip (Blood)", "A barbed spine whip pulsing with abyssal fury.", "RARE", 3500000, { slot: "WEAPON", attackSlash: 88, strengthBonus: 84, attackSpeedTicks: 4, specialAttackCost: 50, specialAttackName: "Energy Drain", specialAttackDescription: "Attacks with +25% accuracy and restores player run energy!", iconEmoji: "🪢" }));
register(item("armadyl_godsword", "Armadyl Godsword", "A heavy holy two-handed blade.", "LEGENDARY", 25000000, { slot: "WEAPON", attackSlash: 132, attackCrush: 80, strengthBonus: 132, prayerBonus: 8, attackSpeedTicks: 6, specialAttackCost: 50, specialAttackName: "The Judgement", specialAttackDescription: "Unleashes holy wrath with +25% accuracy and +37.5% maximum damage!", iconEmoji: "⚡" }));
register(item("ancient_godsword", "Ancient Godsword", "A terrifying blade dedicated to Zaros.", "LEGENDARY", 45000000, { slot: "WEAPON", attackSlash: 132, attackCrush: 80, strengthBonus: 136, prayerBonus: 8, attackSpeedTicks: 6, specialAttackCost: 50, specialAttackName: "Blood Sacrifice", specialAttackDescription: "Strikes for immense damage and siphons health back to the wielder!", iconEmoji: "⚔️" }));

// Shields & Anti-Dragon
register(item("anti_dragon_shield", "Anti-Dragon Shield", "An ancient enchanted shield designed to absorb incinerating dragon breath.", "UNCOMMON", 5000, { slot: "SHIELD", defenceBonus: 12, defenceMelee: 12, defenceMagic: 15, iconEmoji: "🛡️" }));

// Armor - Bronze & Iron & Steel
register(item("bronze_full_helm", "Bronze full helm", "A full bronze helmet.", "COMMON", 44, { slot: "HEAD", defenceBonus: 5, defenceMelee: 5, levelRequirement: 1, iconEmoji: "🪖" }));
register(item("bronze_platebody", "Bronze platebody", "Provides good protection.", "COMMON", 160, { slot: "BODY", defenceBonus: 15, defenceMelee: 15, levelRequirement: 1, iconEmoji: "🛡️" }));
register(item("bronze_platelegs", "Bronze platelegs", "These look pretty protective.", "COMMON", 80, { slot: "LEGS", defenceBonus: 8, defenceMelee: 8, levelRequirement: 1, iconEmoji: "👖" }));
register(item("bronze_kiteshield", "Bronze kiteshield", "A large bronze shield.", "COMMON", 68, { slot: "SHIELD", defenceBonus: 6, defenceMelee: 6, levelRequirement: 1, iconEmoji: "🛡️" }));
register(item("iron_full_helm", "Iron full helm", "A full iron helmet.", "COMMON", 150, { slot: "HEAD", defenceBonus: 7, defenceMelee: 7, levelRequirement: 1, iconEmoji: "🪖" }));
register(item("iron_platebody", "Iron platebody", "Provides good protection.", "COMMON", 560, { slot: "BODY", defenceBonus: 21, defenceMelee: 21, levelRequirement: 1, iconEmoji: "🛡️" }));
register(item("iron_platelegs", "Iron platelegs", "These look pretty protective.", "COMMON", 280, { slot: "LEGS", defenceBonus: 11, defenceMelee: 11, levelRequirement: 1, iconEmoji: "👖" }));
register(item("iron_kiteshield", "Iron kiteshield", "A large iron shield.", "COMMON", 238, { slot: "SHIELD", defenceBonus: 9, defenceMelee: 9, levelRequirement: 1, iconEmoji: "🛡️" }));
register(item("steel_full_helm", "Steel full helm", "A full steel helmet.", "COMMON", 480, { slot: "HEAD", defenceBonus: 11, defenceMelee: 11, levelRequirement: 5, iconEmoji: "🪖" }));
register(item("steel_platebody", "Steel platebody", "Provides excellent protection.", "COMMON", 1400, { slot: "BODY", defenceBonus: 32, defenceMelee: 32, levelRequirement: 5, iconEmoji: "🛡️" }));
register(item("steel_platelegs", "Steel platelegs", "These look pretty protective.", "COMMON", 800, { slot: "LEGS", defenceBonus: 18, defenceMelee: 18, levelRequirement: 5, iconEmoji: "👖" }));
register(item("steel_kiteshield", "Steel kiteshield", "A large steel shield.", "COMMON", 650, { slot: "SHIELD", defenceBonus: 15, defenceMelee: 15, levelRequirement: 5, iconEmoji: "🛡️" }));

// Dragon Armor
register(item("dragon_full_helm", "Dragon Full Helm", "A magnificent helmet forged from Orikalkum.", "RARE", 250000, { slot: "HEAD", defenceBonus: 25, defenceMelee: 25, defenceRanged: 22, levelRequirement: 25, skillRequirement: "Defence", iconEmoji: "🪖" }));
register(item("dragon_platebody", "Dragon Platebody", "A prestigious suit of crimson dragon armor.", "RARE", 750000, { slot: "BODY", defenceBonus: 65, defenceMelee: 65, defenceRanged: 58, levelRequirement: 25, skillRequirement: "Defence", iconEmoji: "🛡️" }));
register(item("dragon_platelegs", "Dragon Platelegs", "Reinforced dragon metal greaves.", "RARE", 400000, { slot: "LEGS", defenceBonus: 40, defenceMelee: 40, defenceRanged: 35, levelRequirement: 25, skillRequirement: "Defence", iconEmoji: "👖" }));

// Leather / Wizard
register(item("leather_gloves", "Leather gloves", "A pair of thin leather gloves.", "COMMON", 6, { slot: "GLOVES", defenceBonus: 2, defenceMelee: 2, levelRequirement: 1, iconEmoji: "🧤" }));
register(item("leather_boots", "Leather boots", "A pair of comfortable leather boots.", "COMMON", 6, { slot: "BOOTS", defenceBonus: 1, defenceMelee: 1, levelRequirement: 1, iconEmoji: "👢" }));
register(item("leather_cowl", "Leather cowl", "A snug leather hood.", "COMMON", 24, { slot: "HEAD", defenceBonus: 3, defenceMelee: 3, defenceRanged: 3, levelRequirement: 1, iconEmoji: "🪖" }));
register(item("leather_body", "Leather body", "A sturdy leather torso piece.", "COMMON", 52, { slot: "BODY", defenceBonus: 8, defenceMelee: 8, defenceRanged: 8, levelRequirement: 1, iconEmoji: "🥋" }));
register(item("leather_chaps", "Leather chaps", "A pair of flexible leather leggings.", "COMMON", 40, { slot: "LEGS", defenceBonus: 4, defenceMelee: 4, defenceRanged: 4, levelRequirement: 1, iconEmoji: "👖" }));
register(item("wizard_hat", "Wizard hat", "A pointy blue wizard hat.", "COMMON", 15, { slot: "HEAD", attackMagic: 2, defenceMagic: 2, iconEmoji: "🧙" }));
register(item("wizard_robe_top", "Wizard robe top", "A blue wizard robe top.", "COMMON", 50, { slot: "BODY", attackMagic: 6, defenceMagic: 6, iconEmoji: "🧥" }));
register(item("wizard_robe_bottom", "Wizard robe skirt", "A blue wizard robe skirt.", "COMMON", 40, { slot: "LEGS", attackMagic: 4, defenceMagic: 4, iconEmoji: "👗" }));

// Arrows
register(item("bronze_arrow", "Bronze arrow", "Arrows with bronze tips.", "COMMON", 3, { isStackable: true, slot: "AMMO", rangedStrengthBonus: 7, levelRequirement: 1, iconEmoji: "🎯" }));
register(item("iron_arrow", "Iron arrow", "Arrows with iron tips.", "COMMON", 8, { isStackable: true, slot: "AMMO", rangedStrengthBonus: 10, levelRequirement: 1, iconEmoji: "🎯" }));

// Farming Seeds & Tools
register(item("rake", "Rake", "Used to clear weeds from farming patches.", "COMMON", 15, { iconEmoji: "🧹" }));
register(item("seed_dibber", "Seed Dibber", "Used to plant seeds in patch soil.", "COMMON", 15, { iconEmoji: "🌱" }));
register(item("watering_can", "Watering Can", "Contains water for nourishing crops.", "COMMON", 25, { iconEmoji: "🚿" }));
register(item("ranarr_seed", "Ranarr Seed", "Plant in an herb patch to grow Ranarr herbs.", "UNCOMMON", 25000, { isSeed: true, levelRequirement: 32, farmingXp: 30.5, iconEmoji: "🌱" }));
register(item("toadflax_seed", "Toadflax Seed", "Plant in an herb patch to grow Toadflax.", "UNCOMMON", 8000, { isSeed: true, levelRequirement: 38, farmingXp: 40.0, iconEmoji: "🌱" }));
register(item("torstol_seed", "Torstol Seed", "Plant in an herb patch to grow legendary Torstol.", "RARE", 75000, { isSeed: true, levelRequirement: 85, farmingXp: 199.5, iconEmoji: "🌱" }));
register(item("magic_seed", "Magic Tree Seed", "Plant in a tree patch to cultivate a mystical Magic Tree.", "RARE", 120000, { isSeed: true, levelRequirement: 75, farmingXp: 500.0, iconEmoji: "🌰" }));

// Herbs (Grimy & Clean)
register(item("grimy_ranarr", "Grimy Ranarr Weed", "A grimy herb. Clean to reveal pure Ranarr.", "UNCOMMON", 8500, { isHerb: true, herbloreXp: 7.5, levelRequirement: 32, iconEmoji: "🌿" }));
register(item("clean_ranarr", "Clean Ranarr Weed", "A freshly cleaned potent medicinal herb.", "UNCOMMON", 9200, { isHerb: true, levelRequirement: 32, iconEmoji: "🍃" }));
register(item("grimy_toadflax", "Grimy Toadflax", "A grimy herb. Clean to reveal Toadflax.", "UNCOMMON", 3200, { isHerb: true, herbloreXp: 8.0, levelRequirement: 38, iconEmoji: "🌿" }));
register(item("clean_toadflax", "Clean Toadflax", "A freshly cleaned soothing herb.", "UNCOMMON", 3800, { isHerb: true, levelRequirement: 38, iconEmoji: "🍃" }));
register(item("grimy_torstol", "Grimy Torstol", "A grimy legendary herb. Clean to reveal Torstol.", "RARE", 35000, { isHerb: true, herbloreXp: 15.0, levelRequirement: 85, iconEmoji: "🌿" }));
register(item("clean_torstol", "Clean Torstol", "The purest and rarest of all known herbs.", "RARE", 40000, { isHerb: true, levelRequirement: 85, iconEmoji: "🍃" }));

// Herblore Secondaries & Materials
register(item("vial_of_water", "Vial of Water", "A glass vial filled with crystal clear water.", "COMMON", 10, { isStackable: true, iconEmoji: "🧪" }));
register(item("eye_of_newt", "Eye of Newt", "A popular potion secondary ingredient.", "COMMON", 15, { isStackable: true, iconEmoji: "👁️" }));
register(item("limpwurt_root", "Limpwurt Root", "A strong root used in strength potions.", "COMMON", 150, { isStackable: true, iconEmoji: "🥕" }));
register(item("crushed_nest", "Crushed Bird Nest", "Finely crushed bird nest powder for brews.", "UNCOMMON", 2500, { isStackable: true, iconEmoji: "🪺" }));
register(item("magic_logs", "Magic Logs", "Logs infused with pulsating arcane energy.", "RARE", 1500, { iconEmoji: "🪵" }));

// Extended Potions
register(item("super_attack_potion", "Super Attack (4)", "Boosts Attack by +5 above your current level!", "UNCOMMON", 6000, { isConsumable: true, boostStat: "ATTACK", iconEmoji: "🧪" }));
register(item("super_strength_potion", "Super Strength (4)", "Boosts Strength by +5 above your current level!", "UNCOMMON", 7500, { isConsumable: true, boostStat: "STRENGTH", iconEmoji: "🧪" }));
register(item("saradomin_brew_4", "Saradomin Brew (4)", "Restores +16 HP and fortifies Defence by +20%!", "RARE", 18000, { isConsumable: true, healAmount: 16, boostStat: "DEFENCE", iconEmoji: "🍵" }));

// Slayer Items
register(item("slayer_gem", "Slayer Gem", "Gives status on your active Slayer monster bounty.", "COMMON", 100, { isConsumable: true, iconEmoji: "💎" }));
register(item("slayer_ring", "Slayer Ring (8)", "Teleports directly to Slayer Masters & dungeons.", "RARE", 25000, { isConsumable: true, iconEmoji: "💍" }));
register(item("herb_sack", "Herb Sack", "Stores up to 400 grimy herbs safely.", "RARE", 500000, { iconEmoji: "🎒" }));
register(item("slayer_helmet", "Slayer Helmet", "Grants +15% damage bonus against assigned Slayer targets!", "RARE", 1250000, { slot: "HEAD", defenceBonus: 30, defenceMelee: 30, defenceRanged: 30, defenceMagic: 30, levelRequirement: 20, skillRequirement: "Defence", iconEmoji: "🪖" }));

// TzHaar Minigame & Tokkul Shop
register(item("tokkul", "Tokkul", "The volcanic obsidian currency of the TzHaar.", "RARE", 10, { isStackable: true, iconEmoji: "🌋" }));
register(item("fire_cape", "Fire Cape", "The legendary mantle of victory from TzTok-Jad in the Fight Caves!", "MYTHIC", 50000000, { slot: "CAPE", strengthBonus: 4, defenceBonus: 11, defenceMelee: 11, defenceRanged: 11, defenceMagic: 11, prayerBonus: 2, iconEmoji: "🔥" }));
register(item("obsidian_cape", "Obsidian Cape", "A thick cape forged from molten volcanic glass.", "RARE", 120000, { slot: "CAPE", defenceBonus: 9, defenceMelee: 9, defenceRanged: 9, defenceMagic: 9, prayerBonus: 1, iconEmoji: "🧣" }));
register(item("obsidian_shield", "Toktz-Ket-Xil (Obsidian Shield)", "An obsidian kiteshield providing great defense and +5 strength.", "RARE", 450000, { slot: "SHIELD", defenceBonus: 42, defenceMelee: 42, strengthBonus: 5, iconEmoji: "🛡️" }));
register(item("tzhaar_ket_om", "TzHaar-Ket-Om (Obsidian Maul)", "A massive volcanic hammer capable of devastating crushed hits!", "RARE", 650000, { slot: "WEAPON", attackCrush: 85, strengthBonus: 85, attackSpeedTicks: 5, levelRequirement: 30, skillRequirement: "Strength", iconEmoji: "🔨" }));

// Pets
register(item("pet_baby_dragon", "Pet Baby Dragon", "A tiny green dragon companion following your footsteps! (Click to summon/dismiss)", "MYTHIC", 10000000, { isPet: true, isConsumable: true, iconEmoji: "🐲" }));
register(item("pet_tztok_jad", "Pet TzTok-Jad", "A miniature lava-spewing Jad following you! (Click to summon/dismiss)", "MYTHIC", 50000000, { isPet: true, isConsumable: true, iconEmoji: "🌋" }));
register(item("pet_skeleton", "Pet Tiny Skeleton", "A cute animated miniature skeleton! (Click to summon/dismiss)", "MYTHIC", 5000000, { isPet: true, isConsumable: true, iconEmoji: "💀" }));
register(item("pet_goblin", "Pet Mini Grimjaw", "A baby goblin warlord cheering you on! (Click to summon/dismiss)", "MYTHIC", 2500000, { isPet: true, isConsumable: true, iconEmoji: "👺" }));
register(item("pet_olmlet", "Pet Olmlet", "A mythical tiny baby Olm from the Chambers of Xeric! (Click to summon/dismiss)", "MYTHIC", 100000000, { isPet: true, isConsumable: true, iconEmoji: "🐉" }));
register(item("pet_chaos_elemental", "Pet Chaos Elemental", "A floating orb of pure chaotic energy! (Click to summon/dismiss)", "MYTHIC", 40000000, { isPet: true, isConsumable: true, iconEmoji: "🌌" }));
register(item("pet_venenatis", "Pet Venenatis Spiderling", "A deadly poisonous baby spider! (Click to summon/dismiss)", "MYTHIC", 45000000, { isPet: true, isConsumable: true, iconEmoji: "🕷️" }));
register(item("pet_callisto", "Pet Callisto Cub", "A ferocious miniature bear cub! (Click to summon/dismiss)", "MYTHIC", 45000000, { isPet: true, isConsumable: true, iconEmoji: "🐻" }));

// === Construction & Housing Materials ===
register(item("saw", "Saw", "Essential tool for cutting wood planks for construction.", "COMMON", 25, { iconEmoji: "🪚" }));
register(item("steel_nails", "Steel Nails", "Sturdy nails used to fasten furniture in player houses.", "COMMON", 5, { isStackable: true, iconEmoji: "📌" }));
register(item("plank_wood", "Wooden Plank", "Standard timber plank for basic housing furniture.", "COMMON", 100, { isStackable: true, iconEmoji: "🪵" }));
register(item("plank_oak", "Oak Plank", "Polished oak plank for crafting parlour chairs and workshop tables.", "UNCOMMON", 350, { isStackable: true, iconEmoji: "🪑" }));
register(item("plank_teak", "Teak Plank", "Hardwood teak plank for portal frames and chapel altars.", "RARE", 950, { isStackable: true, iconEmoji: "🪵" }));
register(item("plank_mahogany", "Mahogany Plank", "Exotic mahogany timber for gilded altars and luxury furniture.", "LEGENDARY", 2200, { isStackable: true, iconEmoji: "🚪" }));
register(item("bolt_of_cloth", "Bolt of Cloth", "Woven fabric for comfortable chairs and canopy beds.", "COMMON", 250, { isStackable: true, iconEmoji: "🧵" }));
register(item("marble_block", "Marble Block", "Solid white marble for grand portal teleports and statue pedestals.", "LEGENDARY", 50000, { iconEmoji: "🏛️" }));
register(item("gold_leaf", "Gold Leaf", "Pure hammered gold sheet for gilding sacred chapel altars.", "LEGENDARY", 130000, { iconEmoji: "✨" }));
register(item("house_teleport_tab", "House Teleport Tablet", "Instantly teleports you directly to your Player-Owned House.", "UNCOMMON", 800, { isConsumable: true, isStackable: true, iconEmoji: "🏠" }));

// === Treasure Trails: Clues, Caskets, & Rewards ===
register(item("clue_scroll_easy", "Clue Scroll (Easy)", "An easy-tier treasure trail scroll. Read to reveal your riddle!", "UNCOMMON", 500, { isConsumable: true, iconEmoji: "📜" }));
register(item("clue_scroll_medium", "Clue Scroll (Medium)", "A medium-tier treasure trail scroll. Follow the hints!", "RARE", 2500, { isConsumable: true, iconEmoji: "📜" }));
register(item("clue_scroll_hard", "Clue Scroll (Hard)", "A challenging treasure trail clue scroll with crypts & bosses.", "LEGENDARY", 15000, { isConsumable: true, iconEmoji: "📜" }));
register(item("clue_scroll_master", "Clue Scroll (Master)", "A masterwork cryptic clue requiring elite mastery!", "MYTHIC", 100000, { isConsumable: true, iconEmoji: "📜" }));

register(item("reward_casket_easy", "Reward Casket (Easy)", "Open for gold, runes, and trimmed cosmetic armors!", "UNCOMMON", 10000, { isConsumable: true, iconEmoji: "🧰" }));
register(item("reward_casket_medium", "Reward Casket (Medium)", "Open for valuable loot and potential Ranger Boots!", "RARE", 75000, { isConsumable: true, iconEmoji: "🧰" }));
register(item("reward_casket_hard", "Reward Casket (Hard)", "Open for God trimmed plates, bows, and 3rd Age relics!", "LEGENDARY", 500000, { isConsumable: true, iconEmoji: "💎" }));
register(item("reward_casket_master", "Reward Casket (Master)", "Open for the rarest 3rd Age artifacts in the game!", "MYTHIC", 5000000, { isConsumable: true, iconEmoji: "👑" }));

// Clue Unique Rewards
register(item("ranger_boots", "Ranger Boots", "The most coveted ranged footwear, granting +8 Ranged attack!", "LEGENDARY", 35000000, { slot: "BOOTS", attackRanged: 8, defenceRanged: 2, iconEmoji: "🥾" }));
register(item("saradomin_rune_plate", "Saradomin Rune Platebody", "A holy blue-trimmed Rune Platebody blessed by Saradomin.", "RARE", 180000, { slot: "BODY", defenceBonus: 82, defenceMelee: 82, prayerBonus: 1, levelRequirement: 40, iconEmoji: "🛡️" }));
register(item("guthix_rune_plate", "Guthix Rune Platebody", "A balanced green-trimmed Rune Platebody blessed by Guthix.", "RARE", 180000, { slot: "BODY", defenceBonus: 82, defenceMelee: 82, prayerBonus: 1, levelRequirement: 40, iconEmoji: "🛡️" }));
register(item("zamorak_rune_plate", "Zamorak Rune Platebody", "A fiery crimson-trimmed Rune Platebody blessed by Zamorak.", "RARE", 180000, { slot: "BODY", defenceBonus: 82, defenceMelee: 82, prayerBonus: 1, levelRequirement: 40, iconEmoji: "🛡️" }));

register(item("third_age_platebody", "3rd Age Platebody", "Ancient ceremonial relic platebody of immense prestige.", "MYTHIC", 150000000, { slot: "BODY", defenceBonus: 95, defenceMelee: 95, defenceRanged: 90, prayerBonus: 3, levelRequirement: 65, iconEmoji: "🥋" }));
register(item("third_age_platelegs", "3rd Age Platelegs", "Ancient ceremonial relic platelegs offering superior defense.", "MYTHIC", 120000000, { slot: "LEGS", defenceBonus: 72, defenceMelee: 72, defenceRanged: 68, prayerBonus: 2, levelRequirement: 65, iconEmoji: "👖" }));
register(item("third_age_full_helmet", "3rd Age Full Helmet", "Ancient warrior's pristine visor helmet.", "MYTHIC", 90000000, { slot: "HEAD", defenceBonus: 40, defenceMelee: 40, prayerBonus: 2, levelRequirement: 65, iconEmoji: "🪖" }));
register(item("third_age_bow", "3rd Age Bow", "Ancient longbow imbued with lost aerodynamic archery arts (+80 Ranged).", "MYTHIC", 200000000, { slot: "WEAPON", attackRanged: 80, rangedStrengthBonus: 65, attackSpeedTicks: 4, levelRequirement: 65, iconEmoji: "🏹" }));

// === Chambers of Xeric Raid Relics ===
register(item("twisted_bow", "Twisted Bow", "The pinnacle of archery. Its power scales massively against high-magic foes!", "MYTHIC", 1200000000, { slot: "WEAPON", attackRanged: 95, rangedStrengthBonus: 88, attackSpeedTicks: 4, levelRequirement: 75, skillRequirement: "Ranged", iconEmoji: "🏹", specialAttackCost: 50, specialAttackName: "Twisted Volley", specialAttackDescription: "Double strike dealing up to 250% damage against magical foes!" }));
register(item("elder_maul", "Elder Maul", "A colossal primordial warhammer with crushing blunt force (+135 Crush).", "MYTHIC", 350000000, { slot: "WEAPON", attackCrush: 135, strengthBonus: 147, attackSpeedTicks: 6, levelRequirement: 75, skillRequirement: "Attack", iconEmoji: "🔨", specialAttackCost: 50, specialAttackName: "Sundering Bash", specialAttackDescription: "Crushes enemy defence by 35% and guarantees a heavy hit." }));
register(item("ancestral_hat", "Ancestral Hat", "Ancient mage hat (+8 Magic Atk, +2% Magic Dmg).", "MYTHIC", 140000000, { slot: "HEAD", attackMagic: 8, magicDamageBonusPercent: 2, defenceMagic: 8, levelRequirement: 75, iconEmoji: "🧙" }));
register(item("ancestral_robe_top", "Ancestral Robe Top", "Pristine mystic robe infused with archaic arcane power (+35 Magic Atk, +4% Magic Dmg).", "MYTHIC", 250000000, { slot: "BODY", attackMagic: 35, magicDamageBonusPercent: 4, defenceMagic: 35, levelRequirement: 75, iconEmoji: "🥋" }));
register(item("ancestral_robe_bottom", "Ancestral Robe Bottom", "Ancient mage robe bottoms (+26 Magic Atk, +3% Magic Dmg).", "MYTHIC", 210000000, { slot: "LEGS", attackMagic: 26, magicDamageBonusPercent: 3, defenceMagic: 26, levelRequirement: 75, iconEmoji: "👖" }));
register(item("dexterous_prayer_scroll", "Dexterous Prayer Scroll", "Teaches the Rigour ranged piety prayer (+20% Ranged Atk & Dmg).", "LEGENDARY", 65000000, { isConsumable: true, iconEmoji: "📜" }));
register(item("arcane_prayer_scroll", "Arcane Prayer Scroll", "Teaches the Augury magic piety prayer (+25% Magic Atk & Def).", "LEGENDARY", 25000000, { isConsumable: true, iconEmoji: "📜" }));

// === Agility & Graceful Weight-Reducing Set ===
register(item("mark_of_grace", "Mark of Grace", "Earned from completing rooftop agility laps. Trade to Grace for outfits!", "UNCOMMON", 1000, { isStackable: true, iconEmoji: "🌟" }));
register(item("graceful_hood", "Graceful Hood", "Lightweight hood that restores run energy 5% faster.", "RARE", 35000, { slot: "HEAD", defenceBonus: 3, iconEmoji: "🪖" }));
register(item("graceful_top", "Graceful Top", "Lightweight tunic that restores run energy 10% faster.", "RARE", 55000, { slot: "BODY", defenceBonus: 5, iconEmoji: "🥋" }));
register(item("graceful_legs", "Graceful Legs", "Lightweight trousers that restore run energy 10% faster.", "RARE", 50000, { slot: "LEGS", defenceBonus: 4, iconEmoji: "👖" }));
register(item("graceful_gloves", "Graceful Gloves", "Lightweight gloves that restore run energy 5% faster.", "RARE", 30000, { slot: "GLOVES", defenceBonus: 2, iconEmoji: "🧤" }));
register(item("graceful_boots", "Graceful Boots", "Lightweight featherweight boots that restore run energy 5% faster.", "RARE", 35000, { slot: "BOOTS", defenceBonus: 2, iconEmoji: "🥾" }));
register(item("graceful_cape", "Graceful Cape", "Aerodynamic cape that restores run energy 5% faster.", "RARE", 40000, { slot: "CAPE", defenceBonus: 3, iconEmoji: "🧣" }));
register(item("stamina_potion", "Stamina Potion (4)", "Restores 40% Run Energy and reduces energy drain by 70% for 2 minutes.", "RARE", 12000, { isConsumable: true, boostStat: "runEnergy", iconEmoji: "🧪" }));

// === Wilderness & High-Risk Drops ===
register(item("dragon_pickaxe", "Dragon Pickaxe", "The mightiest mining pickaxe in Eldara (+61 Mining Power).", "LEGENDARY", 18000000, { slot: "WEAPON", attackSlash: 38, attackCrush: 42, strengthBonus: 48, levelRequirement: 60, iconEmoji: "⛏️", specialAttackCost: 100, specialAttackName: "Smash", specialAttackDescription: "Boosts your Mining level by +3 temporarily!" }));
register(item("ring_of_the_gods", "Ring of the Gods", "Imbued with divine essence (+8 Prayer Bonus, +5 Defenses).", "LEGENDARY", 22000000, { slot: "RING", defenceBonus: 5, prayerBonus: 8, iconEmoji: "💍" }));
register(item("saradomin_cape", "God Cape (Saradomin)", "Imbued in the Mage Arena II. Boosts Magic attack by +15!", "LEGENDARY", 2500000, { slot: "CAPE", attackMagic: 15, defenceMagic: 15, prayerBonus: 2, iconEmoji: "🧣" }));
register(item("zamorak_cape", "God Cape (Zamorak)", "Imbued in the Mage Arena II. Boosts Magic attack by +15!", "LEGENDARY", 2500000, { slot: "CAPE", attackMagic: 15, defenceMagic: 15, prayerBonus: 2, iconEmoji: "🧣" }));
register(item("guthix_cape", "God Cape (Guthix)", "Imbued in the Mage Arena II. Boosts Magic attack by +15!", "LEGENDARY", 2500000, { slot: "CAPE", attackMagic: 15, defenceMagic: 15, prayerBonus: 2, iconEmoji: "🧣" }));
register(item("wilderness_loot_key", "Wilderness Loot Key", "Contains high-value spoils seized from slain wilderness combatants!", "RARE", 150000, { isConsumable: true, iconEmoji: "🗝️" }));
register(item("blood_money", "Blood Money", "The illicit currency of the Wilderness depths.", "RARE", 50, { isStackable: true, iconEmoji: "🩸" }));
register(item("pet_treat", "Gourmet Pet Treat", "Feed to your follower pet to trigger cheerful trick animations!", "UNCOMMON", 150, { isConsumable: true, isStackable: true, iconEmoji: "🍖" }));

// === Barrows Brothers Crypt Armors ===
register(item("dharoks_helm", "Dharok's Helm", "Ancient rusted helmet of Dharok the Wretched.", "RARE", 250000, { slot: "HEAD", defenceBonus: 45, levelRequirement: 70, skillRequirement: "Defence", iconEmoji: "🪖" }));
register(item("dharoks_platebody", "Dharok's Platebody", "Barrows platebody of Dharok. Grants immense damage boost as HP drops when set is worn!", "RARE", 850000, { slot: "BODY", defenceBonus: 92, defenceMelee: 92, levelRequirement: 70, skillRequirement: "Defence", iconEmoji: "🥋" }));
register(item("dharoks_greataxe", "Dharok's Greataxe", "Colossal rusted waraxe (+105 Strength). Deals devastating low-HP damage hits!", "RARE", 1200000, { slot: "WEAPON", attackSlash: 95, strengthBonus: 105, attackSpeedTicks: 5, levelRequirement: 70, skillRequirement: "Attack", iconEmoji: "🪓", specialAttackCost: 50, specialAttackName: "Wretched Cleave", specialAttackDescription: "Double damage strike scaling with lost HP!" }));

register(item("guthans_helm", "Guthan's Helm", "Ancient horned helm of Guthan the Infested.", "RARE", 250000, { slot: "HEAD", defenceBonus: 45, levelRequirement: 70, skillRequirement: "Defence", iconEmoji: "🪖" }));
register(item("guthans_platebody", "Guthan's Platebody", "Barrows platebody of Guthan.", "RARE", 850000, { slot: "BODY", defenceBonus: 92, defenceMelee: 92, levelRequirement: 70, skillRequirement: "Defence", iconEmoji: "🥋" }));
register(item("guthans_spear", "Guthan's Warspear", "A spear infused with vampiric life drain (+75 Stab, +75 Str). Heals player on hit!", "RARE", 1500000, { slot: "WEAPON", attackStab: 75, strengthBonus: 75, attackSpeedTicks: 4, levelRequirement: 70, skillRequirement: "Attack", iconEmoji: "🗡️" }));

register(item("ahrims_robetop", "Ahrim's Robetop", "Corrupted mage robe top (+30 Magic Atk, +30 Magic Def).", "RARE", 1100000, { slot: "BODY", attackMagic: 30, defenceMagic: 30, levelRequirement: 70, skillRequirement: "Magic", iconEmoji: "🥋" }));
register(item("karils_leathertop", "Karil's Leathertop", "Corrupted ranger tunic (+30 Ranged Atk, +35 Ranged Def).", "RARE", 1100000, { slot: "BODY", attackRanged: 30, defenceRanged: 35, levelRequirement: 70, skillRequirement: "Ranged", iconEmoji: "🥋" }));

// === God Wars Dungeon (GWD) Relics ===
register(item("bandos_chestplate", "Bandos Chestplate", "Mighty platebody forged in war (+15 Str, +98 Def).", "LEGENDARY", 28000000, { slot: "BODY", strengthBonus: 15, defenceBonus: 98, defenceMelee: 98, levelRequirement: 65, iconEmoji: "🥋" }));
register(item("bandos_tassets", "Bandos Tassets", "Primordial war tassets (+10 Str, +71 Def).", "LEGENDARY", 24000000, { slot: "LEGS", strengthBonus: 10, defenceBonus: 71, defenceMelee: 71, levelRequirement: 65, iconEmoji: "👖" }));
register(item("armadyl_crossbow", "Armadyl Crossbow", "Holy avian crossbow firing precision bolts (+100 Ranged Atk).", "LEGENDARY", 32000000, { slot: "WEAPON", attackRanged: 100, rangedStrengthBonus: 70, attackSpeedTicks: 4, levelRequirement: 70, iconEmoji: "🏹", specialAttackCost: 40, specialAttackName: "Avian Eye", specialAttackDescription: "Doubles accuracy and guarantees a critical hit!" }));
register(item("saradomin_sword", "Saradomin Sword", "Holy double-handed broadsword delivering lightning strikes (+82 Atk, +82 Str).", "RARE", 4500000, { slot: "WEAPON", attackSlash: 82, strengthBonus: 82, attackSpeedTicks: 4, levelRequirement: 70, iconEmoji: "⚔️" }));
register(item("zamorakian_spear", "Zamorakian Spear", "Unholy barbed lance (+85 Atk, +75 Str).", "RARE", 6800000, { slot: "WEAPON", attackStab: 85, strengthBonus: 75, attackSpeedTicks: 4, levelRequirement: 70, iconEmoji: "🔱" }));
register(item("staff_of_the_dead", "Staff of the Dead", "Unholy necromancer staff (+17 Magic Atk, +15% Magic Dmg).", "LEGENDARY", 14000000, { slot: "WEAPON", attackMagic: 17, magicDamageBonusPercent: 15, attackSpeedTicks: 4, levelRequirement: 75, iconEmoji: "🪄" }));

// === Theatre of Blood (ToB Raid II) Mythics ===
register(item("scythe_of_vitur", "Scythe of Vitur", "Colossal vampyric scythe swinging a wide arc across 3 target squares!", "MYTHIC", 1500000000, { slot: "WEAPON", attackSlash: 110, strengthBonus: 125, attackSpeedTicks: 5, levelRequirement: 80, skillRequirement: "Attack", iconEmoji: "🪓", specialAttackCost: 50, specialAttackName: "Vampyric Harvest", specialAttackDescription: "Sweeping triple-hit slice dealing massive AOE damage!" }));
register(item("ghrazi_rapier", "Ghrazi Rapier", "Lightweight deadly vampyric foil (+94 Stab Atk, +89 Str).", "MYTHIC", 450000000, { slot: "WEAPON", attackStab: 94, strengthBonus: 89, attackSpeedTicks: 4, levelRequirement: 75, iconEmoji: "🗡️" }));
register(item("sanguinesti_staff", "Sanguinesti Staff", "Ancient blood staff healing 1/6th of damage dealt to player HP!", "MYTHIC", 380000000, { slot: "WEAPON", attackMagic: 25, magicDamageBonusPercent: 10, attackSpeedTicks: 4, levelRequirement: 75, iconEmoji: "🪄" }));
register(item("avernic_defender", "Avernic Defender", "The ultimate off-hand defender (+30 Slash/Stab Atk, +8 Str Bonus).", "MYTHIC", 120000000, { slot: "SHIELD", attackSlash: 30, attackStab: 30, strengthBonus: 8, defenceBonus: 30, levelRequirement: 70, iconEmoji: "🛡️" }));
register(item("pet_lil_zik", "Pet Lil' Zik", "A cute miniature mutated spider lord from Verzik's chamber!", "MYTHIC", 200000000, { isPet: true, isConsumable: true, iconEmoji: "🕷️" }));

// === Fletching & Crafting Production Materials ===
register(item("bow_string", "Bowstring", "Spun flax thread for stringing wooden longbows and shortbows.", "COMMON", 100, { isStackable: true, iconEmoji: "🧵" }));
register(item("unstrung_yew_bow", "Unstrung Yew Shortbow", "Carved yew timber ready for bowstringing.", "UNCOMMON", 400, { iconEmoji: "🏹" }));
register(item("yew_shortbow", "Yew Shortbow", "A sturdy high-tier yew shortbow (+48 Ranged Atk).", "UNCOMMON", 1200, { slot: "WEAPON", attackRanged: 48, attackSpeedTicks: 4, levelRequirement: 50, iconEmoji: "🏹" }));
register(item("arrow_shaft", "Arrow Shafts", "Wooden shafts cut for arrowmaking.", "COMMON", 2, { isStackable: true, iconEmoji: "🥢" }));
register(item("feather", "Feather", "Feathers for fletching arrows.", "COMMON", 2, { isStackable: true, iconEmoji: "🪶" }));
register(item("rune_arrowtips", "Rune Arrowtips", "Forged runite heads for arrows.", "RARE", 120, { isStackable: true, iconEmoji: "🗡️" }));
register(item("rune_arrow", "Rune Arrow", "Deadly runite-tipped arrow (+49 Ranged Str).", "RARE", 250, { slot: "AMMO", rangedStrengthBonus: 49, isStackable: true, iconEmoji: "🏹" }));

register(item("dragonstone", "Cut Dragonstone", "Flawless sparkling purple gemstone.", "RARE", 12000, { iconEmoji: "💎" }));
register(item("onyx", "Cut Onyx", "Deep pitch-black volcanic gem of immense latent power.", "LEGENDARY", 3000000, { iconEmoji: "🖤" }));
register(item("amulet_of_glory", "Amulet of Glory", "Enchanted Dragonstone amulet granting +10 to all attack stats & +3 Prayer!", "LEGENDARY", 45000, { slot: "AMULET", attackSlash: 10, attackCrush: 10, attackStab: 10, attackRanged: 10, attackMagic: 10, prayerBonus: 3, iconEmoji: "📿" }));
register(item("amulet_of_fury", "Amulet of Fury", "Enchanted Onyx amulet providing supreme defense (+15) and +8 Strength!", "MYTHIC", 3500000, { slot: "AMULET", defenceBonus: 15, strengthBonus: 8, prayerBonus: 5, iconEmoji: "📿" }));

// === Thieving Equipment & Loot ===
register(item("lockpick", "Lockpick", "Essential tool for cracking lockboxes and chest mechanisms.", "COMMON", 150, { isStackable: true, iconEmoji: "🔑" }));
register(item("stolen_silk", "Stolen Silk", "Fine woven silk taken from market stalls.", "UNCOMMON", 120, { isStackable: true, iconEmoji: "🧵" }));
register(item("stolen_gem", "Stolen Ruby Gem", "Uncut ruby taken from market gem stalls.", "RARE", 1500, { isStackable: true, iconEmoji: "💎" }));
register(item("rogue_mask", "Rogue Mask", "Stealth camouflage mask doubling loot from pickpocketing!", "RARE", 25000, { slot: "HEAD", defenceBonus: 2, iconEmoji: "🥷" }));

// Special & Mystery
register(item("clue_scroll", "Clue Scroll (Elite)", "An elite clue scroll!", "LEGENDARY", 2500000, { iconEmoji: "📜" }));
register(item("eldorath_mystery_box", "Eldorath Mystery Box", "A custom mythic mystery box!", "LEGENDARY", 25000000, { isMysteryBox: true, iconEmoji: "🎁" }));

// === Dragon Slayer Quest & Dragonfire Armor ===
register(item("anti_dragon_shield", "Anti-Dragon Shield", "Ancient runic shield protecting against Elvarg's incinerating dragonfire!", "RARE", 2500, { slot: "SHIELD", defenceBonus: 18, levelRequirement: 32, iconEmoji: "🛡️" }));
register(item("rune_platebody", "Rune Platebody", "Forged runite chest armor requiring Dragon Slayer completion (+82 Def).", "RARE", 65000, { slot: "BODY", defenceBonus: 82, levelRequirement: 40, iconEmoji: "🛡️" }));
register(item("map_piece_1", "Melzar's Map Piece", "First piece of Ned's ancient Crandor sea chart.", "UNCOMMON", 500, { iconEmoji: "📜" }));
register(item("map_piece_2", "Thalzar's Map Piece", "Second piece of Ned's ancient Crandor sea chart.", "UNCOMMON", 500, { iconEmoji: "📜" }));
register(item("map_piece_3", "Lozar's Map Piece", "Third piece of Ned's ancient Crandor sea chart.", "UNCOMMON", 500, { iconEmoji: "📜" }));
register(item("crandor_ticket", "Crandor Ship Pass", "Boarding pass for Captain Ned's vessel Lady Lumbridge.", "UNCOMMON", 1000, { iconEmoji: "🎟️" }));

// === Farming Guild & Supplies ===
register(item("compost", "Compost", "Organic plant fertilizer increasing crop yields by +25%.", "COMMON", 35, { isStackable: true, iconEmoji: "🟤" }));
register(item("supercompost", "Supercompost", "Rich pine ash compost increasing crop yields by +60% and preventing disease!", "UNCOMMON", 250, { isStackable: true, iconEmoji: "✨" }));
register(item("plant_cure", "Plant Cure", "Medicinal potion spray restoring diseased plants to health.", "COMMON", 40, { isStackable: true, iconEmoji: "🧪" }));
register(item("watermelon_seed", "Watermelon Seed", "Seed for juicy watermelons (Level 47 Farming).", "UNCOMMON", 150, { isStackable: true, iconEmoji: "🌱" }));
register(item("snape_grass_seed", "Snape Grass Seed", "Seed for Snape Grass herb secondary (Level 61 Farming).", "RARE", 800, { isStackable: true, iconEmoji: "🌱" }));
register(item("papaya_seed", "Papaya Tree Seed", "Seed for sweet papaya fruit trees (Level 57 Farming).", "RARE", 3500, { isStackable: true, iconEmoji: "🌱" }));
register(item("watermelon", "Watermelon", "Juicy fresh watermelon slice healing 12 HP.", "UNCOMMON", 120, { isConsumable: true, healAmount: 12, iconEmoji: "🍉" }));
register(item("snape_grass", "Snape Grass", "Vital potion herb secondary used for Prayer Potions.", "UNCOMMON", 450, { isStackable: true, iconEmoji: "🌿" }));
register(item("papaya", "Papaya Fruit", "Delicious tropical papaya fruit restoring 18 HP.", "RARE", 1200, { isConsumable: true, healAmount: 18, iconEmoji: "🥭" }));

// === Combat Achievements & Clan & Completionist ===
register(item("combat_hilt", "Ghalak's Combat Hilt", "Awarded for completing Combat Achievements! Grants +5 All Atk & +4 Str.", "LEGENDARY", 500000, { slot: "WEAPON", attackSlash: 15, attackCrush: 15, attackStab: 15, strengthBonus: 8, iconEmoji: "⚔️" }));
register(item("clan_charter", "Clan Charter Scroll", "Official charter scroll to establish a registered Clan in Brindle Realm.", "RARE", 100000, { iconEmoji: "📜" }));
register(item("comp_cape", "Completionist Cape", "The pinnacle achievement cape awarded for completing 100% of all content!", "MYTHIC", 10000000, { slot: "CAPE", defenceBonus: 30, attackSlash: 12, attackCrush: 12, attackStab: 12, attackRanged: 12, attackMagic: 12, strengthBonus: 10, prayerBonus: 10, iconEmoji: "👑" }));

// === Theatre of Blood (ToB) Raids Uniques ===
register(item("scythe_of_vitur", "Scythe of Vitur", "Massive triple-hitting sanguine scythe from Verzik Vitur (+110 Slash, +15 Str)!", "MYTHIC", 120000000, { slot: "WEAPON", attackSlash: 110, strengthBonus: 15, attackSpeedTicks: 5, levelRequirement: 75, iconEmoji: "🩸" }));
register(item("sanguinesti_staff", "Sanguinesti Staff", "Ancient blood staff draining HP on hit to heal the wielder (+28 Magic Atk)!", "LEGENDARY", 45000000, { slot: "WEAPON", attackMagic: 28, attackSpeedTicks: 4, levelRequirement: 75, iconEmoji: "🪄" }));
register(item("avernic_defender", "Avernic Defender", "The ultimate off-hand defender offering unmatched melee accuracy (+29) & strength (+8)!", "LEGENDARY", 60000000, { slot: "SHIELD", attackSlash: 29, attackCrush: 29, attackStab: 29, strengthBonus: 8, levelRequirement: 70, iconEmoji: "🛡️" }));

// === Barrows Armor & Weapons ===
register(item("dharoks_greataxe", "Dharok's Greataxe", "Massive 2H greataxe. Deals scaling damage as your HP drops!", "RARE", 3500000, { slot: "WEAPON", attackSlash: 95, attackCrush: 105, strengthBonus: 105, attackSpeedTicks: 6, levelRequirement: 70, iconEmoji: "🪓" }));
register(item("dharoks_helm", "Dharok's Helm", "Corrupted Barrows helmet (+45 Def).", "RARE", 1200000, { slot: "HEAD", defenceBonus: 45, levelRequirement: 70, iconEmoji: "🪖" }));
register(item("dharoks_platebody", "Dharok's Platebody", "Heavy Barrows platebody (+122 Def).", "RARE", 2500000, { slot: "BODY", defenceBonus: 122, levelRequirement: 70, iconEmoji: "🛡️" }));
register(item("dharoks_platelegs", "Dharok's Platelegs", "Heavy Barrows platelegs (+85 Def).", "RARE", 2200000, { slot: "LEGS", defenceBonus: 85, levelRequirement: 70, iconEmoji: "👖" }));
register(item("guthans_warspear", "Guthan's Warspear", "Ancient Barrows spear. Chance to drain enemy HP on hit!", "RARE", 2800000, { slot: "WEAPON", attackStab: 75, attackSlash: 75, strengthBonus: 75, attackSpeedTicks: 5, levelRequirement: 70, iconEmoji: "🗡️" }));

// === God Wars Dungeon (GWD) Armors & Godswords ===
register(item("bandos_godsword", "Bandos Godsword", "Mighty 2H Godsword! Special attack drains enemy defense levels (+132 Slash, +132 Str)!", "LEGENDARY", 28000000, { slot: "WEAPON", attackSlash: 132, attackCrush: 80, strengthBonus: 132, attackSpeedTicks: 6, levelRequirement: 75, iconEmoji: "🗡️" }));
register(item("saradomin_godsword", "Saradomin Godsword", "Mighty 2H Godsword! Special attack restores HP & Prayer points (+132 Slash, +132 Str)!", "LEGENDARY", 32000000, { slot: "WEAPON", attackSlash: 132, attackCrush: 80, strengthBonus: 132, attackSpeedTicks: 6, levelRequirement: 75, iconEmoji: "🗡️" }));
register(item("armadyl_godsword", "Armadyl Godsword", "Mighty 2H Godsword! Special attack deals +25% increased damage (+132 Slash, +132 Str)!", "LEGENDARY", 45000000, { slot: "WEAPON", attackSlash: 132, attackCrush: 80, strengthBonus: 132, attackSpeedTicks: 6, levelRequirement: 75, iconEmoji: "🗡️" }));
register(item("bandos_chestplate", "Bandos Chestplate", "Ancient war platebody worn by General Graardor (+126 Def, +4 Str)!", "LEGENDARY", 18000000, { slot: "BODY", defenceBonus: 126, strengthBonus: 4, levelRequirement: 65, iconEmoji: "🛡️" }));
register(item("bandos_tassets", "Bandos Tassets", "Ancient war tassets worn by General Graardor (+71 Def, +2 Str)!", "LEGENDARY", 22000000, { slot: "LEGS", defenceBonus: 71, strengthBonus: 2, levelRequirement: 65, iconEmoji: "👖" }));

// === Crafting & Fletching Materials ===
register(item("bow_string", "Bow String", "Spun flax used to string shortbows and longbows.", "COMMON", 10, { isStackable: true, iconEmoji: "🧵" }));
register(item("flax", "Flax", "Raw flax plant harvested from field allotments.", "COMMON", 5, { isStackable: true, iconEmoji: "🌾" }));
register(item("green_dhide_body", "Green D'hide Body", "Tough dragonhide body armor (+40 Ranged Def).", "UNCOMMON", 12000, { slot: "BODY", defenceBonus: 40, levelRequirement: 40, iconEmoji: "🥋" }));
register(item("black_dhide_body", "Black D'hide Body", "Supreme dragonhide body armor (+70 Ranged Def).", "RARE", 45000, { slot: "BODY", defenceBonus: 70, levelRequirement: 70, iconEmoji: "🥋" }));

export function getItem(id: string): ItemDefinition {
  return ITEMS[id] ?? {
    id,
    name: id.replace(/_/g, " "),
    examine: "An unknown item.",
    tier: "COMMON",
    value: 1,
    iconEmoji: "📦",
  };
}
