// 基础类小游戏：speed（快反应）、treasure（校园寻宝）、live（动物直播间·连词成句）、exclaim（感叹机）、judge（诚实小法官）
import { h, shuffle, sample, sleep, aOrAn } from '../util.js';
import { speak } from '../speech.js';
import { speakBtn, micButton, choiceGroup } from '../ui.js';
import { fx } from '../audiofx.js';

const starsBy = (ratio) => (ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1);
function header(area, text) { const p = h('div.game-hud', text); area.appendChild(p); return p; }

/** Starter：听到就点 —— 星期和数字 */
export function speed(area, u, { onWin }) {
  let alive = true;
  const rounds = sample(u.game.items, 10);
  let score = 0;
  (async () => {
    for (let r = 0; r < rounds.length; r++) {
      if (!alive) return;
      const it = rounds[r];
      area.innerHTML = '';
      header(area, `第 ${r + 1}/10 题　答对 ${score}`);
      const opts = shuffle([it, ...sample(u.game.items.filter((x) => x.show !== it.show), 3)]);
      const timer = h('div.timer', h('i'));
      const g = h('div.pic-choices.big');
      let resolve; const res = new Promise((rr) => { resolve = rr; });
      let done = false;
      const t0 = Date.now();
      opts.forEach((o) => {
        const b = h('button.pic-choice', h('span', o.show));
        b.onclick = () => {
          if (done) return; done = true;
          const ok = o.show === it.show;
          b.classList.add(ok ? 'right' : 'wrong');
          (ok ? fx.ding : fx.buzz)();
          resolve(ok);
        };
        g.appendChild(b);
      });
      area.append(h('div.center', speakBtn(it.say, { label: '再听一遍', cls: 'big' })), timer, g);
      await speak(it.say);
      timer.firstChild.style.animation = 'shrink 6s linear forwards';
      const to = setTimeout(() => { if (!done) { done = true; fx.buzz(); resolve(false); } }, 6000);
      const ok = await res;
      clearTimeout(to);
      if (ok && Date.now() - t0 < 6000) score++;
      if (!ok) { [...g.children][opts.indexOf(it)].classList.add('right'); await speak(it.say); }
      await sleep(600);
    }
    if (alive) onWin(starsBy(score / rounds.length));
  })();
  return () => { alive = false; };
}

/** Unit 1：校园寻宝 —— has / have no */
export function treasure(area, u, { onWin }) {
  const items = shuffle(u.game.items).slice(0, 8);
  let opened = 0, right = 0;
  header(area, '点开宝箱，看看学校里有没有它！');
  const grid = h('div.chest-grid');
  const stage = h('div.chest-stage');
  area.append(grid, stage);
  items.forEach((it) => {
    const chest = h('button.chest', '🎁');
    chest.onclick = async () => {
      if (chest.classList.contains('open') || stage.dataset.busy) return;
      stage.dataset.busy = '1';
      chest.classList.add('open');
      chest.innerHTML = '';
      chest.append(h('span', it.e), h('small', it.has ? '✔ 有' : '✘ 没有'));
      fx.pop();
      const yes = `Our school has ${aOrAn(it.en)}.`;
      const no = `We have no ${it.en}.`;
      stage.innerHTML = '';
      stage.append(h('div.big-emoji', it.e), h('p', it.has ? '我们学校有这个！' : '我们学校没有这个！选出正确的句子：'));
      await speak(it.en);
      const g = choiceGroup(shuffle([yes, no]), it.has ? yes : no, { big: true });
      stage.appendChild(g);
      const ok = await g.result;
      if (ok) right++;
      const ans = it.has ? yes : no;
      await speak(ans);
      stage.appendChild(micButton({ target: ans, compact: true, label: '加分题：大声说一遍！' }));
      opened++;
      delete stage.dataset.busy;
      if (opened === items.length) {
        stage.appendChild(h('div.center', h('button.btn.big', { onclick: () => onWin(starsBy(right / items.length)) }, '寻宝完成！🎉')));
      }
    };
    grid.appendChild(chest);
  });
}

