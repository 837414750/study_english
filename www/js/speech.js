// 语音：发音（TTS）+ 离线识别（ASR）+ 录音
//
// 发音优先级：安卓原生 TTS（@capacitor-community/text-to-speech，离线）→ 浏览器 speechSynthesis
// 识别优先级：Vosk 离线模型（www/models，WebAssembly 本地运行）→ 浏览器 Web Speech（仅电脑预览用）→ 无（界面自动改为点选模式）
import { S } from './store.js';
import { sleep } from './util.js';

const Cap = window.Capacitor;
export const isNative = !!(Cap && typeof Cap.isNativePlatform === 'function' && Cap.isNativePlatform());
const NativeTTS = isNative && Cap.Plugins ? Cap.Plugins.TextToSpeech : null;
export const MODEL_URL = 'models/vosk-model-small-en-us-0.15.tar.gz';

// ═════════════════════════ TTS ═════════════════════════
let webVoice = null;
let speakToken = 0;

function pickWebVoice() {
  if (!('speechSynthesis' in window)) return null;
  const vs = speechSynthesis.getVoices();
  const prefer = [/en-US.*(Samantha|Google|Aria|Jenny|Ava)/i, /en-GB.*(Google|Serena|Libby)/i, /^en-US/i, /^en-GB/i, /^en/i];
  for (const re of prefer) {
    const v = vs.find((x) => re.test(`${x.lang} ${x.name}`));
    if (v) return v;
  }
  return null;
}
if ('speechSynthesis' in window) {
  webVoice = pickWebVoice();
  speechSynthesis.onvoiceschanged = () => { webVoice = pickWebVoice(); };
}

export async function ttsStatus() {
  if (NativeTTS) {
    try {
      const r = await NativeTTS.isLanguageSupported({ lang: 'en-US' });
      if (r?.supported) return { engine: 'native', ok: true };
      const langs = (await NativeTTS.getSupportedLanguages())?.languages || [];
      return { engine: 'native', ok: langs.some((l) => /^en/i.test(l)), langs };
    } catch (e) {
      return { engine: 'native', ok: false, error: String(e) };
    }
  }
  if ('speechSynthesis' in window) {
    webVoice = pickWebVoice();
    return { engine: 'web', ok: !!webVoice, voice: webVoice?.name };
  }
  return { engine: 'none', ok: false };
}
export function openTtsInstall() { if (NativeTTS?.openInstall) NativeTTS.openInstall().catch(() => {}); }

export async function stopSpeak() {
  speakToken++;
  try { if (NativeTTS) await NativeTTS.stop(); } catch { /* ignore */ }
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch { /* ignore */ }
}

/**
 * 朗读英文。opts.rate 语速（默认取家长设置，0.8 偏慢更适合孩子）；opts.onWord(i) 逐词高亮回调（估算时间）。
 */
export async function speak(text, opts = {}) {
  if (!text) return;
  await stopSpeak();
  const token = ++speakToken;
  const rate = opts.rate ?? S().settings.rate ?? 0.8;
  const words = String(text).split(/\s+/).filter(Boolean);
  let timers = [];
  if (opts.onWord) {
    // 估算每个词的时间：按字母数加权
    const per = (0.33 + 0.05) / rate;
    let t = 0.15 / rate;
    words.forEach((w, i) => {
      timers.push(setTimeout(() => token === speakToken && opts.onWord(i), t * 1000));
      t += per * Math.max(0.6, Math.min(2.2, w.replace(/[^a-z]/gi, '').length / 4.5)) + (/[,.!?]$/.test(w) ? 0.25 / rate : 0);
    });
  }
  const done = () => { timers.forEach(clearTimeout); timers = []; if (opts.onWord && token === speakToken) opts.onWord(-1); };
  try {
    if (NativeTTS) {
      await NativeTTS.speak({ text, lang: opts.lang || 'en-US', rate, pitch: opts.pitch ?? 1.0, volume: 1.0, category: 'playback', queueStrategy: 0 });
    } else if ('speechSynthesis' in window) {
      await new Promise((resolve) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = opts.lang || webVoice?.lang || 'en-US';
        if (webVoice && !opts.lang) u.voice = webVoice;
        u.rate = rate; u.pitch = opts.pitch ?? 1.05;
        u.onend = resolve; u.onerror = resolve;
        speechSynthesis.speak(u);
        // 兜底：有些浏览器不触发 onend
        setTimeout(resolve, 1500 + words.length * 900 / rate);
      });
    } else {
      await sleep(400 * words.length);
    }
  } catch (e) {
    console.warn('speak failed', e);
  } finally {
    done();
  }
}

