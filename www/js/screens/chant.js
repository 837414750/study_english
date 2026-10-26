// 歌谣屋：先听节拍版（逐词高亮 + 松鼠跳舞），再一行一行跟读打分
import { h, sleep } from '../util.js';
import { unitById, markStage, S } from '../store.js';
import { topbar, micButton, celebrate, petFace, asrBanner, speakBtn } from '../ui.js';
import { speak, stopSpeak } from '../speech.js';
import { fx } from '../audiofx.js';

export function render(root, [uid]) {
  const u = unitById(uid);
  const c = u.chant;
  const showCN = S().settings.showCN;
  root.appendChild(topbar('🎵 歌谣屋', { back: `#/unit/${uid}`, sub: c.title, color: u.color }));
  const body = h('div.stage-body');
  root.appendChild(body);
  let alive = true;

  const dancer = petFace(undefined, 'lg');
  dancer.classList.add('dancer');
  const lineEls = c.lines.map((line, li) => {
    const words = line.split(/\s+/).map((w) => h('span.cw', w + ' '));
    return { el: h('div.chant-line', h('div', words), showCN && c.cn ? h('small', c.cn[li]) : null), words, line };
  });

  async function playAll(rate) {
    playBtn.disabled = slowBtnEl.disabled = true;
    dancer.classList.add('go');
    for (const L of lineEls) {
      if (!alive) return;
      L.el.classList.add('active');
      fx.beat();
      await speak(L.line, { rate, onWord: (i) => L.words.forEach((w, k) => w.classList.toggle('hl', k === i)) });
      L.el.classList.remove('active');
      await sleep(250);
    }
    dancer.classList.remove('go');
    playBtn.disabled = slowBtnEl.disabled = false;
    yourTurn.classList.remove('hide');
  }

  const playBtn = h('button.btn.big', { onclick: () => playAll() }, '▶ 播放歌谣');
  const slowBtnEl = h('button.btn.ghost', { onclick: () => playAll(0.6) }, '🐢 慢速');
  const scores = new Array(c.lines.length).fill(null);
  const yourTurn = h('section.your-turn.hide',
    h('h3', '🎤 轮到你啦！一行一行跟读'),
    asrBanner(),
    c.lines.map((line, i) => h('div.sent-row',
      h('div.sent-text', speakBtn(line), h('span', line)),
      micButton({ target: line, compact: true, label: '跟读', onResult: (r) => { scores[i] = r.score ?? 80; check(); } }))),
  );

  function check() {
    if (scores.some((s) => s == null)) return;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    markStage(uid, 'chant');
    celebrate({
      score: avg, pass: avg >= 60, title: avg >= 60 ? '歌谣唱得真棒！' : '读完啦！多练几遍会更好',
      lines: ['平均得分 ' + avg + ' 分'],
      buttons: [h('a.btn', { href: `#/unit/${uid}/dialogue` }, '下一关：对话馆 ›'), h('button.btn.ghost', { onclick: () => document.querySelector('.modal-bg')?.remove() }, '再练一遍')],
    });
  }

  body.append(h('div.chant-stage', dancer, h('div.chant-lines', lineEls.map((l) => l.el))), h('div.center.row', playBtn, slowBtnEl), yourTurn);
  setTimeout(() => alive && playAll(), 500);
  return () => { alive = false; stopSpeak(); };
}
