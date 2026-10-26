// 本地存储：学习进度、设置、宠物、家长自定义内容（localStorage），录音（IndexedDB）
import { BUILTIN_UNITS } from './content/index.js';
import { today } from './util.js';

const KEY = 'squirrel-english-v1';
export const STAGES = [
  { id: 'words', name: '单词岛', icon: '🏝️', desc: '看图认词 · 跟读' },
  { id: 'chant', name: '歌谣屋', icon: '🎵', desc: '跟着节拍念歌谣' },
  { id: 'dialogue', name: '对话馆', icon: '🤖', desc: '和 Robo 角色扮演' },
  { id: 'game', name: '语法游戏', icon: '🎮', desc: '玩游戏练语法' },
  { id: 'sound', name: '语音站', icon: '🔤', desc: '自然拼读' },
  { id: 'story', name: '故事屋', icon: '📖', desc: '读故事 · 答问题' },
  { id: 'project', name: '大任务', icon: '🏆', desc: '完成我的作品' },
];
export const PET_LEVELS = [
  { xp: 0, name: '松果宝宝', acc: '' },
  { xp: 80, name: '小松鼠', acc: '🎀' },
  { xp: 250, name: '探险松鼠', acc: '🎒' },
  { xp: 550, name: '学霸松鼠', acc: '🎓' },
  { xp: 1000, name: '魔法松鼠', acc: '🪄' },
  { xp: 1700, name: '松鼠国王', acc: '👑' },
];

function defaults() {
  return {
    v: 1,
    profile: { name: '', petName: '松果', onboarded: false, createdAt: new Date().toISOString() },
    settings: {
      passLine: 90, dailyMin: 20, showCN: true, rate: 0.8,
      useGrammar: true, unlockAll: false, unlockedUpTo: 0, pin: '',
    },
    progress: {},
    srs: {},
    pet: { xp: 0, acorns: 0, mood: 80, lastFed: '' },
    stickers: [],
    works: [],
    recordings: [],
    daily: { date: today(), sec: 0, history: {} },
    log: [],
    custom: {},
  };
}

let state = load();
let saveTimer = null;
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const d = defaults();
    const s = JSON.parse(raw);
    return { ...d, ...s, profile: { ...d.profile, ...s.profile }, settings: { ...d.settings, ...s.settings }, pet: { ...d.pet, ...s.pet }, daily: { ...d.daily, ...s.daily } };
  } catch (e) {
    console.warn('load state failed', e);
    return defaults();
  }
}
export function save(now = false) {
  clearTimeout(saveTimer);
  const doSave = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('save failed', e); }
  };
  if (now) doSave(); else saveTimer = setTimeout(doSave, 300);
  listeners.forEach((fn) => { try { fn(state); } catch { /* ignore */ } });
}
export const S = () => state;
export const onChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

// ───────── 单元（内置 + 家长自定义合并）─────────
export function getUnits() {
  return BUILTIN_UNITS.map((u) => mergeCustom(u));
}
export function unitById(id) {
  const u = BUILTIN_UNITS.find((x) => x.id === id);
  return u ? mergeCustom(u) : null;
}
function mergeCustom(u) {
  const c = state.custom[u.id];
  if (!c) return u;
  const m = { ...u };
  if (c.words?.length) m.words = [...u.words, ...c.words.map((w) => ({ ...w, custom: true }))];
  if (c.sentences?.length) m.sentences = c.sentences.slice();
  if (c.recite?.length) m.recites = c.recite.slice();
  if (c.quiz?.length) m.quiz = { ...u.quiz, grammar: [...u.quiz.grammar, ...c.quiz] };
  return m;
}
export function customOf(uid) {
  if (!state.custom[uid]) state.custom[uid] = { words: [], sentences: [], recite: [], quiz: [] };
  const c = state.custom[uid];
  for (const k of ['words', 'sentences', 'recite', 'quiz']) c[k] = c[k] || [];
  return c;
}

// ───────── 进度 ─────────
export function prog(uid) {
  if (!state.progress[uid]) {
    state.progress[uid] = { stages: {}, quiz: { best: 0, history: [] }, recite: { best: 0, history: [], override: false } };
  }
  return state.progress[uid];
}
export function stageDone(uid, stage) { return !!prog(uid).stages[stage]; }
export function markStage(uid, stage) {
  const p = prog(uid);
  const first = !p.stages[stage];
  p.stages[stage] = true;
  addLog('stage', uid, null, stage);
  if (first) addXP(15);
  save();
  return first;
}
export const passLine = () => state.settings.passLine;
export function quizPassed(uid) { return prog(uid).quiz.best >= passLine(); }
export function recitePassed(uid) { const r = prog(uid).recite; return r.override || r.best >= passLine(); }
export function unitPassed(uid) { return quizPassed(uid) && recitePassed(uid); }
export function unitStagesDone(uid) { return STAGES.filter((s) => stageDone(uid, s.id)).length; }

export function isUnlocked(uid) {
  if (state.settings.unlockAll) return true;
  const units = BUILTIN_UNITS;
  const idx = units.findIndex((u) => u.id === uid);
  if (idx <= 0) return true;
  if (idx <= (state.settings.unlockedUpTo || 0)) return true;
  return unitPassed(units[idx - 1].id);
}

