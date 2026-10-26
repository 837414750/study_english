// 家长中心：学习报告 · 录音与改判 · 内容池（自己往池子里加学习资料）· 设置 · 帮助
import { h, toast, fmtDate, today, addDays } from '../util.js';
import { S, save, getUnits, unitById, prog, STAGES, stageDone, customOf, exportContent, exportAll, importJSON, resetProgress, getAudio, passLine } from '../store.js';
import { topbar, speakBtn, modal } from '../ui.js';
import { ttsStatus, openTtsInstall, asrState, initASR, playBlob, speak } from '../speech.js';
import { mastery, weakItems } from '../srs.js';

let unlocked = false;

export function render(root) {
  root.appendChild(topbar('👨‍👩‍👧 家长中心', { back: '#/' }));
  const body = h('div.stage-body.parent');
  root.appendChild(body);
  if (!unlocked) return gate(body, () => { unlocked = true; root.innerHTML = ''; render(root); });

  const tabs = [
    ['report', '📊 学习报告', report],
    ['rec', '🎙️ 录音与改判', recordings],
    ['pool', '📚 内容池', pool],
    ['settings', '⚙️ 设置', settings],
    ['help', '❓ 帮助', help],
  ];
  let cur = sessionStorage.getItem('parentTab') || 'report';
  const nav = h('div.tabs');
  const panel = h('div.panel');
  const show = (id) => {
    cur = id; sessionStorage.setItem('parentTab', id);
    [...nav.children].forEach((b) => b.classList.toggle('on', b.dataset.id === id));
    panel.innerHTML = '';
    tabs.find((t) => t[0] === id)[2](panel);
  };
  tabs.forEach(([id, name]) => nav.appendChild(h('button.tab', { dataset: { id }, onclick: () => show(id) }, name)));
  body.append(nav, panel);
  show(cur);
}

function gate(body, ok) {
  const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
  const inp = h('input.inp', { type: 'number', inputmode: 'numeric', placeholder: '答案' });
  body.append(h('div.gate', h('h2', '家长验证'), h('p', `请计算：${a} × ${b} + ${a} = ?`), inp,
    h('button.btn', { onclick: () => { if (Number(inp.value) === a * b + a) ok(); else toast('答案不对哦'); } }, '进入')));
}

// ───────── 学习报告 ─────────
function report(p) {
  const st = S();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today(), -i);
    const sec = d === st.daily.date ? st.daily.sec : st.daily.history[d] || 0;
    days.push({ d: d.slice(5), m: Math.round(sec / 60) });
  }
  const maxM = Math.max(st.settings.dailyMin, ...days.map((x) => x.m));
  p.append(h('section.card', h('h3', '⏱ 最近 7 天学习时长（分钟）'),
    h('div.mini-bars', days.map((x) => h('div.mb', h('div.mb-bar', h('i', { style: { height: (x.m / maxM) * 100 + '%' } })), h('b', String(x.m)), h('small', x.d)))),
    h('p.muted', `每日建议 ${st.settings.dailyMin} 分钟　·　宠物等级经验 ${st.pet.xp}　·　贴纸 ${st.stickers.length} 张`)));

  const pl = passLine();
  const rows = getUnits().map((u) => {
    const pr = prog(u.id);
    const sd = STAGES.filter((s) => stageDone(u.id, s.id)).length;
    const qh = pr.quiz.history;
    const last = qh[qh.length - 1];
    return h('tr',
      h('td', `${u.icon} ${u.no ? 'U' + u.no : 'S'} ${u.title}`),
      h('td', `${sd}/7`),
      h('td.' + (pr.quiz.best >= pl ? 'ok' : pr.quiz.best ? 'no' : ''), pr.quiz.best ? `${pr.quiz.best}（${qh.length}次）` : '—'),
      h('td.' + (pr.recite.best >= pl || pr.recite.override ? 'ok' : pr.recite.best ? 'no' : ''), pr.recite.override ? '家长判定✔' : pr.recite.best ? `${pr.recite.best}（${pr.recite.history.filter((x) => x.final).length}次）` : '—'),
      h('td', Math.round(mastery(u.id) * 100) + '%'),
      h('td.small', last ? last.detail || '' : ''));
  });
  p.append(h('section.card', h('h3', '🗺️ 各单元进度'), h('div.table-wrap', h('table',
    h('thead', h('tr', ['单元', '关卡', '测验最高', '背诵最高', '单词掌握', '最近一次测验分项'].map((t) => h('th', t)))), h('tbody', rows))),
  h('p.muted', `过关线 ${pl} 分（在设置里可调）。单词掌握度来自记忆曲线复习：卡片升到 4 号盒以上算牢固掌握。`)));

  const weak = weakItems(20);
  p.append(h('section.card', h('h3', '🧐 薄弱点（答错次数多的内容）'),
    weak.length ? h('div.weak-list', weak.map((w) => {
      const c = w.card;
      const text = c.type === 'w' ? `${c.word.e} ${c.word.en}（${c.word.cn}）` : c.type === 's' ? c.text : c.q.q;
      return h('div.weak', h('span.tag', { w: '单词', s: '句子', g: '语法' }[c.type]), speakBtn(c.type === 'g' ? c.q.q.replace(/_+/, c.q.options[0]) : c.type === 'w' ? c.word.en : c.text, { cls: 'tiny' }), h('span', text), h('small', ` 错 ${w.lapses} 次 · ${c.unit.title}`));
    })) : h('p.muted', '暂时没有明显的薄弱点 👍')));

  const recent = [...st.log].reverse().slice(0, 15);
  p.append(h('section.card', h('h3', '📝 最近学习记录'), h('div.log', recent.map((l) => h('div', h('small', fmtDate(l.at)), ' ', unitById(l.uid)?.title || '', ' · ',
    l.type === 'stage' ? `完成关卡「${STAGES.find((s) => s.id === l.extra)?.name || l.extra}」` : l.type === 'quiz' ? `测验 ${l.score} 分` : `背诵${l.extra === 'final' ? '（正式）' : '（练习）'} ${l.score} 分`)))));
}

