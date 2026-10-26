// 通用小工具：创建 DOM、随机、提示、撒花

/** h('div.card#id', {onclick}, child1, 'text', [children]) */
export function h(tag, attrs, ...children) {
  const m = /^([a-z0-9-]+)?((?:[.#][\w-]+)*)$/i.exec(tag) || [];
  const el = document.createElement(m[1] || 'div');
  (m[2] || '').replace(/([.#])([\w-]+)/g, (_, t, v) => { if (t === '.') el.classList.add(v); else el.id = v; });
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) {
    children.unshift(attrs); attrs = null;
  }
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) { if (sk.startsWith('--')) el.style.setProperty(sk, sv); else el.style[sk] = sv; }
    }
    else if (k === 'dataset' && typeof v === 'object') Object.assign(el.dataset, v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'class') el.className += ' ' + v;
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  appendKids(el, children);
  return el;
}
function appendKids(el, kids) {
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const sample = (arr, n) => shuffle(arr).slice(0, n);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** 选择题：options[0] 为正确答案 → 返回 { options: 打乱后的数组, answer: 正确答案文本 } */
export function mcq(options) {
  return { options: shuffle(options), answer: options[0] };
}

export function today(d = new Date()) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
export function daysBetween(a, b) {
  return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
}
export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return today(d);
}

export function toast(msg, ms = 2200) {
  let box = document.getElementById('toast');
  if (!box) { box = h('div#toast'); document.body.appendChild(box); }
  const t = h('div.toast-item', msg);
  box.appendChild(t);
  setTimeout(() => t.classList.add('out'), ms);
  setTimeout(() => t.remove(), ms + 400);
}

/** 撒花：从顶部掉落一些表情 */
export function confetti(symbols = ['🍂', '⭐', '🌰', '🎉', '🍁'], n = 28) {
  const layer = h('div.confetti');
  document.body.appendChild(layer);
  for (let i = 0; i < n; i++) {
    const s = h('span', pick(symbols));
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = Math.random() * 0.8 + 's';
    s.style.fontSize = 18 + Math.random() * 26 + 'px';
    layer.appendChild(s);
  }
  setTimeout(() => layer.remove(), 3200);
}

export function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** 英文冠词：a library / an art room */
export function aOrAn(word) {
  return (/^[aeiou]/i.test(word) && !/^(uni|use|one)/i.test(word) ? 'an ' : 'a ') + word;
}
