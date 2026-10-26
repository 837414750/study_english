// 时间与天气：clock（时间大富翁）、weather（小小天气预报员）
import { h, shuffle, sample, sleep, pick } from '../util.js';
import { speak } from '../speech.js';
import { speakBtn, micButton, choiceGroup } from '../ui.js';
import { clockFace, timePhrase } from '../clockface.js';
import { saveRecording, addWork } from '../store.js';
import { fx } from '../audiofx.js';

const MINUTES = [0, 0, 30, 30, 15, 45, 10, 50, 5, 55, 20, 40];

function randomTime() { return { hh: 1 + Math.floor(Math.random() * 12), mm: pick(MINUTES) }; }
function distractors(hh, mm) {
  const set = new Set();
  const right = timePhrase(hh, mm);
  set.add(timePhrase(hh % 12 + 1, mm));
  set.add(timePhrase(((hh + 10) % 12) + 1, mm));
  if (mm > 0 && mm !== 30) set.add(timePhrase(hh, 60 - mm));
  set.delete(right);
  return shuffle([...set]).slice(0, 2);
}

/** Unit 9：时间大富翁 */
export function clock(area, u, { onWin }) {
  const SQUARES = 10;
  let pos = 0, turns = 0;
  const board = h('div.board');
  const cells = [];
  for (let i = 0; i < SQUARES; i++) {
    const c = h('div.cell', i === SQUARES - 1 ? '🏁' : i === 0 ? '🏠' : String(i));
    cells.push(c); board.appendChild(c);
  }
  const token = h('span.token', '🐿️');
  const stage = h('div.clock-stage');
  area.append(board, stage);
  const place = () => cells[Math.min(pos, SQUARES - 1)].appendChild(token);
  place();

  const turn = async () => {
    turns++;
    stage.innerHTML = '';
    const { hh, mm } = randomTime();
    const phrase = timePhrase(hh, mm);
    const setMode = turns % 3 === 0;
    let ok;
    if (!setMode) {
      stage.append(h('div.game-hud', `第 ${turns} 回合：What time is it?`), clockFace(hh, mm, 220));
      speak('What time is it?');
      const right = `It's ${phrase}.`;
      const g = choiceGroup(shuffle([right, ...distractors(hh, mm).map((p) => `It's ${p}.`)]), right, { big: true, speakOptions: true });
      stage.appendChild(g);
      ok = await g.result;
      await speak(right);
    } else {
      ok = await setClock(stage, hh, mm, phrase);
    }
    if (ok) {
      const dice = 1 + Math.floor(Math.random() * 3);
      const d = h('div.dice', '🎲');
      stage.appendChild(d);
      await sleep(700);
      d.textContent = `🎲 ${dice}`;
      fx.pop();
      for (let k = 0; k < dice; k++) { pos++; place(); fx.tick(); await sleep(260); }
    } else {
      stage.appendChild(h('p.hint', '没关系，这回合原地不动，下回合加油！'));
      await sleep(1200);
    }
    if (pos >= SQUARES - 1) {
      speak('You win!');
      stage.appendChild(h('div.center', h('button.btn.big', { onclick: () => onWin(turns <= 8 ? 3 : turns <= 12 ? 2 : 1) }, '到达终点！🏁')));
    } else {
      stage.appendChild(h('div.center', h('button.btn', { onclick: turn }, '下一回合 ›')));
    }
  };

  function setClock(stageEl, hh, mm, phrase) {
    return new Promise((resolve) => {
      let ch = 12, cm = 0;
      const face = h('div.face-holder');
      const draw = () => { face.innerHTML = ''; face.appendChild(clockFace(ch, cm, 220)); };
      draw();
      const say = `It's ${phrase}.`;
      let tries = 0;
      stageEl.append(h('div.game-hud', `第 ${turns} 回合：拨一拨钟！`), h('p.center.q', speakBtn(say), ' ', say), face,
        h('div.row.center',
          h('button.btn.ghost', { onclick: () => { ch = ch === 1 ? 12 : ch - 1; draw(); } }, '时针 −'),
          h('button.btn.ghost', { onclick: () => { ch = ch === 12 ? 1 : ch + 1; draw(); } }, '时针 +'),
          h('button.btn.ghost', { onclick: () => { cm = (cm + 55) % 60; draw(); } }, '分针 −5'),
          h('button.btn.ghost', { onclick: () => { cm = (cm + 5) % 60; draw(); } }, '分针 +5')),
        h('div.center', h('button.btn', {
          onclick: (e) => {
            if (ch === hh && cm === mm) { fx.ding(); e.target.remove(); resolve(true); }
            else {
              tries++; fx.buzz();
              if (tries >= 2) { ch = hh; cm = mm; draw(); stageEl.appendChild(h('p.hint', '应该是这样哦！')); e.target.remove(); setTimeout(() => resolve(false), 1200); }
              else stageEl.appendChild(h('p.hint', 'past 是"过了几分"，to 是"差几分到"，再试一次！'));
            }
          },
        }, '拨好了 ✔')));
      speak(say);
    });
  }
  turn();
}

