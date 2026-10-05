import React, { useRef, useEffect, useCallback, useState } from "react";
import type { GameState, WorldEntity } from "./engine";
import { findPath } from "./engine";
import { getItem } from "./data/items";
import type { ZoneTileType } from "./types";
import type { GameSettings } from "./settings";

const BASE_TILE_W = 96;
const BASE_TILE_H = 48;
const BASE_WALL_H = 42;
const BASE_FENCE_H = 22;

const TILE_COLORS: Record<ZoneTileType, string> = {
  GRASS: "#3a5a2a",
  PATH_COBBLE: "#8a8a7a",
  DIRT: "#6b5337",
  SAND: "#d4c08a",
  WATER: "#2a4a7a",
  BRIDGE: "#8a6a4a",
  FLOOR_WOOD: "#9a7a5a",
  FLOOR_STONE: "#aaa",
  WALL_STONE: "#555",
  WALL_WOOD: "#6a4a2a",
  FENCE: "#8a6a4a",
  JUNGLE: "#2a4a1a",
  OCEAN_WATER: "#1a3a6a",
  BEACH_SAND: "#e4d4a0",
  LAVA: "#cc4400",
  SWAMP_MUCK: "#4a4a2a",
  MARBLE_STONE: "#ddd",
  AUTUMN_DIRT: "#8a6a3a",
  SNOW: "#eef",
};

const ELEVATED_TILES = new Set<string>(["WALL_STONE", "WALL_WOOD", "FENCE"]);
const WATER_TILES = new Set<string>(["WATER", "OCEAN_WATER"]);

function darken(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.floor(r * (1 - amt))},${Math.floor(g * (1 - amt))},${Math.floor(b * (1 - amt))})`;
}

function lighten(hex: string, amt: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, Math.floor(r + (255 - r) * amt))},${Math.min(255, Math.floor(g + (255 - g) * amt))},${Math.min(255, Math.floor(b + (255 - b) * amt))})`;
}

function getRelativeCombatLevelColor(target: number, player: number): string {
  const d = target - player;
  if (d >= 10) return "#FF3333";
  if (d >= 4) return "#FF6600";
  if (d >= 1) return "#FFAA00";
  if (d === 0) return "#FFEE33";
  if (d >= -3) return "#B4FF33";
  if (d >= -9) return "#66FF44";
  return "#00FF44";
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, fill: string) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawDiamondStroke(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, stroke: string, lw = 1) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lw;
  ctx.stroke();
}

function drawShadow(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fill();
}

function drawWallBlock(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, height: number, topColor: string) {
  // Left face
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, cy);
  ctx.lineTo(cx - w / 2, cy - height);
  ctx.lineTo(cx, cy - height + h / 2);
  ctx.lineTo(cx, cy + h / 2);
  ctx.closePath();
  ctx.fillStyle = darken(topColor, 0.25);
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(cx + w / 2, cy);
  ctx.lineTo(cx + w / 2, cy - height);
  ctx.lineTo(cx, cy - height + h / 2);
  ctx.lineTo(cx, cy + h / 2);
  ctx.closePath();
  ctx.fillStyle = darken(topColor, 0.45);
  ctx.fill();

  // Top diamond
  drawDiamond(ctx, cx, cy - height, w, h, topColor);
  drawDiamondStroke(ctx, cx, cy - height, w, h, "rgba(0,0,0,0.25)");
}

interface Props {
  state: GameState;
  setState: (updater: (s: GameState) => void) => void;
  forceUpdate: () => void;
  onEntityClick: (entity: WorldEntity) => void;
  onGroundItemClick: (item: any) => void;
  settings: GameSettings;
}

