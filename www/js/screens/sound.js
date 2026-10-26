// 语音站：自然拼读（字母/字母组合发音）或单词重音；听音辨词 + 绕口令跟读
import { h, escapeRe, mcq } from '../util.js';
import { unitById, markStage } from '../store.js';
import { topbar, speakBtn, slowBtn, micButton, choiceGroup, celebrate, petSay } from '../ui.js';
import { speak } from '../speech.js';

/** 把单词里的目标字母高亮：mark 支持 'sh'、'igh'、'i_e'（i + 辅音 + e）等 */
export function markWord(word, marks = []) {
  const res = [];
  const sorted = [...marks].sort((a, b) => b.length - a.length);
  const pats = sorted.map((m) => (m.includes('_') ? m.split('_').map(escapeRe).join('[b-df-hj-np-tv-z]') : escapeRe(m)));
  if (!pats.length) return [word];
  const re = new RegExp(pats.join('|'), 'gi');
  let last = 0, m;
  while ((m = re.exec(word))) {
    if (m.index > last) res.push(word.slice(last, m.index));
    const seg = m[0];
    const isSplit = sorted.some((mk) => mk.includes('_') && seg.length === 3 && mk[0] === seg[0].toLowerCase() && mk[2] === seg[2].toLowerCase());
    if (isSplit) res.push(h('b.mk', seg[0]), seg[1], h('b.mk', seg[2]));
    else res.push(h('b.mk', seg));
    last = m.index + seg.length;
    if (!seg.length) re.lastIndex++;
  }
  if (last < word.length) res.push(word.slice(last));
  return res;
}

export function render(root, [uid]) {
  const u = unitById(uid);
  const s = u.sound;
  root.appendChild(topbar('🔤 语音站', { back: `#/unit/${uid}`, sub: s.title, color: u.color }));
  const body = h('div.stage-body');
  root.appendChild(body);
  let current = s.words[0];

  body.appendChild(h('div.sound-hero',
    h('div.sh-key', s.type === 'stress' ? 'Stress' : (s.mark || []).join(' · ')),
    h('div.sh-word', speakBtn(s.key.replace(/·/g, ',')), ' ', s.key),
    h('div.muted', s.title)));

  // 单词墙
  const mic = h('div.mic-slot');
  const label = h('p.center', '点一个单词听一听，再跟读：');
  const wall = h('div.word-wall');
  const setCurrent = (w, btn) => {
    current = w;
    [...wall.children].forEach((c) => c.classList.remove('sel'));
    btn.classList.add('sel');
    speak(w);
    mic.innerHTML = '';
    mic.appendChild(micButton({ target: w, compact: true, label: `跟读 ${w}`, silenceMs: 1100, maxMs: 6000 }));
  };
  if (s.type === 'stress') {
    for (const st of s.stress) {
      const b = h('button.ww.stress', st.parts.map((p, i) => (i === st.s ? h('b.mk.big', p.toUpperCase()) : h('span', p))).reduce((a, x, i) => (i ? [...a, h('i', '·'), x] : [x]), []));
      b.onclick = () => setCurrent(st.w, b);
      wall.appendChild(b);
    }
  } else {
    for (const w of s.words) {
      const b = h('button.ww', markWord(w, s.mark));
      b.onclick = () => setCurrent(w, b);
      wall.appendChild(b);
    }
  }
  body.append(label, wall, mic);

  // 听音辨词
  const q = mcq(s.odd.options);
  const oddBox = h('section.card',
    h('h3', '👂 听一听，选一选'),
    h('p', s.odd.q),
  );
  const g = choiceGroup(q.options, q.answer, { big: true, speakOptions: true });
  oddBox.appendChild(g);
  body.appendChild(oddBox);

  // 绕口令
  let tongueDone = false, oddDone = false;
  const finish = () => {
    if (!(tongueDone && oddDone)) return;
    markStage(uid, 'sound');
    celebrate({ score: null, pass: true, title: '语音站完成！', lines: ['发音越来越标准啦！'], buttons: [h('a.btn', { href: `#/unit/${uid}/story` }, '下一关：故事屋 ›'), h('button.btn.ghost', { onclick: () => document.querySelector('.modal-bg')?.remove() }, '再练练')] });
  };
  g.result.then(async () => { await speak(q.answer); oddDone = true; finish(); });
  body.appendChild(h('section.card',
    h('h3', '👅 绕口令挑战'),
    h('div.tongue', speakBtn(s.tongue), slowBtn(s.tongue), h('b', s.tongue)),
    micButton({ target: s.tongue, label: '挑战一下！读得又快又准', onResult: () => { tongueDone = true; finish(); } }),
    h('button.btn.ghost.small', { onclick: () => { tongueDone = true; finish(); } }, '太难了，先跳过'),
  ));
  body.prepend(petSay(s.type === 'stress' ? '大写的部分要读得重一点、响一点哦！' : '红色的字母就是今天要练的发音！'));
}