// ───────── 录音 ─────────
function recordings(p) {
  const st = S();
  p.append(h('p.muted', '这里保存了最近 80 条录音。离线识别对孩子的声音偶尔会"冤枉"，您可以听一听，觉得背得好就点"判定通过"。'));
  const units = getUnits();
  p.append(h('section.card', h('h3', '✋ 背诵人工判定'), h('div.override-list', units.map((u) => {
    const r = prog(u.id).recite;
    const b = h('button.btn.small' + (r.override ? '.ghost' : ''), r.override ? '取消判定' : '判定通过');
    b.onclick = () => { r.override = !r.override; save(); p.innerHTML = ''; recordings(p); };
    return h('div.ov', h('span', `${u.icon} ${u.title}`), h('small', ` 最高 ${r.best || '—'}`), b);
  }))));
  if (!st.recordings.length) { p.appendChild(h('p.muted', '还没有录音。')); return; }
  p.append(h('section.card', h('h3', '🎧 录音列表'), h('div.rec-list', st.recordings.map((r) => {
    const btn = h('button.btn.small', '▶ 播放');
    btn.onclick = async () => { const b = await getAudio(r.key); if (b) playBlob(b); else toast('录音文件不存在'); };
    return h('div.rec', btn, h('span', `${unitById(r.uid)?.title || r.uid} · ${{ recite: '背诵', project: '作品' }[r.kind] || r.kind}${r.final ? '（正式）' : ''}`),
      h('small', ` ${r.text?.slice(0, 30) || ''}`), h('b', r.score != null ? ` ${r.score}分` : ''), h('small.muted', ' ' + fmtDate(r.at)));
  }))));
}

