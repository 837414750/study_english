// 作品墙：大任务作品 + 录音回放
import { h, fmtDate } from '../util.js';
import { S, getAudio, unitById } from '../store.js';
import { topbar, speakBtn } from '../ui.js';
import { playBlob } from '../speech.js';

export function render(root) {
  root.appendChild(topbar('🖼️ 作品墙', { back: '#/', sub: '我完成的大任务' }));
  const body = h('div.stage-body');
  root.appendChild(body);
  const works = S().works;
  if (!works.length) { body.appendChild(h('p.center.muted', '还没有作品～ 完成每个单元的"大任务"，作品就会贴在这里！')); return; }
  body.appendChild(h('div.works', works.map((w) => {
    const u = unitById(w.uid);
    const play = w.audioKey ? h('button.btn.small', { onclick: async () => { const b = await getAudio(w.audioKey); if (b) playBlob(b); else play.textContent = '录音已过期'; } }, '▶ 我的录音') : null;
    return h('article.work', { style: { '--c': u?.color || '#E8913A' } },
      h('header', h('span', u?.icon || '⭐'), h('b', w.title), h('small', fmtDate(w.at))),
      h('div.work-text', String(w.text).split('\n').map((l) => h('p', l))),
      h('footer', speakBtn(String(w.text).replace(/\n/g, ' '), { label: '听标准读音' }), play, w.score != null ? h('span.muted', `得分 ${w.score}`) : null));
  })));
}
