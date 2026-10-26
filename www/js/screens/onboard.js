// 第一次打开：起名字、给小松鼠起名、告诉我学校学到第几单元、试试声音和话筒
import { h, toast } from '../util.js';
import { S, save, getUnits } from '../store.js';
import { speak, ttsStatus, openTtsInstall } from '../speech.js';
import { petFace, micButton } from '../ui.js';

export function render(root) {
  const st = S();
  let step = 0;
  const box = h('div.onboard');
  root.appendChild(box);
  const units = getUnits();
  const data = { name: st.profile.name || '', pet: st.profile.petName || '松果', upto: st.settings.unlockedUpTo || 0 };

  const steps = [
    () => h('div.ob-step',
      petFace(0, 'xl'),
      h('h1', '欢迎来到松鼠英语岛！'),
      h('p', '我是一只小松鼠，会陪你一起闯过 11 座英语小岛。'),
      h('label', '你的名字（中文或英文都可以）'),
      h('input.inp', { value: data.name, placeholder: '比如：路恒 / Leo', oninput: (e) => { data.name = e.target.value.trim(); } }),
      h('label', '给我起个名字吧'),
      h('input.inp', { value: data.pet, oninput: (e) => { data.pet = e.target.value.trim() || '松果'; } }),
      h('button.btn.big', { onclick: () => { if (!data.name) return toast('先写下你的名字哦'); next(); } }, '下一步 →'),
    ),
    () => h('div.ob-step',
      h('h1', '📚 学校里现在学到哪一课了？'),
      h('p.muted', '之前的岛屿会直接打开，你可以从现在学的这一课开始，也可以回头复习。（家长以后也能在家长中心里修改）'),
      h('div.unit-pick', units.map((u, i) => h('button.choice' + (data.upto === i ? '.right' : ''), {
        onclick: (e) => { data.upto = i; [...e.currentTarget.parentNode.children].forEach((c) => c.classList.remove('right')); e.currentTarget.classList.add('right'); },
      }, `${u.icon} ${u.no ? 'Unit ' + u.no : 'Starter'} ${u.title}`))),
      h('button.btn.big', { onclick: next }, '下一步 →'),
    ),
    () => {
      const ttsInfo = h('p.muted', '正在检查英文发音……');
      ttsStatus().then((s) => {
        ttsInfo.innerHTML = '';
        if (s.ok) ttsInfo.append('✅ 英文发音正常。');
        else {
          ttsInfo.append('⚠️ 平板上还没有英文发音引擎，请家长按"家长中心 → 帮助"里的说明安装（一次即可）。 ');
          if (s.engine === 'native') ttsInfo.append(h('button.btn.small', { onclick: openTtsInstall }, '打开语音数据安装'));
        }
      });
      return h('div.ob-step',
        h('h1', '🔊 试试声音和话筒'),
        h('button.btn.big', { onclick: () => speak(`Hello ${data.name}! I am ${data.pet}. Let's learn English together!`) }, '🔊 听小松鼠打招呼'),
        ttsInfo,
        h('p', '点下面的话筒，说一句：', h('b', 'Hello, I am ready!')),
        micButton({ target: 'Hello, I am ready!', onResult: (r) => { if (r.score != null) toast(`得分 ${r.score}！话筒工作正常`); } }),
        h('button.btn.big', { onclick: finish }, '开始冒险！🚀'),
      );
    },
  ];
  function show() { box.innerHTML = ''; box.appendChild(steps[step]()); }
  function next() { step++; show(); }
  function finish() {
    st.profile.name = data.name;
    st.profile.petName = data.pet;
    st.profile.onboarded = true;
    st.settings.unlockedUpTo = data.upto;
    save(true);
    location.hash = '#/';
  }
  show();
}
