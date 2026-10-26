// SVG 钟面：clockFace(7, 30) → 7:30
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}
export function clockFace(hour, minute, size = 220) {
  const svg = el('svg', { viewBox: '0 0 200 200', width: size, height: size, class: 'clockface' });
  svg.appendChild(el('circle', { cx: 100, cy: 100, r: 92, class: 'cf-rim' }));
  svg.appendChild(el('circle', { cx: 100, cy: 100, r: 84, class: 'cf-face' }));
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const big = i % 5 === 0;
    const r1 = big ? 70 : 76, r2 = 82;
    svg.appendChild(el('line', { x1: 100 + r1 * Math.sin(a), y1: 100 - r1 * Math.cos(a), x2: 100 + r2 * Math.sin(a), y2: 100 - r2 * Math.cos(a), class: big ? 'cf-tick big' : 'cf-tick' }));
  }
  for (let n = 1; n <= 12; n++) {
    const a = (n / 12) * Math.PI * 2;
    const t = el('text', { x: 100 + 58 * Math.sin(a), y: 100 - 58 * Math.cos(a) + 7, class: 'cf-num', 'text-anchor': 'middle' });
    t.textContent = n;
    svg.appendChild(t);
  }
  const ma = (minute / 60) * Math.PI * 2;
  const ha = (((hour % 12) + minute / 60) / 12) * Math.PI * 2;
  svg.appendChild(el('line', { x1: 100, y1: 100, x2: 100 + 40 * Math.sin(ha), y2: 100 - 40 * Math.cos(ha), class: 'cf-hour' }));
  svg.appendChild(el('line', { x1: 100, y1: 100, x2: 100 + 66 * Math.sin(ma), y2: 100 - 66 * Math.cos(ma), class: 'cf-min' }));
  svg.appendChild(el('circle', { cx: 100, cy: 100, r: 6, class: 'cf-dot' }));
  return svg;
}

const NUM = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const MIN = { 5: 'five', 10: 'ten', 15: 'a quarter', 20: 'twenty', 25: 'twenty-five', 30: 'half' };
/** 7,30 → "half past seven"；3,50 → "ten to four" */
export function timePhrase(hour, minute) {
  const h12 = hour % 12 || 12;
  if (minute === 0) return `${NUM[h12]} o'clock`;
  if (minute <= 30) return `${MIN[minute]} past ${NUM[h12]}`;
  const next = (h12 % 12) + 1;
  return `${MIN[60 - minute]} to ${NUM[next]}`;
}
