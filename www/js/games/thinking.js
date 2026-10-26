// 推理类小游戏：guess（猜同学）、match（环球生日传统）、explore（水乡侦探 Is/Are there）、calendar（早餐日历 How often）
import { h, shuffle, sample, sleep, pick } from '../util.js';
import { speak } from '../speech.js';
import { speakBtn, micButton, choiceGroup } from '../ui.js';
import { matchExpect } from '../scoring.js';
import { fx } from '../audiofx.js';

const hud = (area, t) => area.appendChild(h('div.game-hud', t));

/** Unit 2：猜猜他是谁 —— Who is he/she? He/She helps me ... */
export function guess(area, u, { onWin }) {
  const people = u.game.people;
  const targets = sample(people, 4);
  let round = 0, total = 0;
  const next = async () => {
    if (round >= targets.length) { onWin(total >= 10 ? 3 : total >= 7 ? 2 : 1); return; }
    const t = targets[round];
    let clue = 0;
    area.innerHTML = '';
    hud(area, `🕵️ 第 ${round + 1}/${targets.length} 轮　得分 ${total}`);
    const clues = h('div.clues');
    const cards = h('div.people-grid');
    const say = h('div.guess-say');
    area.append(clues, cards, say);
    const showClue = async () => {
      const c = t.clues[clue];
      clues.appendChild(h('div.clue', h('span', `线索 ${clue + 1}`), speakBtn(c, { cls: 'tiny' }), ' ', c));
      await speak(c);
    };
    let done = false;
    people.forEach((p) => {
      const card = h('button.person', h('span.pe', p.e), h('b', p.name), h('small', p.tags.join(' ')));
      card.onclick = async () => {
        if (done || card.classList.contains('wrong')) return;
        if (p.name === t.name) {
          done = true;
          card.classList.add('right'); fx.ding();
          const pts = 3 - clue;
          total += pts;
          const ans = `${t.he} is ${t.name}!`;
          say.append(h('p', `🎉 猜对了！+${pts} 分。现在用英语说：`), h('div.model', speakBtn(ans), h('b', ans)));
          await speak(`Who is ${t.he === 'He' ? 'he' : 'she'}? ${ans}`);
          say.append(micButton({ target: ans, compact: true, label: '说出答案' }), h('button.btn', { onclick: () => { round++; next(); } }, '下一轮 ›'));
        } else {
          card.classList.add('wrong'); fx.buzz();
          if (clue < t.clues.length - 1) { clue++; showClue(); }
          else {
            done = true;
            [...cards.children].find((c) => c.querySelector('b').textContent === t.name).classList.add('right');
            say.append(h('p', `是 ${t.name}！没关系，下一轮加油～`), h('button.btn', { onclick: () => { round++; next(); } }, '下一轮 ›'));
          }
        }
      };
      cards.appendChild(card);
    });
    await sleep(300);
    await speak(`Guess! Who is ${t.he === 'He' ? 'he' : 'she'}?`);
    showClue();
  };
  next();
}

/** Unit 4：环球生日派对 —— It's a tradition to ... */
export function match(area, u, { onWin }) {
  const pairs = u.game.pairs;
  const left = shuffle(pairs), right = shuffle(pairs);
  let sel = null, matched = 0, mistakes = 0;
  hud(area, '先点国家，再点它的生日传统！');
  const cols = h('div.match-cols');
  const L = h('div.mcol'), R = h('div.mcol');
  const out = h('div.match-out');
  cols.append(L, R);
  area.append(cols, out);
  left.forEach((p) => {
    const b = h('button.mitem', p.left);
    b.onclick = () => {
      if (b.classList.contains('done')) return;
      [...L.children].forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel'); sel = { p, b }; fx.tick();
    };
    L.appendChild(b);
  });
  right.forEach((p) => {
    const b = h('button.mitem', p.e + ' ' + p.right);
    b.onclick = async () => {
      if (!sel || b.classList.contains('done')) return;
      if (sel.p === p) {
        sel.b.classList.add('done'); b.classList.add('done'); sel.b.classList.remove('sel'); fx.ding();
        matched++;
        const country = p.left.replace(/^\S+\s/, '');
        const sentence = u.game.pattern.replace('{left}', country).replace('{right}', p.right);
        out.prepend(h('div.sent-row', h('div.sent-text', speakBtn(sentence), h('span', sentence)), micButton({ target: sentence, compact: true, label: '读一读' })));
        sel = null;
        await speak(sentence);
        if (matched === pairs.length) {
          out.prepend(h('div.center', h('button.btn.big', { onclick: () => onWin(mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1) }, '派对完成！🎉')));
        }
      } else {
        mistakes++; fx.buzz();
        b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500);
      }
    };
    R.appendChild(b);
  });
}

