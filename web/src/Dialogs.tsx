import React, { useState } from "react";
import type { GameState, WorldEntity } from "./engine";
import {
  SHOP_INVENTORIES, buyFromShop, sellToShop, depositToBank, withdrawFromBank,
  addToInventory, removeFromInventory, countItem, addChat, changeZone, addXp,
  assignSlayerTask, cancelSlayerTask, buySlayerReward, startFightCaves, buyFromTokkulShop,
  cleanHerb, mixPotion, getSkillLevel, buildHouseRoom, buildFurniture, startRaid, progressRaid,
  finishRaidAndReward, solveClueStep, openRewardCasket, summonPet, interactPet,
  createGeOffer, progressDragonSlayer, createClan, openBarrowsChest, finishToBRaid, pickpocketTarget
} from "./engine";
import { getItem } from "./data/items";
import { HERBLORE_RECIPES, FURNITURE_RECIPES, PETS_DATABASE, COMBAT_ACHIEVEMENTS, COLLECTION_LOG_CATEGORIES, DRAGON_SLAYER_QUEST_STEPS, DEFAULT_LEADERBOARD, THIEVING_TARGETS, CRAFTING_RECIPES, FLETCHING_RECIPES } from "./data/gameConfig";
import type { HouseRoomType } from "./types";

interface DialogProps {
  state: GameState;
  setState: (updater: (s: GameState) => void) => void;
  forceUpdate: () => void;
  onClose: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 100,
};

const dialogStyle: React.CSSProperties = {
  background: "#251E17", border: "2px solid #8D6E63", borderRadius: 8,
  width: 360, maxHeight: "85%", display: "flex", flexDirection: "column",
  boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
};

const dialogHeader: React.CSSProperties = {
  display: "flex", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #4a3a2a",
  background: "linear-gradient(180deg, #3A2B1D 0%, #20170F 100%)",
};

const closeBtn: React.CSSProperties = {
  background: "#FF4444", border: "none", color: "#FFF", width: 24, height: 24,
  borderRadius: 4, cursor: "pointer", fontSize: 12,
};

const tabBtn: React.CSSProperties = {
  padding: "4px 12px", border: "1px solid #4a3a2a", background: "#2a2a1a",
  color: "#aaa", fontSize: 10, cursor: "pointer", borderRadius: 3,
};

const activeTabBtn: React.CSSProperties = {
  ...tabBtn, background: "#4a3a2a", color: "#FFD700", fontWeight: "bold",
};

const listStyle: React.CSSProperties = {
  overflowY: "auto", flex: 1, maxHeight: 220,
};

const listItemStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, padding: "4px 6px",
  borderBottom: "1px solid #3a3a2a",
};

const buyBtn: React.CSSProperties = {
  padding: "4px 10px", background: "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)", border: "1px solid #81C784",
  color: "#FFF", fontSize: 10, fontWeight: "bold", cursor: "pointer", borderRadius: 4,
};

