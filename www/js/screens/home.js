// 地图首页：今日计划 + 11 座岛屿
import { h } from '../util.js';
import { S, getUnits, isUnlocked, unitPassed, quizPassed, recitePassed, unitStagesDone, STAGES, usedMinToday, petLevel, PET_LEVELS, prog } from '../store.js';
import { dailyPlan, dueCount, mastery } from '../srs.js';
import { petFace } from '../ui.js';
import { speak } from '../speech.js';

const GREETINGS = ['Good to see you!', "Let's learn and play!", 'You are a star!', 'Ready for an adventure?', 'I missed you!'];

export function render(root) {
  const st = S();
  const lv = petLevel();
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const pet = petFace(lv, 'md');
  pet.onclick = () => speak(`${hello}, ${st.profile.name}! ${GREETINGS[Math.floor(Math.random() * GREETINGS.length)]}`);

  root.appendChild(h('header.home-head',
    h('a.pet-link', { href: '#/pet' }, pet),
    h('div.hh-text',
      h('h1', `${hello}, ${st.profile.name}!`),
      h('p', `${st.profile.petName} · ${PET_LEVELS[lv].name}　点我说话 👆`)),
    h('div.hh-stats',
      h('span.stat', { title: '松果' }, '🌰 ', st.pet.acorns),
      h('span.stat', { title: '贴纸' }, '⭐ ', st.stickers.length),
      h('span.stat', { title: '今日学习' }, '⏱ ', `${usedMinToday()}/${st.settings.dailyMin}分`)),
  ));

  // 今日计划
  const plan = dailyPlan();
  root.appendChild(h('section.plan',
    h('h2', '📅 今天的冒险任务'),
    h('div.plan-list', plan.map((p, i) => h('a.plan-item.' + p.kind, { href: p.href },
      h('span.pi-num', String(i + 1)), h('span.pi-ico', p.icon),
      h('div', h('b', p.title), h('small', p.sub)), h('span.go', '出发 ›')))),
  ));

  // 地图
  const units = getUnits();
  const map = h('section.map');
  units.forEach((u, i) => {
    const unlocked = isUnlocked(u.id);
    const passed = unitPassed(u.id);
    const done = unitStagesDone(u.id);
    const m = mastery(u.id);
    const p = prog(u.id);
    const island = h('a.island' + (unlocked ? '' : '.locked') + (passed ? '.lit' : ''), {
      href: unlocked ? `#/unit/${u.id}` : null,
      style: { '--c': u.color, '--d': `${i * 40}ms` },
      onclick: unlocked ? null : () => speak('This island is locked. Pass the last island first!'),
    },
    h('div.is-icon', unlocked ? u.icon : '🔒'),
    h('div.is-no', u.no ? `Unit ${u.no}` : 'Starter'),
    h('div.is-title', u.title),
    h('div.is-cn', u.island),
    unlocked ? h('div.is-prog',
      h('span.dots', STAGES.map((s) => h('i' + (p.stages[s.id] ? '.on' : '')))),
      h('span.badges', quizPassed(u.id) ? '📝' : '', recitePassed(u.id) ? '🎤' : '')) : null,
    unlocked && done ? h('div.is-master', { title: '单词掌握度' }, h('i', { style: { width: Math.round(m * 100) + '%' } })) : null,
    passed ? h('div.is-star', '🌟') : null,
    );
    map.appendChild(island);
  });
  root.appendChild(h('h2.map-title', '🗺️ 冒险地图'));
  root.appendChild(map);

  const due = dueCount();
  root.appendChild(h('nav.bottom-nav',
    h('a', { href: '#/review' }, '🔁', h('span', '复习本'), due ? h('em.badge', String(due)) : null),
    h('a', { href: '#/pet' }, '🐿️', h('span', '我的松鼠')),
    h('a', { href: '#/collection' }, '🃏', h('span', '收集册')),
    h('a', { href: '#/works' }, '🖼️', h('span', '作品墙')),
    h('a', { href: '#/parent' }, '👨‍👩‍👧', h('span', '家长')),
  ));
}