// ───────── 内容池 ─────────
function pool(p) {
  const units = getUnits();
  let uid = sessionStorage.getItem('poolUnit') || units[1].id;
  const sel = h('select.inp', { onchange: (e) => { uid = e.target.value; sessionStorage.setItem('poolUnit', uid); draw(); } },
    units.map((u) => h('option', { value: u.id, selected: u.id === uid }, `${u.no ? 'Unit ' + u.no : 'Starter'} ${u.title}`)));
  const area = h('div');
  p.append(h('section.card', h('h3', '📚 往学习池里加内容'), h('p.muted', '加进来的内容会自动出现在对应单元：单词进单词岛和测验，句子进单词岛跟读和复习本，课文进背诵挑战，题目进测验题库。'), h('label', '选择单元'), sel), area);

  const draw = () => {
    area.innerHTML = '';
    const c = customOf(uid);
    const refresh = () => { save(); draw(); };
    // 单词
    const wEn = h('input.inp', { placeholder: '英文，如 playground' }), wCn = h('input.inp', { placeholder: '中文，如 操场' }), wE = h('input.inp.short', { placeholder: '表情/图标 🛝' });
    area.append(h('section.card', h('h3', '🔤 单词'),
      h('div.form-row', wEn, wCn, wE, h('button.btn.small', { onclick: () => { if (!wEn.value.trim()) return toast('请填写英文'); c.words.push({ en: wEn.value.trim(), cn: wCn.value.trim(), e: wE.value.trim() || '📘' }); toast('已添加'); refresh(); } }, '添加')),
      list(c.words, (w) => `${w.e} ${w.en}  ${w.cn}`, (i) => { c.words.splice(i, 1); refresh(); }, (w) => w.en),
      h('details', h('summary', '批量粘贴（每行：英文,中文,表情）'), (() => {
        const ta = h('textarea.inp', { rows: 4, placeholder: 'playground,操场,🛝\ndining hall,餐厅,🍽️' });
        return h('div', ta, h('button.btn.small', { onclick: () => {
          const n = ta.value.split('\n').map((l) => l.split(/[,，\t]/).map((x) => x.trim())).filter((x) => x[0]).map(([en, cn = '', e = '📘']) => c.words.push({ en, cn, e })).length;
          toast(`已导入 ${n} 个单词`); refresh();
        } }, '导入'));
      })())));
    // 句子
    const sEn = h('input.inp', { placeholder: '英文句子' }), sCn = h('input.inp', { placeholder: '中文意思（可选）' });
    area.append(h('section.card', h('h3', '💬 重点句子'),
      h('div.form-row', sEn, sCn, h('button.btn.small', { onclick: () => { if (!sEn.value.trim()) return; c.sentences.push({ en: sEn.value.trim(), cn: sCn.value.trim() }); toast('已添加'); refresh(); } }, '添加')),
      list(c.sentences, (s) => `${s.en}  ${s.cn || ''}`, (i) => { c.sentences.splice(i, 1); refresh(); }, (s) => s.en)));
    // 背诵课文
    const rT = h('input.inp', { placeholder: '标题，如 课本 p.10 Let\'s meet there' });
    const rX = h('textarea.inp', { rows: 5, placeholder: '把要背的课文粘贴/输入在这里，每句以 . ! ? 结尾' });
    area.append(h('section.card', h('h3', '📘 背诵课文（比如课本原文）'),
      rT, rX, h('button.btn.small', { onclick: () => {
        const text = rX.value.trim();
        if (!text) return toast('请输入课文');
        c.recite.push({ title: rT.value.trim() || '我的课文', text: text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean) });
        toast('已添加到背诵挑战'); refresh();
      } }, '添加'),
      list(c.recite, (r) => `${r.title}（${r.text.length} 句）`, (i) => { c.recite.splice(i, 1); refresh(); }, (r) => r.text.join(' '))));
    // 测验题
    const qQ = h('input.inp', { placeholder: '题目，用 ____ 表示空格：There ____ a park.' });
    const qA = h('input.inp', { placeholder: '正确答案：is' });
    const qB = h('input.inp', { placeholder: '错误选项1：are' });
    const qC = h('input.inp', { placeholder: '错误选项2：am' });
    area.append(h('section.card', h('h3', '🧩 测验选择题'),
      h('div.form-grid', qQ, qA, qB, qC),
      h('button.btn.small', { onclick: () => {
        if (!qQ.value.trim() || !qA.value.trim() || !qB.value.trim()) return toast('题目、正确答案和至少一个错误选项必填');
        c.quiz.push({ q: qQ.value.trim(), options: [qA.value.trim(), qB.value.trim(), qC.value.trim()].filter(Boolean) });
        toast('已加入测验题库'); refresh();
      } }, '添加'),
      list(c.quiz, (q) => `${q.q}  →  ${q.options[0]}`, (i) => { c.quiz.splice(i, 1); refresh(); })));
  };
  draw();

  // 导入导出
  p.append(h('section.card', h('h3', '📦 导入 / 导出'),
    h('p.muted', '可以把内容池导出成 JSON 备份，或者让 AI 按下面的格式批量生成内容再导入。'),
    h('div.row',
      h('button.btn.small', { onclick: () => showText('内容池 JSON（复制保存）', exportContent()) }, '导出内容池'),
      h('button.btn.small.ghost', { onclick: () => showText('全部数据备份（含进度）', exportAll()) }, '导出全部数据'),
      h('button.btn.small', { onclick: importDialog }, '导入 JSON')),
    h('details', h('summary', '查看 JSON 格式示例'), h('pre.code', JSON.stringify({
      type: 'squirrel-english-content', v: 1,
      custom: { u1: { words: [{ en: 'playground', cn: '操场', e: '🛝' }], sentences: [{ en: 'Let\'s meet in the library.', cn: '我们在图书馆见。' }], recite: [{ title: 'My school', text: ['This is my school.', 'It is very big.'] }], quiz: [{ q: 'There ____ a big hall.', options: ['is', 'are', 'am'] }] } },
    }, null, 2)), h('p.muted', '单元编号：starter, u1 ~ u10；quiz 的 options 第一个是正确答案。'))));
}

