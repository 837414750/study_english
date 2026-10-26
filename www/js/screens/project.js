// 大任务：选词填空拼出自己的作品 → 大声朗读并录音 → 保存到作品墙
import { h, pick } from '../util.js';
import { unitById, markStage, addWork, saveRecording, addXP } from '../store.js';
import { topbar, speakBtn, micButton, celebrate, petSay } from '../ui.js';
import { speak } from '../speech.js';

export function fillLines(lines, values) {
  return lines.map((l) => l.replace(/\{(\w+)\}/g, (_, k) => values[k] || '____'));
}

export function render(root, [uid]) {
  const u = unitById(uid);
  const pj = u.project;
  root.appendChild(topbar('🏆 大任务', { back: `#/unit/${uid}`, sub: `${pj.title} · ${pj.cn}`, color: u.color }));
  const body = h('div.stage-body');
  root.appendChild(body);
  const order = [];
  pj.lines.forEach((l) => l.replace(/\{(\w+)\}/g, (_, k) => { if (!order.includes(k)) order.push(k); return ''; }));
  const values = {};
  order.forEach((k) => { const opt = pj.slots[k]; values[k] = Array.isArray(opt) ? '' : ''; });

  const preview = h('div.work-preview');
  const refresh = () => {
    preview.innerHTML = '';
    fillLines(pj.lines, values).forEach((l) => preview.appendChild(h('p', l)));
    readBox.classList.toggle('hide', order.some((k) => !values[k]));
  };

  const pickers = h('div.slot-pickers');
  order.forEach((k, idx) => {
    const opt = pj.slots[k];
    const row = h('div.slot-row', h('span.slot-no', String(idx + 1)));
    if (typeof opt === 'string' && opt.startsWith('#input')) {
      row.appendChild(h('input.inp', { placeholder: opt.split(':')[1] || '写一写', oninput: (e) => { values[k] = e.target.value.trim(); refresh(); } }));
    } else {
      const chips = h('div.chips');
      opt.forEach((o) => {
        const c = h('button.chip', o);
        c.onclick = () => { values[k] = o; [...chips.children].forEach((x) => x.classList.toggle('on', x === c)); refresh(); speak(o); };
        chips.appendChild(c);
      });
      row.appendChild(chips);
    }
    pickers.appendChild(row);
  });

  const readBox = h('section.card.hide',
    h('h3', '🎤 大声朗读你的作品'),
    h('div.row', speakBtn(() => fillLines(pj.lines, values).join(' '), { label: '先听一遍' }),
      h('button.btn.ghost.small', { onclick: () => { order.forEach((k) => { const o = pj.slots[k]; if (Array.isArray(o)) values[k] = pick(o); }); syncChips(); refresh(); } }, '🎲 随机来一份')),
  );
  const syncChips = () => {
    [...pickers.children].forEach((row, i) => {
      const k = order[i];
      row.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.textContent === values[k]));
    });
  };
  readBox.appendChild(micButton({
    get target() { return fillLines(pj.lines, values).join(' '); },
    maxMs: 45000, silenceMs: 2500, label: '点话筒，开始朗读（读完停一下）',
    onResult: async (res) => {
      const text = fillLines(pj.lines, values).join('\n');
      const key = res.blob ? await saveRecording({ uid, kind: 'project', text, score: res.score }, res.blob) : null;
      addWork({ uid, title: pj.title, text, audioKey: key, score: res.score });
      markStage(uid, 'project');
      addXP(10);
      celebrate({
        score: res.score ?? null, pass: true, title: '作品完成！已贴到作品墙 🖼️',
        lines: ['可以去作品墙听听自己的声音，也可以给爸爸妈妈听！'],
        buttons: [h('a.btn', { href: `#/unit/${uid}/quiz` }, '去挑战单元测验 📝'), h('a.btn.ghost', { href: '#/works' }, '看作品墙')],
      });
    },
  }));

  // 选择题下拉也允许"随机"快速出一份，方便孩子先感受
  body.append(petSay('选一选，拼出属于你自己的英语作品！'), pickers, h('h3', '👀 我的作品预览'), preview, readBox);
  refresh();
}
