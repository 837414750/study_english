// 对话馆：和机器人 Robo 情景对话。可以说（离线识别 + 关键词匹配），也可以点选；卡住有提示和示范。
// 第二轮可以"换角色"：孩子演 Robo。
import { h, shuffle, sleep } from '../util.js';
import { unitById, markStage, S, addXP } from '../store.js';
import { topbar, micButton, speakBtn, celebrate, asrBanner, choiceGroup } from '../ui.js';
import { speak, canListen, initASR } from '../speech.js';
import { matchExpect } from '../scoring.js';
import { clockFace } from '../clockface.js';
import { fx } from '../audiofx.js';

export function render(root, [uid]) {
  const u = unitById(uid);
  const d = u.dialogue;
  const showCN = S().settings.showCN;
  root.appendChild(topbar('🤖 对话馆', { back: `#/unit/${uid}`, sub: `${d.title} · ${d.cn}`, color: u.color }));
  const body = h('div.stage-body.dialogue');
  root.appendChild(body);
  let alive = true;
  const scene = h('div.scene', h('span.scene-pic', d.scene), h('div', h('b', d.title), h('small', `你在和「${d.bot}」聊天`)));
  const log = h('div.chat');
  const controls = h('div.chat-controls');
  body.append(asrBanner() || '', scene, log, controls);

  const scrollDown = () => setTimeout(() => log.lastChild?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
  function botSay(text, cn, pic) {
    const b = h('div.msg.bot', h('span.avatar', '🤖'), h('div.bub', h('div', text), showCN && cn ? h('small', cn) : null, speakBtn(text, { cls: 'tiny' })));
    if (pic) {
      const [hh, mm] = pic.split(':').map(Number);
      b.querySelector('.bub').appendChild(clockFace(hh, mm, 130));
    }
    log.appendChild(b); scrollDown();
    return speak(text, { pitch: 1.25 });
  }
  function kidSay(text, starsN) {
    log.appendChild(h('div.msg.kid', h('div.bub', text, starsN ? h('span.mini-stars', ' ' + '⭐'.repeat(starsN)) : null), h('span.avatar', '🧒')));
    scrollDown();
  }

  async function roundOne() {
    const results = [];
    for (let ti = 0; ti < d.turns.length; ti++) {
      if (!alive) return;
      const t = d.turns[ti];
      await botSay(t.bot, t.cn, t.pic);
      const stars = await kidTurn(t, ti);
      results.push(stars);
      await sleep(400);
    }
    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    markStage(uid, 'dialogue');
    addXP(Math.round(avg * 3));
    controls.innerHTML = '';
    celebrate({
      score: null, pass: true, title: '对话完成！',
      lines: [`获得 ${results.reduce((a, b) => a + b, 0)} 颗星 ⭐`, '要不要换个角色，你来当 Robo？'],
      buttons: [h('button.btn', { onclick: () => { document.querySelector('.modal-bg')?.remove(); roundTwo(); } }, '🔄 换我当 Robo'),
        h('a.btn.ghost', { href: `#/unit/${uid}/game` }, '下一关：语法游戏 ›')],
    });
  }

  /** 孩子回答一轮：返回星星数 3/2/1 */
  function kidTurn(t, ti) {
    return new Promise((resolve) => {
      let attempts = 0, hintLevel = 0;
      controls.innerHTML = '';
      const hintBox = h('div.hint-box');
      const done = (text, starsN) => { fx.ding(); kidSay(text, starsN); controls.innerHTML = ''; resolve(starsN); };
      const mic = micButton({
        autoScore: false, label: '点话筒，回答 Robo', grammar: [...t.kid, ...t.expect], maxMs: 10000,
        target: null,
        onResult: (r) => {
          if (r.fallback) { done(t.kid[0], 1); return; }
          const m = matchExpect(r.heard, t.expect, t.kid);
          if (m.ok) done(r.heard, attempts === 0 ? 3 : 2);
          else {
            attempts++;
            fx.buzz();
            hintLevel = Math.min(2, attempts);
            showHint(hintLevel);
          }
        },
      });
      const showHint = (level) => {
        hintBox.innerHTML = '';
        if (level === 1) hintBox.append(h('p', '💡 ', t.kidcn || '想一想，可以这样开头：', h('b', ' ' + t.kid[0].split(' ').slice(0, 2).join(' ') + ' ……')));
        else hintBox.append(h('p', '💡 跟我说：'), h('div.model', speakBtn(t.kid[0]), h('b', t.kid[0])));
        if (level >= 2) speak(t.kid[0]);
      };
      const others = d.turns.filter((_, k) => k !== ti).map((x) => x.kid[0]);
      const tapBtn = h('button.btn.ghost.small', '👆 点选回答');
      tapBtn.onclick = () => {
        tapBtn.remove();
        const opts = shuffle([t.kid[0], shuffle(others)[0]]);
        const g = choiceGroup(opts, t.kid[0], { speakOptions: true });
        controls.appendChild(g);
        g.result.then(async (ok) => {
          await sleep(500);
          if (ok) { await speak(t.kid[0]); done(t.kid[0], 1); } else { g.remove(); controls.appendChild(tapBtn); showHint(2); }
        });
      };
      const hintBtn = h('button.btn.ghost.small', { onclick: () => { hintLevel = Math.min(2, hintLevel + 1); attempts = Math.max(attempts, 1); showHint(hintLevel); } }, '💡 提示');
      controls.append(mic, h('div.row.center', hintBtn, tapBtn), hintBox);
      initASR().then(() => { if (!canListen()) tapBtn.click(); });
    });
  }

  async function roundTwo() {
    log.innerHTML = '';
    controls.innerHTML = '';
    log.appendChild(h('p.center.muted', '🔄 现在你是 Robo！读出 Robo 的台词，我来演你。'));
    for (const t of d.turns) {
      if (!alive) return;
      await new Promise((resolve) => {
        controls.innerHTML = '';
        controls.append(h('div.model', speakBtn(t.bot), h('b', t.bot)),
          micButton({ target: t.bot, label: '读出 Robo 的台词', onResult: (r) => {
            if (r.fallback || r.score >= 40) {
              log.appendChild(h('div.msg.kid', h('div.bub', t.bot, r.score != null ? h('span.mini-stars', ` ${r.score}分`) : null), h('span.avatar', '🤖')));
              resolve();
            }
          } }),
          h('button.btn.ghost.small', { onclick: resolve }, '跳过'));
      });
      controls.innerHTML = '';
      log.appendChild(h('div.msg.bot', h('span.avatar', '🧒'), h('div.bub', t.kid[0])));
      scrollDown();
      await speak(t.kid[0], { pitch: 1.3 });
    }
    addXP(10);
    celebrate({ score: null, pass: true, title: '你是最棒的 Robo！', buttons: [h('a.btn', { href: `#/unit/${uid}/game` }, '下一关：语法游戏 ›'), h('a.btn.ghost', { href: `#/unit/${uid}` }, '回到岛屿')] });
  }

  roundOne();
  return () => { alive = false; };
}
