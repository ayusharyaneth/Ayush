// Web Audio API Synthesizer Sound Engine (Synthesized in real-time, matching manishtamang.com)
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = typeof window !== 'undefined' ? localStorage.getItem('portfolio-sound-muted') === 'true' : false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-sound-muted', this.muted);
    }
    return this.muted;
  }

  // Exact Manish Tamang whoosh synthesizer for card hover & deck interaction
  playWhoosh() {
    if (this.muted) return;
    try {
      const ctx = this.init();
      if (!ctx) return;
      const t = ctx.currentTime;
      if (!this.whooshBuffer) {
        const a = ctx.createBuffer(1, Math.floor(0.08 * ctx.sampleRate), ctx.sampleRate);
        const ch = a.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
          const s = Math.sin((i / ch.length) * Math.PI);
          ch[i] = (2 * Math.random() - 1) * s;
        }
        this.whooshBuffer = a;
      }
      const n = ctx.createBufferSource();
      n.buffer = this.whooshBuffer;
      const o = ctx.createBiquadFilter();
      o.type = 'bandpass';
      o.frequency.setValueAtTime(4000, t);
      o.frequency.exponentialRampToValueAtTime(1500, t + 0.08);
      o.Q.value = 1;
      const l = ctx.createGain();
      l.gain.value = 0.18;
      n.connect(o);
      o.connect(l);
      l.connect(ctx.destination);
      n.start(t);
    } catch {}
  }

  // Exact Manish Tamang pop synthesizer for card clicks & opening modals
  playPop() {
    if (this.muted) return;
    try {
      const ctx = this.init();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {}
  }

  // Exact Manish Tamang tactile click synthesizer
  playClick() {
    if (this.muted) return;
    try {
      const ctx = this.init();
      if (!ctx) return;
      const t = ctx.currentTime;
      if (!this.clickBuffer) {
        const a = ctx.createBuffer(1, Math.floor(0.008 * ctx.sampleRate), ctx.sampleRate);
        const ch = a.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
          ch[i] = (2 * Math.random() - 1) * Math.exp(-i / 50);
        }
        this.clickBuffer = a;
      }
      const n = ctx.createBufferSource();
      n.buffer = this.clickBuffer;
      const o = ctx.createBiquadFilter();
      o.type = 'bandpass';
      o.frequency.value = 4000 + 1000 * Math.random();
      o.Q.value = 3;
      const l = ctx.createGain();
      l.gain.value = 0.45;
      n.connect(o);
      o.connect(l);
      l.connect(ctx.destination);
      n.start(t);
    } catch {}
  }

  // Exact Manish Tamang tick synthesizer
  playTick() {
    if (this.muted) return;
    try {
      const ctx = this.init();
      if (!ctx) return;
      const t = ctx.currentTime;
      if (!this.tickBuffer) {
        const a = ctx.createBuffer(1, Math.floor(0.004 * ctx.sampleRate), ctx.sampleRate);
        const ch = a.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
          ch[i] = (2 * Math.random() - 1) * Math.exp(-i / 20);
        }
        this.tickBuffer = a;
      }
      const n = ctx.createBufferSource();
      n.buffer = this.tickBuffer;
      const o = ctx.createBiquadFilter();
      o.type = 'highpass';
      o.frequency.value = 3000;
      const l = ctx.createGain();
      l.gain.value = 0.3;
      n.connect(o);
      o.connect(l);
      l.connect(ctx.destination);
      n.start(t);
    } catch {}
  }

  // Alias for hover to use whoosh/tick with micro-cooldown
  playHover() {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (this.lastHoverTime && now - this.lastHoverTime < 35) return;
    this.lastHoverTime = now;
    this.playTick();
  }

  // Tactile resonant card hover sound (warm acoustic transient + soft spatial whoosh)
  playCardHover() {
    if (this.muted) return;
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (this.lastCardHover && now - this.lastCardHover < 60) return; // Prevent stuttering across child elements
    this.lastCardHover = now;

    try {
      const ctx = this.init();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const t = ctx.currentTime;

      // Tactile resonant pop transient
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, t);
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.035);

      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);

      // Complementary soft whoosh sweep
      this.playWhoosh();
    } catch {}
  }


  // Exact Manish Tamang toggle synthesizer
  playToggle() {
    if (this.muted) return;
    try {
      const ctx = this.init();
      if (!ctx) return;
      const t = ctx.currentTime;
      if (!this.toggleBuffer) {
        const a = ctx.createBuffer(1, Math.floor(0.012 * ctx.sampleRate), ctx.sampleRate);
        const ch = a.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
          ch[i] = (2 * Math.random() - 1) * Math.exp(-i / 80);
        }
        this.toggleBuffer = a;
      }
      const n = ctx.createBufferSource();
      n.buffer = this.toggleBuffer;
      const o = ctx.createBiquadFilter();
      o.type = 'bandpass';
      o.frequency.value = 2500;
      o.Q.value = 4;
      const l = ctx.createGain();
      l.gain.value = 0.4;
      n.connect(o);
      o.connect(l);
      l.connect(ctx.destination);
      n.start(t);

      const u = ctx.createOscillator();
      const s = ctx.createGain();
      u.type = 'sine';
      u.frequency.setValueAtTime(800, t);
      u.frequency.exponentialRampToValueAtTime(400, t + 0.03);
      s.gain.setValueAtTime(0.15, t);
      s.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      u.connect(s);
      s.connect(ctx.destination);
      u.start(t);
      u.stop(t + 0.04);
    } catch {}
  }

  // Exact Manish Tamang success harmonic chime
  playSuccess() {
    if (this.muted) return;
    try {
      const ctx = this.init();
      if (!ctx) return;
      const t = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'triangle';
        osc1.frequency.value = freq;
        osc2.type = 'sine';
        osc2.frequency.value = 2 * freq;

        filter.type = 'lowpass';
        filter.frequency.value = 3000;

        const u = t + 0.08 * idx;
        gain.gain.setValueAtTime(0, u);
        gain.gain.linearRampToValueAtTime(0.2, u + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, u + 0.15);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(filter);
        filter.connect(ctx.destination);

        osc1.start(u);
        osc2.start(u);
        osc1.stop(u + 0.15);
        osc2.stop(u + 0.15);
      });

      const highOsc = ctx.createOscillator();
      const highGain = ctx.createGain();
      highOsc.type = 'sine';
      highOsc.frequency.value = 1046.5;
      highGain.gain.setValueAtTime(0, t + 0.24);
      highGain.gain.linearRampToValueAtTime(0.15, t + 0.26);
      highGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      highOsc.connect(highGain);
      highGain.connect(ctx.destination);
      highOsc.start(t + 0.24);
      highOsc.stop(t + 0.45);
    } catch {}
  }
}

export const sound = new SoundEngine();

// Auto-unlock AudioContext on first user interaction (pointermove, scroll, pointerdown, keydown, touchstart)
if (typeof window !== 'undefined') {
  const events = ['pointerdown', 'keydown', 'touchstart', 'pointermove', 'scroll', 'wheel'];
  const unlock = () => {
    sound.init();
    events.forEach(ev => window.removeEventListener(ev, unlock));
  };
  events.forEach(ev => window.addEventListener(ev, unlock, { once: true, passive: true }));
}



