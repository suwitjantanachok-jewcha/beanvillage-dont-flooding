// Web Audio API Synthesizer for "หมู่บ้านแห่งถั่ว - ล่า 9,000 บาท"
// Generates water splashes, Thai temple brass band, motorcycle revs, stamps, and ducks without external file dependencies.

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
}

export function getMuted(): boolean {
  return isMuted;
}

// 1. Water Splash
export function playWaterSplash() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(600, now);
  filter.frequency.exponentialRampToValueAtTime(150, now + 0.3);
  filter.Q.setValueAtTime(3, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.3);
}

// 2. Item Pop / Bubble Pickup
export function playPop() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

// 3. Duck Squeak / Quack
export function playDuckQuack() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.linearRampToValueAtTime(650, now + 0.08);
  osc.frequency.linearRampToValueAtTime(380, now + 0.2);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}

// 4. Brass Band Defeat Tune ("แตรวงดนตรีงานวัดตอนแพ้")
// Plays a humorous Thai temple fair / parade funeral comedic tune: "แต๊ด แตน แต่น แต๊น... แต่น แต๊นนน!"
export function playBrassBandDefeat() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Brass notes: G4, E4, C4, G3, F3, E3, D3, C3 (sad comical parade slide)
  const notes = [
    { freq: 392, start: 0.0, dur: 0.22 }, // G4
    { freq: 330, start: 0.26, dur: 0.22 }, // E4
    { freq: 261.6, start: 0.52, dur: 0.3 }, // C4
    { freq: 196, start: 0.9, dur: 0.25 }, // G3
    { freq: 174.6, start: 1.2, dur: 0.35 }, // F3
    { freq: 164.8, start: 1.6, dur: 0.4 }, // E3 (wah-wah bend)
    { freq: 146.8, start: 2.05, dur: 0.9 }, // D3
    { freq: 130.8, start: 2.1, dur: 1.1 }, // C3 (low comedic drone)
  ];

  notes.forEach((note) => {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc2.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, now + note.start);
    osc2.frequency.setValueAtTime(note.freq * 1.008, now + note.start); // slight detune for trumpet vibrato

    // Pitch bend down at end of phrase
    if (note.start > 1.5) {
      osc.frequency.exponentialRampToValueAtTime(note.freq * 0.92, now + note.start + note.dur);
      osc2.frequency.exponentialRampToValueAtTime(note.freq * 0.92, now + note.start + note.dur);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now + note.start);
    filter.frequency.exponentialRampToValueAtTime(800, now + note.start + note.dur);

    gain.gain.setValueAtTime(0.01, now + note.start);
    gain.gain.linearRampToValueAtTime(0.28, now + note.start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.dur);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.start);
    osc.stop(now + note.start + note.dur);
    osc2.start(now + note.start);
    osc2.stop(now + note.start + note.dur);
  });

  // Cymbal splash on beat
  [0.0, 0.9, 2.05].forEach((t) => {
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const cymFilter = ctx.createBiquadFilter();
    cymFilter.type = 'highpass';
    cymFilter.frequency.setValueAtTime(4500, now + t);

    const cymGain = ctx.createGain();
    cymGain.gain.setValueAtTime(0.18, now + t);
    cymGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.25);

    noise.connect(cymFilter);
    cymFilter.connect(cymGain);
    cymGain.connect(ctx.destination);

    noise.start(now + t);
    noise.stop(now + t + 0.25);
  });
}

// 5. Village Motorcycle Sound ("เสียงมอไซค์วิน" - 2-stroke sputter, throttle rev & horn)
export function playMotorcycleWin() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Engine sputter & rev
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  // rev sequence: idle sputter -> rev up -> fast rev
  osc.frequency.setValueAtTime(55, now);
  osc.frequency.linearRampToValueAtTime(90, now + 0.3);
  osc.frequency.linearRampToValueAtTime(140, now + 0.7);
  osc.frequency.linearRampToValueAtTime(70, now + 1.2);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.linearRampToValueAtTime(0.35, now + 0.6);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 1.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.3);

  // Classic Thai bike horn: "ปี๊น ปี๊นนน!"
  [0.85, 1.05].forEach((startTime) => {
    const horn = ctx.createOscillator();
    const hornGain = ctx.createGain();
    horn.type = 'triangle';
    horn.frequency.setValueAtTime(440, now + startTime);
    horn.frequency.setValueAtTime(587, now + startTime + 0.05);

    hornGain.gain.setValueAtTime(0.3, now + startTime);
    hornGain.gain.exponentialRampToValueAtTime(0.01, now + startTime + 0.14);

    horn.connect(hornGain);
    hornGain.connect(ctx.destination);
    horn.start(now + startTime);
    horn.stop(now + startTime + 0.14);
  });
}

// 6. Government Stamp Sound ("ตึ่ง! ประทับตรา อบต.")
export function playStamp() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
}

// 7. Error Buzzer / Rejected Document
export function playErrorBuzzer() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.setValueAtTime(120, now + 0.15);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

// 8. Golden Box / Money Ding
export function playGoldDing() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.07);

    gain.gain.setValueAtTime(0.2, now + idx * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.07);
    osc.stop(now + idx * 0.07 + 0.4);
  });
}

// 9. Victory Fanfare ("ไชโย! รับ 9,000 บาท")
export function playVictoryFanfare() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 523.25, delay: 0.0, dur: 0.15 }, // C5
    { freq: 659.25, delay: 0.15, dur: 0.15 }, // E5
    { freq: 783.99, delay: 0.3, dur: 0.18 }, // G5
    { freq: 1046.5, delay: 0.48, dur: 0.5 }, // C6
    { freq: 880.0, delay: 1.0, dur: 0.18 }, // A5
    { freq: 1046.5, delay: 1.2, dur: 0.8 }, // C6
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(n.freq, now + n.delay);

    gain.gain.setValueAtTime(0.3, now + n.delay);
    gain.gain.exponentialRampToValueAtTime(0.01, now + n.delay + n.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + n.delay);
    osc.stop(now + n.delay + n.dur);
  });
}
