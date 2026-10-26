// 单元岛屿：7 个关卡 + 测验 + 背诵
import { h } from '../util.js';
import { unitById, STAGES, stageDone, prog, passLine, quizPassed, recitePassed, isUnlocked, unitPassed } from '../store.js';
import { topbar, speakBtn, petSay } from '../ui.js';
import { mastery } from '../srs.js';

/** 从"英文 + 中文"混排的规则里取出英文部分来朗读 */
export function englishPart(s) {
  return s.split(/[一-龥（]/)[0].replace(/[=/]/g, ',').trim();
}

export function render(root, [uid]) {
  const u = unitById(uid);
  if (!u || !isUnlocked(uid)) { location.hash = '#/'; return; }
  const p = prog(uid);
  root.style.setProperty('--accent', u.color);
  root.appendChild(topbar(`${u.icon} ${u.no ? 'Unit ' + u.no : 'Starter'}  ${u.title}`, { back: '#/', sub: `${u.cn} · ${u.island}`, color: u.color }));

  const next = STAGES.find((s) => !stageDone(uid, s.id));
  const tip = unitPassed(uid)
    ? '这座岛已经点亮啦！🌟 可以随时回来复习，挑战 100 分。'
    : next ? `建议从「${next.name}」开始，一关一关闯！` : '7 个关卡都完成了！去挑战单元测验和背诵吧！';
  root.appendChild(petSay(tip));

  root.appendChild(h('section.grammar-card',
    h('h3', '📌 本课语法：', u.grammar.title),
    u.grammar.points.map((pt) => h('div.gp',
      h('div.gp-rule', speakBtn(englishPart(pt.rule)), h('span', pt.rule)),
      h('div.gp-tip', '💡 ', pt.tip))),
  ));

  const grid = h('section.stage-grid');
  STAGES.forEach((s, i) => {
    const done = stageDone(uid, s.id);
    grid.appendChild(h('a.stage-card' + (done ? '.done' : '') + (next === s ? '.next' : ''), { href: `#/unit/${uid}/${s.id}` },
      h('span.sc-num', String(i + 1)),
      h('span.sc-ico', s.icon),
      h('b', s.name),
      h('small', s.id === 'game' ? u.game.title : s.desc),
      done ? h('span.sc-check', '✔') : null));
  });
  root.appendChild(grid);

  const pl = passLine();
  root.appendChild(h('section.boss-row',
    h('a.boss-card' + (quizPassed(uid) ? '.done' : ''), { href: `#/unit/${uid}/quiz` },
      h('span.sc-ico', '📝'), h('b', '单元测验'),
      h('small', `听力·词汇·语法·口语·阅读　${pl} 分过关`),
      h('div.best', p.quiz.best ? `最高 ${p.quiz.best} 分` : '还没挑战'), quizPassed(uid) ? h('span.sc-check', '✔') : null),
    h('a.boss-card' + (recitePassed(uid) ? '.done' : ''), { href: `#/unit/${uid}/recite` },
      h('span.sc-ico', '🎤'), h('b', '背诵挑战'),
      h('small', `《${u.recite.title}》　${pl} 分过关`),
      h('div.best', p.recite.best ? `最高 ${p.recite.best} 分` : (p.recite.override ? '家长已判定通过' : '还没挑战')), recitePassed(uid) ? h('span.sc-check', '✔') : null),
  ));
  const m = Math.round(mastery(uid) * 100);
  root.appendChild(h('p.muted.center', `单词掌握度 ${m}%（会随着复习本里的记忆曲线慢慢变高）`));
}
