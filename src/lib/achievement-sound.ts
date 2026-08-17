/** Short rising chime played when a module is marked complete. */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  audioCtx ??= new Ctor();
  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  peak: number,
  type: OscillatorType = "triangle"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function withAudioContext(play: (ctx: AudioContext, t: number) => void) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    play(ctx, ctx.currentTime + 0.02);
  } catch {
    // Autoplay or missing Web Audio — skip silently
  }
}

/** Achievement-style arpeggio: C–E–G–C with a soft sparkle on top. */
export function playAchievementSound() {
  withAudioContext((ctx, t) => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      playTone(ctx, freq, t + i * 0.1, 0.42, 0.09);
    });
    playTone(ctx, 1567.98, t + 0.34, 0.55, 0.035, "sine");
  });
}

/** Soft descending pair when a module is unmarked. */
export function playUncheckSound() {
  withAudioContext((ctx, t) => {
    playTone(ctx, 392.0, t, 0.22, 0.06, "sine");
    playTone(ctx, 261.63, t + 0.12, 0.32, 0.05, "sine");
  });
}