function list(arr, label, onDel, speakText) {
  if (!arr.length) return h('p.muted', '（还没有添加）');
  return h('div.pool-list', arr.map((x, i) => h('div.pool-item', speakText ? speakBtn(speakText(x), { cls: 'tiny' }) : null, h('span', label(x)), h('button.del', { onclick: () => { if (confirm('删除这一条？')) onDel(i); } }, '🗑'))));
}

function showText(title, text) {
  const ta = h('textarea.inp.code', { rows: 14, readonly: true }, text);
  modal(h('div', h('h3', title), ta, h('div.row',
    h('button.btn.small', { onclick: async () => { try { await navigator.clipboard.writeText(text); toast('已复制'); } catch { ta.select(); document.execCommand('copy'); toast('已复制'); } } }, '复制'),
    h('a.btn.small.ghost', { href: URL.createObjectURL(new Blob([text], { type: 'application/json' })), download: `squirrel-english-${today()}.json` }, '下载文件'))));
}

function importDialog() {
  const ta = h('textarea.inp.code', { rows: 10, placeholder: '把 JSON 粘贴到这里，或选择文件' });
  const file = h('input', { type: 'file', accept: '.json,application/json,text/plain', onchange: async (e) => { const f = e.target.files[0]; if (f) ta.value = await f.text(); } });
  const m = modal(h('div', h('h3', '导入 JSON'), file, ta, h('button.btn', { onclick: () => {
    try { toast(importJSON(ta.value)); m.close(); location.reload(); } catch (err) { toast('导入失败：' + err.message); }
  } }, '导入')));
}

// ───────── 设置 ─────────
function settings(p) {
  const st = S();
  const s = st.settings;
  const units = getUnits();
  const row = (label, ctrl, tip) => h('div.set-row', h('div', h('b', label), tip ? h('small', tip) : null), ctrl);
  const range = (key, min, max, step, fmt) => {
    const val = h('b.val', fmt(s[key]));
    const r = h('input', { type: 'range', min, max, step, value: s[key], oninput: (e) => { s[key] = Number(e.target.value); val.textContent = fmt(s[key]); save(); } });
    return h('div.range', r, val);
  };
  const toggle = (key) => h('input.switch', { type: 'checkbox', checked: !!s[key], onchange: (e) => { s[key] = e.target.checked; save(); } });

  p.append(h('section.card', h('h3', '🎯 学习'),
    row('过关分数线', range('passLine', 80, 95, 5, (v) => v + ' 分'), '测验和背诵都按这个分数判定过关（默认 90）'),
    row('每日建议时长', range('dailyMin', 10, 60, 5, (v) => v + ' 分钟'), '到时间小松鼠会提醒休息'),
    row('显示中文', toggle('showCN'), '关掉后只显示英文，适合进阶'),
    row('朗读语速', h('div', range('rate', 0.5, 1.1, 0.05, (v) => v.toFixed(2) + '×'), h('button.btn.small.ghost', { onclick: () => speak('Hello! This is my school. It is big and beautiful.') }, '试听')), '0.8 左右比较适合四年级'),
    row('识别时限定词表', toggle('useGrammar'), '开启后识别更"宽容"、更准（推荐开启）；关闭则完全自由识别、更严格'),
  ));
  const upto = h('select.inp', { onchange: (e) => { s.unlockedUpTo = Number(e.target.value); save(); toast('已更新'); } },
    units.map((u, i) => h('option', { value: i, selected: (s.unlockedUpTo || 0) === i }, `${u.no ? 'Unit ' + u.no : 'Starter'} ${u.title}`)));
  p.append(h('section.card', h('h3', '🗺️ 岛屿解锁'),
    row('学校已学到', upto, '此单元及之前的岛屿直接开放'),
    row('全部解锁', toggle('unlockAll'), '复习期或者想预习时打开')));

  const nameIn = h('input.inp', { value: st.profile.name, onchange: (e) => { st.profile.name = e.target.value.trim(); save(); } });
  const petIn = h('input.inp', { value: st.profile.petName, onchange: (e) => { st.profile.petName = e.target.value.trim() || '松果'; save(); } });
  p.append(h('section.card', h('h3', '🧒 名字'), row('孩子的名字', nameIn), row('松鼠的名字', petIn)));

  const ttsInfo = h('span', '检测中…');
  ttsStatus().then((r) => { ttsInfo.textContent = r.ok ? `✅ 正常（${r.engine === 'native' ? '系统语音引擎' : '浏览器语音'}）` : '⚠️ 没有英文语音，请看"帮助"'; });
  const asrInfo = h('span');
  const showAsr = () => { const a = asrState(); asrInfo.textContent = a.status === 'ready' ? `✅ 正常（${a.engine === 'vosk' ? '离线 Vosk 模型' : '浏览器在线识别'}）` : a.status === 'loading' ? '⏳ 加载中…' : `⚠️ ${a.error || '不可用'}`; };
  showAsr(); initASR().then(showAsr);
  p.append(h('section.card', h('h3', '🔊 声音与话筒'),
    row('英文发音', h('div', ttsInfo, ' ', h('button.btn.small.ghost', { onclick: openTtsInstall }, '安装语音数据'))),
    row('语音识别', asrInfo)));

  p.append(h('section.card.danger', h('h3', '⚠️ 重置'),
    h('p.muted', '清空学习进度、宠物、录音记录（保留内容池和设置）。'),
    h('button.btn.small.ghost', { onclick: () => { if (confirm('确定清空所有学习进度吗？') && confirm('再确认一次：清空后无法恢复')) { resetProgress(); toast('已重置'); location.hash = '#/'; } } }, '清空学习进度')));
}

