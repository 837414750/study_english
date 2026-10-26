// 故事屋：翻页绘本（逐词高亮朗读 + 跟读）→ 阅读理解问题
import { h, mcq, sleep } from '../util.js';
import { unitById, markStage, S, addXP } from '../store.js';
import { topbar, speakBtn, micButton, choiceGroup, celebrate } from '../ui.js';
import { speak, stopSpeak } from '../speech.js';
import { introduce, cardKey } from '../srs.js';

export function render(root, [uid]) {
  const u = unitById(uid);
  const st = u.story;
  let showCN = S().settings.showCN;
  root.appendChild(topbar('📖 故事屋', { back: `#/unit/${uid}`, sub: `${st.title} · ${st.cn}`, color: u.color }));
  const body = h('div.stage-body');
  root.appendChild(body);
  let page = 0, auto = false, alive = true;

  const view = async () => {
    const p = st.pages[page];
    body.innerHTML = '';
    const words = p.en.split(/\s+/).map((w) => h('span.cw', w + ' '));
    const cn = h('div.pg-cn' + (showCN ? '' : '.hide'), p.cn);
    const book = h('div.book',
      h('div.pg-pic', p.e),
      h('div.pg-text', words),
      cn,
      h('div.row.center', speakBtn(p.en, { label: '读给我听', onWord: (i) => words.forEach((w, k) => w.classList.toggle('hl', k === i)) }),
        h('button.btn.ghost.small', { onclick: () => { showCN = !showCN; cn.classList.toggle('hide', !showCN); } }, '中/英'),
        h('button.btn.ghost.small' + (auto ? '.on' : ''), { onclick: (e) => { auto = !auto; e.target.classList.toggle('on', auto); if (auto) readAndNext(); } }, auto ? '⏸ 自动' : '▶ 自动翻页')),
      micButton({ target: p.en, compact: true, label: '我来读这一页' }),
    );
    body.append(
      h('div.progress-line', h('i', { style: { width: ((page + 1) / st.pages.length) * 100 + '%' } })),
      book,
      h('div.nav-row',
        h('button.btn.ghost', { disabled: page === 0, onclick: () => { page--; view(); } }, '‹ 上一页'),
        page < st.pages.length - 1 ? h('button.btn', { onclick: () => { page++; view(); } }, '下一页 ›') : h('button.btn', { onclick: questions }, '读完了，回答问题 ›')),
    );
    if (auto) readAndNext(); else speak(p.en, { onWord: (i) => words.forEach((w, k) => w.classList.toggle('hl', k === i)) });
    async function readAndNext() {
      await speak(p.en, { onWord: (i) => words.forEach((w, k) => w.classList.toggle('hl', k === i)) });
      await sleep(900);
      if (!alive || !auto) return;
      if (page < st.pages.length - 1) { page++; view(); } else { auto = false; questions(); }
    }
  };

  async function questions() {
    auto = false; await stopSpeak();
    body.innerHTML = '';
    body.appendChild(h('h3.center', '🤔 故事问答'));
    let right = 0;
    for (const q of st.questions) {
      const { options, answer } = mcq(q.options);
      const card = h('section.card', h('p.q', speakBtn(q.q), ' ', q.q), showCN ? h('p.muted', q.cn) : null);
      const g = choiceGroup(options, answer, { speakOptions: true });
      card.appendChild(g);
      body.appendChild(card);
      card.scrollIntoView({ behavior: 'smooth' });
      speak(q.q);
      if (await g.result) right++;
      await sleep(600);
    }
    // 把故事里的句子放进复习本（随机 2 句）
    st.pages.slice(1, 3).forEach((p) => introduce(cardKey('s', uid, p.en)));
    markStage(uid, 'story');
    addXP(right * 3);
    const score = Math.round((right / st.questions.length) * 100);
    celebrate({ score, pass: score >= 60, title: score === 100 ? '全部答对！阅读小达人！' : '故事读完啦！', buttons: [h('a.btn', { href: `#/unit/${uid}/project` }, '下一关：大任务 ›'), h('button.btn.ghost', { onclick: () => { document.querySelector('.modal-bg')?.remove(); page = 0; view(); } }, '再读一遍')] });
  }

  view();
  return () => { alive = false; };
}