export const GameCanvas: React.FC<Props> = ({ state, setState, forceUpdate, onEntityClick, onGroundItemClick, settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevWasActiveRef = useRef(false);
  const [showIdleFlash, setShowIdleFlash] = useState(false);
  const [zoom, setZoom] = useState<number>(() => {
    const saved = localStorage.getItem("dq_camera_zoom");
    return saved ? parseFloat(saved) : 1.8;
  });

  const updateZoom = useCallback((newZoom: number) => {
    const clamped = Math.min(3.5, Math.max(0.8, +newZoom.toFixed(2)));
    setZoom(clamped);
    localStorage.setItem("dq_camera_zoom", clamped.toString());
  }, []);

  const TILE_W = BASE_TILE_W * zoom;
  const TILE_H = BASE_TILE_H * zoom;
  const WALL_H = BASE_WALL_H * zoom;
  const FENCE_H = BASE_FENCE_H * zoom;

  // Monitor idle state for RuneLite Idle Notifier
  useEffect(() => {
    if (!settings.plugins.idleNotifier) return;
    const isPlayerActive = state.path.length > 0 || state.combatTargetId !== null || state.skillingTargetId !== null;
    
    if (prevWasActiveRef.current && !isPlayerActive) {
      setShowIdleFlash(true);
      const timer = setTimeout(() => setShowIdleFlash(false), 1500);
      return () => clearTimeout(timer);
    }
    prevWasActiveRef.current = isPlayerActive;
  }, [state.path.length, state.combatTargetId, state.skillingTargetId, settings.plugins.idleNotifier]);

  // Determine current active objective target entity ID
  let activeTargetId: string | null = null;
  const player = state.player;
  if (state.zoneId === "tutorial_island") {
    const step = player.tutorialStep ?? 0;
    if (step === 0) activeTargetId = "tut_guide";
    else if (step === 1) activeTargetId = "tut_tree_1";
    else if (step === 2) activeTargetId = "tut_fish_spot";
    else if (step === 3) activeTargetId = "tut_copper_rock";
    else if (step === 4) activeTargetId = "tut_anvil";
    else if (step === 5) activeTargetId = "tut_combat";
    else if (step === 6) activeTargetId = "tut_rat_1";
    else if (step >= 7) activeTargetId = "tut_dock";
  } else if (state.zoneId === "brindle_mainland") {
    if (player.quests.cooks_assistant === 1) activeTargetId = "brindle_cook";
    else if (player.quests.restless_ghost === 1) activeTargetId = "crypt_entrance";
    else if (player.quests.dragon_slayer === 1) activeTargetId = "crandor_ferry_dock";
    else if (player.quests.dragon_slayer === 2) activeTargetId = "brindle_weapon_shopkeeper";
  } else if (state.zoneId === "skeleton_crypt") {
    activeTargetId = "boss_malakor_1";
  } else if (state.zoneId === "dragon_crypt") {
    activeTargetId = "boss_elvarg_1";
  } else if (state.zoneId === "grimjaw_lair") {
    activeTargetId = "boss_grimjaw_1";
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;

    const camX = (state.player.tileX - state.player.tileY) * TILE_W / 2;
    const camY = (state.player.tileX + state.player.tileY) * TILE_H / 2;

    const toScreen = (tx: number, ty: number) => ({
      x: W / 2 + (tx - ty) * TILE_W / 2 - camX,
      y: H / 2 + (tx + ty) * TILE_H / 2 - camY,
    });

    // Sky/void background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "#0a0a14");
    bgGrad.addColorStop(0.5, "#12121e");
    bgGrad.addColorStop(1, "#0a0a14");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const zone = state.zone;

    // === PASS 1: Flat ground tiles ===
    for (let ty = 0; ty < zone.height; ty++) {
      for (let tx = 0; tx < zone.width; tx++) {
        const s = toScreen(tx, ty);
        if (s.x < -TILE_W || s.x > W + TILE_W || s.y < -TILE_H * 2 || s.y > H + TILE_H * 2) continue;

        const tileKey = `${tx},${ty}`;
        const tileType = zone.customTileMap.get(tileKey) ?? "GRASS";
        const baseColor = TILE_COLORS[tileType] ?? TILE_COLORS.GRASS;
        const checker = (tx + ty) % 2 === 0;
        const color = checker ? lighten(baseColor, 0.04) : baseColor;

        if (WATER_TILES.has(tileType)) {
          drawDiamond(ctx, s.x, s.y, TILE_W, TILE_H, darken(color, 0.15));
          drawDiamond(ctx, s.x, s.y, TILE_W - 6 * zoom, TILE_H - 3 * zoom, color);
        } else if (ELEVATED_TILES.has(tileType)) {
          drawDiamond(ctx, s.x, s.y, TILE_W, TILE_H, darken(color, 0.5));
        } else {
          drawDiamond(ctx, s.x, s.y, TILE_W, TILE_H, color);
          drawDiamondStroke(ctx, s.x, s.y, TILE_W, TILE_H, "rgba(0,0,0,0.08)");
        }
      }
    }

    // === PASS 1.5: Telegraphed Boss Danger Tiles ===
    if (state.dangerTiles) {
      for (const d of state.dangerTiles) {
        const s = toScreen(d.x, d.y);
        const pulse = 0.5 + Math.sin(Date.now() / 150) * 0.3;
        drawDiamond(ctx, s.x, s.y, TILE_W, TILE_H, `rgba(255, 23, 68, ${pulse})`);
        drawDiamondStroke(ctx, s.x, s.y, TILE_W + 2, TILE_H + 2, "#FF1744", 2);

        ctx.font = `bold ${Math.max(9, Math.round(9 * zoom))}px monospace`;
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.fillText("⚠️ DANGER", s.x, s.y);
      }
    }

    // === PASS 2: Depth-sorted elevated objects ===
    type RenderObj = { depth: number; kind: string; tx: number; ty: number; data?: any };
    const queue: RenderObj[] = [];

    for (let ty = 0; ty < zone.height; ty++) {
      for (let tx = 0; tx < zone.width; tx++) {
        const tileType = zone.customTileMap.get(`${tx},${ty}`) ?? "GRASS";
        if (!ELEVATED_TILES.has(tileType)) continue;
        const s = toScreen(tx, ty);
        if (s.x < -TILE_W * 2 || s.x > W + TILE_W * 2 || s.y < -TILE_H * 4 || s.y > H + TILE_H * 4) continue;
        queue.push({ depth: tx + ty, kind: "wall", tx, ty, data: tileType });
      }
    }

    const hidePassive = settings.plugins.entityHider;
    for (const e of state.entities) {
      if (e.isDead) continue;
      if (hidePassive && e.isNpc && !e.isCombatNpc && e.type !== "npc_banker" && e.type !== "npc_shopkeeper_general" && e.type !== "npc_shopkeeper_weapons") {
        continue;
      }

      const s = toScreen(e.tileX, e.tileY);
      if (s.x < -TILE_W * 2 || s.x > W + TILE_W * 2 || s.y < -TILE_H * 4 || s.y > H + TILE_H * 4) continue;
      queue.push({ depth: e.tileX + e.tileY + 0.1, kind: "entity", tx: e.tileX, ty: e.tileY, data: e });
    }

    for (const item of state.groundItems) {
      const s = toScreen(item.tileX, item.tileY);
      if (s.x < -TILE_W || s.x > W + TILE_W || s.y < -TILE_H * 2 || s.y > H + TILE_H * 2) continue;
      queue.push({ depth: item.tileX + item.tileY + 0.05, kind: "item", tx: item.tileX, ty: item.tileY, data: item });
    }

    // Player Follower Pet (render 1 tile behind player)
    if (player.activePet) {
      const petDef = getItem(player.activePet);
      const petTx = player.tileX + (state.path.length > 0 ? -Math.sign(player.tileX - (state.path[0]?.x ?? player.tileX)) : 0);
      const petTy = player.tileY + (state.path.length > 0 ? -Math.sign(player.tileY - (state.path[0]?.y ?? player.tileY)) : 1);
      queue.push({ depth: petTx + petTy + 0.08, kind: "pet", tx: petTx, ty: petTy, data: petDef });
    }

    queue.push({ depth: state.player.tileX + state.player.tileY + 0.1, kind: "player", tx: state.player.tileX, ty: state.player.tileY });

    queue.sort((a, b) => a.depth - b.depth);

    for (const obj of queue) {
      const s = toScreen(obj.tx, obj.ty);
      const cx = s.x, cy = s.y;

      if (obj.kind === "wall") {
        const tileType = obj.data as ZoneTileType;
        const color = TILE_COLORS[tileType] ?? "#555";
        const h = tileType === "FENCE" ? FENCE_H : WALL_H;
        drawWallBlock(ctx, cx, cy, TILE_W, TILE_H, h, color);
      } else if (obj.kind === "pet") {
        const petDef = obj.data;
        const bob = Math.sin(Date.now() / 250) * 4 * zoom;
        drawShadow(ctx, cx, cy + 2, TILE_W * 0.2, TILE_H * 0.2);
        ctx.font = `${Math.round(26 * zoom)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(petDef.iconEmoji, cx, cy - 10 * zoom - bob);

        ctx.font = `bold ${Math.max(9, Math.round(9.5 * zoom))}px sans-serif`;
        ctx.fillStyle = "#FF80AB";
        ctx.fillText("🐾 Pet", cx, cy - TILE_H / 2 - 14 * zoom - bob);
      } else if (obj.kind === "item") {
        const item = obj.data;
        drawShadow(ctx, cx, cy + 2, TILE_W * 0.25, TILE_H * 0.25);
        ctx.font = `${Math.round(28 * zoom)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(getItem(item.itemId).iconEmoji, cx, cy - 6 * zoom);
        if (item.qty > 1) {
          ctx.font = `bold ${Math.max(10, Math.round(11 * zoom))}px sans-serif`;
          ctx.fillStyle = "#FFD700";
          ctx.textAlign = "left";
          ctx.fillText(`${item.qty}`, cx - TILE_W / 4, cy + 2);
        }

        if (settings.plugins.groundItems) {
          const def = getItem(item.itemId);
          ctx.font = `bold ${Math.max(10, Math.round(10 * zoom))}px monospace`;
          ctx.fillStyle = def.tier === "LEGENDARY" || def.tier === "MYTHIC" ? "#FF9100" : def.tier === "RARE" ? "#FF33FF" : "#C0B29F";
          ctx.textAlign = "center";
          ctx.fillText(`${def.name}${item.qty > 1 ? ` x${item.qty}` : ""}`, cx, cy - 24 * zoom);
        }
      } else if (obj.kind === "entity") {
        const e = obj.data as WorldEntity;
        const isGoalTarget = activeTargetId === e.id || activeTargetId === e.type;

        // Draw pulsing beacon ring under goal target
        if (isGoalTarget) {
          const beaconPulse = 0.5 + Math.sin(Date.now() / 200) * 0.4;
          drawDiamond(ctx, cx, cy, TILE_W + 8 * zoom, TILE_H + 4 * zoom, `rgba(255, 215, 0, ${beaconPulse * 0.35})`);
          drawDiamondStroke(ctx, cx, cy, TILE_W + 8 * zoom, TILE_H + 4 * zoom, "#FFD700", 2.5);
        }

        drawShadow(ctx, cx, cy + 2, TILE_W * 0.3, TILE_H * 0.3);
        ctx.globalAlpha = e.depleted ? 0.3 : 1;
        ctx.font = `${Math.round(36 * zoom)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(e.emoji, cx, cy - 12 * zoom);
        ctx.globalAlpha = 1;

        // Frozen ice overlay
        if (e.frozenTicks && e.frozenTicks > 0) {
          ctx.font = `${Math.round(30 * zoom)}px serif`;
          ctx.fillText("🧊", cx, cy - 12 * zoom);
        }

        // Floating Waypoint Arrow directly over goal target
        if (isGoalTarget) {
          const arrowBob = Math.sin(Date.now() / 200) * 5 * zoom;
          ctx.font = `bold ${Math.max(12, Math.round(14 * zoom))}px sans-serif`;
          ctx.fillStyle = "#FFD700";
          ctx.textAlign = "center";
          ctx.fillText("⬇️ GOAL", cx, cy - TILE_H / 2 - 32 * zoom - arrowBob);
        }

        // Name
        if (e.isNpc || e.isInteractiveObject) {
          ctx.font = `bold ${Math.max(11, Math.round(11.5 * zoom))}px sans-serif`;
          ctx.fillStyle = isGoalTarget ? "#FFD700" : "#FFF";
          ctx.textAlign = "center";
          const name = e.name.length > 15 ? e.name.substring(0, 13) + ".." : e.name;
          ctx.fillText(name, cx, cy - TILE_H / 2 - 12 * zoom);

          // RuneLite Clue Helper Highlight Overlay
          const activeClue = state.player.activeClue;
          if (settings.plugins.clueHelper && activeClue && activeClue.currentStep && activeClue.currentStep.targetEntityId === e.id && activeClue.currentStep.targetZone === state.zoneId) {
            ctx.font = `bold ${Math.max(10, Math.round(10.5 * zoom))}px monospace`;
            ctx.fillStyle = "#00FF44";
            ctx.fillText("⭐ CLUE TARGET ⭐", cx, cy - TILE_H / 2 - 26 * zoom);
            drawDiamondStroke(ctx, cx, cy, TILE_W + 6, TILE_H + 3, "#00FF44", 2);
          }
        }

        // Combat level
        if (e.combatLevel > 0) {
          ctx.font = `bold ${Math.max(11, Math.round(12 * zoom))}px sans-serif`;
          ctx.fillStyle = getRelativeCombatLevelColor(e.combatLevel, state.player.combatLevel);
          ctx.textAlign = "center";
          const yOffset = e.isNpc || e.isInteractiveObject ? 24 * zoom : 14 * zoom;
          ctx.fillText(`Lv.${e.combatLevel}`, cx, cy - TILE_H / 2 - yOffset);
        }

        // HP bar
        if (e.currentHp < e.maxHp && e.maxHp > 1) {
          const bw = TILE_W - 6, bh = Math.max(5, Math.round(6 * zoom)), by = cy - TILE_H / 2 - 5 * zoom;
          ctx.fillStyle = "#000";
          ctx.fillRect(cx - bw / 2, by, bw, bh);
          ctx.fillStyle = "#FF4444";
          ctx.fillRect(cx - bw / 2, by, bw * (e.currentHp / e.maxHp), bh);
        }
      } else if (obj.kind === "player") {
        drawShadow(ctx, cx, cy + 2, TILE_W * 0.3, TILE_H * 0.3);
        ctx.font = `${Math.round(42 * zoom)}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(state.player.emoji || "🧙", cx, cy - 14 * zoom);

        ctx.font = `bold ${Math.max(12, Math.round(13 * zoom))}px sans-serif`;
        ctx.fillStyle = "#00E5FF";
        ctx.textAlign = "center";
        ctx.fillText(state.player.name, cx, cy - TILE_H / 2 - 14 * zoom);

        if (state.player.hp < state.player.maxHp) {
          const bw = TILE_W - 6, bh = Math.max(4, Math.round(5 * zoom)), by = cy - TILE_H / 2 - 4 * zoom;
          ctx.fillStyle = "#000";
          ctx.fillRect(cx - bw / 2, by, bw, bh);
          ctx.fillStyle = "#00FF00";
          ctx.fillRect(cx - bw / 2, by, bw * (state.player.hp / state.player.maxHp), bh);
        }
      }
    }

    // === PASS 3: Overlays ===
    if (settings.plugins.trueTile) {
      const ps = toScreen(state.player.tileX, state.player.tileY);
      drawDiamondStroke(ctx, ps.x, ps.y, TILE_W, TILE_H, "#00E5FF", 2);
      drawDiamond(ctx, ps.x, ps.y, TILE_W - 4, TILE_H - 2, "rgba(0, 229, 255, 0.08)");
    }

    // Path indicators
    for (let i = 0; i < state.path.length; i++) {
      const p = state.path[i];
      const s = toScreen(p.x, p.y);
      ctx.fillStyle = i === 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)";
      drawDiamond(ctx, s.x, s.y, TILE_W - 8, TILE_H - 4, ctx.fillStyle);
    }

    // Combat target
    if (state.combatTargetId) {
      const t = state.entities.find(e => e.id === state.combatTargetId);
      if (t && !t.isDead) {
        const s = toScreen(t.tileX, t.tileY);
        drawDiamondStroke(ctx, s.x, s.y, TILE_W, TILE_H, "#FF4444", 2);
      }
    }
    // Skilling target
    if (state.skillingTargetId) {
      const t = state.entities.find(e => e.id === state.skillingTargetId);
      if (t) {
        const s = toScreen(t.tileX, t.tileY);
        drawDiamondStroke(ctx, s.x, s.y, TILE_W, TILE_H, "#4CAF50", 2);
      }
    }

    // Hitsplats
    const now = Date.now();
    for (const h of state.hitsplats) {
      const s = toScreen(h.tileX, h.tileY);
      const age = now - h.timestamp;
      const alpha = Math.max(0, 1 - age / 2000);
      const yOff = (age / 2000) * 28 * zoom;
      ctx.font = `bold ${Math.round(h.isSpec ? 22 * zoom : 18 * zoom)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = h.isHeal ? `rgba(0,255,0,${alpha})` : h.isSpec ? `rgba(255, 215, 0, ${alpha})` : `rgba(255,${h.damage === 0 ? 100 : 0},${h.damage === 0 ? 255 : 0},${alpha})`;
      ctx.fillText(h.damage === 0 ? "0" : h.isSpec ? `⚡${h.damage}` : `${h.damage}`, s.x, s.y - TILE_H / 2 - yOff);
    }

    // === PASS 4: Day-Night Cycle Lighting Overlay ===
    const cycleLength = 300;
    const cycleTick = state.tick % cycleLength;
    
    let overlayColor = "rgba(0, 0, 0, 0)";
    let timeLabel = "☀️ Day";
    let labelColor = "#FFEE33";

    if (cycleTick >= 120 && cycleTick < 150) {
      const t = (cycleTick - 120) / 30;
      const r = Math.floor(220 - (220 - 15) * t);
      const g = Math.floor(100 - (100 - 15) * t);
      const b = Math.floor(30 + (45 - 30) * t);
      const alpha = 0.45 * t;
      overlayColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      timeLabel = "🌇 Dusk";
      labelColor = "#FF9800";
    } else if (cycleTick >= 150 && cycleTick < 240) {
      overlayColor = "rgba(12, 12, 35, 0.48)";
      timeLabel = "🌙 Night";
      labelColor = "#8C9EFF";
    } else if (cycleTick >= 240 && cycleTick < 270) {
      const t = (cycleTick - 240) / 30;
      const r = Math.floor(12 + (255 - 12) * t);
      const g = Math.floor(12 + (160 - 12) * t);
      const b = Math.floor(35 + (50 - 35) * t);
      const alpha = 0.48 * (1 - t);
      overlayColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      timeLabel = "🌅 Dawn";
      labelColor = "#FFD54F";
    }
    
    if (overlayColor !== "rgba(0, 0, 0, 0)") {
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, W, H);
    }

    // Vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.7);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // === PASS 5: Epic Boss Health Bar Overlay ===
    const activeBoss = state.entities.find(e => e.isBoss && !e.isDead);
    if (activeBoss) {
      const barW = Math.min(320, W * 0.6);
      const barH = 14;
      const barX = (W - barW) / 2;
      const barY = 46;

      ctx.fillStyle = "rgba(20, 14, 10, 0.95)";
      ctx.fillRect(barX - 6, barY - 16, barW + 12, barH + 24);
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(barX - 6, barY - 16, barW + 12, barH + 24);

      ctx.font = "bold 9.5px sans-serif";
      ctx.fillStyle = "#FFD700";
      ctx.textAlign = "center";
      ctx.fillText(`👑 ${activeBoss.name} (Lv.${activeBoss.combatLevel})`, W / 2, barY - 4);

      // HP bar background
      ctx.fillStyle = "#220000";
      ctx.fillRect(barX, barY, barW, barH);
      // HP bar fill
      const hpPct = Math.max(0, activeBoss.currentHp / activeBoss.maxHp);
      const hpGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      hpGrad.addColorStop(0, "#FF1744");
      hpGrad.addColorStop(1, "#FF5252");
      ctx.fillStyle = hpGrad;
      ctx.fillRect(barX, barY, barW * hpPct, barH);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "#FFF";
      ctx.fillText(`${activeBoss.currentHp} / ${activeBoss.maxHp} HP`, W / 2, barY + 10);
    }

    // Time of Day indicator
    ctx.fillStyle = "rgba(18, 13, 10, 0.85)";
    ctx.fillRect(10, 10, 68, 18);
    ctx.strokeStyle = "#4a3a2a";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, 68, 18);
    
    ctx.font = "bold 9px monospace";
    ctx.fillStyle = labelColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(timeLabel, 44, 19);
  }, [state, settings, TILE_W, TILE_H, WALL_H, FENCE_H, zoom, activeTargetId]);

  // Animation loop
  useEffect(() => {
    let raf: number;
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const camX = (state.player.tileX - state.player.tileY) * TILE_W / 2;
    const camY = (state.player.tileX + state.player.tileY) * TILE_H / 2;
    const a = (sx - canvas.width / 2 + camX) / (TILE_W / 2);
    const b = (sy - canvas.height / 2 + camY) / (TILE_H / 2);
    const tx = Math.round((a + b) / 2);
    const ty = Math.round((b - a) / 2);

    const clickedEntity = state.entities.find(en => !en.isDead && en.tileX === tx && en.tileY === ty);
    if (clickedEntity) { onEntityClick(clickedEntity); return; }

    const clickedItem = state.groundItems.find(g => g.tileX === tx && g.tileY === ty);
    if (clickedItem) { onGroundItemClick(clickedItem); return; }

    if (tx >= 0 && ty >= 0 && tx < state.zone.width && ty < state.zone.height) {
      setState(s => { s.combatTargetId = null; s.skillingTargetId = null; s.path = findPath(s, s.player.tileX, s.player.tileY, tx, ty); });
      forceUpdate();
    }
  }, [state, setState, forceUpdate, onEntityClick, onGroundItemClick, TILE_W, TILE_H]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    updateZoom(zoom + delta);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }} onWheel={handleWheel}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ width: "100%", height: "100%", display: "block", cursor: "pointer", touchAction: "none" }}
      />

      {/* Interactive Zoom Controls HUD */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 84,
        display: "flex",
        alignItems: "center",
        gap: 3,
        background: "rgba(18, 13, 10, 0.88)",
        border: "1.5px solid #5A442E",
        borderRadius: 4,
        padding: "2px 5px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
        zIndex: 50,
      }}>
        <button
          onClick={() => updateZoom(zoom - 0.15)}
          title="Zoom Out (−)"
          style={{
            background: "linear-gradient(180deg, #3E2B1E 0%, #24180F 100%)",
            border: "1px solid #6A4E38",
            color: "#FFD700",
            fontSize: 11,
            fontWeight: "bold",
            padding: "1px 6px",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          ➖
        </button>
        <span
          onClick={() => updateZoom(1.35)}
          title="Reset Zoom"
          style={{
            color: "#D7CCC8",
            fontSize: 9,
            fontWeight: "bold",
            minWidth: 32,
            textAlign: "center",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => updateZoom(zoom + 0.15)}
          title="Zoom In (+)"
          style={{
            background: "linear-gradient(180deg, #3E2B1E 0%, #24180F 100%)",
            border: "1px solid #6A4E38",
            color: "#FFD700",
            fontSize: 11,
            fontWeight: "bold",
            padding: "1px 6px",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          ➕
        </button>
      </div>

      {/* Idle Notification Edge Glow Flash */}
      {showIdleFlash && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          border: "4px solid rgba(255, 68, 68, 0.75)",
          boxShadow: "inset 0 0 40px rgba(255, 68, 68, 0.6)",
          pointerEvents: "none", zIndex: 9999,
          animation: "pulse 0.4s infinite",
        }} />
      )}
    </div>
  );
};