/** Unit 3：动物直播间 —— 现在进行时 连词成句 */
export function live(area, u, { onWin }) {
  const scenes = sample(u.game.scenes, 6);
  let idx = 0, firstTry = 0;
  const next = () => {
    if (idx >= scenes.length) { onWin(starsBy(firstTry / scenes.length)); return; }
    const sc = scenes[idx];
    const correct = sc.words.join(' ');
    let tries = 0;
    area.innerHTML = '';
    header(area, `📺 直播第 ${idx + 1}/${scenes.length} 条`);
    const answer = h('div.answer-line');
    const pool = h('div.tile-pool');
    const tiles = shuffle([...sc.words, ...sc.distract]);
    tiles.forEach((t) => {
      const tile = h('button.tile', t);
      tile.onclick = () => {
        fx.tick();
        if (tile.parentNode === pool) answer.appendChild(tile); else pool.appendChild(tile);
      };
      pool.appendChild(tile);
    });
    const check = h('button.btn.big', '检查 ✔');
    const fb = h('div.feedback');
    check.onclick = async () => {
      const got = [...answer.children].map((x) => x.textContent).join(' ');
      if (got === correct) {
        if (tries === 0) firstTry++;
        fx.ding();
        answer.classList.add('ok');
        fb.innerHTML = '';
        fb.append(h('p', '🎙️ 主播说得对！'));
        await speak(correct);
        fb.append(micButton({ target: correct, compact: true, label: '像主播一样播报一遍' }), h('button.btn', { onclick: () => { idx++; next(); } }, '下一条 ›'));
        check.remove();
      } else {
        tries++;
        fx.buzz();
        answer.classList.add('shake'); setTimeout(() => answer.classList.remove('shake'), 500);
        const want = sc.words;
        const gotArr = [...answer.children].map((x) => x.textContent);
        const k = want.findIndex((w, i) => gotArr[i] !== w);
        fb.innerHTML = '';
        fb.append(h('p.hint', tries >= 2 ? `提示：正确顺序是 —— ${correct}` : `第 ${k + 1} 块不对哦。一只动物用 is，两只以上用 are，后面接 动词ing！`));
      }
    };
    area.append(h('div.big-emoji', sc.e), h('p.center', '它们正在做什么？把词块排成句子：'), answer, pool, h('div.center', check), fb);
  };
  next();
}

/** Unit 6：秋天感叹机 —— How ...! */
export function exclaim(area, u, { onWin }) {
  const scenes = shuffle(u.game.scenes);
  let idx = 0, right = 0;
  const next = async () => {
    if (idx >= scenes.length) { onWin(starsBy(right / scenes.length)); return; }
    const sc = scenes[idx];
    area.innerHTML = '';
    header(area, `🍂 第 ${idx + 1}/${scenes.length} 幅`);
    area.append(h('div.big-emoji', sc.e), h('p.center', sc.cn));
    const g = choiceGroup(shuffle(sc.options), sc.options[0], { big: true });
    area.appendChild(g);
    const ok = await g.result;
    if (ok) right++;
    await speak(sc.options[0], { pitch: 1.2 });
    let maxLv = 0;
    const meter = h('div.feel-meter', '感情指数：', h('span', '🤍🤍🤍🤍🤍'));
    area.append(meter, micButton({
      target: sc.options[0], compact: true, label: '有感情地大声说出来！',
      onLevel: (v) => { maxLv = Math.max(maxLv, v); },
      onResult: () => {
        const hearts = Math.max(1, Math.min(5, Math.round(maxLv * 6)));
        meter.querySelector('span').textContent = '❤️'.repeat(hearts) + '🤍'.repeat(5 - hearts);
      },
    }), h('div.center', h('button.btn', { onclick: () => { idx++; next(); } }, '下一幅 ›')));
  };
  next();
}

/** Unit 8：诚实小法官 —— should / shouldn't */
export function judge(area, u, { onWin }) {
  const cases = shuffle(u.game.cases);
  let idx = 0, right = 0;
  const next = async () => {
    if (idx >= cases.length) { onWin(starsBy(right / cases.length)); return; }
    const c = cases[idx];
    area.innerHTML = '';
    header(area, `⚖️ 第 ${idx + 1}/${cases.length} 个案件`);
    area.append(h('div.case-card', h('div.big-emoji', c.e), h('p.case-en', speakBtn(c.en), ' ', c.en), h('p.muted', c.cn)),
      h('p.center', '法官大人，他/她应该怎么做？'));
    speak(c.en);
    const g = choiceGroup(shuffle(c.options), c.options[0], { big: true, speakOptions: true });
    area.appendChild(g);
    const ok = await g.result;
    if (ok) { right++; area.appendChild(h('div.gavel', '🔨')); }
    await speak(c.options[0]);
    area.append(micButton({ target: c.options[0], compact: true, label: '宣判！大声读出来' }),
      h('div.center', h('button.btn', { onclick: () => { idx++; next(); } }, '下一个案件 ›')));
  };
  next();
}

