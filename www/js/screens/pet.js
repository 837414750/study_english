// 我的松鼠：等级、经验、心情、喂松果、装备
import { h, pick, confetti } from '../util.js';
import { S, PET_LEVELS, petLevel, feedPet, save } from '../store.js';
import { topbar, petFace } from '../ui.js';
import { speak } from '../speech.js';
import { fx } from '../audiofx.js';

const TALK = [
  ['I love acorns!', '我最爱松果！'], ["Let's read a story!", '我们去读故事吧！'], ['You are my best friend.', '你是我最好的朋友。'],
  ['How beautiful the leaves are!', '树叶多美啊！'], ['What time is it? Time to learn!', '几点了？学习时间到！'],
  ['We should always tell the truth.', '我们应该一直说实话。'], ["It's a sunny day!", '今天是晴天！'], ['Can you jump like me?', '你能像我一样跳吗？'],
];

export function render(root) {
  const st = S();
  root.appendChild(topbar(`🐿️ ${st.profile.petName}`, { back: '#/' }));
  const body = h('div.stage-body.pet-page');
  root.appendChild(body);
  const draw = () => {
    body.innerHTML = '';
    const lv = petLevel();
    const cur = PET_LEVELS[lv], nxt = PET_LEVELS[lv + 1];
    const pet = petFace(lv, 'xl');
    const bubble = h('div.bubble.big', '点我聊天吧！');
    pet.onclick = () => { const [en, cn] = pick(TALK); bubble.innerHTML = ''; bubble.append(h('b', en), h('br'), h('small', cn)); speak(en, { pitch: 1.3 }); pet.classList.add('jump'); setTimeout(() => pet.classList.remove('jump'), 600); };
    const pct = nxt ? Math.round(((st.pet.xp - cur.xp) / (nxt.xp - cur.xp)) * 100) : 100;
    body.append(
      h('div.pet-stage', pet, bubble),
      h('h2.center', `Lv.${lv + 1} ${cur.name}`),
      h('div.meter', h('span', '经验'), h('div.bar', h('i', { style: { width: pct + '%' } })), h('b', nxt ? `${st.pet.xp}/${nxt.xp}` : 'MAX')),
      h('div.meter', h('span', '心情'), h('div.bar.mood', h('i', { style: { width: st.pet.mood + '%' } })), h('b', st.pet.mood >= 70 ? '😊' : st.pet.mood >= 45 ? '🙂' : '🥺')),
      h('div.center', h('button.btn.big', {
        onclick: () => {
          if (feedPet()) { fx.ding(); confetti(['🌰'], 14); speak('Yummy! Thank you!', { pitch: 1.3 }); draw(); }
          else { fx.buzz(); bubble.textContent = '松果不够啦～ 去学习就能赚松果！'; }
        },
      }, `🌰 喂松果（还有 ${st.pet.acorns} 个，每次 3 个）`)),
      h('h3', '🎁 成长之路'),
      h('div.level-road', PET_LEVELS.map((l, i) => h('div.lv' + (i <= lv ? '.on' : ''), petFace(i, 'sm'), h('b', l.name), h('small', `${l.xp} 经验`)))),
      h('p.muted.center', '学单词、闯关卡、测验、背诵、复习都会获得经验和松果。'),
    );
  };
  draw();
  save();
}
