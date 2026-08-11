'use client';

class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private blipToggle: boolean = false;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initAndResume();
        if (this.ctx && this.ctx.state === 'running') {
          this.isUnlocked = true;
          window.removeEventListener('pointerdown', unlockAudio);
          window.removeEventListener('keydown', unlockAudio);
          window.removeEventListener('click', unlockAudio);
        }
      };

      window.addEventListener('pointerdown', unlockAudio);
      window.addEventListener('keydown', unlockAudio);
      window.addEventListener('click', unlockAudio);
    }
  }

  public initAndResume(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initAndResume();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Retro 8-bit Arcade Dialogue Text Blip
  public playKeyPress() {
    if (this.isMuted) return;
    const ctx = this.initAndResume();
    if (!ctx || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      this.blipToggle = !this.blipToggle;
      const freq = this.blipToggle ? 880 : 1100;

      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, now + 0.015);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.015);
    } catch (e) {}
  }

  // Retro Fighting Game Move Sounds (Bull = Rising Special Move, Bear = Heavy Counter Punch)
  public playTurnStart(speaker: 'bull' | 'bear') {
    if (this.isMuted) return;
    const ctx = this.initAndResume();
    if (!ctx || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;
      const isBull = speaker === 'bull';

      // 1. Arcade Hit Impact (Short retro noise burst)
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // 2. 8-Bit Synth Pitch Slide (Rising Fireball / Heavy Dragon Punch)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isBull ? 'square' : 'sawtooth';

      if (isBull) {
        // Bull Rising Uppercut / Fireball (200Hz -> 900Hz -> 1400Hz)
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.18);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      } else {
        // Bear Heavy Ground Slam / Low Block (750Hz -> 120Hz)
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (isBull ? 0.22 : 0.25));
    } catch (e) {}
  }

  // Retro Arcade KO & Victory Fanfare
  public playVerdict(winner: 'bull' | 'bear' | 'neutral') {
    if (this.isMuted) return;
    const ctx = this.initAndResume();
    if (!ctx || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;

      // Heavy 8-Bit "K.O.!" Impact Hit
      const koOsc = ctx.createOscillator();
      const koGain = ctx.createGain();
      koOsc.type = 'sawtooth';
      koOsc.frequency.setValueAtTime(180, now);
      koOsc.frequency.exponentialRampToValueAtTime(45, now + 0.3);
      koGain.gain.setValueAtTime(0.25, now);
      koGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      koOsc.connect(koGain);
      koGain.connect(ctx.destination);
      koOsc.start(now);

      // Fast Retro 8-Bit Victory Arpeggio
      const arpeggioNotes = winner === 'bull'
        ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // C5, E5, G5, C6, E6, G6
        : winner === 'bear'
          ? [440.00, 523.25, 659.25, 880.00, 1046.50]        // A4, C5, E5, A5, C6
          : [440.00, 554.37, 659.25, 880.00];

      const noteDuration = 0.07;
      arpeggioNotes.forEach((freq, idx) => {
        if (!ctx) return;
        const noteTime = now + 0.15 + idx * noteDuration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, noteTime);

        const isLastNote = idx === arpeggioNotes.length - 1;
        const decay = isLastNote ? 0.6 : 0.08;

        gain.gain.setValueAtTime(0.09, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + decay);
      });
    } catch (e) {}
  }
}

export const sound = new RetroSoundEngine();
