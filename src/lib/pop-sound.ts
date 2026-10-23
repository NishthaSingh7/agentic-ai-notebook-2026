export function playPop() {
  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;

  const ctx = new AudioContextCtor();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.9, now);
  master.connect(ctx.destination);

  const notes = [
    { freq: 523.25, at: 0, dur: 0.22, gain: 0.1 },
    { freq: 659.25, at: 0.09, dur: 0.24, gain: 0.1 },
    { freq: 783.99, at: 0.18, dur: 0.42, gain: 0.12 },
  ];

  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(note.freq, now + note.at);
    gain.gain.setValueAtTime(0.0001, now + note.at);
    gain.gain.exponentialRampToValueAtTime(note.gain, now + note.at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.at + note.dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + note.at);
    osc.stop(now + note.at + note.dur + 0.02);
  }

  const shimmer = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(1567.98, now + 0.22);
  shimmerGain.gain.setValueAtTime(0.0001, now + 0.22);
  shimmerGain.gain.exponentialRampToValueAtTime(0.028, now + 0.25);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(master);
  shimmer.start(now + 0.22);
  shimmer.stop(now + 0.52);

  window.setTimeout(() => {
    void ctx.close();
  }, 800);
}