/** 中文提示（宠物说话用），没有中文语音就静默 */
export async function speakCN(text) {
  try {
    if (NativeTTS) await NativeTTS.speak({ text, lang: 'zh-CN', rate: 1.0, pitch: 1.1, volume: 1.0, category: 'playback', queueStrategy: 0 });
    else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text); u.lang = 'zh-CN'; u.rate = 1.05; speechSynthesis.speak(u);
    }
  } catch { /* ignore */ }
}

// ═════════════════════════ ASR ═════════════════════════
const asr = { engine: 'none', status: 'idle', model: null, error: '', listeners: new Set() };
const WebSR = window.SpeechRecognition || window.webkitSpeechRecognition;

function setStatus(status, error = '') {
  asr.status = status; asr.error = error;
  asr.listeners.forEach((fn) => fn({ ...asrState() }));
}
export const asrState = () => ({ engine: asr.engine, status: asr.status, error: asr.error });
export const onAsrState = (fn) => { asr.listeners.add(fn); return () => asr.listeners.delete(fn); };
export const canListen = () => asr.status === 'ready';
const hasMic = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

let initPromise = null;
/** 启动时调用：加载离线识别模型（首次约 10~30 秒，之后有缓存） */
export function initASR() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (!hasMic()) { setStatus('unavailable', '设备不支持麦克风'); return; }
    if (window.Vosk && typeof window.Vosk.createModel === 'function') {
      asr.engine = 'vosk';
      setStatus('loading');
      try {
        if (!isNative) {
          const head = await fetch(MODEL_URL, { method: 'HEAD' }).catch(() => null);
          if (head && head.status === 404) throw new Error('模型文件不存在');
        }
        const url = new URL(MODEL_URL, location.href).href;
        asr.model = await Promise.race([
          window.Vosk.createModel(url),
          new Promise((_, rej) => setTimeout(() => rej(new Error('加载超时')), 120000)),
        ]);
        setStatus('ready');
        return;
      } catch (e) {
        console.warn('Vosk load failed', e);
        asr.model = null;
        if (!(WebSR && !isNative)) { setStatus('unavailable', '离线识别模型加载失败：' + (e?.message || e)); return; }
      }
    }
    if (WebSR && !isNative) {
      asr.engine = 'webspeech';
      setStatus('ready');
      return;
    }
    asr.engine = 'none';
    setStatus('unavailable', isNative ? '缺少离线识别模型（打包前请运行 npm run prepare-assets）' : '此浏览器不支持语音识别，请用 Chrome');
  })();
  return initPromise;
}

/**
 * 开始听孩子说话。
 * opts: { grammar: string[]|null, maxMs, silenceMs, onPartial(text), onLevel(0~1), record: boolean }
 * 返回 { stop(), promise }，promise 解析为 { text, words, duration, blob }
 */
export function listen(opts = {}) {
  const ctl = { stopped: false, stop: () => {} };
  ctl.promise = (async () => {
    await initASR();
    if (!canListen()) throw new Error(asr.error || '语音识别不可用');
    if (asr.engine === 'vosk') return listenVosk(opts, ctl);
    return listenWeb(opts, ctl);
  })();
  return ctl;
}

async function openMic() {
  return navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
    video: false,
  });
}

function startRecorder(stream) {
  if (!window.MediaRecorder) return null;
  try {
    const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported?.(t));
    const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    const chunks = [];
    mr.ondataavailable = (e) => e.data?.size && chunks.push(e.data);
    mr.start(250);
    return {
      stop: () => new Promise((res) => {
        mr.onstop = () => res(chunks.length ? new Blob(chunks, { type: mr.mimeType || 'audio/webm' }) : null);
        try { mr.stop(); } catch { res(null); }
      }),
    };
  } catch { return null; }
}

/** 音量与静音检测：说完话停顿 silenceMs 自动结束 */
function makeVad(opts, onSilence) {
  let floor = null, speech = false, quietSince = null, frames = 0;
  const t0 = performance.now();
  const silenceMs = opts.silenceMs ?? 1800;
  const noSpeechMs = opts.noSpeechMs ?? 7000;
  return (buf) => {
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    frames++;
    if (frames < 4) floor = floor == null ? rms : Math.min(floor, rms);
    const thr = Math.max(0.015, (floor || 0.005) * 3);
    opts.onLevel?.(Math.min(1, rms / 0.15));
    const now = performance.now();
    if (rms > thr) { speech = true; quietSince = null; }
    else if (speech) {
      quietSince = quietSince ?? now;
      if (now - quietSince > silenceMs) onSilence('silence');
    } else if (now - t0 > noSpeechMs) onSilence('nospeech');
  };
}

