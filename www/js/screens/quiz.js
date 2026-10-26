// 单元测验：满分 100，≥过关线（默认 90）过关
// 听力 20 · 词汇 20 · 语法 30 · 口语 20 · 阅读 10；没过关可以"只重做错题"
import { h, shuffle, sample, sleep, mcq } from '../util.js';
import { unitById, getUnits, recordQuiz, passLine, prog } from '../store.js';
import { topbar, speakBtn, micButton, choiceGroup, celebrate, petSay, scoreBadge, asrBanner } from '../ui.js';
import { speak, canListen, initASR } from '../speech.js';
import { introduce, review, cardKey } from '../srs.js';
import { fx } from '../audiofx.js';

const SECTIONS = [
  { id: 'listen', name: '听力', icon: '👂', pts: 20 },
  { id: 'vocab', name: '词汇', icon: '🔤', pts: 20 },
  { id: 'grammar', name: '语法', icon: '🧩', pts: 30 },
  { id: 'speak', name: '口语', icon: '🎤', pts: 20 },
  { id: 'read', name: '阅读', icon: '📰', pts: 10 },
];

/** 生成一套题（每次随机） */
export function buildQuiz(u, asrOK) {
  const items = [];
  const words = u.words;
  // 听力：听词选图 ×2，听句选图 ×2
  sample(words, 2).forEach((w) => items.push({ sec: 'listen', pts: 5, kind: 'listenWord', w, srs: cardKey('w', u.id, w.en) }));
  const pages = u.story.pages.filter((p) => p.en.split(' ').length <= 14);
  sample(pages, 2).forEach((p) => items.push({ sec: 'listen', pts: 5, kind: 'listenSentence', p, pool: pages }));
  // 词汇：看图选词 ×2，拼写 ×2
  const [w1, w2, w3, w4] = shuffle(words);
  [w1, w2].forEach((w) => items.push({ sec: 'vocab', pts: 5, kind: 'pickWord', w, srs: cardKey('w', u.id, w.en) }));
  const spellable = shuffle(words.filter((w) => /^[a-z]{3,9}$/i.test(w.en)));
  (spellable.length >= 2 ? spellable.slice(0, 2) : [w3, w4]).forEach((w) => items.push({ sec: 'vocab', pts: 5, kind: spellable.length >= 2 ? 'spell' : 'pickWord', w, srs: cardKey('w', u.id, w.en) }));
  // 语法：选择 ×4，连词成句 ×2
  sample(u.quiz.grammar, 4).forEach((q) => items.push({ sec: 'grammar', pts: 5, kind: 'mcq', q, srs: cardKey('g', u.id, q.q) }));
  sample(u.quiz.order, 2).forEach((s) => items.push({ sec: 'grammar', pts: 5, kind: 'order', s, srs: cardKey('s', u.id, s) }));
  // 口语 ×2
  u.quiz.speak.forEach((sp) => items.push({ sec: 'speak', pts: 10, kind: asrOK ? 'speak' : 'speakPick', sp, srs: cardKey('s', u.id, sp.answer) }));
  // 阅读 ×2
  u.quiz.reading.questions.forEach((q) => items.push({ sec: 'read', pts: 5, kind: 'read', q, text: u.quiz.reading.text }));
  return items;
}

