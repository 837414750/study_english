// 语法游戏关：按单元配置加载对应的小游戏
import { h } from '../util.js';
import { unitById, markStage, addXP } from '../store.js';
import { topbar, celebrate, petSay } from '../ui.js';
import * as basic from '../games/basic.js';
import * as thinking from '../games/thinking.js';
import * as timeWeather from '../games/time-weather.js';

const GAMES = { ...basic, ...thinking, ...timeWeather };

export function render(root, [uid]) {
  const u = unitById(uid);
  const g = u.game;
  root.appendChild(topbar('🎮 ' + g.title, { back: `#/unit/${uid}`, sub: u.grammar.title, color: u.color }));
  const body = h('div.stage-body.game');
  root.appendChild(body);
  const play = GAMES[g.type];
  if (!play) { body.appendChild(h('p', '游戏未找到：' + g.type)); return; }
  const intro = h('div.game-intro', petSay(g.cn), h('button.btn.big', '开始游戏 ▶'));
  body.appendChild(intro);
  let stop = null;
  intro.querySelector('button').onclick = () => {
    intro.remove();
    const area = h('div.game-area');
    body.appendChild(area);
    stop = play(area, u, {
      onWin: (stars) => {
        markStage(uid, 'game');
        addXP(stars * 4);
        celebrate({
          score: null, pass: true, title: '游戏通关！',
          lines: ['获得 ' + '⭐'.repeat(stars)],
          buttons: [h('a.btn', { href: `#/unit/${uid}/sound` }, '下一关：语音站 ›'),
            h('button.btn.ghost', { onclick: () => { document.querySelector('.modal-bg')?.remove(); render(root.replaceChildren() || root, [uid]); } }, '再玩一次')],
        });
      },
    });
  };
  return () => { if (typeof stop === 'function') stop(); };
}
