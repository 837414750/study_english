// 收集册：单词卡（按记忆盒点亮）+ 贴纸
import { h } from '../util.js';
import { S, getUnits } from '../store.js';
import { topbar } from '../ui.js';
import { speak } from '../speech.js';
import { cardKey } from '../srs.js';

export function stickerInfo(id) {
  const [kind, uid] = id.split('-');
  const u = getUnits().find((x) => x.id === uid);
  const name = u ? (u.no ? `Unit ${u.no}` : 'Starter') : uid;
  if (kind === 'quiz') return { icon: '📝', text: `${name} 测验过关` };
  if (kind === 'quiz100') return { icon: '💯', text: `${name} 测验满分` };
  if (kind === 'recite') return { icon: '🎤', text: `${name} 背诵过关` };
  return { icon: '⭐', text: id };
}

export function render(root) {
  root.appendChild(topbar('🃏 收集册', { back: '#/', sub: '学过的单词会变成卡片，复习越多越闪亮' }));
  const body = h('div.stage-body');
  root.appendChild(body);
  const srs = S().srs;
  const st = S().stickers;
  body.appendChild(h('h3', `⭐ 我的贴纸（${st.length}）`));
  body.appendChild(st.length ? h('div.sticker-wall', st.map((id) => { const s = stickerInfo(id); return h('div.sticker', h('span', s.icon), h('small', s.text)); }))
    : h('p.muted', '完成单元测验和背诵就能获得贴纸！'));
  let total = 0, got = 0;
  for (const u of getUnits()) {
    const cards = u.words.map((w) => {
      const c = srs[cardKey('w', u.id, w.en)];
      total++;
      const level = !c ? 'none' : c.box >= 4 ? 'gold' : c.box >= 2 ? 'silver' : 'seen';
      if (c) got++;
      return h('button.wcard.' + level, { onclick: () => c && speak(w.en) }, h('span', c ? w.e : '❔'), h('b', c ? w.en : '???'), c ? h('small', w.cn) : null);
    });
    body.appendChild(h('section.coll-unit', h('h3', `${u.icon} ${u.no ? 'Unit ' + u.no : 'Starter'} ${u.title}`), h('div.wcards', cards)));
  }
  body.prepend(h('p.center', `已收集 ${got}/${total} 张单词卡　🥇金卡 = 记得最牢`));
}
