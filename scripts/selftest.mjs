// 内容与核心算法自检：node scripts/selftest.mjs
import { BUILTIN_UNITS } from '../www/js/content/index.js';
import { scoreReading, normalize, matchExpect } from '../www/js/scoring.js';
import { timePhrase } from '../www/js/clockface.js';

let errors = 0;
const fail = (msg) => { errors++; console.error('✘', msg); };
const GAME_TYPES = ['speed', 'treasure', 'guess', 'live', 'match', 'explore', 'exclaim', 'calendar', 'judge', 'clock', 'weather'];

for (const u of BUILTIN_UNITS) {
  const at = (k) => `${u.id}.${k}`;
  for (const k of ['id', 'title', 'cn', 'icon', 'color', 'words', 'grammar', 'chant', 'dialogue', 'game', 'sound', 'story', 'project', 'quiz', 'recite']) if (!u[k]) fail(`缺少 ${at(k)}`);
  if (u.words.length < 6) fail(`${at('words')} 少于 6 个`);
  const ens = u.words.map((w) => w.en); if (new Set(ens).size !== ens.length) fail(`${at('words')} 有重复`);
  const es = u.words.map((w) => w.e); if (new Set(es).size !== es.length) fail(`${at('words')} 图标重复：${es}`);
  u.words.forEach((w) => { if (!w.en || !w.cn || !w.e) fail(`${at('words')} 字段不全 ${JSON.stringify(w)}`); });
  if (!GAME_TYPES.includes(u.game.type)) fail(`${at('game.type')} 未知：${u.game.type}`);
  u.dialogue.turns.forEach((t, i) => { if (!t.bot || !t.kid?.length || !t.expect?.length) fail(`${at('dialogue')}[${i}] 不完整`);
    t.kid.forEach((k) => { if (!matchExpect(k, t.expect, t.kid).ok) fail(`${at('dialogue')}[${i}] 示范句不能通过自己的关键词：${k}`); }); });
  if (u.quiz.grammar.length < 4) fail(`${at('quiz.grammar')} 少于 4 题`);
  u.quiz.grammar.forEach((q) => { if (q.options.length < 2 || new Set(q.options).size !== q.options.length) fail(`${at('quiz')} 选项问题：${q.q}`); if (!q.q.includes('____')) fail(`${at('quiz')} 缺少空格：${q.q}`); });
  if (u.quiz.order.length < 2) fail(`${at('quiz.order')} 少于 2 句`);
  if (u.quiz.speak.length !== 2) fail(`${at('quiz.speak')} 应为 2 题`);
  if (u.quiz.reading.questions.length !== 2) fail(`${at('quiz.reading')} 应为 2 题`);
  [...u.story.questions, ...u.quiz.reading.questions].forEach((q) => { if (new Set(q.options).size !== q.options.length) fail(`${at('story/reading')} 选项重复：${q.q}`); });
  if (u.story.pages.length < 5) fail(`${at('story')} 页数太少`);
  const ph = new Set(); u.project.lines.forEach((l) => l.replace(/\{(\w+)\}/g, (_, k) => ph.add(k)));
  ph.forEach((k) => { if (!u.project.slots[k]) fail(`${at('project')} 缺少 slot ${k}`); });
  Object.keys(u.project.slots).forEach((k) => { if (!ph.has(k)) fail(`${at('project')} slot ${k} 未使用`); });
  const rw = normalize(u.recite.text.join(' ')).length;
  if (rw < 25 || rw > 90) fail(`${at('recite')} 词数 ${rw} 不在 25~90`);
  const perfect = scoreReading(u.recite.text, { text: normalize(u.recite.text.join(' ')).join(' '), duration: rw / 1.8 });
  if (perfect.total < 95) fail(`${at('recite')} 完美朗读只得 ${perfect.total}`);
  if (u.sound.type !== 'stress' && !u.sound.mark?.length) fail(`${at('sound.mark')} 缺失`);
  if (u.game.type === 'live') u.game.scenes.forEach((s) => s.distract.forEach((d) => { if (s.words.includes(d)) fail(`${at('game')} 干扰项与答案相同 ${d}`); }));
}

const tp = [[7, 0, "seven o'clock"], [11, 30, 'half past eleven'], [3, 50, 'ten to four'], [3, 15, 'a quarter past three'], [8, 45, 'a quarter to nine'], [12, 55, 'five to one']];
tp.forEach(([hh, mm, want]) => { const got = timePhrase(hh, mm); if (got !== want) fail(`timePhrase(${hh},${mm}) = ${got}，应为 ${want}`); });

const t = ['Welcome to my school!', 'It is big and beautiful.'];
const half = scoreReading(t, { text: 'welcome to my school', duration: 3 });
if (half.total > 55) fail(`只读一半却得到 ${half.total} 分`);

const words = BUILTIN_UNITS.reduce((a, u) => a + u.words.length, 0);
console.log(errors ? `\n共 ${errors} 个问题` : `✔ 自检通过：${BUILTIN_UNITS.length} 个单元，${words} 个单词`);
process.exit(errors ? 1 : 0);
