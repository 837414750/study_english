// 单词岛：①认识新词（看图·听·跟读）→ ②听音找图（答错的词会再出现）→ ③句子跟读（家长添加的句子）
import { h, shuffle, sample, sleep } from '../util.js';
import { unitById, markStage, S, addXP } from '../store.js';
import { topbar, speakBtn, slowBtn, micButton, choiceGroup, celebrate, petSay, asrBanner } from '../ui.js';
import { speak } from '../speech.js';
import { introduce, review, cardKey } from '../srs.js';
import { fx } from '../audiofx.js';

export function render(root, [uid]) {
  const u = unitById(uid);
  const showCN = S().settings.showCN;
  root.appendChild(topbar('🏝️ 单词岛', { back: `#/unit/${uid}`, sub: `${u.title} · ${u.words.length} 个新词`, color: u.color }));
  const body = h('div.stage-body');
  root.appendChild(body);
  const mistakes = new Set();

  // ① 认识新词
  function learn() {
    let i = 0;
    const banner = asrBanner();
    const view = () => {
      const w = u.words[i];
      body.innerHTML = '';
      if (banner) body.appendChild(banner);
      const card = h('div.word-card',
        h('div.wc-pic', w.e),
        h('div.wc-en', w.en),
        showCN ? h('div.wc-cn', w.cn) : null,
        h('div.wc-btns', speakBtn(w.en, { label: '听' }), slowBtn(w.en)),
        micButton({ target: w.en, label: '点话筒，跟读这个词', silenceMs: 1100, maxMs: 6000 }),
      );
      body.append(
        h('div.progress-line', h('i', { style: { width: ((i + 1) / u.words.length) * 100 + '%' } })),
        h('p.center.muted', `第 ${i + 1} / ${u.words.length} 个`),
        card,
        h('div.nav-row',
          h('button.btn.ghost', { disabled: i === 0, onclick: () => { i--; view(); } }, '‹ 上一个'),
          i < u.words.length - 1
            ? h('button.btn', { onclick: () => { i++; view(); } }, '下一个 ›')
            : h('button.btn', { onclick: () => quizWords() }, '我都认识了，去挑战 ›')),
      );
      speak(w.en);
    };
    view();
  }

  // ② 听音找图
  async function quizWords() {
    let queue = shuffle(u.words);
    let correct = 0, total = 0;
    while (queue.length) {
      const w = queue.shift();
      total++;
      body.innerHTML = '';
      const others = sample(u.words.filter((x) => x.en !== w.en), Math.min(3, u.words.length - 1));
      const opts = shuffle([w, ...others]);
      const grid = h('div.pic-choices');
      let resolve;
      const picked = new Promise((r) => { resolve = r; });
      opts.forEach((o) => {
        const b = h('button.pic-choice', h('span', o.e));
        b.onclick = () => {
          if (b.parentNode.dataset.done) return;
          b.parentNode.dataset.done = '1';
          const ok = o.en === w.en;
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) [...grid.children][opts.indexOf(w)].classList.add('right');
          (ok ? fx.ding : fx.buzz)();
          resolve(ok);
        };
        grid.appendChild(b);
      });
      body.append(
        h('div.progress-line', h('i', { style: { width: (correct / u.words.length) * 100 + '%' } })),
        petSay('听一听，点出正确的图片！'),
        h('div.center', speakBtn(w.en, { label: '再听一遍', cls: 'big' })),
        grid,
      );
      await sleep(300);
      speak(w.en);
      const ok = await picked;
      if (ok) {
        correct++;
        await speak(w.en);
      } else {
        mistakes.add(w.en);
        body.appendChild(h('p.center.hint', `是 ${w.e}  ${w.en}${showCN ? '（' + w.cn + '）' : ''}，等会儿再考你一次！`));
        await speak(w.en);
        await sleep(900);
        queue.splice(Math.min(queue.length, 2), 0, w); // 答错的词过两题再出现（短时重复）
      }
      await sleep(400);
    }
    // 进入记忆曲线
    for (const w of u.words) {
      const key = cardKey('w', uid, w.en);
      introduce(key);
      if (mistakes.has(w.en)) review(key, false);
    }
    addXP(u.words.length * 2);
    if (u.sentences?.length) sentences(); else finish(Math.round((u.words.length / total) * 100));
  }

  // ③ 家长添加的句子跟读
  function sentences() {
    body.innerHTML = '';
    body.appendChild(petSay('最后，把爸爸妈妈准备的句子也读一读吧！'));
    for (const s of u.sentences) {
      body.appendChild(h('div.sent-row', h('div.sent-text', speakBtn(s.en), h('span', s.en), showCN && s.cn ? h('small', s.cn) : null),
        micButton({ target: s.en, compact: true, label: '跟读' })));
      introduce(cardKey('s', uid, s.en));
    }
    body.appendChild(h('div.center', h('button.btn.big', { onclick: () => finish(100) }, '完成 ✔')));
  }

  function finish(acc) {
    const first = markStage(uid, 'words');
    celebrate({
      score: null, pass: true, title: '单词岛完成！',
      lines: [`一次就答对的比例：${acc}%`, mistakes.size ? `答错过的 ${mistakes.size} 个词已放进复习本，今天再练一次会记得更牢！` : '全部一次答对，太厉害了！', first ? '获得 15 经验 + 松果 🌰' : ''],
      buttons: [h('a.btn', { href: `#/unit/${uid}`, onclick: () => document.querySelector('.modal-bg')?.remove() }, '回到岛屿'),
        h('a.btn.ghost', { href: `#/unit/${uid}/chant`, onclick: () => document.querySelector('.modal-bg')?.remove() }, '下一关：歌谣屋 ›')],
    });
  }

  learn();
}
