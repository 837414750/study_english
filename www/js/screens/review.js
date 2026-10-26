// 复习本：按记忆曲线到期的卡片（单词 / 句子 / 语法错题），答对升盒、答错当天再练
import { h, shuffle, sample, sleep, mcq } from '../util.js';
import { S, addXP } from '../store.js';
import { topbar, speakBtn, micButton, choiceGroup, celebrate, petSay } from '../ui.js';
import { speak, canListen, initASR } from '../speech.js';
import { dueCards, resolveCard, review, INTERVALS } from '../srs.js';
import { fx } from '../audiofx.js';

export function render(root) {
  root.appendChild(topbar('🔁 复习本', { back: '#/', sub: '记忆曲线：1 → 2 → 4 → 7 → 15 → 30 天' }));
  const body = h('div.stage-body');
  root.appendChild(body);
  let alive = true;

  (async () => {
    await initASR();
    let keys = dueCards(12);
    let freePractice = false;
    if (!keys.length) {
      const all = Object.keys(S().srs).filter((k) => resolveCard(k));
      if (!all.length) {
        body.append(petSay('复习本还是空的～ 先去岛上学单词吧，学过的词会自动来这里排队复习！'), h('div.center', h('a.btn.big', { href: '#/' }, '去地图')));
        return;
      }
      body.append(petSay('今天要复习的都完成啦！🎉 想再自由练习一组吗？'));
      const go = h('button.btn.big', '自由练习 8 张');
      body.appendChild(h('div.center', go));
      await new Promise((r) => { go.onclick = r; });
      keys = sample(all, 8);
      freePractice = true;
    }
    let right = 0;
    for (let i = 0; i < keys.length; i++) {
      if (!alive) return;
      const key = keys[i];
      const card = resolveCard(key);
      const box = S().srs[key]?.box || 1;
      body.innerHTML = '';
      body.append(h('div.quiz-head', h('span.sec-tag', `${card.unit.icon} ${card.unit.title}`), h('span', `${i + 1}/${keys.length}`), h('span.box-tag', `📦 ${box} 号盒`)),
        h('div.progress-line', h('i', { style: { width: (i / keys.length) * 100 + '%' } })));
      const area = h('div.q-box');
      body.appendChild(area);
      const ok = await ask(area, card, box);
      if (!freePractice) review(key, ok);
      if (ok) right++;
      const nb = S().srs[key]?.box || 1;
      area.appendChild(h('p.center.muted', ok ? `✔ 升到 ${nb} 号盒，${INTERVALS[nb]} 天后再见` : '✘ 回到 1 号盒，今天再练一次'));
      await sleep(ok ? 900 : 1600);
    }
    addXP(right);
    celebrate({ score: Math.round((right / keys.length) * 100), pass: right / keys.length >= 0.6, title: '复习完成！', lines: [`记住了 ${right}/${keys.length} 张`, '每天复习一点点，记得最牢！'], buttons: [h('a.btn', { href: '#/' }, '回到地图')] });
  })();

  return () => { alive = false; };
}

async function ask(area, card, box) {
  if (card.type === 'w') {
    const w = card.word;
    const others = card.unit.words.filter((x) => x.en !== w.en);
    if (box <= 2 || !canListen()) {
      // 听音选图（入门）或看图选词
      if (box <= 2) {
        const opts = shuffle([w, ...sample(others, 3)]);
        area.append(h('p.q', '听一听，选出图片'), h('div.center', speakBtn(w.en, { label: '再听', cls: 'big' })));
        const g = choiceGroup(opts.map((o) => o.e), w.e, { big: true });
        g.classList.add('emoji-choices');
        area.appendChild(g);
        speak(w.en);
        const ok = await g.result;
        await speak(w.en);
        return ok;
      }
      const { options, answer } = mcq([w.en, ...sample(others, 3).map((x) => x.en)]);
      area.append(h('p.q', '看图选英文'), h('div.big-emoji', w.e), h('p.center.muted', w.cn));
      const g = choiceGroup(options, answer, { big: true });
      area.appendChild(g);
      const ok = await g.result;
      await speak(w.en);
      return ok;
    }
    // 看图说词（进阶，主动回忆效果最好）
    area.append(h('p.q', '看图说出英文'), h('div.big-emoji', w.e), h('p.center.muted', w.cn));
    return new Promise((resolve) => {
      let tries = 0;
      area.appendChild(micButton({
        target: w.en, label: '说出这个词', silenceMs: 1100, maxMs: 6000,
        onResult: async (r) => {
          tries++;
          if (r.fallback || r.score >= 70) { await speak(w.en); resolve(true); }
          else if (tries >= 2) { area.appendChild(h('p.hint', `是 ${w.en}`)); await speak(w.en); resolve(false); }
        },
      }), h('div.center', h('button.btn.ghost.small', { onclick: async () => { area.appendChild(h('p.hint', w.en)); await speak(w.en); resolve(false); } }, '想不起来了')));
    });
  }
  if (card.type === 's') {
    area.append(h('p.q', '听一听，跟读这句话'), h('div.model', speakBtn(card.text), h('b', card.text)));
    speak(card.text);
    return new Promise((resolve) => {
      area.appendChild(micButton({ target: card.text, label: '跟读', onResult: (r) => { if (r.fallback || r.score >= 70) resolve(true); else if (r.score < 70) area.appendChild(h('p.hint', `${r.score} 分，再来一次？`)); } }));
      area.appendChild(h('div.center', h('button.btn.ghost.small', { onclick: () => resolve(false) }, '跳过')));
    });
  }
  if (card.type === 'g') {
    const { options, answer } = mcq(card.q.options);
    area.append(h('p.q.gq', card.q.q));
    const g = choiceGroup(options, answer, { big: true });
    area.appendChild(g);
    const ok = await g.result;
    const full = card.q.q.replace(/_+/, answer);
    area.appendChild(h('div.model', speakBtn(full), h('span', full)));
    await speak(full);
    return ok;
  }
  fx.pop();
  return true;
}