// ───────── 帮助 ─────────
function help(p) {
  p.append(h('section.card.help',
    h('h3', '🎯 这款 App 怎么帮孩子学'),
    h('ul',
      h('li', '每个单元 7 个关卡对应课本板块：Topic words → Song/Chant → Talking time → 语法 → Sound → Reading/Story → Project。'),
      h('li', '单元测验（听力20·词汇20·语法30·口语20·阅读10）和背诵挑战都满分 100，达到过关线（默认 90）才会点亮岛屿、解锁下一座。'),
      h('li', '学过的单词、句子、错题自动进入"复习本"，按 1/2/4/7/15/30 天的记忆曲线安排复习，答错会回到第一天。首页"今日任务"总是先安排到期复习，再安排新内容。'),
      h('li', '测验低于 70 分时，今日任务会先让孩子回到单词岛和语法游戏打基础；没过关只需重做错题、只需补背没背好的句子，避免挫败感。'),
      h('li', '所有内容都在平板本地，不联网、不上传录音。')),
    h('h3', '🔊 平板没有英文发音怎么办'),
    h('ol',
      h('li', '打开小米平板「设置 → 更多设置 → 语言和输入法 → 文字转语音（TTS）输出」，看看首选引擎是否支持英语。'),
      h('li', '如果不支持，可以在应用商店安装一个支持英文的离线语音引擎（例如"Google 文字转语音"，或开源的 sherpa-onnx TTS Engine），安装后在上面的设置里设为首选引擎，并下载英文（美国）语音数据。'),
      h('li', '回到本 App 的"设置"，点"试听"确认能听到英文。')),
    h('h3', '🎤 话筒识别说明'),
    h('ul',
      h('li', '识别使用内置的离线英文模型（Vosk），第一次打开需要 10~30 秒加载，之后会快很多。'),
      h('li', '孩子说话时离平板 20~40 厘米、声音洪亮一些，识别会更准。'),
      h('li', '离线识别偶尔会把孩子读对的词判错。如果您觉得孩子背得很好但分数不到线，可以在"录音与改判"里回听并手动判定通过，或在设置里把过关线调到 85。')),
    h('h3', '📚 内容池'),
    h('p', '在"内容池"里可以给任何单元添加单词、句子、课本课文和测验题。建议把课本里需要背诵的课文原文录入进来，孩子就能在背诵挑战里选择它来背。'),
  ));
}
