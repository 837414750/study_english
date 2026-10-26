// 跟读 / 背诵打分：把识别结果和原文逐词对齐，按"完整度 50 + 准确度 30 + 流利度 20"打分。
// 纯函数，无 DOM 依赖，可在 Node 里单元测试（scripts/selftest.mjs）。

const CONTRACTIONS = {
  "it's": 'it is', "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
  "he's": 'he is', "she's": 'she is', "that's": 'that is', "there's": 'there is', "what's": 'what is',
  "how's": 'how is', "where's": 'where is', "who's": 'who is', "let's": 'let us', "isn't": 'is not',
  "aren't": 'are not', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "can't": 'can not',
  "cannot": 'can not', "won't": 'will not', "shouldn't": 'should not', "wasn't": 'was not', "i'll": 'i will',
  "you'll": 'you will', "we'll": 'we will', "i've": 'i have', "we've": 'we have', "o'clock": 'oclock',
};
const ABBR = { mr: 'mister', mrs: 'missus', ms: 'miss', ok: 'okay', 'o.k.': 'okay' };

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
export function numberToWords(n) {
  n = Number(n);
  if (!Number.isFinite(n) || n < 0 || n > 9999) return String(n);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numberToWords(n % 100) : '');
  return numberToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numberToWords(n % 1000) : '');
}