/** Unit 10：小小天气预报员 */
export function weather(area, u, { onWin }) {
  const cities = u.game.cities;
  let r = 0, right = 0;
  const desc = (c) => `It's ${c.w} and ${c.feel}.`;
  const mapEl = () => h('div.weather-map', cities.map((c) => h('div.wcity', h('span', c.e), h('b', c.name), h('small', `${c.cn} ${c.t}°`))));
  const qs = sample(cities, 4);
  const next = async () => {
    if (r >= qs.length) { report(); return; }
    const c = qs[r];
    area.innerHTML = '';
    area.append(h('div.game-hud', `📺 第 ${r + 1}/${qs.length} 题　答对 ${right}`), mapEl());
    const q = `How's the weather in ${c.name}?`;
    area.append(h('p.center.q', speakBtn(q), ' ', q));
    speak(q);
    const wrong = sample(cities.filter((x) => x.w !== c.w), 2).map(desc);
    const g = choiceGroup(shuffle([desc(c), ...wrong]), desc(c), { big: true, speakOptions: true });
    area.appendChild(g);
    if (await g.result) right++;
    const full = `It's ${c.w} in ${c.name}. It's ${c.t < 0 ? 'minus ' + Math.abs(c.t) : c.t} degrees.`;
    area.append(h('div.model', speakBtn(full), h('b', full)));
    await speak(full);
    area.append(micButton({ target: full, compact: true, label: '像主播一样说一遍' }), h('div.center', h('button.btn', { onclick: () => { r++; next(); } }, '下一题 ›')));
  };
  const report = () => {
    area.innerHTML = '';
    const c = pick(cities);
    const t = c.t < 0 ? `minus ${Math.abs(c.t)}` : String(c.t);
    const script = `Good morning! Here is the weather report. It's ${c.w} in ${c.name} today. It's ${t} degrees. It's ${c.feel}. Have a nice day!`;
    area.append(h('div.game-hud', '🎬 正式开播：录一段你的天气预报！'), h('div.tv', h('div.tv-screen', h('span', c.e), h('b', c.name), h('small', `${c.t}°`))),
      h('div.model.script', speakBtn(script), h('b', script)),
      micButton({
        target: script, maxMs: 30000, silenceMs: 2500, label: '点话筒开始播报',
        onResult: async (res) => {
          if (res.blob) {
            const key = await saveRecording({ uid: u.id, kind: 'project', text: script, score: res.score }, res.blob);
            addWork({ uid: u.id, title: `天气预报：${c.name}`, text: script, audioKey: key, score: res.score });
          }
          area.appendChild(h('div.center', h('button.btn.big', { onclick: () => onWin(right >= 4 ? 3 : right >= 3 ? 2 : 1) }, '播报完成！🎉')));
        },
      }),
      h('div.center', h('button.btn.ghost', { onclick: () => onWin(right >= 4 ? 3 : right >= 3 ? 2 : 1) }, '先跳过')));
    speak(script);
  };
  next();
}
