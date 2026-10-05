// Procedural Web Audio API Sound and Music Synthesizer for Dungeon Quest

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentTrack: string | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private musicInterval: any = null;
  private musicVolume = 0.5;
  private sfxVolume = 0.7;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.isMuted ? 0 : this.sfxVolume * 0.35;
        this.sfxGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.isMuted ? 0 : this.musicVolume * 0.18;
        this.musicGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public playAttackSound(style: "melee" | "ranged" | "magic" | "spec" = "melee") {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const now = this.ctx.currentTime;

      if (style === "melee") {
        // Swift sword swoosh
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (style === "ranged") {
        // Bow string twang
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (style === "spec") {
        // Resonant special strike
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (_e) {}
  }

  public playHitSound(isSpec = false, isDamageToPlayer = false) {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      if (isDamageToPlayer) {
        osc.type = "square";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      } else {
        osc.type = isSpec ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(isSpec ? 500 : 260, now);
        osc.frequency.exponentialRampToValueAtTime(isSpec ? 110 : 70, now + 0.14);
        gain.gain.setValueAtTime(isSpec ? 0.35 : 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      }

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (_e) {}
  }

  public playMagicCast(spellId: string) {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sine";

      if (spellId === "ice_barrage") {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(1760, now + 0.15);
        osc.frequency.linearRampToValueAtTime(330, now + 0.35);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (spellId === "fire_blast") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.2);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        // Wind strike
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(740, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (_e) {}
  }

  public playPotionDrink() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      // Dual glug bubble
      [420, 560].forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        osc.frequency.linearRampToValueAtTime(freq + 140, now + idx * 0.08 + 0.06);
        gain.gain.setValueAtTime(0.22, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.07);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.07);
      });
    } catch (_e) {}
  }

  public playEatFood() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (_e) {}
  }

  public playPrayerSound() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (_e) {}
  }

  public playFarmingAction() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_e) {}
  }

  public playMinigameWave() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const notes = [220, 277.18, 329.63, 440]; // A3, C#4, E4, A4 horn
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.28, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } catch (_e) {}
  }

  public playBossRoar() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.5);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (_e) {}
  }

  public playSkillSound(skill: string) {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      if (skill === "Woodcutting") {
        osc.type = "square";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      } else if (skill === "Mining" || skill === "Smithing") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      } else if (skill === "Fishing") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.15);
      } else if (skill === "Herblore" || skill === "Farming") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.12);
      } else if (skill === "Construction") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
      } else if (skill === "Agility") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      }

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_e) {}
  }

  public playConstructionHammer() {
    this.playSkillSound("Construction");
  }

  public playAgilityJump() {
    this.playSkillSound("Agility");
  }

  public playClueCompletion() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.25, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.09 + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.2);
      });
    } catch (_e) {}
  }

  public playWildernessAlarm() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (_e) {}
  }

  public playPetTrick() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const notes = [659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.25, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.2);
      });
    } catch (_e) {}
  }

  public playLevelUpJingle() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.3, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.25);
      });
    } catch (_e) {}
  }

  public playQuestCompleteFanfare() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const notes = [440, 554.37, 659.25, 880, 783.99, 880];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.25, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.3);
      });
    } catch (_e) {}
  }

  public startBackgroundMusic(trackName = "Harmony") {
    if (this.currentTrack === trackName && this.isMusicPlaying) return;
    this.stopBackgroundMusic();
    this.currentTrack = trackName;
    this.isMusicPlaying = true;
    this.init();

    const melodies: Record<string, number[]> = {
      NewbieMelody: [261.63, 329.63, 392.00, 329.63, 293.66, 349.23, 440.00, 392.00],
      Harmony: [329.63, 392.00, 440.00, 523.25, 493.88, 392.00, 440.00, 329.63],
      Warpath: [130.81, 146.83, 164.81, 196.00, 164.81, 146.83, 130.81, 110.00],
      Dragonfire: [220.00, 261.63, 311.13, 293.66, 261.63, 220.00, 196.00, 220.00],
      Spooky: [196.00, 207.65, 220.00, 196.00, 185.00, 174.61, 196.00, 164.81],
      Inferno: [110.00, 123.47, 130.81, 146.83, 164.81, 146.83, 130.81, 98.00],
      Garden: [392.00, 440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00],
      Wilderness: [110.00, 116.54, 110.00, 98.00, 103.83, 98.00, 92.50, 87.31],
      ChambersOfXeric: [146.83, 174.61, 220.00, 196.00, 174.61, 220.00, 261.63, 220.00],
      HomeSweetHome: [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 349.23, 329.63],
    };

    const cleanKey = trackName.replace(/\s+/g, "");
    const notes = melodies[cleanKey] ?? melodies.Harmony;
    let step = 0;

    this.musicInterval = setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.isMuted) return;
      try {
        const freq = notes[step % notes.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + 0.45);
        step++;
      } catch (_e) {}
    }, 500);
  }

  public stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  public isPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(muted ? 0 : this.musicVolume * 0.18, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(muted ? 0 : this.sfxVolume * 0.35, this.ctx.currentTime);
    }
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain && this.ctx && !this.isMuted) {
      this.musicGain.gain.setValueAtTime(this.musicVolume * 0.18, this.ctx.currentTime);
    }
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx && !this.isMuted) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume * 0.35, this.ctx.currentTime);
    }
  }
}

export const soundEngine = new SoundEngine();
