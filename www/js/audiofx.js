// 合成音效（无需音频文件，离线可用）
let ctx = null;
function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}
export const fx = {
  ding() { tone(880, 0, 0.18, 'triangle'); tone(1320, 0.09, 0.25, 'triangle'); },
  buzz() { tone(220, 0, 0.22, 'square', 0.08); tone(180, 0.12, 0.25, 'square', 0.08); },
  pop() { tone(600, 0, 0.08, 'sine', 0.15); },
  tick() { tone(1200, 0, 0.04, 'square', 0.05); },
  fanfare() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, 'triangle', 0.16)); },
  levelup() { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle', 0.15)); },
  beat() { tone(140, 0, 0.12, 'sine', 0.35); },
};