/** Unit 5：水乡侦探 —— Is there ...? Are there any ...? */
export function explore(area, u, { onWin }) {
  const { places, towns } = u.game;
  let round = 0, totalAsks = 0;
  const next = async () => {
    if (round >= 2) { onWin(totalAsks <= 5 ? 3 : totalAsks <= 8 ? 2 : 1); return; }
    const secret = pick(towns);
    let asks = 0;
    area.innerHTML = '';
    hud(area, `🔍 第 ${round + 1}/2 个案子：Robo 住在哪个小镇？`);
    const townRow = h('div.town-row', towns.map((t) => h('button.town', { dataset: { name: t.name } },
      h('b', t.name), h('div.town-places', t.has.join(' ')))));
    const chat = h('div.chat.small');
    const qs = h('div.ask-grid');
    area.append(townRow, h('p.center.muted', '点一个问题问 Robo（也可以对着话筒问），排除不可能的小镇，然后点你猜的小镇！'), qs, chat);
    const question = (p) => (p.kind === 'many' ? `Are there any ${p.many}?` : `Is there ${p.one}?`);
    const answer = (p) => {
      const has = secret.has.includes(p.e);
      if (p.kind === 'many') return has ? `Yes, there are. There are many ${p.many}.` : "No, there aren't.";
      return has ? 'Yes, there is.' : "No, there isn't.";
    };
    const ask = async (p) => {
      asks++; totalAsks++;
      const q = question(p);
      chat.prepend(h('div.msg.kid', h('div.bub', q)));
      await speak(q, { pitch: 1 });
      const a = answer(p);
      chat.prepend(h('div.msg.bot', h('span.avatar', '🤖'), h('div.bub', a)));
      await speak(a, { pitch: 1.25 });
      const has = secret.has.includes(p.e);
      [...townRow.children].forEach((tb) => {
        const t = towns.find((x) => x.name === tb.dataset.name);
        if (t.has.includes(p.e) !== has) tb.classList.add('out');
      });
    };
    places.forEach((p) => qs.appendChild(h('button.ask', { onclick: () => ask(p) }, p.e + ' ' + question(p))));
    qs.appendChild(micButton({
      compact: true, autoScore: false, label: '对着话筒问 Robo',
      grammar: places.map(question),
      onResult: (r) => {
        if (r.fallback) return;
        const p = places.find((pl) => matchExpect(r.heard, [pl.one.split(' ').pop(), pl.many]).ok);
        if (p && /\b(is|are)\b/i.test(r.heard)) ask(p);
        else chat.prepend(h('p.hint', '用 Is there ... ? 或 Are there any ... ? 来问哦'));
      },
    }));
    [...townRow.children].forEach((tb) => {
      tb.onclick = async () => {
        if (tb.dataset.name === secret.name) {
          tb.classList.add('right'); fx.ding();
          await speak(`Yes! I live in ${secret.name}. You are a great detective!`);
          area.appendChild(h('div.center', h('button.btn.big', { onclick: () => { round++; next(); } }, round === 0 ? '下一个案子 ›' : '结案！🎉')));
        } else {
          tb.classList.add('out'); fx.buzz();
          speak(`No, I don't live in ${tb.dataset.name}.`);
        }
      };
    });
    speak("Hi detective! I live in one of these towns. Ask me questions!");
  };
  next();
}

/** Unit 7：早餐日历侦探 —— How often ...? */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FREQ = { 1: 'once a week', 2: 'twice a week', 3: 'three times a week', 4: 'four times a week', 5: 'five times a week', 6: 'six times a week', 7: 'every day' };
export function calendar(area, u, { onWin }) {
  const { people, foods } = u.game;
  const rounds = 6;
  let r = 0, right = 0;
  const next = async () => {
    if (r >= rounds) { final(); return; }
    const person = pick(people), food = pick(foods);
    const n = pick([1, 2, 3, 5, 7]);
    const days = new Set(sample([0, 1, 2, 3, 4, 5, 6], n));
    area.innerHTML = '';
    hud(area, `📅 第 ${r + 1}/${rounds} 题　答对 ${right}`);
    area.appendChild(h('div.week', DAYS.map((d, i) => h('div.day', h('small', d), h('span', days.has(i) ? food.e : '')))));
    const has = 'has';
    const q = `How often does ${person} have ${food.en}?`;
    area.appendChild(h('p.center.q', speakBtn(q), ' ', q));
    speak(q);
    const correct = FREQ[n].replace(/^./, (c) => c.toUpperCase()) + '.';
    const wrongs = shuffle(Object.values(FREQ).filter((f) => f !== FREQ[n])).slice(0, 2).map((f) => f.replace(/^./, (c) => c.toUpperCase()) + '.');
    const g = choiceGroup(shuffle([correct, ...wrongs]), correct, { big: true });
    area.appendChild(g);
    const ok = await g.result;
    if (ok) right++;
    const full = `${person} ${has} ${food.en} ${FREQ[n]}.`;
    area.appendChild(h('div.model', speakBtn(full), h('b', full)));
    await speak(full);
    area.appendChild(h('div.center', h('button.btn', { onclick: () => { r++; next(); } }, '下一题 ›')));
  };
  const final = () => {
    area.innerHTML = '';
    hud(area, '🎤 最后一题：说说你自己！');
    const q = 'How often do you drink milk?';
    area.append(h('p.center.q', speakBtn(q), ' ', q), h('p.center.muted', '例如：Every day. / Five times a week. / Twice a week.'));
    speak(q);
    area.append(micButton({
      autoScore: false, label: '说出你的答案', grammar: Object.values(FREQ),
      onResult: (res) => {
        const ok = res.fallback || matchExpect(res.heard, ['every day', 'once', 'twice', 'times', 'never']).ok;
        if (ok) { fx.ding(); onWin(right >= 5 ? 3 : right >= 4 ? 2 : 1); }
        else { fx.buzz(); area.appendChild(h('p.hint', '试试这样说：Every day. 或者 Three times a week.')); }
      },
    }), h('div.center', h('button.btn.ghost', { onclick: () => onWin(right >= 5 ? 3 : right >= 4 ? 2 : 1) }, '跳过')));
  };
  next();
}
