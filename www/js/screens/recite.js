// 背诵挑战：四步走（看全文 → 挖空 → 首字母 → 完全背诵），第 4 步计入过关分
// 打分：完整度 50 + 准确度 30 + 流利度 20；没过关只需补背"橙色句子"
import { h } from '../util.js';
import { unitById, recordRecite, passLine, prog, saveRecording } from '../store.js';
import { topbar, speakBtn, micButton, celebrate, petSay, scoreBadge, coloredText, asrBanner } from '../ui.js';
import { listen, canListen, initASR, stopSpeak, playBlob } from '../speech.js';
import { scoreReading, buildGrammar, normalize } from '../scoring.js';
import { introduce, cardKey } from '../srs.js';
import { fx } from '../audiofx.js';

const STEPS = [
  { n: 1, name: '看全文读', icon: '👀' },
  { n: 2, name: '挖空读', icon: '🕳️' },
  { n: 3, name: '首字母提示', icon: '🔠' },
  { n: 4, name: '完全背诵', icon: '🏆' },
];

export function maskSentence(s, step) {
  if (step === 1) return s;
  const words = s.split(/\s+/);
  if (step === 2) return words.map((w, i) => (i % 3 === 1 ? w.replace(/[A-Za-z']+/, (m) => '_'.repeat(Math.max(3, m.length))) : w)).join(' ');
  if (step === 3) return words.map((w) => w.replace(/([A-Za-z])([A-Za-z']*)/, (_, a, b) => a + '_'.repeat(b.length))).join(' ');
  return '';
}

export function render(root, [uid]) {
  const u = unitById(uid);
  const pl = passLine();
  const passages = [{ title: u.recite.title, text: u.recite.text, builtin: true },
    ...(u.recites || []).map((r) => ({ title: r.title, text: Array.isArray(r.text) ? r.text : String(r.text).split(/(?<=[.!?])\s+/).filter(Boolean) }))];
  let pi = 0, step = 1;
  root.appendChild(topbar('🎤 背诵挑战', { back: `#/unit/${uid}`, sub: `${pl} 分过关 · 第 4 步计分`, color: u.color }));
  const body = h('div.stage-body.recite');
  root.appendChild(body);
  let alive = true, ctl = null;

  const draw = () => {
    const P = passages[pi];
    body.innerHTML = '';
    const best = prog(uid).recite.best;
    body.append(petSay(best >= pl ? `已经过关啦（最高 ${best} 分）！想挑战更高分吗？` : '一步一步来：先看着读，再慢慢遮住，最后不看书背出来！'));
    if (passages.length > 1) {
      body.appendChild(h('div.chips.center', passages.map((p, i) => h('button.chip' + (i === pi ? '.on' : ''), { onclick: () => { pi = i; draw(); } }, (p.builtin ? '⭐ ' : '📘 ') + p.title))));
    }
    body.appendChild(h('div.steps', STEPS.map((s) => h('button.step' + (s.n === step ? '.on' : ''), { onclick: () => { step = s.n; draw(); } }, s.icon, h('span', `${s.n}. ${s.name}`)))));
    const banner = asrBanner();
    if (banner) body.appendChild(banner);

    const card = h('section.recite-card', h('h2', P.title));
    if (step < 4) {
      P.text.forEach((s) => card.appendChild(h('div.sent-row',
        h('div.sent-text', speakBtn(s, { cls: 'tiny' }), h('span.rc-line', maskSentence(s, step))),
        micButton({ target: s, compact: true, label: '练这句' }))));
      card.appendChild(h('div.row.center', speakBtn(P.text.join(' '), { label: '听全文' }), speakBtn(P.text.join(' '), { label: '慢速', rate: 0.6 })));
    } else {
      card.appendChild(h('div.hidden-text', P.text.map((s, i) => h('div.hidden-line', `${i + 1}. ` + '﹏'.repeat(Math.min(14, normalize(s).length + 2))))));
      card.appendChild(h('p.center.muted', `共 ${P.text.length} 句。准备好了就点下面的大话筒，一口气背完，背完停 3 秒会自动结束。`));
    }
    body.appendChild(card);
    body.appendChild(fullRecord(P));
  };

  function fullRecord(P) {
    const box = h('section.card.full-rec');
    const btn = h('button.btn-mic.huge', h('span.mic-ring'), h('span.mic-ico', '🎤'));
    const label = h('div.mic-label', step === 4 ? '正式背诵（计入过关分）' : `整篇朗读练习（第 ${step} 步，不计过关分）`);
    const live = h('div.mic-partial');
    const result = h('div.rec-result');
    box.append(btn, label, live, result);
    btn.onclick = async () => {
      if (ctl) { ctl.stop(); return; }
      await initASR();
      if (!canListen()) { label.textContent = '当前设备不能识别语音，请家长在"家长中心 → 录音"里听孩子背诵后手动判定。'; return; }
      await stopSpeak();
      fx.pop();
      btn.classList.add('on');
      label.textContent = '我在听……背完停一下就会自动结束（也可以再点一下话筒结束）';
      result.innerHTML = '';
      const ring = btn.querySelector('.mic-ring');
      ctl = listen({
        grammar: buildGrammar(P.text), maxMs: 120000, silenceMs: 3000, noSpeechMs: 9000,
        onPartial: (t) => { live.textContent = t.split(' ').slice(-12).join(' '); },
        onLevel: (v) => { ring.style.transform = `scale(${1 + v * 0.6})`; },
      });
      let res;
      try { res = await ctl.promise; } catch (e) { label.textContent = '话筒出错：' + (e?.message || e); btn.classList.remove('on'); ctl = null; return; }
      ctl = null;
      btn.classList.remove('on');
      if (!alive) return;
      if (!res.text) { label.textContent = '没有听到声音，再试一次吧！'; fx.buzz(); return; }
      const sc = scoreReading(P.text, res);
      const final = step === 4;
      const key = res.blob ? await saveRecording({ uid, kind: 'recite', text: P.title, score: sc.total, final }, res.blob) : null;
      recordRecite(uid, sc.total, { final, step, title: P.title, audioKey: key });
      if (final) P.text.forEach((s) => introduce(cardKey('s', uid, s)));
      showResult(result, P, sc, res, final);
      label.textContent = '点话筒可以再来一次';
    };
    return box;
  }

  function showResult(result, P, sc, res, final) {
    result.innerHTML = '';
    const pass = sc.total >= pl;
    result.append(
      h('div.score-row', scoreBadge(sc.total),
        h('div.breakdown',
          h('div', `完整度 ${sc.completeness}/50`), h('div', `准确度 ${sc.accuracy}/30`), h('div', `流利度 ${sc.fluency}/20`))),
      h('p.muted', '🟢 读对　🟠 有点像　⚪ 漏掉了'),
      coloredText(sc.display),
      res.blob ? h('button.btn.ghost.small', { onclick: () => playBlob(res.blob) }, '▶ 听听我的录音') : null,
    );
    if (!final) {
      result.appendChild(h('p.hint', sc.total >= 85 ? '读得很好！可以进入下一步了 👉' : '多练几遍那些橙色的句子吧！'));
      if (sc.total >= 85 && step < 4) result.appendChild(h('div.center', h('button.btn', { onclick: () => { step++; draw(); } }, `进入第 ${step + 1} 步 ›`)));
      return;
    }
    if (pass) {
      celebrate({ score: sc.total, pass: true, title: '背诵过关！🎉', lines: ['太了不起了，不看书也能背出来！'], buttons: [h('a.btn', { href: `#/unit/${uid}` }, '回到岛屿'), h('button.btn.ghost', { onclick: () => document.querySelector('.modal-bg')?.remove() }, '看看成绩')] });
      return;
    }
    // 没过关：只补背橙色句子
    const weak = sc.sentences.map((s, i) => ({ ...s, i })).filter((s) => s.score < 85);
    if (!weak.length) { result.appendChild(h('p.hint', '每句都读到了，再流利一点就能过关！试着连贯地背一遍。')); return; }
    // 补背加分：把"如果这些句子都背对"能拿到的分（约 98）按每句缺的词数分摊
    const deficit = weak.reduce((a, w) => a + normalize(w.text).length * (100 - w.score) / 100, 0) || 1;
    const room = Math.max(0, 98 - sc.total);
    let current = sc.total;
    const now = h('div.center', h('b', `当前总分 ${current}`));
    result.append(h('h3', `🟠 只需补背这 ${weak.length} 句（背对后自动加分）`), now);
    weak.forEach((w) => {
      const words = normalize(w.text).length;
      let bestS = w.score;
      result.appendChild(h('div.sent-row.weak',
        h('div.sent-text', h('span', `${w.i + 1}. `), h('span.rc-line', maskSentence(w.text, 3)), h('small.muted', ` 原来 ${w.score} 分`)),
        micButton({
          target: w.text, compact: true, label: '补背这句',
          onResult: (r) => {
            if (r.score == null || r.score <= bestS) return;
            const gain = (((r.score - bestS) / 100) * words / deficit) * room;
            bestS = r.score;
            current = Math.min(100, Math.round(current + gain));
            now.innerHTML = '';
            now.appendChild(h('b', `当前总分 ${current}`));
            recordRecite(uid, current, { final: true, step: 4, title: P.title, patched: true });
            if (current >= pl) celebrate({ score: current, pass: true, title: '补背成功，背诵过关！🎉', buttons: [h('a.btn', { href: `#/unit/${uid}` }, '回到岛屿')] });
          },
        })));
    });
  }

  draw();
  return () => { alive = false; ctl?.stop(); };
}