export function render(root, [uid]) {
  const u = unitById(uid);
  const pl = passLine();
  root.appendChild(topbar('📝 单元测验', { back: `#/unit/${uid}`, sub: `${u.title} · 满分 100 · ${pl} 分过关`, color: u.color }));
  const body = h('div.stage-body.quiz');
  root.appendChild(body);
  let alive = true;
  const best = prog(uid).quiz.best;

  body.append(
    petSay(best ? `上次最高 ${best} 分。${best >= pl ? '已经过关啦，挑战 100 分吧！' : `加油，到 ${pl} 分就过关！`}` : `一共 5 个部分，${pl} 分以上就能点亮这座岛的测验徽章！`),
    h('div.sec-list', SECTIONS.map((s) => h('div.sec-chip', s.icon, ' ', s.name, h('small', ` ${s.pts}分`)))),
    asrBanner() || '',
    h('div.center', h('button.btn.big', { onclick: start }, '开始测验 ▶')),
  );

  async function start() {
    await initASR();
    const items = buildQuiz(u, canListen());
    await runItems(items, null);
  }

  /** 逐题作答；prev 为上一轮结果（重做错题时用） */
  async function runItems(items, prev) {
    const results = prev ? prev.slice() : items.map(() => null);
    const todo = prev ? items.map((it, i) => (prev[i].earned < it.pts ? i : -1)).filter((i) => i >= 0) : items.map((_, i) => i);
    for (let n = 0; n < todo.length; n++) {
      if (!alive) return;
      const i = todo[n];
      const it = items[i];
      const sec = SECTIONS.find((s) => s.id === it.sec);
      body.innerHTML = '';
      body.append(
        h('div.quiz-head', h('span.sec-tag', sec.icon + ' ' + sec.name), h('span', `第 ${n + 1}/${todo.length} 题`), prev ? h('span.redo', '重做错题') : null),
        h('div.progress-line', h('i', { style: { width: (n / todo.length) * 100 + '%' } })),
      );
      const box = h('div.q-box');
      body.appendChild(box);
      const earned = await ITEM[it.kind](box, it, u);
      results[i] = { earned: Math.max(earned, prev?.[i]?.earned || 0), kind: it.kind, sec: it.sec };
      if (it.srs) {
        introduce(it.srs);
        if (earned < it.pts) review(it.srs, false);
      }
      await sleep(earned >= it.pts ? 700 : 1500);
    }
    finish(items, results);
  }

  function finish(items, results) {
    const total = Math.round(results.reduce((a, r) => a + r.earned, 0));
    const bySec = SECTIONS.map((s) => {
      const got = results.filter((r) => r.sec === s.id).reduce((a, r) => a + r.earned, 0);
      return { ...s, got: Math.round(got) };
    });
    recordQuiz(uid, total, bySec.map((s) => `${s.name}${s.got}/${s.pts}`).join(' '));
    body.innerHTML = '';
    const pass = total >= pl;
    const wrongCount = items.filter((it, i) => results[i].earned < it.pts).length;
    body.append(
      h('div.result-card', scoreBadge(total),
        h('h2', pass ? (total === 100 ? '满分！太厉害了！🏆' : '测验过关！🎉') : `还差 ${pl - total} 分过关`),
        h('div.sec-result', bySec.map((s) => h('div.sr', h('span', s.icon + ' ' + s.name), h('div.bar', h('i', { style: { width: (s.got / s.pts) * 100 + '%' } })), h('b', `${s.got}/${s.pts}`))))),
      h('div.center.row',
        wrongCount ? h('button.btn.big', { onclick: () => runItems(items, results) }, `🔁 只重做 ${wrongCount} 道错题`) : null,
        h('button.btn.ghost', { onclick: start }, '换一套重新测'),
        h('a.btn.ghost', { href: `#/unit/${uid}` }, '回到岛屿')),
      wrongCount ? h('p.muted.center', '错题已自动放进复习本，记忆曲线会提醒你再练。') : null,
    );
    if (pass) celebrate({ score: total, pass: true, title: total === 100 ? '满分！获得稀有贴纸！' : '测验过关！', buttons: [h('a.btn', { href: `#/unit/${uid}/recite` }, '去挑战背诵 🎤'), h('button.btn.ghost', { onclick: () => document.querySelector('.modal-bg')?.remove() }, '看看成绩')] });
    else fx.pop();
  }

  return () => { alive = false; };
}

// ───────────── 各题型 ─────────────
function feedback(box, ok, text) {
  box.appendChild(h('div.fb.' + (ok ? 'ok' : 'no'), ok ? '✔ 答对了！' : '✘ 正确答案：', ok ? '' : h('b', text)));
}