export function recordQuiz(uid, score, detail) {
  const q = prog(uid).quiz;
  const wasPassed = q.best >= passLine();
  q.history.push({ at: new Date().toISOString(), score, detail });
  if (q.history.length > 30) q.history.shift();
  q.best = Math.max(q.best, score);
  addLog('quiz', uid, score);
  let reward = 0;
  if (score >= passLine() && !wasPassed) reward += 30;
  if (score === 100) { reward += 10; addSticker(`quiz100-${uid}`); }
  if (score >= passLine()) addSticker(`quiz-${uid}`);
  addXP(reward + Math.round(score / 20));
  save();
}
export function recordRecite(uid, score, info) {
  const r = prog(uid).recite;
  const wasPassed = r.best >= passLine();
  r.history.push({ at: new Date().toISOString(), score, ...info });
  if (r.history.length > 30) r.history.shift();
  if (info.final) r.best = Math.max(r.best, score);
  addLog('recite', uid, score, info.final ? 'final' : 'practice');
  if (info.final && score >= passLine() && !wasPassed) { addXP(30); addSticker(`recite-${uid}`); }
  else addXP(Math.round(score / 25));
  save();
}

// ───────── 宠物 / 奖励 ─────────
let levelUpHandler = null;
export const onLevelUp = (fn) => { levelUpHandler = fn; };
export function petLevel(xp = state.pet.xp) {
  let lv = 0;
  PET_LEVELS.forEach((l, i) => { if (xp >= l.xp) lv = i; });
  return lv;
}
export function addXP(n) {
  if (!n) return;
  const before = petLevel();
  state.pet.xp += n;
  state.pet.acorns += Math.max(1, Math.round(n / 3));
  const after = petLevel();
  save();
  if (after > before && levelUpHandler) levelUpHandler(after);
}
export function feedPet() {
  if (state.pet.acorns < 3) return false;
  state.pet.acorns -= 3;
  state.pet.mood = Math.min(100, state.pet.mood + 15);
  state.pet.lastFed = new Date().toISOString();
  save();
  return true;
}
export function addSticker(id) {
  if (!state.stickers.includes(id)) { state.stickers.push(id); save(); return true; }
  return false;
}

// ───────── 日志 / 学习时长 ─────────
export function addLog(type, uid, score = null, extra = null) {
  state.log.push({ at: new Date().toISOString(), type, uid, score, extra });
  if (state.log.length > 800) state.log.splice(0, state.log.length - 800);
}
export function tickDaily(sec) {
  const d = today();
  if (state.daily.date !== d) {
    state.daily.history[state.daily.date] = state.daily.sec;
    state.daily.date = d; state.daily.sec = 0;
    // 宠物心情每天自然下降一点，喂一喂就好
    state.pet.mood = Math.max(30, state.pet.mood - 10);
  }
  state.daily.sec += sec;
  save();
}
export const usedMinToday = () => Math.floor((state.daily.date === today() ? state.daily.sec : 0) / 60);

// ───────── 作品墙 ─────────
export function addWork(w) {
  state.works.unshift({ id: 'w' + Date.now(), at: new Date().toISOString(), ...w });
  if (state.works.length > 60) state.works.pop();
  save();
}

// ───────── 导入 / 导出 ─────────
export function exportAll() { return JSON.stringify(state, null, 2); }
export function exportContent() {
  return JSON.stringify({ type: 'squirrel-english-content', v: 1, custom: state.custom }, null, 2);
}
export function importJSON(text) {
  const data = JSON.parse(text);
  if (data.type === 'squirrel-english-content') {
    for (const [uid, c] of Object.entries(data.custom || {})) {
      const t = customOf(uid);
      for (const k of ['words', 'sentences', 'recite', 'quiz']) if (Array.isArray(c[k])) t[k].push(...c[k]);
    }
    save(true);
    return '内容池已导入';
  }
  if (data.v === 1 && data.progress) {
    state = { ...defaults(), ...data };
    save(true);
    return '全部数据已恢复';
  }
  throw new Error('无法识别的文件格式');
}
export function resetProgress() {
  const keep = { custom: state.custom, settings: state.settings, profile: state.profile };
  state = { ...defaults(), ...keep };
  save(true);
}

// ───────── 录音（IndexedDB）─────────
let dbp = null;
function db() {
  if (!dbp) {
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open('squirrel-english-audio', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('audio');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbp;
}
export async function putAudio(key, blob) {
  try {
    const d = await db();
    await new Promise((res, rej) => {
      const tx = d.transaction('audio', 'readwrite');
      tx.objectStore('audio').put(blob, key);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
    return true;
  } catch (e) { console.warn('putAudio', e); return false; }
}
export async function getAudio(key) {
  try {
    const d = await db();
    return await new Promise((res, rej) => {
      const r = d.transaction('audio').objectStore('audio').get(key);
      r.onsuccess = () => res(r.result || null); r.onerror = () => rej(r.error);
    });
  } catch { return null; }
}
export async function delAudio(key) {
  try {
    const d = await db();
    d.transaction('audio', 'readwrite').objectStore('audio').delete(key);
  } catch { /* ignore */ }
}
/** 保存一条录音并登记，超过上限自动删最旧的 */
export async function saveRecording(meta, blob) {
  if (!blob) return null;
  const key = `${meta.kind}-${meta.uid}-${Date.now()}`;
  if (!(await putAudio(key, blob))) return null;
  state.recordings.unshift({ key, at: new Date().toISOString(), ...meta });
  while (state.recordings.length > 80) {
    const old = state.recordings.pop();
    delAudio(old.key);
  }
  save();
  return key;
}