/** 把一段文字变成规范化的词数组 */
export function normalize(text) {
  if (!text) return [];
  let t = String(text).toLowerCase().replace(/[’‘`´]/g, "'");
  t = t.replace(/\bo\s+clock\b/g, 'oclock');
  t = t.replace(/(\d+):(\d\d)/g, (_, a, b) => `${numberToWords(+a)} ${+b ? numberToWords(+b) : ''}`);
  t = t.replace(/-?\d+/g, (m) => (m.startsWith('-') ? 'minus ' : '') + numberToWords(Math.abs(+m)));
  t = t.replace(/[-–—/]/g, ' ');
  const out = [];
  for (let w of t.split(/\s+/)) {
    w = w.replace(/^[^a-z']+|[^a-z'.]+$/g, '').replace(/\.+$/, '');
    if (!w) continue;
    if (CONTRACTIONS[w]) { out.push(...CONTRACTIONS[w].split(' ')); continue; }
    if (ABBR[w]) { out.push(ABBR[w]); continue; }
    w = w.replace(/[^a-z]/g, '');
    if (!w || w === 'unk') continue;
    out.push(w);
  }
  return out;
}

function editDistance(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** 两个词的相似度：1 完全一样；0.8 只差复数/时态尾巴；0.7 发音接近；0 不同 */
export function wordSim(a, b) {
  if (a === b) return 1;
  const stem = (w) => w.replace(/(es|s|ed|ing)$/, '');
  if (a.length > 2 && b.length > 2 && stem(a) === stem(b)) return 0.8;
  const L = Math.max(a.length, b.length);
  if (L >= 4 && 1 - editDistance(a, b) / L >= 0.75) return 0.7;
  return 0;
}

/**
 * 编辑距离对齐：返回 target 每个词对应的 hyp 下标（或 -1）以及相似度。
 */
export function align(target, hyp) {
  const m = target.length, n = hyp.length;
  const D = Array.from({ length: m + 1 }, () => new Float64Array(n + 1));
  const B = Array.from({ length: m + 1 }, () => new Uint8Array(n + 1)); // 0 diag 1 up(del) 2 left(ins)
  for (let i = 1; i <= m; i++) { D[i][0] = i; B[i][0] = 1; }
  for (let j = 1; j <= n; j++) { D[0][j] = j; B[0][j] = 2; }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const s = wordSim(target[i - 1], hyp[j - 1]);
      const diag = D[i - 1][j - 1] + (s >= 0.7 ? 1 - s : 1.15);
      const up = D[i - 1][j] + 1;
      const left = D[i][j - 1] + 1;
      if (diag <= up && diag <= left) { D[i][j] = diag; B[i][j] = 0; }
      else if (up <= left) { D[i][j] = up; B[i][j] = 1; }
      else { D[i][j] = left; B[i][j] = 2; }
    }
  }
  const map = new Array(m).fill(-1);
  const sim = new Array(m).fill(0);
  let i = m, j = n, inserts = 0;
  while (i > 0 || j > 0) {
    const b = B[i][j];
    if (i > 0 && j > 0 && b === 0) {
      const s = wordSim(target[i - 1], hyp[j - 1]);
      if (s >= 0.7) { map[i - 1] = j - 1; sim[i - 1] = s; }
      i--; j--;
    } else if (i > 0 && (j === 0 || b === 1)) { i--; }
    else { inserts++; j--; }
  }
  return { map, sim, inserts };
}

/** 识别结果 → 规范化词表（带置信度与时间戳） */
export function hypTokens(result) {
  const out = [];
  if (result?.words?.length) {
    for (const w of result.words) {
      for (const t of normalize(w.word)) out.push({ t, conf: w.conf ?? null, start: w.start ?? null, end: w.end ?? null });
    }
  } else {
    for (const t of normalize(result?.text || '')) out.push({ t, conf: null, start: null, end: null });
  }
  return out;
}

/** 把原文切成"显示用的词"，每个显示词对应若干规范化词 */
export function displayTokens(text) {
  const parts = String(text).split(/\s+/).filter(Boolean);
  const res = [];
  let idx = 0;
  for (const p of parts) {
    const norm = normalize(p);
    res.push({ text: p, from: idx, to: idx + norm.length });
    idx += norm.length;
  }
  return res;
}

const clamp01 = (x) => Math.max(0, Math.min(1, x));

/**
 * 背诵 / 朗读打分
 * @param {string|string[]} target 原文（句子数组或整段）
 * @param {{text:string, words?:Array, duration?:number}} result 识别结果
 * @returns {{total, completeness, accuracy, fluency, display:[{text,status}], sentences:[{text,score}]}}
 */
export function scoreReading(target, result, opts = {}) {
  const sentences = Array.isArray(target) ? target : [target];
  const fullText = sentences.join(' ');
  const tgt = normalize(fullText);
  const hyp = hypTokens(result);
  const N = tgt.length || 1;
  const { map, sim, inserts } = align(tgt, hyp.map((x) => x.t));

  // 完整度
  let credit = 0;
  const status = tgt.map((_, i) => {
    if (map[i] < 0) return 'miss';
    credit += sim[i] >= 1 ? 1 : sim[i];
    return sim[i] >= 1 ? 'ok' : 'close';
  });
  let compRatio = credit / N;
  const extra = Math.max(0, inserts - Math.ceil(N * 0.25));
  compRatio = clamp01(compRatio - Math.min(0.1, extra * 0.02));

  // 准确度：相似度 + 识别置信度
  const matched = map.map((j, i) => ({ j, s: sim[i] })).filter((x) => x.j >= 0);
  const meanSim = matched.length ? matched.reduce((a, x) => a + x.s, 0) / matched.length : 0;
  const confs = matched.map((x) => hyp[x.j].conf).filter((c) => typeof c === 'number');
  const confFactor = confs.length ? clamp01((confs.reduce((a, c) => a + c, 0) / confs.length - 0.3) / 0.55) : 0.9;
  const accRatio = matched.length ? 0.6 * meanSim + 0.4 * confFactor : 0;

  // 流利度：语速 + 长停顿
  let fluRatio = 0.85;
  const timed = hyp.filter((x) => typeof x.start === 'number');
  let span = null;
  if (timed.length >= 2) span = timed[timed.length - 1].end - timed[0].start;
  else if (result?.duration) span = Math.max(1, result.duration - 0.8);
  if (span && matched.length) {
    const wpm = matched.length / (span / 60);
    if (wpm < 40) fluRatio = 0.45 + (wpm / 40) * 0.2;
    else if (wpm < 80) fluRatio = 0.65 + ((wpm - 40) / 40) * 0.35;
    else if (wpm <= 190) fluRatio = 1;
    else fluRatio = 0.85;
    let longPauses = 0;
    for (let k = 1; k < timed.length; k++) if (timed[k].start - timed[k - 1].end > 1.6) longPauses++;
    fluRatio = clamp01(fluRatio - longPauses * 0.1);
  }
  const gate = Math.pow(compRatio, 1.5);
  const completeness = Math.round(50 * compRatio);
  const accuracy = Math.round(30 * accRatio * gate);
  const fluency = Math.round(20 * fluRatio * gate);
  const total = Math.min(100, completeness + accuracy + fluency);

  // 显示与分句得分
  const display = [];
  const sentenceScores = [];
  let offset = 0;
  for (const s of sentences) {
    const toks = displayTokens(s);
    let got = 0, cnt = 0;
    for (const d of toks) {
      const parts = status.slice(offset + d.from, offset + d.to);
      let st = 'ok';
      if (!parts.length) st = 'ok';
      else if (parts.every((p) => p === 'miss')) st = 'miss';
      else if (parts.some((p) => p !== 'ok')) st = 'close';
      parts.forEach((p) => { cnt++; got += p === 'ok' ? 1 : p === 'close' ? 0.7 : 0; });
      display.push({ text: d.text, status: st });
    }
    offset += toks.length ? toks[toks.length - 1].to : 0;
    display.push({ br: true });
    sentenceScores.push({ text: s, score: cnt ? Math.round((got / cnt) * 100) : 100 });
  }
  display.pop();
  return { total, completeness, accuracy, fluency, display, sentences: sentenceScores, heard: result?.text || '' };
}

/** 单句跟读打分（0~100），不计流利度 */
export function scoreSentence(target, result) {
  const r = scoreReading([target], result);
  const comp = r.completeness / 50;
  const acc = r.accuracy / 30;
  return { score: Math.round(100 * (0.75 * comp + 0.25 * acc)), display: r.display, heard: r.heard };
}

/**
 * 对话意图匹配：孩子说的话里只要包含任一关键词组（模糊匹配），或与示范句足够像，就算通过。
 */
export function matchExpect(heard, expect = [], models = []) {
  const hyp = normalize(heard);
  if (!hyp.length) return { ok: false, score: 0 };
  const hasPhrase = (phrase) => {
    const p = normalize(phrase);
    if (!p.length) return false;
    for (let s = 0; s < hyp.length; s++) {
      let k = 0;
      while (k < p.length && s + k < hyp.length && wordSim(p[k], hyp[s + k]) >= 0.7) k++;
      if (k === p.length) return true;
    }
    return false;
  };
  const hit = expect.some(hasPhrase);
  let best = 0, bestModel = models[0] || '';
  for (const m of models) {
    const s = scoreSentence(m, { text: heard }).score;
    if (s > best) { best = s; bestModel = m; }
  }
  return { ok: (hit && (hyp.length >= 2 || best >= 40)) || best >= 65, score: Math.max(best, hit ? 70 : 0), bestModel };
}

/** 把一组句子里出现的词汇做成识别语法（限制词表能大幅提升儿童识别准确率） */
const COMMON = 'a an the i you he she it we they is are am was do does not no yes and but or to of in on at for with my your his her our their this that what who how where when can like have has go come see look good nice ok okay oh um uh well very so too please thank thanks hello hi bye one two three four five six seven eight nine ten'.split(' ');
export function buildGrammar(texts) {
  const set = new Set(COMMON);
  for (const t of [].concat(texts)) for (const w of normalize(t)) set.add(w === 'oclock' ? "o'clock" : w);
  return [...set].filter((w) => /^[a-z']+$/.test(w)).concat(['[unk]']);
}
