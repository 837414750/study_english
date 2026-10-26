// 公共界面组件：顶栏、朗读按钮、麦克风、打分徽章、弹窗、庆祝动画、松鼠对话气泡
import { h, confetti, sleep } from './util.js';
import { speak, listen, canListen, asrState, initASR, stopSpeak } from './speech.js';
import { scoreSentence, buildGrammar } from './scoring.js';
import { S, PET_LEVELS, petLevel } from './store.js';
import { fx } from './audiofx.js';

export function topbar(title, { back = '#/', sub = '', right = null, color = null } = {}) {
  document.documentElement.style.setProperty('--accent', color || '#2F6B4F');
  return h('header.topbar',
    back ? h('a.back', { href: back, onclick: () => stopSpeak() }, '‹') : h('span.back.ghost'),
    h('div.tb-title', h('div', title), sub ? h('small', sub) : null),
    h('div.tb-right', right),
  );
}

/** 🔊 按钮：点一下朗读，可传 rate */
export function speakBtn(text, { rate, label = '', cls = '', onWord } = {}) {
  const b = h('button.btn-speak' + (cls ? '.' + cls : ''), { title: '听一听' }, '🔊', label ? h('span', label) : null);
  b.onclick = async (e) => {
    e.stopPropagation();
    b.classList.add('playing');
    await speak(typeof text === 'function' ? text() : text, { rate, onWord });
    b.classList.remove('playing');
  };
  return b;
}
export function slowBtn(text) { return speakBtn(text, { rate: 0.55, label: '慢速', cls: 'slow' }); }

/** 渲染带颜色的逐词结果 */
export function coloredText(display) {
  return h('div.colored', display.map((d) => (d.br ? h('br') : h('span.w.' + d.status, d.text + ' '))));
}

export function stars(score) {
  const n = score >= 90 ? 3 : score >= 75 ? 2 : score >= 60 ? 1 : 0;
  return h('span.stars', '★'.repeat(n) + '☆'.repeat(3 - n));
}
export function scoreBadge(score, pass = S().settings.passLine) {
  const cls = score >= pass ? 'pass' : score >= 60 ? 'mid' : 'low';
  return h('div.score-badge.' + cls, h('b', String(score)), h('small', '分'));
}

/**
 * 麦克风跟读组件
 * opts: { target: 目标句（字符串，用于打分）, grammar: 额外词表, onResult({score, display, heard, blob, fallback}),
 *         label, maxMs, silenceMs, autoScore=true, compact }
 */
export function micButton(opts) {
  const wrap = h('div.mic-wrap' + (opts.compact ? '.compact' : ''));
  const ring = h('span.mic-ring');
  const btn = h('button.btn-mic', ring, h('span.mic-ico', '🎤'));
  const label = h('div.mic-label', opts.label || '点话筒，跟着读');
  const partial = h('div.mic-partial');
  wrap.append(btn, label, partial);
  let ctl = null;

  const fallback = () => {
    // 没有识别能力：改为"读完自评"
    const ok = h('button.btn.small', '✅ 我大声读完了');
    ok.onclick = () => { ok.remove(); opts.onResult?.({ score: null, fallback: true }); };
    label.textContent = '（当前设备暂不能识别语音，大声读出来就好）';
    wrap.append(ok);
  };

  btn.onclick = async () => {
    if (ctl) { ctl.stop(); return; }
    await initASR();
    if (!canListen()) { btn.disabled = true; fallback(); return; }
    await stopSpeak();
    fx.pop();
    btn.classList.add('on');
    label.textContent = '我在听……说完停一下就好';
    partial.textContent = '';
    const gtexts = [opts.target, ...(opts.grammar || [])].filter(Boolean);
    const grammar = gtexts.length ? buildGrammar(gtexts) : null;
    ctl = listen({
      grammar, maxMs: opts.maxMs ?? 12000, silenceMs: opts.silenceMs ?? 1500,
      onPartial: (t) => { partial.textContent = t; },
      onLevel: (v) => { opts.onLevel?.(v); ring.style.transform = `scale(${1 + v * 0.6})`; ring.style.opacity = String(0.25 + v * 0.6); },
    });
    try {
      const res = await ctl.promise;
      btn.classList.remove('on');
      ring.style.transform = '';
      if (!res.text) {
        label.textContent = res.reason === 'nospeech' ? '没听到声音哦，再试一次？声音大一点～' : '没听清，再来一次吧！';
        fx.buzz();
        ctl = null;
        opts.onEmpty?.();
        return;
      }
      partial.textContent = '听到：' + res.text;
      let out = { heard: res.text, blob: res.blob, raw: res };
      if (opts.target && opts.autoScore !== false) {
        const sc = scoreSentence(opts.target, res);
        out = { ...out, ...sc };
        label.textContent = sc.score >= 85 ? '太棒了！' : sc.score >= 60 ? '不错，还可以更好！' : '再试一次吧，你可以的！';
        (sc.score >= 60 ? fx.ding : fx.buzz)();
      } else {
        label.textContent = '点话筒可以再说一次';
      }
      opts.onResult?.(out);
    } catch (e) {
      btn.classList.remove('on');
      label.textContent = '话筒出了点问题：' + (e?.message || e);
      if (!canListen()) fallback();
    }
    ctl = null;
  };
  return wrap;
}