async function listenVosk(opts, ctl) {
  const stream = await openMic();
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = new AC();
  if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
  const source = ctx.createMediaStreamSource(stream);
  const grammar = opts.grammar && S().settings.useGrammar ? JSON.stringify(opts.grammar) : undefined;
  // 带 grammar 创建识别器：若词表里有模型词典外的词，部分 vosk 版本会抛错，
  // 这里兜底为不带 grammar 重新创建，保证口语题不会因此崩溃。
  let rec;
  try {
    rec = new asr.model.KaldiRecognizer(ctx.sampleRate, grammar);
  } catch (e) {
    console.warn('KaldiRecognizer with grammar failed, retry without grammar', e);
    rec = new asr.model.KaldiRecognizer(ctx.sampleRate);
  }
  rec.setWords(true);
  const results = [];
  let waitingFinal = null;
  let partial = '';
  const joined = () => results.map((r) => r.text).filter(Boolean).join(' ');
  rec.on('result', (m) => {
    const r = m.result || {};
    if (r.text) results.push(r);
    opts.onPartial?.(joined());
    if (waitingFinal) waitingFinal();
  });
  rec.on('partialresult', (m) => {
    partial = m.result?.partial || '';
    opts.onPartial?.([joined(), partial].filter(Boolean).join(' '));
  });
  const recorder = opts.record !== false ? startRecorder(stream) : null;
  const t0 = performance.now();
  let finish;
  const done = new Promise((r) => { finish = r; });
  const vad = makeVad(opts, (why) => finish(why));
  const node = ctx.createScriptProcessor(4096, 1, 1);
  node.onaudioprocess = (e) => {
    try { rec.acceptWaveform(e.inputBuffer); } catch (err) { console.warn(err); }
    vad(e.inputBuffer.getChannelData(0));
  };
  source.connect(node);
  node.connect(ctx.destination);
  ctl.stop = () => finish('manual');
  const timer = setTimeout(() => finish('timeout'), opts.maxMs ?? 15000);
  const reason = await done;
  clearTimeout(timer);
  ctl.stopped = true;
  try { source.disconnect(); node.disconnect(); } catch { /* ignore */ }
  await new Promise((res) => {
    waitingFinal = res;
    try { rec.retrieveFinalResult(); } catch { res(); }
    setTimeout(res, 2000);
  });
  try { rec.remove(); } catch { /* ignore */ }
  const blob = recorder ? await recorder.stop() : null;
  stream.getTracks().forEach((t) => t.stop());
  ctx.close().catch(() => {});
  const words = results.flatMap((r) => r.result || []);
  return { text: joined() || '', words, duration: (performance.now() - t0) / 1000, blob, reason };
}

async function listenWeb(opts, ctl) {
  let stream = null, recorder = null;
  try { stream = await openMic(); recorder = opts.record !== false ? startRecorder(stream) : null; } catch { /* 预览模式下录音失败也继续 */ }
  const r = new WebSR();
  r.lang = 'en-US'; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
  const finals = [];
  let interim = '';
  const t0 = performance.now();
  let lastHeard = performance.now();
  let finish;
  const done = new Promise((res) => { finish = res; });
  r.onresult = (e) => {
    interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      if (res.isFinal) finals.push({ text: res[0].transcript.trim(), conf: res[0].confidence });
      else interim += res[0].transcript;
    }
    lastHeard = performance.now();
    opts.onPartial?.([...finals.map((f) => f.text), interim].join(' ').trim());
  };
  r.onerror = (e) => finish('error:' + e.error);
  r.onend = () => finish('end');
  try { r.start(); } catch (e) { finish('error'); }
  const silenceMs = (opts.silenceMs ?? 1800) + 400;
  const poll = setInterval(() => {
    const now = performance.now();
    opts.onLevel?.(now - lastHeard < 300 ? 0.6 : 0.1);
    if ((finals.length || interim) && now - lastHeard > silenceMs) finish('silence');
    if (!finals.length && !interim && now - t0 > (opts.noSpeechMs ?? 8000)) finish('nospeech');
  }, 200);
  ctl.stop = () => finish('manual');
  const timer = setTimeout(() => finish('timeout'), opts.maxMs ?? 15000);
  const reason = await done;
  clearInterval(poll); clearTimeout(timer);
  try { r.stop(); } catch { /* ignore */ }
  await sleep(300);
  const blob = recorder ? await recorder.stop() : null;
  stream?.getTracks().forEach((t) => t.stop());
  const text = [...finals.map((f) => f.text), interim].join(' ').trim();
  return { text, words: null, duration: (performance.now() - t0) / 1000, blob, reason };
}

// ═════════════════════════ 播放录音 ═════════════════════════
let currentAudio = null;
export function playBlob(blob) {
  if (!blob) return Promise.resolve();
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  const url = URL.createObjectURL(blob);
  const a = new Audio(url);
  currentAudio = a;
  return new Promise((res) => {
    a.onended = a.onerror = () => { URL.revokeObjectURL(url); res(); };
    a.play().catch(() => res());
  });
}
