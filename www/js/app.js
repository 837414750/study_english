// 入口：路由、学习时长、宠物升级提示
import { h } from './util.js';
import { S, onLevelUp, PET_LEVELS, tickDaily, usedMinToday, save } from './store.js';
import { initASR, stopSpeak, speak } from './speech.js';
import { modal, petFace } from './ui.js';
import { fx } from './audiofx.js';

const routes = [
  [/^#?\/?$/, () => import('./screens/home.js')],
  [/^#\/onboard$/, () => import('./screens/onboard.js')],
  [/^#\/unit\/([\w]+)$/, () => import('./screens/unit.js')],
  [/^#\/unit\/([\w]+)\/words$/, () => import('./screens/words.js')],
  [/^#\/unit\/([\w]+)\/chant$/, () => import('./screens/chant.js')],
  [/^#\/unit\/([\w]+)\/dialogue$/, () => import('./screens/dialogue.js')],
  [/^#\/unit\/([\w]+)\/game$/, () => import('./screens/game.js')],
  [/^#\/unit\/([\w]+)\/sound$/, () => import('./screens/sound.js')],
  [/^#\/unit\/([\w]+)\/story$/, () => import('./screens/story.js')],
  [/^#\/unit\/([\w]+)\/project$/, () => import('./screens/project.js')],
  [/^#\/unit\/([\w]+)\/quiz$/, () => import('./screens/quiz.js')],
  [/^#\/unit\/([\w]+)\/recite$/, () => import('./screens/recite.js')],
  [/^#\/review$/, () => import('./screens/review.js')],
  [/^#\/pet$/, () => import('./screens/pet.js')],
  [/^#\/collection$/, () => import('./screens/collection.js')],
  [/^#\/works$/, () => import('./screens/works.js')],
  [/^#\/parent$/, () => import('./screens/parent.js')],
];

const app = document.getElementById('app');
let cleanup = null;
let navSeq = 0;

async function route() {
  const seq = ++navSeq;
  const hash = location.hash || '#/';
  if (!S().profile.onboarded && hash !== '#/onboard') { location.hash = '#/onboard'; return; }
  await stopSpeak();
  document.querySelectorAll('.modal-bg').forEach((m) => m.remove());
  document.documentElement.style.setProperty('--accent', '#2F6B4F');
  if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { console.warn(e); } }
  cleanup = null;
  for (const [re, loader] of routes) {
    const m = re.exec(hash);
    if (!m) continue;
    try {
      const mod = await loader();
      if (seq !== navSeq) return;
      app.innerHTML = '';
      const screen = h('main.screen');
      app.appendChild(screen);
      window.scrollTo(0, 0);
      cleanup = await mod.render(screen, m.slice(1));
    } catch (e) {
      console.error(e);
      app.innerHTML = '';
      app.appendChild(h('div.boot', '😵', h('p', '页面出错了：' + (e?.message || e)), h('a.btn', { href: '#/' }, '回到地图')));
    }
    return;
  }
  location.hash = '#/';
}
window.addEventListener('hashchange', route);

// 宠物升级
onLevelUp((lv) => {
  fx.levelup();
  const l = PET_LEVELS[lv];
  modal(h('div.levelup', petFace(lv, 'xl'), h('h2', `${S().profile.petName} 升级啦！`), h('p', `现在是「${l.name}」${l.acc ? '，获得新装备 ' + l.acc : ''}`)), { cls: 'cel' });
  speak('Level up! Great job!');
});

// 学习时长：每 10 秒记一次；超过每日建议时长，松鼠会提醒休息
let restShown = false;
setInterval(() => {
  if (document.visibilityState !== 'visible') return;
  tickDaily(10);
  const limit = S().settings.dailyMin;
  if (!restShown && limit && usedMinToday() >= limit) {
    restShown = true;
    modal(h('div.rest', petFace(undefined, 'xl'), h('h2', '😴 ' + S().profile.petName + ' 有点困了'),
      h('p', `今天已经学了 ${usedMinToday()} 分钟，真了不起！`),
      h('p', '让眼睛休息一下，看看远处吧～ 明天再来闯关！'),
      h('a.btn', { href: '#/', onclick: () => document.querySelector('.modal-bg')?.remove() }, '好的，休息一下')), { cls: 'cel' });
  }
}, 10000);

// 平板上防止误触返回导致退出：安卓返回键回到上一页
document.addEventListener('backbutton', () => history.back());
if (window.Capacitor?.Plugins?.App) {
  window.Capacitor.Plugins.App.addListener('backButton', () => {
    if (location.hash && location.hash !== '#/') history.back();
  });
}

window.addEventListener('beforeunload', () => save(true));
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(true); });

route();
setTimeout(() => initASR(), 1200);