export const ShopDialog: React.FC<DialogProps & { shopType: string }> = ({ state, setState, forceUpdate, onClose, shopType }) => {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const items = SHOP_INVENTORIES[shopType] ?? [];
  const isTokkul = shopType === "npc_tzhaar_master";
  const isSlayer = shopType === "npc_slayer_master";

  const getCurrencyLabel = () => {
    if (isTokkul) return `🌋 ${countItem(state.player, "tokkul")} Tokkul`;
    if (isSlayer) return `💀 ${state.player.slayerPoints ?? 0} Slayer Pts`;
    return `🪙 ${countItem(state.player, "coins")}gp`;
  };

  const handleBuy = (itemId: string, price: number) => {
    setState(s => {
      if (isTokkul) {
        buyFromTokkulShop(s, itemId, price);
      } else if (isSlayer) {
        buySlayerReward(s, itemId, price);
      } else {
        buyFromShop(s, itemId, price, 1);
      }
    });
    forceUpdate();
  };

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold" }}>
            {isTokkul ? "🌋 TzHaar Tokkul Exchange" : isSlayer ? "💀 Slayer Rewards Vault" : "🏪 Merchant Shop"}
          </span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 4, padding: 4 }}>
          <button onClick={() => setMode("buy")} style={mode === "buy" ? activeTabBtn : tabBtn}>Buy</button>
          {!isTokkul && !isSlayer && (
            <button onClick={() => setMode("sell")} style={mode === "sell" ? activeTabBtn : tabBtn}>Sell</button>
          )}
          <span style={{ color: "#FFD700", fontSize: 10, marginLeft: "auto", alignSelf: "center", fontWeight: "bold" }}>
            {getCurrencyLabel()}
          </span>
        </div>
        <div style={listStyle}>
          {mode === "buy" ? (
            items.map(item => (
              <div key={item.itemId} style={listItemStyle}>
                <span style={{ fontSize: 16 }}>{getItem(item.itemId).iconEmoji}</span>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#FFF", fontSize: 9.5, fontWeight: "bold" }}>{getItem(item.itemId).name}</span>
                  <span style={{ color: "#AAA", fontSize: 7.5 }}>{getItem(item.itemId).examine}</span>
                </div>
                <span style={{ color: isTokkul ? "#FF5722" : isSlayer ? "#00E5FF" : "#FFD700", fontSize: 9.5, fontWeight: "bold", marginRight: 4 }}>
                  {item.price} {isTokkul ? "Tokkul" : isSlayer ? "Pts" : "gp"}
                </span>
                <button
                  onClick={() => handleBuy(item.itemId, item.price)}
                  style={buyBtn}
                >Buy</button>
              </div>
            ))
          ) : (
            state.player.inventory.filter(s => s && s.itemId !== "coins").map((slot, i) => slot && (
              <div key={i} style={listItemStyle}>
                <span style={{ fontSize: 16 }}>{getItem(slot.itemId).iconEmoji}</span>
                <span style={{ color: "#FFF", fontSize: 10, flex: 1 }}>{getItem(slot.itemId).name} ({slot.amount})</span>
                <span style={{ color: "#FFD700", fontSize: 10 }}>{Math.floor(getItem(slot.itemId).value * 0.6)}gp</span>
                <button
                  onClick={() => { setState(s => { sellToShop(s, slot.itemId, 1); }); forceUpdate(); }}
                  style={buyBtn}
                >Sell</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const BankDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const bankEntries = Object.entries(state.player.bank).filter(([_, qty]) => qty > 0);

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold" }}>🏦 Bank Vault</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 8, padding: 4, height: 250 }}>
          <div style={{ flex: 1, ...listStyle }}>
            <div style={{ color: "#888", fontSize: 10, padding: 4 }}>Inventory</div>
            {state.player.inventory.map((slot, i) => slot && (
              <div key={i} onClick={() => setSelected(slot.itemId)} style={{
                ...listItemStyle,
                background: selected === slot.itemId ? "#4a3a2a" : "transparent",
                cursor: "pointer",
              }}>
                <span style={{ fontSize: 14 }}>{getItem(slot.itemId).iconEmoji}</span>
                <span style={{ color: "#FFF", fontSize: 10, flex: 1 }}>{getItem(slot.itemId).name}</span>
                <span style={{ color: "#aaa", fontSize: 10 }}>{slot.amount}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setState(s => { depositToBank(s, slot.itemId, slot.amount); }); forceUpdate(); }}
                  style={buyBtn}
                >→</button>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, ...listStyle }}>
            <div style={{ color: "#888", fontSize: 10, padding: 4 }}>Bank</div>
            {bankEntries.length === 0 && <div style={{ color: "#666", fontSize: 10, padding: 4 }}>Empty</div>}
            {bankEntries.map(([itemId, qty]) => (
              <div key={itemId} style={listItemStyle}>
                <span style={{ fontSize: 14 }}>{getItem(itemId).iconEmoji}</span>
                <span style={{ color: "#FFF", fontSize: 10, flex: 1 }}>{getItem(itemId).name}</span>
                <span style={{ color: "#aaa", fontSize: 10 }}>{qty}</span>
                <button
                  onClick={() => { setState(s => { withdrawFromBank(s, itemId, qty); }); forceUpdate(); }}
                  style={buyBtn}
                >←</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const HerbloreDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const [tab, setTab] = useState<"potions" | "clean">("potions");
  const player = state.player;
  const herbLvl = getSkillLevel(player, "herblore");

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 380 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#00E5FF", fontWeight: "bold", fontSize: 12 }}>🧪 Herblore Laboratory</span>
          <span style={{ color: "#FFEE33", fontSize: 10, marginLeft: 8 }}>Lvl: {herbLvl}</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 4, padding: 4 }}>
          <button onClick={() => setTab("potions")} style={tab === "potions" ? activeTabBtn : tabBtn}>Brew Potions ⚗️</button>
          <button onClick={() => setTab("clean")} style={tab === "clean" ? activeTabBtn : tabBtn}>Clean Herbs 🌿</button>
        </div>
        <div style={listStyle}>
          {tab === "potions" ? (
            HERBLORE_RECIPES.filter(r => r.secondaryId !== "").map(recipe => {
              const hasHerb = countItem(player, recipe.herbId) > 0;
              const hasSec = countItem(player, recipe.secondaryId) > 0;
              const canBrew = hasHerb && hasSec && herbLvl >= recipe.levelReq;

              return (
                <div key={recipe.id} style={{ ...listItemStyle, opacity: herbLvl >= recipe.levelReq ? 1 : 0.6 }}>
                  <span style={{ fontSize: 18 }}>{getItem(recipe.resultId).iconEmoji}</span>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: "#FFF", fontSize: 9.5, fontWeight: "bold" }}>{recipe.name}</span>
                      <span style={{ color: herbLvl >= recipe.levelReq ? "#00FF80" : "#FF4444", fontSize: 8 }}>
                        (Lvl {recipe.levelReq})
                      </span>
                    </div>
                    <span style={{ color: "#AAA", fontSize: 7.5 }}>
                      Requires: {getItem(recipe.herbId).name} ({hasHerb ? "✅" : "❌"}) + {getItem(recipe.secondaryId).name} ({hasSec ? "✅" : "❌"})
                    </span>
                  </div>
                  <button
                    disabled={!canBrew}
                    onClick={() => {
                      setState(s => { mixPotion(s, recipe.id); });
                      forceUpdate();
                    }}
                    style={{
                      ...buyBtn,
                      background: canBrew ? "linear-gradient(180deg, #00C853 0%, #007E33 100%)" : "#42372A",
                      borderColor: canBrew ? "#00FF80" : "#555",
                      cursor: canBrew ? "pointer" : "not-allowed",
                      fontSize: 8.5,
                      padding: "4px 8px",
                    }}
                  >
                    Brew
                  </button>
                </div>
              );
            })
          ) : (
            player.inventory.map((slot, idx) => {
              if (!slot || !slot.itemId.startsWith("grimy_")) return null;
              const def = getItem(slot.itemId);
              return (
                <div key={idx} style={listItemStyle}>
                  <span style={{ fontSize: 16 }}>{def.iconEmoji}</span>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#FFF", fontSize: 9.5, fontWeight: "bold" }}>{def.name}</span>
                    <span style={{ color: "#81C784", fontSize: 7.5 }}>Req: Lvl {def.levelRequirement ?? 1} Herblore • +{def.herbloreXp ?? 10} XP</span>
                  </div>
                  <button
                    onClick={() => {
                      setState(s => { cleanHerb(s, idx); });
                      forceUpdate();
                    }}
                    style={{ ...buyBtn, fontSize: 8.5, padding: "4px 8px" }}
                  >
                    Clean
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export const NpcDialog: React.FC<DialogProps & { entity: WorldEntity }> = ({ state, setState, forceUpdate, onClose, entity }) => {
  const [openSubShop, setOpenSubShop] = useState<string | null>(null);
  const isBanker = entity.type.includes("banker") || entity.type === "bank_booth";
  const isShopkeeper = entity.type.includes("shopkeeper") || entity.type === "npc_shopkeeper_weapons";
  const shopType = entity.type;

  if (openSubShop) {
    return <ShopDialog state={state} setState={setState} forceUpdate={forceUpdate} onClose={() => setOpenSubShop(null)} shopType={openSubShop} />;
  }

  if (isBanker) {
    return <BankDialog state={state} setState={setState} forceUpdate={forceUpdate} onClose={onClose} />;
  }
  if (isShopkeeper && SHOP_INVENTORIES[shopType] && entity.type !== "npc_shopkeeper_weapons") {
    return <ShopDialog state={state} setState={setState} forceUpdate={forceUpdate} onClose={onClose} shopType={shopType} />;
  }

  const lines: string[] = [];
  const tutorialStep = state.player.tutorialStep ?? 0;
  const isTutorial = state.zoneId === "tutorial_island";
  const player = state.player;

  // === TOOL LEPRECHAUN ===
  if (entity.type === "npc_leprechaun") {
    lines.push("🧝 Tool Leprechaun: 'Top of the mornin' to ye! I tend to the local farming patches.'");
    lines.push("🌱 Farming Guide:");
    lines.push("1. Buy a Seed Dibber & Seeds (Ranarr, Toadflax, Torstol, or Magic Tree Seeds) from me.");
    lines.push("2. Click on the nearby Herb or Tree patch to plant your seeds.");
    lines.push("3. Watch your crops grow through their growth cycles, then harvest fresh herbs and logs!");
  }

  // === SLAYER MASTER VANNAKA ===
  else if (entity.type === "npc_slayer_master") {
    lines.push("🗡️ Slayer Master Vannaka: 'Greetings warrior. I assign combat bounties to slay the realm's dangerous beasts!'");
    if (player.slayerTask) {
      lines.push(`🎯 ACTIVE BOUNTY: Slay ${player.slayerTask.countRemaining}/${player.slayerTask.totalCount} ${player.slayerTask.monsterName}!`);
      lines.push(`Reward: +${player.slayerTask.pointsReward} Slayer Points & +${player.slayerTask.xpReward} Slayer XP.`);
    } else {
      lines.push("You do not currently have an active Slayer task. Click below to take on a monster bounty!");
    }
  }

  // === TZHAAR FIGHT CAVES MASTER ===
  else if (entity.type === "npc_tzhaar_master") {
    lines.push("🌋 TzHaar-Mej-Jal: 'Welcome JalYt (stranger) to the TzHaar Wave Survival Arena!'");
    lines.push("Fight through 10 escalating waves of volcanic monsters, culminating in the terror of TzTok-Jad!");
    lines.push("Conquer all 10 waves to earn the prestigious Fire Cape and thousands of Tokkul!");
  }

  // === GRACE (AGILITY ROOFTOP MASTER) ===
  else if (entity.type === "npc_grace") {
    lines.push("🏃 Grace: 'Keep moving, adventurer! Rooftop running keeps you nimble and swift.'");
    lines.push("Complete rooftop laps across the Brindle village rooftops to earn Marks of Grace (🌟).");
    lines.push("Trade Marks of Grace with me for the featherweight Graceful Outfit to supercharge your Run Energy!");
  }

  // === ESTATE BUTLER (CONSTRUCTION & POH) ===
  else if (entity.type === "npc_estate_agent") {
    lines.push("🤵 Estate Butler: 'At your service, master of the estate! I can assist with expanding your housing realm.'");
    lines.push("You can build Parlours, Chapels (with Gilded Altars for x3.5 Prayer XP!), Portal Chambers, and Pet Menageries.");
    lines.push("Purchase saws, nails, planks, marble blocks, and gold leaf from my trade supply.");
  }

  // === KOLODION (MAGE ARENA II & GOD SPELLS) ===
  else if (entity.type === "npc_kolodion") {
    lines.push("🧙 Kolodion: 'You have entered the sanctum of the Mage Arena in Deep Wilderness.'");
    lines.push("Only the most fearless mages survive out here. I trade sacred God Capes blessed by Saradomin, Guthix, and Zamorak!");
  }

  // === TUTORIAL ISLAND NPCS ===
  else if (isTutorial) {
    if (entity.type === "npc_guide") {
      if (tutorialStep === 0) {
        lines.push("🧙 Starter Isle Guide: 'Greetings, adventurer! Welcome to Eldara!'");
        lines.push("🎯 NEXT STEP: Chop down one of the nearby Trees (🌲) to the east to obtain some standard logs.");
        lines.push("I have marked the Tree with a glowing golden target on your map! Speak to me once you have logs in your inventory.");
        setTimeout(() => {
          setState(s => { s.player.tutorialStep = 1; });
        }, 100);
      } else if (tutorialStep === 1) {
        if (countItem(player, "logs") > 0) {
          lines.push("🧙 Starter Isle Guide: 'Splendid work! You gathered standard logs.'");
          lines.push("🎯 NEXT STEP: Head south-east to the Fishing & Cooking Tutor (🎣).");
          lines.push("She will show you how to catch raw food and cook it on the range!");
          setTimeout(() => {
            setState(s => { s.player.tutorialStep = 2; });
          }, 100);
        } else {
          lines.push("🧙 Starter Isle Guide: 'Chop down one of the Trees to the east to get Logs.'");
        }
      } else {
        lines.push("🧙 Starter Isle Guide: 'Follow the glowing goal markers on your screen to complete your island trials!'");
      }
    } else if (entity.type === "npc_fishing_tutor") {
      if (tutorialStep < 2) {
        lines.push("🎣 Fishing Tutor: 'Speak to the Starter Isle Guide first!'");
      } else if (tutorialStep === 2) {
        if (countItem(player, "shrimps") > 0) {
          lines.push("🎣 Fishing Tutor: 'Delightful! You caught and cooked fresh shrimps.'");
          lines.push("🎯 NEXT STEP: Head west to the Mining & Smithing Tutor (⛏️) to learn how to forge armor.");
          setTimeout(() => {
            setState(s => { s.player.tutorialStep = 4; });
          }, 100);
        } else {
          lines.push("🎣 Fishing Tutor: 'Welcome! I will teach you survival cooking.'");
          lines.push("🎯 NEXT STEP: Click the Fishing Spot (🐟) with your Small Fishing Net to catch Raw Shrimps.");
          lines.push("Then click the nearby Cooking Range (🍳) to cook them!");
          setTimeout(() => {
            setState(s => { s.player.tutorialStep = 3; });
          }, 100);
        }
      } else if (tutorialStep === 3) {
        if (countItem(player, "shrimps") > 0) {
          lines.push("🎣 Fishing Tutor: 'Well done! Cooked food heals your Hitpoints.'");
          lines.push("🎯 NEXT STEP: Head west to the Mining & Smithing Tutor (⛏️).");
          setTimeout(() => {
            setState(s => { s.player.tutorialStep = 4; });
          }, 100);
        } else {
          lines.push("🎣 Fishing Tutor: 'Catch Raw Shrimps at the fishing spot and cook them on the range!'");
        }
      } else {
        lines.push("🎣 Fishing Tutor: 'Good luck on the mainland! Always carry food when fighting.'");
      }
    } else if (entity.type === "npc_mining_tutor") {
      if (tutorialStep < 4) {
        lines.push("⛏️ Mining Tutor: 'Complete the Woodcutting and Cooking tutorials first!'");
      } else if (tutorialStep === 4) {
        lines.push("⛏️ Mining Tutor: 'Time to forge your first weapon!'");
        lines.push("🎯 NEXT STEP: Mine Copper Ore and Tin Ore from the rocks, smelt a Bronze Bar at the Furnace (🔥), then hammer a Bronze Dagger at the Anvil (⚒️)!'");
      } else if (tutorialStep === 5) {
        lines.push("⛏️ Mining Tutor: 'A fine Bronze Dagger! Now speak to the Combat Instructor to the north.'");
        setTimeout(() => {
          setState(s => { s.player.tutorialStep = 6; });
        }, 100);
      } else {
        lines.push("⛏️ Mining Tutor: 'May your pickaxe strike true!'");
      }
    } else if (entity.type === "npc_combat_tutor") {
      if (tutorialStep < 6) {
        lines.push("⚔️ Combat Instructor: 'Halt recruit! Speak to the crafting tutors first.'");
      } else if (tutorialStep === 6) {
        lines.push("⚔️ Combat Instructor: 'Welcome to combat training!'");
        lines.push("🎯 NEXT STEP: Open your Equipment tab on the bottom right and equip your Bronze Dagger.");
        lines.push("Then click on a Giant Rat (🐀) to attack and defeat it in battle!");
      } else if (tutorialStep >= 7) {
        lines.push("⚔️ Combat Instructor: 'Magnificent victory! You have mastered the fundamentals.'");
        lines.push("🎯 NEXT STEP: Head south to the Departure Dock (⛵) and take the ferry to the mainland village of Brindle!");
      }
    }
  }

  // === MAINLAND QUEST NPCS ===
  else {
    if (entity.type === "npc_cook") {
      const q = player.quests.cooks_assistant ?? 0;
      const hasFlour = countItem(player, "top_quality_flour") > 0;
      const hasEgg = countItem(player, "super_fresh_egg") > 0;
      const hasMilk = countItem(player, "fresh_milk") > 0;

      if (q === 0) {
        lines.push("👨‍🍳 Head Cook: 'Oh dear, oh dear! The Duke's banquet is tonight and I've forgotten the ingredients!'");
        lines.push("Can you help me? I need 3 special ingredients:");
        lines.push("1. 🌾 Top-quality Flour (from the flour bin in the kitchen)");
        lines.push("2. 🥚 Super-fresh Egg (from the chicken coop nest to the south)");
        lines.push("3. 🥛 Fresh Milk (milked from the dairy cow in the pasture)");
        lines.push("🎯 Click 'Accept Quest' to start Cook's Assistant!");
        setTimeout(() => {
          setState(s => {
            s.player.quests.cooks_assistant = 1;
            addChat(s, "📜 Quest Started: Cook's Assistant! Gather Flour, Egg, and Milk.", "#FFD700");
          });
        }, 100);
      } else if (q === 1) {
        if (hasFlour && hasEgg && hasMilk) {
          lines.push("👨‍🍳 Head Cook: 'You have brought all 3 ingredients! The Duke's feast is saved!'");
          lines.push("🏆 QUEST COMPLETE: Cook's Assistant!");
          lines.push("🎁 Rewards: 500 Cooking XP, 500 Coins, 10 Cooked Sharks, +1 Quest Point!");
          setTimeout(() => {
            setState(s => {
              removeFromInventory(s.player, "top_quality_flour", 1);
              removeFromInventory(s.player, "super_fresh_egg", 1);
              removeFromInventory(s.player, "fresh_milk", 1);
              addToInventory(s.player, "coins", 500);
              addToInventory(s.player, "cooked_shark", 10);
              addXp(s.player, "cooking", 500);
              s.player.quests.cooks_assistant = 100;
              s.player.questPoints = (s.player.questPoints ?? 0) + 1;
              addChat(s, "🎉 Quest Complete: Cook's Assistant! (+1 Quest Point)", "#00FF44");
            });
          }, 100);
        } else {
          lines.push("👨‍🍳 Head Cook: 'I still need the ingredients! Here is where to find them:'");
          lines.push(`• Top-quality Flour: ${hasFlour ? "✅ Collected" : "❌ Flour bin in kitchen"}`);
          lines.push(`• Super-fresh Egg: ${hasEgg ? "✅ Collected" : "❌ Chicken coop nest"}`);
          lines.push(`• Fresh Milk: ${hasMilk ? "✅ Collected" : "❌ Milk the dairy cow in pasture"}`);
        }
      } else {
        lines.push("👨‍🍳 Head Cook: 'Thanks again for saving the royal banquet! The Duke loved the meal.'");
      }
    }

    else if (entity.type === "npc_priest") {
      const q = player.quests.restless_ghost ?? 0;
      if (q === 0) {
        lines.push("👴 Father Joshua: 'Bless you, traveler! A restless spirit is haunting the graveyard to the northwest.'");
        lines.push("I believe someone stole the spirit's sacred Golden Skull and hid it inside the ancient Graveyard Crypt (🕳️).");
        lines.push("🎯 NEXT STEP: Take this Ghostspeak Amulet, speak with the Ghost (👻), and delve into the crypt to recover the Golden Skull!");
        setTimeout(() => {
          setState(s => {
            addToInventory(s.player, "ghostspeak_amulet", 1);
            s.player.quests.restless_ghost = 1;
            addChat(s, "📜 Quest Started: The Restless Ghost! Received Ghostspeak Amulet.", "#FFD700");
          });
        }, 100);
      } else if (q === 1) {
        lines.push("👴 Father Joshua: 'Equip the Ghostspeak Amulet and speak with the Restless Spirit in the graveyard.'");
        lines.push("Then descend into the Graveyard Crypt to defeat Malakor and recover the Golden Skull!");
      } else {
        lines.push("👴 Father Joshua: 'May the light guide your footsteps, sacred champion.'");
      }
    }

    else if (entity.type === "npc_ghost") {
      const hasSkull = countItem(player, "golden_skull") > 0;
      const isWearingAmulet = player.equipment.AMULET === "ghostspeak_amulet";

      if (!isWearingAmulet) {
        lines.push("👻 Restless Spirit: 'Wooooo... wooo woooo... woooo!'");
        lines.push("(You cannot understand the ghost without equipping the Ghostspeak Amulet from Father Joshua!)");
      } else if (hasSkull) {
        lines.push("👻 Restless Spirit: 'My Golden Skull! You retrieved it from Malakor's dark altar!'");
        lines.push("Now my soul may finally rest in peace. Blessings upon you, hero!");
        lines.push("🏆 QUEST COMPLETE: The Restless Ghost!");
        lines.push("🎁 Rewards: 1,125 Prayer XP, Ghostspeak Amulet kept, +1 Quest Point!");
        setTimeout(() => {
          setState(s => {
            removeFromInventory(s.player, "golden_skull", 1);
            addXp(s.player, "prayer", 1125);
            s.player.quests.restless_ghost = 100;
            s.player.questPoints = (s.player.questPoints ?? 0) + 1;
            addChat(s, "🎉 Quest Complete: The Restless Ghost! (+1 Quest Point)", "#00FF44");
          });
        }, 100);
      } else {
        lines.push("👻 Restless Spirit: 'A dark warlock named Malakor stole my Golden Skull and locked it inside the Crypt to the north!'");
        lines.push("🎯 NEXT STEP: Enter the Graveyard Crypt (🕳️), defeat Skeleton Warlord Malakor, and bring my Golden Skull back to me!");
      }
    }

    else if (entity.type === "npc_shopkeeper_weapons") {
      const q = player.quests.dragon_slayer ?? 0;
      if (q === 0) {
        lines.push("⚔️ Guildmaster Brian: 'Halt, adventurer! Are you brave enough to seek the prestige of a true Champion?'");
        lines.push("To earn the right to equip Dragon weaponry and Dragon Plate armor, you must slay Elvarg the Green Dragon on the volcanic isle of Crandor!");
        lines.push("Take this Anti-Dragon Shield to protect against incinerating dragonfire.");
        lines.push("🎯 NEXT STEP: Board the Crandor Expedition Ship (⛵) at the eastern docks, enter the Dragon Crypt, and slay Elvarg!");
        setTimeout(() => {
          setState(s => {
            addToInventory(s.player, "anti_dragon_shield", 1);
            s.player.quests.dragon_slayer = 1;
            addChat(s, "📜 Quest Started: Dragon Slayer! Received Anti-Dragon Shield.", "#FFD700");
          });
        }, 100);
      } else if (q === 1) {
        lines.push("⚔️ Guildmaster Brian: 'Equip your Anti-Dragon Shield, board the ship at the eastern dock, and slay Elvarg in the Crandor Dragon Crypt!'");
      } else if (q === 2) {
        lines.push("⚔️ Guildmaster Brian: 'BY THE GODS! You have slain Elvarg the Dragon!'");
        lines.push("I hereby name you a Grand Champion of Eldara!");
        lines.push("🏆 QUEST COMPLETE: Dragon Slayer!");
        lines.push("🎁 Rewards: 18,650 Strength & Defence XP, unlocked Dragon Scimitar & Dragon Armor, +2 Quest Points!");
        setTimeout(() => {
          setState(s => {
            addXp(s.player, "strength", 18650);
            addXp(s.player, "defence", 18650);
            addToInventory(s.player, "dragon_scimitar", 1);
            addToInventory(s.player, "dragon_platebody", 1);
            s.player.quests.dragon_slayer = 100;
            s.player.questPoints = (s.player.questPoints ?? 0) + 2;
            addChat(s, "🎉 Quest Complete: Dragon Slayer! Unlocked Dragon Weapons & Armor! (+2 Quest Points)", "#00FF44");
          });
        }, 100);
      } else {
        lines.push("⚔️ Guildmaster Brian: 'Hail, Dragon Slayer! The finest weapons in the realm are at your service.'");
      }
    }

    else {
      if (entity.chatterLines.length > 0) {
        lines.push(entity.chatterLines[Math.floor(Math.random() * entity.chatterLines.length)]);
      } else {
        lines.push(entity.examineText);
      }
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <div style={dialogHeader}>
          <span style={{ fontSize: 18 }}>{entity.emoji}</span>
          <span style={{ color: "#FFD700", fontWeight: "bold", flex: 1, marginLeft: 6 }}>{entity.name}</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 12 }}>
          {lines.map((line, i) => (
            <p key={i} style={{ color: line.startsWith("🎯") ? "#00E5FF" : line.startsWith("🏆") ? "#00FF44" : "#FFF", fontSize: 11, marginBottom: 8, lineHeight: 1.4 }}>
              {line}
            </p>
          ))}

          {/* Special Contextual NPC Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {entity.type === "npc_leprechaun" && (
              <button
                onClick={() => setOpenSubShop("npc_leprechaun")}
                style={{ ...buyBtn, padding: "6px 0", textAlign: "center" }}
              >
                🌱 Open Farming & Seeds Store
              </button>
            )}

            {entity.type === "npc_slayer_master" && (
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => {
                    setState(s => { assignSlayerTask(s); });
                    forceUpdate();
                  }}
                  style={{ ...buyBtn, flex: 1, padding: "6px 0", textAlign: "center" }}
                >
                  {player.slayerTask ? "New Task" : "🗡️ Assign Slayer Task"}
                </button>
                {player.slayerTask && (
                  <button
                    onClick={() => {
                      setState(s => { cancelSlayerTask(s); });
                      forceUpdate();
                    }}
                    style={{ ...tabBtn, flex: 1, padding: "6px 0", textAlign: "center", color: "#FF4444" }}
                  >
                    Cancel (30 Pts)
                  </button>
                )}
                <button
                  onClick={() => setOpenSubShop("npc_slayer_master")}
                  style={{ ...activeTabBtn, flex: 1, padding: "6px 0", textAlign: "center" }}
                >
                  Slayer Shop 💎
                </button>
              </div>
            )}

            {entity.type === "npc_grace" && (
              <button
                onClick={() => setOpenSubShop("npc_grace")}
                style={{ ...buyBtn, padding: "6px 0", textAlign: "center", background: "linear-gradient(180deg, #00BCD4 0%, #00838F 100%)" }}
              >
                🏃 Grace's Graceful Clothing Shop (Trade Marks)
              </button>
            )}

            {entity.type === "npc_estate_agent" && (
              <button
                onClick={() => setOpenSubShop("npc_estate_agent")}
                style={{ ...buyBtn, padding: "6px 0", textAlign: "center", background: "linear-gradient(180deg, #795548 0%, #4E342E 100%)" }}
              >
                🏠 Estate Construction Store & Materials
              </button>
            )}

            {entity.type === "npc_kolodion" && (
              <button
                onClick={() => setOpenSubShop("npc_kolodion")}
                style={{ ...buyBtn, padding: "6px 0", textAlign: "center", background: "linear-gradient(180deg, #673AB7 0%, #311B92 100%)" }}
              >
                🧙 Mage Arena II God Capes Shop
              </button>
            )}

            {entity.type === "npc_tzhaar_master" && (
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => {
                    onClose();
                    setState(s => { startFightCaves(s); });
                    forceUpdate();
                  }}
                  style={{ ...buyBtn, flex: 1, padding: "6px 0", textAlign: "center", background: "linear-gradient(180deg, #E65100 0%, #BF360C 100%)" }}
                >
                  🌋 Enter Fight Caves
                </button>
                <button
                  onClick={() => setOpenSubShop("npc_tzhaar_master")}
                  style={{ ...activeTabBtn, flex: 1, padding: "6px 0", textAlign: "center" }}
                >
                  Tokkul Shop 🔥
                </button>
              </div>
            )}

            {entity.type === "npc_shopkeeper_weapons" && (
              <button
                onClick={() => setOpenSubShop("npc_shopkeeper_weapons")}
                style={{ ...buyBtn, padding: "6px 0", textAlign: "center" }}
              >
                Trade Weapons Shop ⚔️
              </button>
            )}

            <button onClick={onClose} style={{ ...buyBtn, padding: "6px 0", textAlign: "center" }}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClueScrollDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const clue = state.player.activeClue;
  if (!clue) return null;

  const currentStep = clue.currentStep;
  const isNearTarget =
    (currentStep.targetZone === state.zoneId) &&
    (currentStep.targetX === undefined || Math.abs(state.player.tileX - currentStep.targetX) <= 2) &&
    (currentStep.targetY === undefined || Math.abs(state.player.tileY - currentStep.targetY) <= 2);

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 340, background: "linear-gradient(180deg, #F3E5AB 0%, #D4B26F 100%)", border: "2px solid #8D6E63", color: "#3E2723" }}>
        <div style={{ ...dialogHeader, background: "#8D6E63" }}>
          <span style={{ color: "#FFF", fontWeight: "bold", fontSize: 11 }}>📜 Clue Scroll ({clue.tier})</span>
          <span style={{ color: "#FFE082", fontSize: 9.5, marginLeft: 8 }}>Step {clue.stepNumber}/{clue.totalSteps}</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontStyle: "italic", fontSize: 11.5, lineHeight: 1.5, background: "rgba(255,255,255,0.45)", padding: 10, borderRadius: 6, border: "1px dashed #8D6E63", textAlign: "center" }}>
            "{currentStep.clueText}"
          </div>

          <div style={{ fontSize: 9.5, color: "#4E342E", background: "rgba(0,0,0,0.06)", padding: 6, borderRadius: 4 }}>
            💡 <strong>Hint:</strong> {currentStep.hint}
          </div>

          <div style={{ fontSize: 9, color: "#5D4037" }}>
            📍 <strong>Target Area:</strong> {currentStep.targetZone.replace(/_/g, " ").toUpperCase()} {currentStep.targetX !== undefined ? `(${currentStep.targetX}, ${currentStep.targetY})` : ""}
          </div>

          <button
            onClick={() => {
              if (isNearTarget) {
                setState(s => { solveClueStep(s); });
                forceUpdate();
                if (clue.stepNumber >= clue.totalSteps) onClose();
              } else {
                addChat(state, `You search the area, but find nothing of interest here. Check the clue hint!`, "#FF9800");
                forceUpdate();
              }
            }}
            style={{
              ...buyBtn,
              background: isNearTarget ? "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)" : "linear-gradient(180deg, #FF9800 0%, #F57C00 100%)",
              fontSize: 10,
              padding: "8px 0",
              textAlign: "center",
            }}
          >
            {isNearTarget ? "✨ Investigate / Dig Clue Target! ✨" : "🔍 Search Current Location (Not at target yet)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const HouseBuilderDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const [tab, setTab] = useState<"rooms" | "furniture">("rooms");
  const player = state.player;
  const conLevel = getSkillLevel(player, "construction");

  const availableRooms: { type: HouseRoomType; name: string; reqLvl: number; cost: number; emoji: string }[] = [
    { type: "GARDEN", name: "Formal Garden", reqLvl: 1, cost: 1000, emoji: "🌳" },
    { type: "PARLOUR", name: "Parlour", reqLvl: 1, cost: 5000, emoji: "🪑" },
    { type: "WORKSHOP", name: "Workshop", reqLvl: 15, cost: 10000, emoji: "⚒️" },
    { type: "MENAGERIE", name: "Pet Menagerie", reqLvl: 37, cost: 30000, emoji: "🛋️" },
    { type: "CHAPEL", name: "Chapel (Altars)", reqLvl: 45, cost: 50000, emoji: "✝️" },
    { type: "PORTAL_CHAMBER", name: "Portal Chamber", reqLvl: 50, cost: 100000, emoji: "🌀" },
  ];

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 380 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 12 }}>🏠 Estate Architecture Workshop</span>
          <span style={{ color: "#00E5FF", fontSize: 10, marginLeft: 8 }}>Con Lvl: {conLevel}</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 4, padding: 4 }}>
          <button onClick={() => setTab("rooms")} style={tab === "rooms" ? activeTabBtn : tabBtn}>Build Rooms 🏛️</button>
          <button onClick={() => setTab("furniture")} style={tab === "furniture" ? activeTabBtn : tabBtn}>Craft Furniture 🪚</button>
        </div>

        <div style={listStyle}>
          {tab === "rooms" ? (
            availableRooms.map(r => {
              const alreadyBuilt = player.house.rooms.some(rm => rm.type === r.type);
              const canBuild = conLevel >= r.reqLvl && countItem(player, "coins") >= r.cost && !alreadyBuilt;

              return (
                <div key={r.type} style={listItemStyle}>
                  <span style={{ fontSize: 20 }}>{r.emoji}</span>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#FFF", fontSize: 10, fontWeight: "bold" }}>{r.name}</span>
                    <span style={{ color: conLevel >= r.reqLvl ? "#00FF80" : "#FF4444", fontSize: 8 }}>
                      Req: Lvl {r.reqLvl} Construction • Cost: {r.cost.toLocaleString()}gp
                    </span>
                  </div>
                  <button
                    disabled={!canBuild}
                    onClick={() => {
                      setState(s => { buildHouseRoom(s, r.type, 0, 0); });
                      forceUpdate();
                    }}
                    style={{
                      ...buyBtn,
                      background: alreadyBuilt ? "#333" : canBuild ? "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)" : "#42372A",
                      fontSize: 8.5,
                      cursor: canBuild ? "pointer" : "not-allowed",
                    }}
                  >
                    {alreadyBuilt ? "Built ✅" : "Build"}
                  </button>
                </div>
              );
            })
          ) : (
            FURNITURE_RECIPES.map(f => {
              const canCraft = conLevel >= f.levelReq;
              return (
                <div key={f.id} style={listItemStyle}>
                  <span style={{ fontSize: 18 }}>{f.emoji}</span>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#FFF", fontSize: 9.5, fontWeight: "bold" }}>{f.name}</span>
                    <span style={{ color: "#FFD700", fontSize: 7.5 }}>Req: Lvl {f.levelReq} Con • +{f.xp} XP</span>
                    <span style={{ color: "#AAA", fontSize: 7 }}>{f.bonusDescription}</span>
                  </div>
                  <button
                    onClick={() => {
                      setState(s => { buildFurniture(s, f.id); });
                      forceUpdate();
                    }}
                    style={{ ...buyBtn, fontSize: 8.5 }}
                  >
                    Craft
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export const RaidPartyDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const raid = state.player.raidState;
  const isRaiding = !!(raid && raid.active);

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 380, border: "2px solid #E040FB" }}>
        <div style={{ ...dialogHeader, background: "linear-gradient(180deg, #4A148C 0%, #1A0033 100%)" }}>
          <span style={{ color: "#E040FB", fontWeight: "bold", fontSize: 12 }}>🐉 Chambers of Xeric Expedition</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ color: "#FFF", fontSize: 9.5, lineHeight: 1.4 }}>
            Delve deep into the ancient Mount Quidamortem ruins. Battle through 3 chambers of mythical titans to claim legendary rewards!
          </p>

          <div style={{ background: "#120D1A", padding: 8, borderRadius: 4, border: "1px solid #7B1FA2" }}>
            <div style={{ color: "#FFD700", fontSize: 9, fontWeight: "bold", marginBottom: 4 }}>🏰 Chamber Progression:</div>
            <div style={{ color: isRaiding && raid?.currentRoom === 1 ? "#00E5FF" : "#AAA", fontSize: 8.5 }}>
              1. 🔨 Tekton the Obsidian Smith (Hammer strikes & forge meteors)
            </div>
            <div style={{ color: isRaiding && raid?.currentRoom === 2 ? "#00E5FF" : "#AAA", fontSize: 8.5 }}>
              2. 🐊 Mutadile & Sacred Tree of Life (Tidal surges & healing)
            </div>
            <div style={{ color: isRaiding && raid?.currentRoom === 3 ? "#00E5FF" : "#AAA", fontSize: 8.5 }}>
              3. 🐉 The Great Olm (Crystal rain & lightning surge walls)
            </div>
          </div>

          <div style={{ background: "#1C1424", padding: 6, borderRadius: 4, fontSize: 8, color: "#E040FB" }}>
            🌟 <strong>Mythic Unique Spoils:</strong> Twisted Bow, Elder Maul, Ancestral Robes, Prayer Scrolls, Pet Olmlet!
          </div>

          {isRaiding ? (
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => {
                  setState(s => { progressRaid(s); });
                  forceUpdate();
                }}
                style={{ ...buyBtn, flex: 1, padding: "6px 0", textAlign: "center", background: "linear-gradient(180deg, #00C853 0%, #007E33 100%)" }}
              >
                ⚔️ Advance Chamber / Fight
              </button>
              <button
                onClick={() => {
                  setState(s => { finishRaidAndReward(s); });
                  forceUpdate();
                }}
                style={{ ...buyBtn, flex: 1, padding: "6px 0", textAlign: "center", background: "linear-gradient(180deg, #FFD700 0%, #FF8F00 100%)", color: "#000" }}
              >
                💎 Claim Raid Spoils
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                setState(s => { startRaid(s); });
                forceUpdate();
              }}
              style={{ ...buyBtn, padding: "8px 0", textAlign: "center", background: "linear-gradient(180deg, #7B1FA2 0%, #4A148C 100%)" }}
            >
              🚀 Launch Chambers of Xeric Raid Expedition
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const PetMenagerieDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const player = state.player;
  const activePetId = player.activePet;
  const activePet = activePetId ? PETS_DATABASE[activePetId] : null;

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 360, border: "2px solid #00BCD4" }}>
        <div style={{ ...dialogHeader, background: "linear-gradient(180deg, #006064 0%, #002224 100%)" }}>
          <span style={{ color: "#00E5FF", fontWeight: "bold", fontSize: 12 }}>🐾 Pet Menagerie & Companions</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {activePet ? (
            <div style={{ background: "#0A1F24", border: "1px solid #00838F", borderRadius: 6, padding: 8, textAlign: "center" }}>
              <div style={{ fontSize: 32 }}>{activePet.emoji}</div>
              <div style={{ color: "#00E5FF", fontSize: 11, fontWeight: "bold" }}>{activePet.name}</div>
              <div style={{ color: "#FFEE33", fontSize: 8.5, marginTop: 2 }}>{activePet.perkDescription}</div>
              <div style={{ color: "#AAA", fontSize: 8, fontStyle: "italic", marginTop: 4 }}>"{activePet.dialogue}"</div>

              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                <button
                  onClick={() => {
                    setState(s => { interactPet(s, "trick"); });
                    forceUpdate();
                  }}
                  style={{ ...buyBtn, flex: 1, fontSize: 8, padding: "4px 0" }}
                >
                  ✨ Do Trick
                </button>
                <button
                  onClick={() => {
                    setState(s => { interactPet(s, "feed"); });
                    forceUpdate();
                  }}
                  style={{ ...buyBtn, flex: 1, fontSize: 8, padding: "4px 0", background: "linear-gradient(180deg, #FF9800 0%, #E65100 100%)" }}
                >
                  🍖 Feed Treat
                </button>
                <button
                  onClick={() => {
                    setState(s => { summonPet(s, activePet.id); });
                    forceUpdate();
                  }}
                  style={{ ...tabBtn, flex: 1, fontSize: 8, padding: "4px 0", color: "#FF5252" }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: "#AAA", fontSize: 9, textAlign: "center", padding: 8, background: "#111", borderRadius: 4 }}>
              You do not have an active pet summoned. Click on any pet in your inventory or below to summon!
            </div>
          )}

          <div style={{ color: "#FFD700", fontSize: 9, fontWeight: "bold" }}>🐾 Available Companions:</div>
          <div style={{ maxHeight: 120, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.values(PETS_DATABASE).map(p => {
              const hasInInv = countItem(player, p.id) > 0;
              const isCurrent = activePetId === p.id;
              return (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: isCurrent ? "#00363A" : "#1A1A1A", padding: "4px 6px", borderRadius: 4, border: "1px solid #333" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{p.emoji}</span>
                    <span style={{ color: "#FFF", fontSize: 8.5 }}>{p.name}</span>
                  </div>
                  <button
                    disabled={!hasInInv && !isCurrent}
                    onClick={() => {
                      setState(s => { summonPet(s, p.id); });
                      forceUpdate();
                    }}
                    style={{
                      ...buyBtn,
                      fontSize: 8,
                      padding: "2px 6px",
                      background: isCurrent ? "#D32F2F" : hasInInv ? "#00C853" : "#444",
                    }}
                  >
                    {isCurrent ? "Dismiss" : hasInInv ? "Summon" : "Locked"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// === Grand Exchange Trading Dialog ===
export const GrandExchangeDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const [selectedItemId, setSelectedItemId] = useState("lobster");
  const [price, setPrice] = useState(250);
  const [quantity, setQuantity] = useState(1);
  const [isBuy, setIsBuy] = useState(true);

  const player = state.player;

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 400 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 13, flex: 1 }}>⚖️ Grand Exchange Market</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setIsBuy(true)}
              style={{ ...activeTabBtn, flex: 1, background: isBuy ? "#2E7D32" : "#1A1A1A", color: isBuy ? "#FFF" : "#888" }}
            >
              🛒 Create Buy Offer
            </button>
            <button
              onClick={() => setIsBuy(false)}
              style={{ ...activeTabBtn, flex: 1, background: !isBuy ? "#C62828" : "#1A1A1A", color: !isBuy ? "#FFF" : "#888" }}
            >
              🏷️ Create Sell Offer
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "#181410", padding: 10, borderRadius: 6, border: "1px solid #3A2A1A" }}>
            <label style={{ color: "#AAA", fontSize: 9 }}>Item ID:</label>
            <input
              type="text"
              value={selectedItemId}
              onChange={e => setSelectedItemId(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
              style={{ background: "#251E17", border: "1px solid #5A442E", color: "#FFD700", padding: "4px 8px", borderRadius: 4, fontSize: 10 }}
            />

            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <label style={{ color: "#AAA", fontSize: 8.5 }}>Price per Item (Coins):</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ background: "#251E17", border: "1px solid #5A442E", color: "#FFF", padding: "4px 8px", borderRadius: 4, fontSize: 10 }}
                />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <label style={{ color: "#AAA", fontSize: 8.5 }}>Quantity:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ background: "#251E17", border: "1px solid #5A442E", color: "#FFF", padding: "4px 8px", borderRadius: 4, fontSize: 10 }}
                />
              </div>
            </div>

            <div style={{ color: "#00E5FF", fontSize: 9, fontWeight: "bold", textAlign: "right" }}>
              Total Value: 🪙 {(price * quantity).toLocaleString()} Coins
            </div>

            <button
              onClick={() => {
                setState(s => { createGeOffer(s, selectedItemId, price, quantity, isBuy); });
                forceUpdate();
              }}
              style={{
                background: isBuy ? "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)" : "linear-gradient(180deg, #E53935 0%, #C62828 100%)",
                border: "none", color: "#FFF", fontWeight: "bold", padding: "6px 0", borderRadius: 4, cursor: "pointer", fontSize: 10,
              }}
            >
              {isBuy ? "Confirm Buy Order" : "Confirm Sell Order"}
            </button>
          </div>

          <div style={{ color: "#FFD700", fontSize: 9, fontWeight: "bold" }}>📜 Recent Completed Trade Offers:</div>
          <div style={{ maxHeight: 110, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {player.geOffers.length > 0 ? (
              player.geOffers.slice().reverse().map(o => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", background: "#111", padding: "4px 6px", borderRadius: 3, border: "1px solid #333", fontSize: 8 }}>
                  <span style={{ color: o.isBuyOffer ? "#4CAF50" : "#E53935" }}>{o.isBuyOffer ? "[BUY]" : "[SELL]"} {o.totalQty}x {o.itemName}</span>
                  <span style={{ color: "#FFD700" }}>@ {o.pricePerItem} ea</span>
                </div>
              ))
            ) : (
              <span style={{ color: "#888", fontSize: 8, textAlign: "center" }}>No active or past trade offers recorded.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// === Dragon Slayer Quest Dialog ===
export const DragonSlayerQuestDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const ds = state.player.dragonSlayer;

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 380 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 12, flex: 1 }}>📜 Dragon Slayer Quest Journal</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "#1A1510", padding: 10, borderRadius: 6, border: "1px solid #8D6E63" }}>
            <span style={{ color: "#FFD700", fontSize: 11, fontWeight: "bold" }}>🐉 Objective: Defeat Elvarg of Crandor</span>
            <div style={{ color: "#D7CCC8", fontSize: 8.5, lineHeight: 1.4 }}>
              {DRAGON_SLAYER_QUEST_STEPS[Math.min(ds.step, 5)].desc}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
              <div style={{ color: countItem(state.player, "map_piece_1") > 0 ? "#00FF80" : "#FF5252", fontSize: 8 }}>
                {countItem(state.player, "map_piece_1") > 0 ? "✓" : "✗"} Melzar's Map Piece (Melzar's Catacombs)
              </div>
              <div style={{ color: countItem(state.player, "map_piece_2") > 0 ? "#00FF80" : "#FF5252", fontSize: 8 }}>
                {countItem(state.player, "map_piece_2") > 0 ? "✓" : "✗"} Thalzar's Map Piece (Skeleton Crypt)
              </div>
              <div style={{ color: countItem(state.player, "map_piece_3") > 0 ? "#00FF80" : "#FF5252", fontSize: 8 }}>
                {countItem(state.player, "map_piece_3") > 0 ? "✓" : "✗"} Lozar's Map Piece (Goblin Den)
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setState(s => { progressDragonSlayer(s); });
              forceUpdate();
            }}
            style={{
              background: "linear-gradient(180deg, #FFB300 0%, #E65100 100%)",
              border: "none", color: "#211406", fontWeight: "bold", padding: "8px 0", borderRadius: 4, cursor: "pointer", fontSize: 10,
            }}
          >
            💬 Speak to Captain Ned
          </button>
        </div>
      </div>
    </div>
  );
};

// === Combat Achievements Dialog ===
export const CombatAchievementsDialog: React.FC<DialogProps> = ({ state, onClose }) => {
  const ca = state.player.combatAchievements;

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 400 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 13, flex: 1 }}>🏆 Combat Achievements</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", background: "#1A1A1A", padding: "6px 10px", borderRadius: 4, border: "1px solid #333" }}>
            <span style={{ color: "#00E5FF", fontSize: 9, fontWeight: "bold" }}>Tasks Completed: {ca.completedTasks.length}/{COMBAT_ACHIEVEMENTS.length}</span>
            <span style={{ color: "#FFD700", fontSize: 9, fontWeight: "bold" }}>Ghalak Hilts Unlocked: {ca.completedTasks.length}</span>
          </div>

          <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {COMBAT_ACHIEVEMENTS.map(t => {
              const isDone = ca.completedTasks.includes(t.id);
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: isDone ? "#1B3A1B" : "#181410", padding: "6px 8px", borderRadius: 4, border: isDone ? "1px solid #4CAF50" : "1px solid #3A2A1A" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: isDone ? "#00FF80" : "#AAA", fontWeight: "bold", fontSize: 9 }}>{t.name}</span>
                      <span style={{ background: "#333", color: "#FFD700", fontSize: 7, padding: "1px 4px", borderRadius: 2 }}>{t.tier}</span>
                    </div>
                    <span style={{ color: "#888", fontSize: 7.5 }}>{t.desc}</span>
                  </div>
                  <span style={{ color: isDone ? "#00FF80" : "#FF5252", fontWeight: "bold", fontSize: 10 }}>
                    {isDone ? "✓ DONE" : "LOCKED"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// === Collection Log Dialog ===
export const CollectionLogDialog: React.FC<DialogProps> = ({ state, onClose }) => {
  const [activeCat, setActiveCat] = useState("raids_cox");
  const log = state.player.collectionLog;
  const currentCat = COLLECTION_LOG_CATEGORIES.find(c => c.id === activeCat) ?? COLLECTION_LOG_CATEGORIES[0];

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 420 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 13, flex: 1 }}>📖 Universal Collection Log</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
            {COLLECTION_LOG_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                style={{ ...tabBtn, background: activeCat === c.id ? "#4A3A2A" : "#1A1A1A", color: activeCat === c.id ? "#FFD700" : "#AAA" }}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, maxHeight: 200, overflowY: "auto", background: "#110D0A", padding: 8, borderRadius: 6, border: "1px solid #33271C" }}>
            {currentCat.items.map(id => {
              const item = getItem(id);
              const count = log[id] ?? 0;
              const obtained = count > 0;
              return (
                <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: obtained ? "#2E241A" : "#181818", border: obtained ? "1px solid #FFD700" : "1px solid #333", borderRadius: 4, padding: 6, opacity: obtained ? 1 : 0.4 }}>
                  <span style={{ fontSize: 20 }}>{item.iconEmoji}</span>
                  <span style={{ color: obtained ? "#FFF" : "#777", fontSize: 7, textAlign: "center", fontWeight: "bold", marginTop: 2 }}>{item.name}</span>
                  <span style={{ color: obtained ? "#00FF80" : "#FF5252", fontSize: 7.5, fontWeight: "900" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// === Clan Hall & Registrar Dialog ===
export const ClanHallDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const [clanNameInput, setClanNameInput] = useState("Dragons of Brindle");
  const player = state.player;

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 380 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 13, flex: 1 }}>🚩 Clan Guild Hall & Registrar</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {player.clan ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#1A1510", padding: 10, borderRadius: 6, border: "1px solid #8D6E63" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 24 }}>{player.clan.bannerEmoji}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "#FFD700", fontSize: 12, fontWeight: "bold" }}>Clan [{player.clan.name}]</span>
                  <span style={{ color: "#00E5FF", fontSize: 8.5 }}>Rank: {player.clan.rank} | Members: {player.clan.memberCount}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setState(s => { changeZone(s, "clan_hall"); });
                  onClose();
                }}
                style={{ background: "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)", border: "none", color: "#FFF", fontWeight: "bold", padding: "6px 0", borderRadius: 4, cursor: "pointer", fontSize: 9.5 }}
              >
                🚪 Enter Clan Guild Hall
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#181410", padding: 10, borderRadius: 6, border: "1px solid #3A2A1A" }}>
              <span style={{ color: "#FFD700", fontSize: 10, fontWeight: "bold" }}>📜 Found a New Clan:</span>
              <input
                type="text"
                value={clanNameInput}
                onChange={e => setClanNameInput(e.target.value)}
                style={{ background: "#251E17", border: "1px solid #5A442E", color: "#FFD700", padding: "4px 8px", borderRadius: 4, fontSize: 10 }}
              />
              <button
                onClick={() => {
                  setState(s => { createClan(s, clanNameInput, "🚩"); });
                  forceUpdate();
                }}
                style={{ background: "linear-gradient(180deg, #FFB300 0%, #E65100 100%)", border: "none", color: "#211406", fontWeight: "bold", padding: "6px 0", borderRadius: 4, cursor: "pointer", fontSize: 9.5 }}
              >
                Register Clan Charter (Requires Charter Scroll)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// === Barrows Crypts Dialog ===
export const BarrowsDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  const bs = state.player.barrowsState;

  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 380 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 13, flex: 1 }}>⚰️ Barrows Crypts Mound</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#1A1510", padding: 10, borderRadius: 6, border: "1px solid #8D6E63", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: "#FFD700", fontSize: 11, fontWeight: "bold" }}>Defeat the 6 Barrows Brothers!</span>
            <span style={{ color: "#AAA", fontSize: 8.5 }}>Total Crypt Chests Looted: {bs.chestsLooted}</span>
          </div>

          <button
            onClick={() => {
              setState(s => { openBarrowsChest(s); });
              forceUpdate();
            }}
            style={{ background: "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)", border: "none", color: "#FFF", fontWeight: "bold", padding: "8px 0", borderRadius: 4, cursor: "pointer", fontSize: 10 }}
          >
            ⚰️ Search Barrows Rewards Chest
          </button>
        </div>
      </div>
    </div>
  );
};

// === Theatre of Blood (ToB) Dialog ===
export const ToBRaidDialog: React.FC<DialogProps> = ({ state, setState, forceUpdate, onClose }) => {
  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 380 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 13, flex: 1 }}>🩸 Theatre of Blood Raid</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#1A1010", padding: 10, borderRadius: 6, border: "1px solid #C62828", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: "#E53935", fontSize: 11, fontWeight: "bold" }}>Verzik Vitur's Sanguine Chamber</span>
            <span style={{ color: "#AAA", fontSize: 8.5 }}>Face Maiden, Bloat, Sotetseg, and Verzik Vitur for Scythe of Vitur & Sanguinesti Staff!</span>
          </div>

          <button
            onClick={() => {
              setState(s => { finishToBRaid(s); });
              forceUpdate();
            }}
            style={{ background: "linear-gradient(180deg, #E53935 0%, #B71C1C 100%)", border: "none", color: "#FFF", fontWeight: "bold", padding: "8px 0", borderRadius: 4, cursor: "pointer", fontSize: 10 }}
          >
            🩸 Challenge Verzik Vitur & Claim Sanguine Chest
          </button>
        </div>
      </div>
    </div>
  );
};

// === World Highscores Leaderboard Dialog ===
export const HighscoresLeaderboardDialog: React.FC<DialogProps> = ({ state, onClose }) => {
  return (
    <div style={overlayStyle}>
      <div style={{ ...dialogStyle, width: 420 }}>
        <div style={dialogHeader}>
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: 13, flex: 1 }}>🥇 World Highscores Leaderboard</span>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>
        <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {DEFAULT_LEADERBOARD.map(e => (
              <div key={e.rank} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: e.rank === 1 ? "#3E2723" : "#181410", padding: "6px 8px", borderRadius: 4, border: e.rank === 1 ? "1px solid #FFD700" : "1px solid #333" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: e.rank === 1 ? "#FFD700" : "#AAA", fontWeight: "bold", fontSize: 10 }}>#{e.rank}</span>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#FFF", fontWeight: "bold", fontSize: 9 }}>{e.playerName}</span>
                    <span style={{ color: "#888", fontSize: 7.5 }}>Total Lvl: {e.totalLevel} | CB: {e.combatLevel}</span>
                  </div>
                </div>
                <span style={{ color: "#00FF80", fontSize: 8.5, fontWeight: "bold" }}>{(e.totalXp / 1000000).toFixed(1)}M XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


