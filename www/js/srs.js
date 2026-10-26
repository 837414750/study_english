// 记忆曲线复习（Leitner 卡片盒 + 艾宾浩斯间隔）
// 盒子 1→6 对应复习间隔 1、2、4、7、15、30 天；答错回到 1 号盒，当天再练。
// 卡片类型：w=单词  s=句子  g=语法错题
import { S, save, getUnits, unitById, STAGES, stageDone, quizPassed, recitePassed, isUnlocked, prog, passLine } from './store.js';
import { today, addDays } from './util.js';

export const INTERVALS = [0, 1, 2, 4, 7, 15, 30];
export const MAX_BOX = 6;

export const cardKey = (type, uid, id) => `${type}|${uid}|${id}`;
export function parseKey(key) {
  const [type, uid, ...rest] = key.split('|');
  return { type, uid, id: rest.join('|') };
}

/** 第一次学会某张卡：放进 1 号盒，明天复习 */
export function introduce(key) {
  const st = S().srs;
  if (st[key]) return;
  st[key] = { box: 1, due: addDays(today(), 1), seen: 1, lapses: 0, last: today() };
  save();
}

/** 复习一次：对了升盒，错了降回 1 号盒且今天还要再见 */
export function review(key, correct) {
  const st = S().srs;
  const c = st[key] || { box: 0, due: today(), seen: 0, lapses: 0 };
  c.seen += 1;
  c.last = today();
  if (correct) {
    c.box = Math.min(MAX_BOX, c.box + 1);
    c.due = addDays(today(), INTERVALS[c.box]);
  } else {
    c.box = 1;
    c.lapses += 1;
    c.due = today();
  }
  st[key] = c;
  save();
}

export function dueCards(limit = 12) {
  const t = today();
  return Object.entries(S().srs)
    .filter(([key, c]) => c.due <= t && resolveCard(key))
    .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : a[1].box - b[1].box))
    .slice(0, limit)
    .map(([key]) => key);
}
export const dueCount = () => {
  const t = today();
  return Object.entries(S().srs).filter(([k, c]) => c.due <= t && resolveCard(k)).length;
};

/** 把卡片 key 还原成可展示的内容 */
export function resolveCard(key) {
  const { type, uid, id } = parseKey(key);
  const u = unitById(uid);
  if (!u) return null;
  if (type === 'w') {
    const w = u.words.find((x) => x.en === id);
    return w ? { type, uid, unit: u, word: w } : null;
  }
  if (type === 's') return { type, uid, unit: u, text: id };
  if (type === 'g') {
    const q = u.quiz.grammar.find((x) => x.q === id);
    return q ? { type, uid, unit: u, q } : null;
  }
  return null;
}

/** 单元掌握度 0~1：单词卡片平均盒号 / 4（盒 4 以上即视为牢固） */
export function mastery(uid) {
  const u = unitById(uid);
  if (!u) return 0;
  const st = S().srs;
  let sum = 0;
  for (const w of u.words) {
    const c = st[cardKey('w', uid, w.en)];
    sum += c ? Math.min(c.box, 4) / 4 : 0;
  }
  return u.words.length ? sum / u.words.length : 0;
}

/** 薄弱项：答错 ≥2 次，或者还在 1 号盒且见过多次 */
export function weakItems(limit = 30) {
  return Object.entries(S().srs)
    .filter(([, c]) => c.lapses >= 2 || (c.box <= 1 && c.seen >= 3))
    .sort((a, b) => b[1].lapses - a[1].lapses)
    .slice(0, limit)
    .map(([key, c]) => ({ key, ...c, card: resolveCard(key) }))
    .filter((x) => x.card);
}

/**
 * 今日学习计划 —— 按"先复习、再新学、最后巩固"的顺序，控制在每日时长内。
 * 返回 [{ icon, title, sub, href }]
 */
export function dailyPlan() {
  const plan = [];
  const due = dueCount();
  if (due > 0) {
    plan.push({ icon: '🔁', title: `复习 ${Math.min(due, 12)} 张记忆卡`, sub: `记忆曲线提醒：这些快忘啦（约 ${Math.ceil(Math.min(due, 12) / 3)} 分钟）`, href: '#/review', kind: 'review' });
  }
  const units = getUnits();
  const open = (u) => isUnlocked(u.id) && !(quizPassed(u.id) && recitePassed(u.id));
  // 优先跟上学校进度（家长设置的"学校已学到"单元），之前没过关的单元作为补充
  const from = S().settings.unlockedUpTo || 0;
  const cur = units.slice(from).find(open) || units.find(open);
  const earlier = units.slice(0, from).filter(open);
  if (cur) {
    const p = prog(cur.id);
    const lastQuiz = p.quiz.history[p.quiz.history.length - 1];
    const nextStage = STAGES.find((s) => !stageDone(cur.id, s.id));
    if (lastQuiz && lastQuiz.score < 70) {
      // 测验分数偏低：先回到单词和语法游戏打基础，再挑战
      plan.push({ icon: '🛠️', title: `${cur.title}：先补补基础`, sub: '上次测验没到 70 分，先玩一遍单词岛和语法游戏', href: `#/unit/${cur.id}/words`, kind: 'fix' });
    }
    if (nextStage) {
      plan.push({ icon: nextStage.icon, title: `${cur.title} · ${nextStage.name}`, sub: nextStage.desc, href: `#/unit/${cur.id}/${nextStage.id}`, kind: 'learn' });
      const after = STAGES[STAGES.indexOf(nextStage) + 1];
      if (after && !stageDone(cur.id, after.id)) {
        plan.push({ icon: after.icon, title: `${cur.title} · ${after.name}`, sub: after.desc, href: `#/unit/${cur.id}/${after.id}`, kind: 'learn' });
      }
    } else if (!quizPassed(cur.id)) {
      plan.push({ icon: '📝', title: `${cur.title} · 单元测验`, sub: `满分 100，${passLine()} 分过关`, href: `#/unit/${cur.id}/quiz`, kind: 'quiz' });
    } else {
      plan.push({ icon: '🎤', title: `${cur.title} · 背诵挑战`, sub: `满分 100，${passLine()} 分过关`, href: `#/unit/${cur.id}/recite`, kind: 'recite' });
    }
    if (earlier.length && plan.length < 4) {
      const e = earlier[0];
      plan.push({ icon: '🧭', title: `回顾：${e.title}`, sub: '之前的岛屿还没点亮，有空去挑战测验和背诵', href: `#/unit/${e.id}`, kind: 'review' });
    }
  } else {
    plan.push({ icon: '🏆', title: '全部岛屿都点亮啦！', sub: '去复习本巩固，或者挑战 100 分', href: '#/review', kind: 'done' });
  }
  return plan;
}