export function asrBanner() {
  const st = asrState();
  if (st.status === 'ready') return null;
  if (st.status === 'loading') return h('div.banner.info', '⏳ 正在加载离线语音识别（第一次稍慢），可以先听和看～');
  if (st.status === 'unavailable') return h('div.banner.warn', '🎤 语音识别暂不可用：', st.error || '', '。口语题会改成点选或自评。');
  return null;
}

export function modal(content, { onClose, cls = '' } = {}) {
  const close = () => { bg.remove(); onClose?.(); };
  const bg = h('div.modal-bg', { onclick: (e) => e.target === bg && close() },
    h('div.modal' + (cls ? '.' + cls : ''), h('button.modal-x', { onclick: close }, '×'), content));
  document.body.appendChild(bg);
  return { close, el: bg };
}

export function petFace(level = petLevel(), size = 'md') {
  const acc = PET_LEVELS[level].acc;
  return h('div.pet.' + size, h('span.pet-body', '🐿️'), acc ? h('span.pet-acc', acc) : null);
}

export function petSay(text, { size = 'sm' } = {}) {
  return h('div.pet-say', petFace(undefined, size), h('div.bubble', text));
}

/** 过关/得分庆祝层 */
export function celebrate({ score, title, pass, lines = [], buttons = [] }) {
  if (pass) { fx.fanfare(); confetti(); } else fx.pop();
  const box = h('div.celebrate',
    h('div.cel-pet', petFace(undefined, 'lg')),
    h('h2', title || (pass ? '过关啦！' : '加油，再来一次！')),
    score != null ? h('div.cel-score', scoreBadge(score), stars(score)) : null,
    lines.map((l) => h('p', l)),
    h('div.cel-btns', buttons),
  );
  return modal(box, { cls: 'cel' });
}

/** 选项按钮组：返回 Promise<是否答对>，并标出对错 */
export function choiceGroup(options, answer, { onPick, big = false, speakOptions = false } = {}) {
  const grid = h('div.choices' + (big ? '.big' : ''));
  let resolve;
  const p = new Promise((r) => { resolve = r; });
  let done = false;
  for (const o of options) {
    const b = h('button.choice', o);
    if (speakOptions) b.prepend(h('span.mini-speak', { onclick: (e) => { e.stopPropagation(); speak(o); } }, '🔊 '));
    b.onclick = () => {
      if (done) return;
      done = true;
      const ok = o === answer;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) [...grid.children].find((x) => x.textContent.replace('🔊 ', '') === answer)?.classList.add('right');
      (ok ? fx.ding : fx.buzz)();
      onPick?.(o, ok);
      resolve(ok);
    };
    grid.appendChild(b);
  }
  grid.result = p;
  return grid;
}

export async function flash(el, cls, ms = 600) {
  el.classList.add(cls); await sleep(ms); el.classList.remove(cls);
}