const ITEM = {
  async listenWord(box, it, u) {
    const opts = shuffle([it.w, ...sample(u.words.filter((x) => x.en !== it.w.en), 3)]);
    box.append(h('p.q', '听单词，选出正确的图片'), h('div.center', speakBtn(it.w.en, { label: '播放', cls: 'big' })));
    const grid = h('div.pic-choices');
    const p = new Promise((res) => {
      opts.forEach((o) => {
        const b = h('button.pic-choice', h('span', o.e));
        b.onclick = () => {
          if (grid.dataset.done) return; grid.dataset.done = 1;
          const ok = o === it.w; b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) grid.children[opts.indexOf(it.w)].classList.add('right');
          (ok ? fx.ding : fx.buzz)(); res(ok);
        };
        grid.appendChild(b);
      });
    });
    box.appendChild(grid);
    speak(it.w.en);
    const ok = await p;
    if (!ok) feedback(box, false, `${it.w.e} ${it.w.en}`);
    return ok ? it.pts : 0;
  },
  async listenSentence(box, it) {
    const opts = shuffle([it.p, ...sample(it.pool.filter((x) => x !== it.p), 2)]);
    box.append(h('p.q', '听句子，选出对应的图'), h('div.center', speakBtn(it.p.en, { label: '播放', cls: 'big' })));
    const g = choiceGroup(opts.map((o) => o.e), it.p.e, { big: true });
    g.classList.add('emoji-choices');
    box.appendChild(g);
    speak(it.p.en);
    const ok = await g.result;
    if (!ok) feedback(box, false, it.p.en);
    return ok ? it.pts : 0;
  },
  async pickWord(box, it, u) {
    const { options, answer } = mcq([it.w.en, ...sample(u.words.filter((x) => x.en !== it.w.en), 3).map((x) => x.en)]);
    box.append(h('p.q', '看图，选出正确的英文'), h('div.big-emoji', it.w.e), h('p.center.muted', it.w.cn));
    const g = choiceGroup(options, answer, { big: true });
    box.appendChild(g);
    const ok = await g.result;
    speak(it.w.en);
    return ok ? it.pts : 0;
  },
  async spell(box, it) {
    const word = it.w.en.toLowerCase();
    const extra = sample('abcdefghijklmnopqrstuvwxyz'.split('').filter((c) => !word.includes(c)), 2);
    const tiles = shuffle([...word.split(''), ...extra]);
    const slots = h('div.spell-slots', word.split('').map(() => h('span.slot', '')));
    const pool = h('div.tile-pool');
    let typed = [];
    let tries = 0;
    const res = new Promise((resolve) => {
      const redraw = () => {
        [...slots.children].forEach((s, i) => { s.textContent = typed[i]?.c || ''; });
        if (typed.length === word.length) {
          const got = typed.map((t) => t.c).join('');
          if (got === word) { fx.ding(); slots.classList.add('ok'); speak(it.w.en); resolve(tries === 0 ? it.pts : Math.round(it.pts / 2)); }
          else {
            tries++; fx.buzz(); slots.classList.add('shake');
            setTimeout(() => {
              slots.classList.remove('shake');
              typed.forEach((t) => t.b.classList.remove('used')); typed = []; redraw();
              if (tries >= 2) { feedback(box, false, word); resolve(0); }
            }, 600);
          }
        }
      };
      tiles.forEach((c) => {
        const b = h('button.tile.letter', c);
        b.onclick = () => { if (b.classList.contains('used') || typed.length >= word.length) return; b.classList.add('used'); typed.push({ c, b }); fx.tick(); redraw(); };
        pool.appendChild(b);
      });
      box.append(h('p.q', '听一听，拼出这个单词'), h('div.big-emoji', it.w.e), h('div.center', speakBtn(it.w.en, { label: '听' }), h('span.muted', ' ' + it.w.cn)), slots, pool,
        h('div.center', h('button.btn.ghost.small', { onclick: () => { const t = typed.pop(); if (t) { t.b.classList.remove('used'); redraw(); } } }, '⌫ 退格')));
      speak(it.w.en);
    });
    return res;
  },
  async mcq(box, it) {
    const { options, answer } = mcq(it.q.options);
    box.append(h('p.q.gq', it.q.q.replace('____', '______')));
    const g = choiceGroup(options, answer, { big: true });
    box.appendChild(g);
    const ok = await g.result;
    const full = it.q.q.replace(/_+/, answer);
    box.appendChild(h('div.model', speakBtn(full), h('span', full)));
    speak(full);
    return ok ? it.pts : 0;
  },
  async order(box, it) {
    const toks = it.s.split(/\s+/);
    const answer = h('div.answer-line');
    const pool = h('div.tile-pool');
    shuffle(toks.map((t, i) => ({ t, i }))).forEach(({ t }) => {
      const b = h('button.tile', t);
      b.onclick = () => { fx.tick(); (b.parentNode === pool ? answer : pool).appendChild(b); };
      pool.appendChild(b);
    });
    let tries = 0;
    box.append(h('p.q', '连词成句：按顺序点词块'), answer, pool);
    return new Promise((resolve) => {
      const btn = h('button.btn', '检查 ✔');
      btn.onclick = async () => {
        const got = [...answer.children].map((x) => x.textContent).join(' ');
        if (got === it.s) { fx.ding(); answer.classList.add('ok'); btn.remove(); speak(it.s); resolve(tries === 0 ? it.pts : Math.round(it.pts / 2)); }
        else {
          tries++; fx.buzz(); answer.classList.add('shake'); setTimeout(() => answer.classList.remove('shake'), 500);
          if (tries >= 2) { btn.remove(); feedback(box, false, it.s); resolve(0); }
        }
      };
      box.appendChild(h('div.center', btn));
    });
  },
  async speak(box, it) {
    box.append(h('p.q', '🎤 口语：', it.sp.cn), h('div.big-emoji', it.sp.e), h('p.center.muted', '想好了再点话筒说（可以说两次，取最高分）'));
    let best = 0, attempts = 0;
    return new Promise((resolve) => {
      const done = () => {
        const pts = best >= 85 ? 10 : best >= 70 ? 8 : best >= 55 ? 6 : best >= 35 ? 3 : 0;
        box.appendChild(h('div.model', '参考答案：', speakBtn(it.sp.answer), h('b', it.sp.answer), h('span.muted', `　本题得 ${pts} 分`)));
        speak(it.sp.answer);
        setTimeout(() => resolve(pts), 1800);
      };
      const mic = micButton({
        target: it.sp.answer, label: '点话筒回答',
        onResult: (r) => {
          if (r.fallback) { best = 85; done(); return; }
          attempts++; best = Math.max(best, r.score);
          if (best >= 85 || attempts >= 2) done();
          else box.appendChild(h('p.hint', `得分 ${r.score}，再说一次会更好！（最多两次）`));
        },
        onEmpty: () => { attempts++; if (attempts >= 3) done(); },
      });
      box.append(mic, h('div.center', h('button.btn.ghost.small', { onclick: done }, '我不会，看答案')));
    });
  },
  async speakPick(box, it, u) {
    const others = getUnits().filter((x) => x.id !== u.id).flatMap((x) => x.quiz.speak.map((s) => s.answer));
    const { options, answer } = mcq([it.sp.answer, ...sample(others, 2)]);
    box.append(h('p.q', '🎤 口语（点选版）：', it.sp.cn), h('div.big-emoji', it.sp.e));
    const g = choiceGroup(options, answer, { big: true, speakOptions: true });
    box.appendChild(g);
    const ok = await g.result;
    await speak(answer);
    return ok ? it.pts : 0;
  },
  async read(box, it) {
    const { options, answer } = mcq(it.q.options);
    box.append(h('div.passage', it.text), h('p.q', it.q.q));
    const g = choiceGroup(options, answer, { big: true });
    box.appendChild(g);
    return (await g.result) ? it.pts : 0;
  },
};
