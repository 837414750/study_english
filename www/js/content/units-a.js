// 松鼠英语岛 · 原创学习内容（Starter ~ Unit 5）
// 依据：上海教育出版社 2024 版《英语》四年级上册 各单元主题、话题词、句型与语音点。
// 所有对话、歌谣、故事、背诵短文均为原创，未摘录课本原文。
// 约定：所有选择题 options[0] 为正确答案，运行时会自动打乱顺序。

export const UNITS_A = [
  // ───────────────────────────── Starter ─────────────────────────────
  {
    id: 'starter', no: 0, title: 'Starter', cn: '开学热身营', island: '热身营地', icon: '⛺', color: '#7BAE5A',
    words: [
      { en: 'teacher', cn: '老师', e: '👩‍🏫' },
      { en: 'friend', cn: '朋友', e: '🧑‍🤝‍🧑' },
      { en: 'family', cn: '家庭', e: '👨‍👩‍👧' },
      { en: 'school bag', cn: '书包', e: '🎒' },
      { en: 'Monday', cn: '星期一', e: '周一' },
      { en: 'Wednesday', cn: '星期三', e: '周三' },
      { en: 'Friday', cn: '星期五', e: '周五' },
      { en: 'Sunday', cn: '星期日', e: '周日' },
      { en: 'twenty', cn: '二十', e: '20' },
      { en: 'fifty', cn: '五十', e: '50' },
      { en: 'a hundred', cn: '一百', e: '100' },
    ],
    grammar: {
      title: '星期、数字和介绍别人',
      points: [
        { rule: '问星期：What day is it today? —— It\'s Monday.', tip: '星期的首字母永远大写哦！' },
        { rule: '介绍别人：This is my teacher, Miss Wang.', tip: 'This is ... 用来介绍身边的人。' },
        { rule: '问数量：How many students are there? —— There are forty.', tip: '整十数：twenty, thirty, forty, fifty …… 都以 -ty 结尾。' },
      ],
    },
    chant: {
      title: 'Seven Days Chant',
      lines: [
        'Monday, Tuesday, clap, clap, clap!',
        'Wednesday, Thursday, tap, tap, tap!',
        'Friday is fun, Saturday is play,',
        'Sunday, Sunday, a family day!',
      ],
      cn: ['星期一、星期二，拍拍手！', '星期三、星期四，跺跺脚！', '星期五真有趣，星期六去玩耍，', '星期日、星期日，家庭团聚日！'],
    },
    dialogue: {
      title: 'Back to School', cn: '开学第一天', scene: '🏫', bot: 'Robo 同学',
      turns: [
        { bot: 'Good morning! Welcome back to school!', cn: '早上好！欢迎回到学校！', kid: ['Good morning! Nice to see you again.'], expect: ['morning', 'nice', 'hello', 'hi'] },
        { bot: 'What day is it today?', cn: '今天星期几？', kid: ["It's Monday.", "It's Friday."], expect: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
        { bot: 'Who is your English teacher?', cn: '谁是你的英语老师？', kid: ['Miss Wang is my English teacher.'], expect: ['teacher', 'miss', 'mister', 'mrs'] },
        { bot: 'How many students are there in your class?', cn: '你们班有多少学生？', kid: ['There are forty students.'], expect: ['there are', 'twenty', 'thirty', 'forty', 'fifty', 'students'] },
        { bot: "Let's have a great new term!", cn: '让我们度过一个精彩的新学期吧！', kid: ["Yes! Let's study hard!"], expect: ['yes', 'study', 'great', 'ok'] },
      ],
    },
    game: {
      type: 'speed', title: '热身快反应', cn: '听到什么，就最快点什么！',
      items: [
        { say: 'Monday', show: '周一' }, { say: 'Tuesday', show: '周二' }, { say: 'Wednesday', show: '周三' },
        { say: 'Thursday', show: '周四' }, { say: 'Friday', show: '周五' }, { say: 'Saturday', show: '周六' },
        { say: 'Sunday', show: '周日' }, { say: 'twenty', show: '20' }, { say: 'thirty-five', show: '35' },
        { say: 'forty-eight', show: '48' }, { say: 'fifty', show: '50' }, { say: 'sixty-two', show: '62' },
        { say: 'seventy', show: '70' }, { say: 'eighty-one', show: '81' }, { say: 'ninety-nine', show: '99' },
        { say: 'a hundred', show: '100' }, { say: 'fifteen', show: '15' }, { say: 'fifty-five', show: '55' },
      ],
    },
    sound: {
      title: '短元音复习', key: 'a  e  i  o  u', mark: ['a', 'e', 'i', 'o', 'u'],
      words: ['cat', 'bed', 'pig', 'dog', 'bus', 'hat', 'red', 'sit'],
      tongue: 'A fat cat sits on a red bed.',
      odd: { q: '哪个单词里的 a 读 /æ/（像 cat）？', options: ['hat', 'hot', 'hut'] },
    },
    story: {
      title: 'A New Term for Sunny', cn: '小松鼠桑尼的新学期',
      pages: [
        { e: '🐿️🌳🏫', en: 'Sunny is a little squirrel.', cn: '桑尼是一只小松鼠。' },
        { e: '🎒😊', en: "Today is Monday. It's the first day of the new term.", cn: '今天是星期一，是新学期的第一天。' },
        { e: '🦉📚', en: 'His teacher is Mr Owl. He is kind and clever.', cn: '他的老师是猫头鹰先生，他又和蔼又聪明。' },
        { e: '🐰🐻🦊', en: 'There are twenty animals in his class.', cn: '他的班上有二十只小动物。' },
        { e: '🐿️🐰', en: "Sunny has a new friend. She is Rabbit Rosy.", cn: '桑尼交了一个新朋友，她是兔子罗茜。' },
        { e: '📅✨', en: '"We have English every day!" says Rosy.', cn: '"我们每天都有英语课！"罗茜说。' },
        { e: '🐿️❤️', en: 'Sunny loves his new term.', cn: '桑尼很喜欢他的新学期。' },
      ],
      questions: [
        { q: 'What day is the first day of the new term?', cn: '新学期第一天是星期几？', options: ['Monday', 'Friday', 'Sunday'] },
        { q: 'Who is Sunny\'s teacher?', cn: '谁是桑尼的老师？', options: ['Mr Owl', 'Rabbit Rosy', 'Miss Bear'] },
        { q: 'How many animals are there in his class?', cn: '他班上有多少只动物？', options: ['twenty', 'twelve', 'thirty'] },
      ],
    },
    project: {
      title: 'All About Me', cn: '我的自我介绍卡',
      slots: {
        name: '#input:你的英文名或拼音名',
        teacher: ['Miss Wang', 'Miss Li', 'Mr Zhang', 'Mrs Chen'],
        day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        subject: ['English', 'Maths', 'PE', 'Art', 'Music'],
      },
      lines: ['Hello! My name is {name}.', 'I am in Grade Four.', 'My English teacher is {teacher}.', 'My favourite day is {day}.', 'I have {subject} on that day.', 'Nice to meet you!'],
    },
    quiz: {
      grammar: [
        { q: "—What day is it today? —It's ____.", options: ['Monday', 'morning', 'May'] },
        { q: 'There ____ forty students in our class.', options: ['are', 'is', 'am'] },
        { q: '15 + 5 = ____', options: ['twenty', 'twelve', 'fifteen'] },
        { q: 'The day after Tuesday is ____.', options: ['Wednesday', 'Monday', 'Thursday'] },
        { q: '—Who is she? —She is ____ English teacher.', options: ['my', 'I', 'me'] },
        { q: 'We have English ____ Monday.', options: ['on', 'in', 'at'] },
        { q: 'There are ____ days in a week.', options: ['seven', 'six', 'five'] },
      ],
      order: ['What day is it today?', 'She is our English teacher.', 'There are forty students in my class.'],
      speak: [
        { cn: '说一说：今天星期一。', e: '📅', answer: "It's Monday today." },
        { cn: '介绍：这是我的英语老师。', e: '👩‍🏫', answer: 'This is my English teacher.' },
      ],
      reading: {
        text: "Hello, I'm Joe. I'm in Grade Four now. There are thirty-eight students in my class. Our English teacher is Miss Li. She is kind. We have English every day. My favourite day is Friday. We have PE and Art on Friday.",
        questions: [
          { q: "How many students are there in Joe's class?", options: ['thirty-eight', 'thirty', 'forty-eight'] },
          { q: "What is Joe's favourite day?", options: ['Friday', 'Monday', 'Sunday'] },
        ],
      },
    },
    recite: {
      title: 'Back to School',
      text: ["Hello! I'm back at school.", "I'm in Grade Four now.", 'This is my classroom.', 'There are forty students in my class.', 'Our English teacher is Miss Wang.', 'She is kind and helpful.', 'We have English from Monday to Friday.', 'I love my new term!'],
    },
  },

  // ───────────────────────────── Unit 1 My school ─────────────────────────────
  {
    id: 'u1', no: 1, title: 'My school', cn: '我的学校', island: '校园岛', icon: '🏫', color: '#E8913A',
    words: [
      { en: 'classroom', cn: '教室', e: '🪑' },
      { en: 'sports field', cn: '运动场', e: '⚽' },
      { en: 'hall', cn: '礼堂', e: '🎭' },
      { en: 'library', cn: '图书馆', e: '📚' },
      { en: 'computer room', cn: '电脑房', e: '💻' },
      { en: 'school building', cn: '教学楼', e: '🏫' },
      { en: 'art room', cn: '美术室', e: '🎨' },
      { en: 'music room', cn: '音乐室', e: '🎵' },
      { en: 'garden', cn: '花园', e: '🌷' },
    ],
    grammar: {
      title: 'have no = don\'t have any；There is / There are',
      points: [
        { rule: 'Our school has a big library.  我们学校有一个大图书馆。', tip: '"我们学校"是一个整体，用 has。' },
        { rule: 'We have no swimming pool. = We don\'t have any swimming pool.', tip: 'have no 后面直接加名词；don\'t have any 意思一样。' },
        { rule: 'There is a hall. / There are two computer rooms.', tip: '一个用 is，两个及以上用 are。' },
      ],
    },
    chant: {
      title: 'Come to My School',
      lines: [
        'Come to my school, come and see,',
        'A library with books for you and me.',
        'An art room, a hall, a field so wide,',
        'No swimming pool, but we play outside!',
      ],
      cn: ['来我的学校，来看看，', '图书馆里有书给你也给我。', '美术室、礼堂、宽宽的运动场，', '没有游泳池，但我们在户外玩！'],
    },
    dialogue: {
      title: "Let's Meet There", cn: '带新同学参观校园', scene: '🏫🚶', bot: '新同学 Robo',
      turns: [
        { bot: "Hi! I'm new here. Is this your school?", cn: '嗨！我是新来的。这是你的学校吗？', kid: ['Yes, it is. Welcome to our school!'], expect: ['yes', 'welcome'] },
        { bot: 'Does your school have a library?', cn: '你们学校有图书馆吗？', kid: ['Yes. Our school has a big library.'], expect: ['library', 'yes', 'has'] },
        { bot: 'Can we swim at school?', cn: '我们能在学校游泳吗？', kid: ['No. We have no swimming pool.', "No. We don't have any swimming pool."], expect: ['no', 'swimming', 'pool', "don't"] },
        { bot: "What's your favourite place in the school?", cn: '学校里你最喜欢哪里？', kid: ['My favourite place is the art room.', 'My favourite place is the library.'], expect: ['favourite', 'room', 'library', 'field', 'hall', 'garden'] },
        { bot: "Cool! Let's meet there after class.", cn: '酷！下课后我们在那儿见吧。', kid: ['OK! See you there.'], expect: ['ok', 'see', 'great', 'sure'] },
      ],
    },
    game: {
      type: 'treasure', title: '校园寻宝', cn: '点开每个宝箱：学校里有它吗？选出正确的句子！',
      items: [
        { e: '📚', en: 'library', has: true }, { e: '💻', en: 'computer room', has: true },
        { e: '🎨', en: 'art room', has: true }, { e: '⚽', en: 'sports field', has: true },
        { e: '🏊', en: 'swimming pool', has: false }, { e: '🎬', en: 'cinema', has: false },
        { e: '🌷', en: 'garden', has: true }, { e: '🐄', en: 'farm', has: false },
        { e: '🎭', en: 'hall', has: true },
      ],
    },
    sound: {
      title: '字母 w 的发音 /w/', key: 'window', mark: ['w', 'wh'],
      words: ['we', 'wet', 'water', 'window', 'wind', 'wolf', 'swim', 'sweet'],
      tongue: 'Will the wet wolf walk with Wendy?',
      odd: { q: '哪个单词含有 /w/ 音？', options: ['window', 'bird', 'pen'] },
    },
    story: {
      title: 'A School on a Boat', cn: '船上的学校',
      pages: [
        { e: '🌊🚤🏫', en: 'Far away, there is a school on a boat.', cn: '在很远的地方，有一所建在船上的学校。' },
        { e: '🏝️🧒', en: 'The children live near the river. There is no road.', cn: '孩子们住在河边，那里没有公路。' },
        { e: '🚤🌅', en: 'Every morning, the boat school comes to them.', cn: '每天早上，船上学校会开到他们身边。' },
        { e: '📚🪑', en: 'The boat has a small classroom and a little library.', cn: '船上有一间小教室和一个小小的图书馆。' },
        { e: '🙅⚽', en: 'It has no sports field. But the children are happy.', cn: '船上没有运动场，但孩子们很开心。' },
        { e: '🧒📖😊', en: 'They read, sing and learn English on the water.', cn: '他们在水上读书、唱歌、学英语。' },
        { e: '💛', en: 'A school can be big or small. It can even be a boat!', cn: '学校可以大，也可以小，甚至可以是一条船！' },
      ],
      questions: [
        { q: 'Where is the school?', cn: '这所学校在哪里？', options: ['On a boat', 'On a hill', 'In a city'] },
        { q: 'Does the boat school have a sports field?', cn: '船上学校有运动场吗？', options: ["No, it doesn't.", 'Yes, it does.'] },
        { q: 'What does the boat have?', cn: '船上有什么？', options: ['A classroom and a library', 'A hall and a garden', 'A swimming pool'] },
      ],
    },
    project: {
      title: 'My Favourite Place in the School', cn: '我最喜欢的校园角落',
      slots: {
        place: ['library', 'art room', 'sports field', 'music room', 'computer room', 'garden'],
        adj1: ['big', 'small', 'clean', 'bright'],
        adj2: ['beautiful', 'quiet', 'fun', 'nice'],
        act: ['read books', 'draw pictures', 'play football', 'sing songs', 'use computers', 'look at the flowers'],
      },
      lines: ['My favourite place in the school is the {place}.', 'It is {adj1} and {adj2}.', 'I can {act} there.', 'I like it very much!'],
    },
    quiz: {
      grammar: [
        { q: 'Our school ____ a big library.', options: ['has', 'have', 'is'] },
        { q: "We have no pool. = We ____ any pool.", options: ["don't have", 'have', 'are'] },
        { q: 'There ____ three computer rooms in our school.', options: ['are', 'is', 'am'] },
        { q: 'There ____ a hall in our school.', options: ['is', 'are', 'have'] },
        { q: '—Is this your classroom? —Yes, ____.', options: ['it is', "it isn't", 'I am'] },
        { q: 'We can read books in the ____.', options: ['library', 'sports field', 'garden'] },
        { q: 'We play football on the ____.', options: ['sports field', 'library', 'computer room'] },
      ],
      order: ['Our school has a big library.', 'We have no swimming pool.', 'My favourite place is the art room.'],
      speak: [
        { cn: '说一说：我们学校有一个大图书馆。', e: '📚', answer: 'Our school has a big library.' },
        { cn: '说一说：我们没有游泳池。', e: '🏊🙅', answer: 'We have no swimming pool.' },
      ],
      reading: {
        text: "Hello! I'm Lily. My school is not very big, but it is beautiful. It has a library, an art room and a small sports field. We have no swimming pool. I like the art room best. I draw pictures there with my friends.",
        questions: [
          { q: "Does Lily's school have a swimming pool?", options: ["No, it doesn't.", 'Yes, it does.'] },
          { q: "What is Lily's favourite place?", options: ['the art room', 'the library', 'the sports field'] },
        ],
      },
    },
    recite: {
      title: 'Welcome to My School',
      text: ['Welcome to my school!', 'It is big and beautiful.', 'There is a library in our school.', 'There are two computer rooms too.', 'We have no swimming pool, but we have a big sports field.', 'My favourite place is the art room.', 'I like my school very much.'],
    },
  },

  // ───────────────────────────── Unit 2 My classmates ─────────────────────────────
  {
    id: 'u2', no: 2, title: 'My classmates', cn: '我的同学', island: '伙伴岛', icon: '🧑‍🤝‍🧑', color: '#E86A6A',
    words: [
      { en: 'classmate', cn: '同学', e: '🧑‍🎓' },
      { en: 'lovely', cn: '可爱的', e: '🥰' },
      { en: 'different', cn: '不同的', e: '🔀' },
      { en: 'great', cn: '很棒的', e: '👍' },
      { en: 'interesting', cn: '有趣的', e: '🤩' },
      { en: 'helpful', cn: '乐于助人的', e: '🤝' },
      { en: 'kind', cn: '友善的', e: '💗' },
      { en: 'funny', cn: '好笑的', e: '😂' },
      { en: 'clever', cn: '聪明的', e: '💡' },
    ],
    grammar: {
      title: 'Who is he/she? ……help sb (to) do……',
      points: [
        { rule: '—Who is he?  —He is Tom.  / —Who is she? —She is Amy.', tip: '男生用 he，女生用 she。' },
        { rule: 'He helps me do my homework.  他帮我做作业。', tip: 'help 后面：人 + 动词原形。help me do / help me to do 都可以。' },
        { rule: 'She often helps the teacher clean the blackboard.', tip: 'he / she 作主语时，help 要加 s：helps。' },
      ],
    },
    chant: {
      title: 'We Are Different',
      lines: [
        'Tall or short, we are all great,',
        'Kind and funny, my classmate!',
        'You help me, and I help you,',
        "Different friends, but we're a team too!",
      ],
      cn: ['高也好矮也好，我们都很棒，', '友善又好笑，我的同学！', '你帮助我，我帮助你，', '虽然各不相同，但我们是一个团队！'],
    },
    dialogue: {
      title: 'Who Is He?', cn: '聊聊我的好朋友', scene: '🧑‍🤝‍🧑💬', bot: 'Robo 同学',
      turns: [
        { bot: 'Who is your best friend in the class?', cn: '班上谁是你最好的朋友？', kid: ['My best friend is Max.', 'My best friend is Amy.'], expect: ['friend', 'is', 'my'] },
        { bot: 'What is your friend like?', cn: '你的朋友是什么样的人？', kid: ['He is kind and helpful.', 'She is lovely and funny.'], expect: ['kind', 'helpful', 'funny', 'lovely', 'great', 'interesting', 'clever'] },
        { bot: 'How does your friend help you?', cn: '你的朋友怎么帮助你？', kid: ['He helps me read English.', 'She helps me do Maths.'], expect: ['help', 'helps'] },
        { bot: 'Can your friend play basketball?', cn: '你的朋友会打篮球吗？', kid: ['Yes, he can.', "No, she can't."], expect: ['yes', 'no', 'can'] },
        { bot: 'Your friend sounds great!', cn: '你的朋友听起来很棒！', kid: ['Yes! We are good friends.'], expect: ['yes', 'friend', 'great'] },
      ],
    },
    game: {
      type: 'guess', title: '猜猜他是谁', cn: 'Robo 会一条一条给线索，线索越少猜中，星星越多！',
      people: [
        { name: 'Tom', e: '👦', he: 'He', tags: ['⚽', '📏 tall'], clues: ['He is tall.', 'He can play football well.', 'He often helps me carry my bag.'] },
        { name: 'Amy', e: '👧', he: 'She', tags: ['🎤', '💇 long hair'], clues: ['She has long hair.', 'She can sing beautifully.', 'She helps the teacher water the flowers.'] },
        { name: 'Ben', e: '🧒', he: 'He', tags: ['🧮', '👓 glasses'], clues: ['He wears glasses.', 'He is good at Maths.', 'He helps me do my Maths homework.'] },
        { name: 'Kitty', e: '👩‍🦰', he: 'She', tags: ['🎨', '😂 funny'], clues: ['She is very funny.', 'She can draw well.', 'She helps me draw pictures.'] },
        { name: 'Leo', e: '👱', he: 'He', tags: ['🏀', '📏 short'], clues: ['He is short but strong.', 'He can play basketball.', 'He helps me clean the classroom.'] },
        { name: 'Mia', e: '👩', he: 'She', tags: ['📖', '💗 kind'], clues: ['She is kind and quiet.', 'She reads a lot of books.', 'She helps me read English stories.'] },
      ],
    },
    sound: {
      title: '字母 x 的发音 /ks/', key: 'fox', mark: ['x'],
      words: ['box', 'fox', 'six', 'taxi', 'mix', 'next', 'excited', 'wax'],
      tongue: 'Six foxes fix a box.',
      odd: { q: '哪个单词含有 /ks/ 音？', options: ['fox', 'fish', 'frog'] },
    },
    story: {
      title: 'Tim and the Big Race', cn: '蒂姆和大赛跑',
      pages: [
        { e: '👦🏃', en: 'Tim is my classmate. He is kind, but he runs very slowly.', cn: '蒂姆是我的同学。他很友善，但跑得很慢。' },
        { e: '🏁📢', en: 'Our school has a big race next week. Tim is worried.', cn: '下周我们学校有一场大赛跑，蒂姆很担心。' },
        { e: '👧👦🤝', en: '"Don\'t worry. We can help you!" say his classmates.', cn: '"别担心，我们能帮你！"同学们说。' },
        { e: '🌅🏃🏃', en: 'Every morning, Amy helps him run on the sports field.', cn: '每天早上，艾米帮他在运动场上练跑步。' },
        { e: '🍎💪', en: 'Ben helps him eat healthy food.', cn: '本帮他吃健康的食物。' },
        { e: '🏁🎉', en: 'On the race day, Tim runs and runs. He finishes the race!', cn: '比赛那天，蒂姆跑啊跑，他跑完了全程！' },
        { e: '👏😊', en: '"You can do it, Tim!" We are all very excited.', cn: '"你做到了，蒂姆！"我们都非常激动。' },
      ],
      questions: [
        { q: 'What is Tim like?', cn: '蒂姆是怎样的人？', options: ['He is kind.', 'He is funny.', 'He is tall.'] },
        { q: 'Who helps Tim run every morning?', cn: '每天早上谁帮蒂姆练跑步？', options: ['Amy', 'Ben', 'The teacher'] },
        { q: 'Does Tim finish the race?', cn: '蒂姆跑完比赛了吗？', options: ['Yes, he does.', "No, he doesn't."] },
      ],
    },
    project: {
      title: 'A Guessing Card', cn: '"猜猜我是谁"同学卡',
      slots: {
        p: ['He', 'She'],
        look: ['tall', 'short', 'thin', 'strong'],
        adj: ['kind', 'funny', 'helpful', 'clever', 'lovely'],
        can: ['sing', 'dance', 'draw', 'swim', 'play basketball', 'run fast'],
        help: ['read English', 'do Maths', 'clean the classroom', 'carry my bag'],
      },
      lines: ['This is my classmate.', '{p} is {look} and {adj}.', '{p} can {can} well.', '{p} often helps me {help}.', 'Guess! Who is this?'],
    },
    quiz: {
      grammar: [
        { q: '—Who is she? —____ is my classmate, Amy.', options: ['She', 'He', 'Her'] },
        { q: 'Tom often helps me ____ my homework.', options: ['do', 'does', 'doing'] },
        { q: 'Amy ____ the teacher clean the classroom.', options: ['helps', 'help', 'helping'] },
        { q: 'My friend is very ____. He always helps others.', options: ['helpful', 'different', 'sad'] },
        { q: 'We are ____. I like reading, but he likes running.', options: ['different', 'same', 'lovely'] },
        { q: '—Who is he? —He ____ Peter.', options: ['is', 'are', 'am'] },
        { q: 'She can ____ beautifully.', options: ['sing', 'sings', 'singing'] },
      ],
      order: ['He is kind and helpful.', 'She helps me learn English.', 'Who is the girl in red?'],
      speak: [
        { cn: '问一问：他是谁？', e: '👦❓', answer: 'Who is he?' },
        { cn: '说一说：她经常帮我学数学。', e: '👧🧮', answer: 'She often helps me learn Maths.' },
      ],
      reading: {
        text: 'My classmate Jack is short, but he is very strong. He can run fast. He is helpful too. He often helps me carry books to the classroom. We are different. I like drawing, but Jack likes running. We are good friends.',
        questions: [
          { q: 'What can Jack do?', options: ['run fast', 'draw well', 'sing beautifully'] },
          { q: 'Jack often helps me ____.', options: ['carry books', 'draw pictures', 'sing songs'] },
        ],
      },
    },
    recite: {
      title: 'My Classmate',
      text: ['This is my classmate, Mia.', 'She is tall and lovely.', 'She is very helpful.', 'She often helps me read English stories.', 'She can sing and dance well.', 'We are different, but we are good friends.', 'I like her very much.'],
    },
  },

  // ───────────────────────────── Unit 3 Animals and their homes ─────────────────────────────
  {
    id: 'u3', no: 3, title: 'Animals and their homes', cn: '动物和它们的家', island: '动物岛', icon: '🐼', color: '#5BA36B',
    words: [
      { en: 'panda', cn: '熊猫', e: '🐼' },
      { en: 'monkey', cn: '猴子', e: '🐒' },
      { en: 'elephant', cn: '大象', e: '🐘' },
      { en: 'baby elephant', cn: '小象', e: '🐘🍼' },
      { en: 'polar bear', cn: '北极熊', e: '🐻‍❄️' },
      { en: 'tiger', cn: '老虎', e: '🐯' },
      { en: 'hometown', cn: '家乡', e: '🏡' },
      { en: 'forest', cn: '森林', e: '🌳' },
      { en: 'river', cn: '河流', e: '🌊' },
      { en: 'ice', cn: '冰', e: '🧊' },
    ],
    grammar: {
      title: '现在进行时：be + doing（正在做）',
      points: [
        { rule: 'The panda is eating bamboo.  熊猫正在吃竹子。', tip: '一只动物：is + 动词ing。' },
        { rule: 'The monkeys are climbing trees.  猴子们正在爬树。', tip: '两只以上：are + 动词ing。我自己：I am + 动词ing。' },
        { rule: '—What are they doing?  —They are swimming.', tip: '变 ing：eat→eating，swim→swimming（双写 m），dance→dancing（去 e）。' },
      ],
    },
    chant: {
      title: 'What Are They Doing?',
      lines: [
        'Pandas, pandas, what are you doing?',
        'We are eating, munch, munch, munch!',
        'Monkeys, monkeys, what are you doing?',
        'We are climbing, up, up, up!',
        'Polar bears, what are you doing?',
        'We are swimming, splash, splash, splash!',
      ],
      cn: ['熊猫熊猫，你们在做什么？', '我们在吃东西，嚼嚼嚼！', '猴子猴子，你们在做什么？', '我们在爬树，爬爬爬！', '北极熊，你们在做什么？', '我们在游泳，哗哗哗！'],
    },
    dialogue: {
      title: 'Live from the Panda Base', cn: '熊猫基地视频连线', scene: '🐼🎋📱', bot: '小记者 Robo',
      turns: [
        { bot: "Hello! I'm at the panda base in Sichuan.", cn: '你好！我在四川的熊猫基地。', kid: ['Hello! What are the pandas doing?'], expect: ['what', 'doing', 'pandas'] },
        { bot: 'They are eating bamboo. Look!', cn: '它们在吃竹子，看！', kid: ['How lovely! Is the baby panda eating too?'], expect: ['baby', 'eating', 'lovely', 'is'] },
        { bot: "No, it isn't. It's climbing a tree.", cn: '不，它没有。它正在爬树。', kid: ["Wow! It's so cute."], expect: ['cute', 'wow', 'lovely'] },
        { bot: 'What are you doing now?', cn: '你现在在做什么？', kid: ["I'm talking with you!", "I'm watching the pandas."], expect: ["i'm", 'i am', 'watching', 'talking'] },
        { bot: 'Pandas are our friends. See you!', cn: '熊猫是我们的朋友。再见！', kid: ['Bye! Thank you, Robo!'], expect: ['bye', 'thank', 'see you'] },
      ],
    },
    game: {
      type: 'live', title: '动物直播间', cn: '你是小主播！把词块排成句子，告诉观众动物正在做什么。',
      scenes: [
        { e: '🐘💦', words: ['The elephant', 'is', 'drinking', 'water.'], distract: ['are', 'drink'] },
        { e: '🐼🎋', words: ['The panda', 'is', 'eating', 'bamboo.'], distract: ['are', 'eats'] },
        { e: '🐒🐒🌳', words: ['The monkeys', 'are', 'climbing', 'trees.'], distract: ['is', 'climb'] },
        { e: '🐻‍❄️🌊', words: ['The polar bear', 'is', 'swimming.'], distract: ['are', 'swim'] },
        { e: '🐯😴', words: ['The tiger', 'is', 'sleeping.'], distract: ['are', 'sleeps'] },
        { e: '🐘🐘🌳', words: ['The elephants', 'are', 'walking', 'in the forest.'], distract: ['is', 'walks'] },
        { e: '🐒🍌', words: ['The monkey', 'is', 'eating', 'a banana.'], distract: ['are', 'eat'] },
        { e: '🐼🐼🎾', words: ['The pandas', 'are', 'playing', 'together.'], distract: ['is', 'play'] },
      ],
    },
    sound: {
      title: '字母 v 的发音 /v/', key: 'very', mark: ['v'],
      words: ['van', 'vet', 'very', 'five', 'seven', 'love', 'visit', 'video'],
      tongue: 'Vivian visits seven vets in a van.',
      odd: { q: '哪个单词含有 /v/ 音？（上牙轻咬下唇）', options: ['van', 'fan', 'pan'] },
    },
    story: {
      title: 'Little Polar Bear', cn: '北极熊宝宝的一天',
      pages: [
        { e: '❄️🧊🌨️', en: 'This is the Arctic. It is very cold here.', cn: '这里是北极，这里非常冷。' },
        { e: '🐻‍❄️🐻‍❄️', en: 'A mother polar bear is walking on the ice.', cn: '一只北极熊妈妈正在冰上行走。' },
        { e: '🐻‍❄️👣', en: 'Her baby is walking behind her.', cn: '她的宝宝跟在她后面走。' },
        { e: '🐻‍❄️🌊🐟', en: 'Now the mother is swimming in the sea. She is looking for fish.', cn: '现在妈妈正在海里游泳，她在找鱼。' },
        { e: '🐻‍❄️👀', en: 'The baby is sitting on the ice. It is watching her.', cn: '宝宝坐在冰上，它正看着妈妈。' },
        { e: '🐻‍❄️💦😆', en: '"I can swim too!" says the baby. Splash!', cn: '"我也会游泳！"宝宝说。扑通！' },
        { e: '🐻‍❄️❤️', en: 'Polar bears are good swimmers. Their home is the Arctic.', cn: '北极熊很会游泳，它们的家在北极。' },
      ],
      questions: [
        { q: 'Where do polar bears live?', cn: '北极熊住在哪里？', options: ['In the Arctic', 'In the forest', 'In Yunnan'] },
        { q: 'What is the mother doing in the sea?', cn: '妈妈在海里做什么？', options: ['She is looking for fish.', 'She is sleeping.', 'She is eating bamboo.'] },
        { q: 'Can polar bears swim well?', cn: '北极熊游泳游得好吗？', options: ['Yes, they can.', "No, they can't."] },
      ],
    },
    project: {
      title: 'My Animal Card', cn: '我的动物名片',
      slots: {
        animal: ['panda', 'elephant', 'monkey', 'polar bear', 'tiger'],
        home: ['in Sichuan', 'in Yunnan', 'in the Arctic', 'in the forest'],
        food: ['bamboo', 'bananas', 'fish', 'grass', 'meat'],
        act: ['eating', 'sleeping', 'playing', 'climbing', 'swimming'],
      },
      lines: ['This is a {animal}.', 'It lives {home}.', 'It likes eating {food}.', 'Look! It is {act} now.', 'Let\'s protect animals!'],
    },
    quiz: {
      grammar: [
        { q: 'Look! The monkey ____ climbing a tree.', options: ['is', 'are', 'am'] },
        { q: 'The pandas are ____ bamboo now.', options: ['eating', 'eat', 'eats'] },
        { q: "—What are the elephants doing? —They're ____.", options: ['drinking water', 'drink water', 'drinks water'] },
        { q: 'Listen! The baby ____ crying.', options: ['is', 'are', 'be'] },
        { q: "—Is the polar bear sleeping? —No, it ____. It's swimming.", options: ["isn't", 'is', "aren't"] },
        { q: 'I ____ reading a book about animals.', options: ['am', 'is', 'are'] },
        { q: "The pandas' hometown is in ____.", options: ['Sichuan', 'the Arctic', 'the sea'] },
      ],
      order: ['The elephants are walking in the forest.', 'Look! The panda is eating bamboo.', 'What are the monkeys doing?'],
      speak: [
        { cn: '看图说：大象正在喝水。', e: '🐘💦', answer: 'The elephant is drinking water.' },
        { cn: '问一问：猴子们在干什么？', e: '🐒❓', answer: 'What are the monkeys doing?' },
      ],
      reading: {
        text: "Hi, I'm Mike. I'm at the zoo with my dad. It's sunny today. The animals are very happy. Look! Two monkeys are playing on the trees. A big elephant is drinking water. The pandas are not eating. They are sleeping!",
        questions: [
          { q: 'What are the monkeys doing?', options: ['playing on the trees', 'drinking water', 'sleeping'] },
          { q: 'Are the pandas eating?', options: ["No, they aren't.", 'Yes, they are.'] },
        ],
      },
    },
    recite: {
      title: 'Elephants in the Forest',
      text: ['This is Yunnan.', 'It is the hometown of many elephants.', 'Look! An elephant family is walking in the forest.', 'The mother elephant is drinking water.', 'The baby elephant is playing in the river.', 'They are very happy.', "Let's protect the elephants!"],
    },
  },

  // ───────────────────────────── Unit 4 Our birthday ─────────────────────────────
  {
    id: 'u4', no: 4, title: 'Our birthday', cn: '我们的生日', island: '派对岛', icon: '🎂', color: '#D4699E',
    words: [
      { en: 'birthday', cn: '生日', e: '🎂' },
      { en: 'invitation', cn: '邀请；请柬', e: '💌' },
      { en: 'party', cn: '派对', e: '🎉' },
      { en: 'activity', cn: '活动', e: '🤸' },
      { en: 'share a cake', cn: '分享蛋糕', e: '🍰' },
      { en: 'letter', cn: '信', e: '✉️' },
      { en: 'noodles', cn: '面条', e: '🍜' },
      { en: 'egg', cn: '鸡蛋', e: '🥚' },
      { en: 'candle', cn: '蜡烛', e: '🕯️' },
      { en: 'present', cn: '礼物', e: '🎁' },
    ],
    grammar: {
      title: "It's a tradition to (do) ……  ……是一个传统",
      points: [
        { rule: "It's a tradition to eat noodles on birthdays.", tip: 'to 后面跟动词原形：to eat / to have / to give。' },
        { rule: 'In China, it\'s a tradition to eat long noodles.', tip: '说某个地方的传统，前面加 In + 地点。' },
        { rule: 'My birthday is in May. / My birthday is on 8th June.', tip: '月份用 in；具体哪一天用 on。' },
      ],
    },
    chant: {
      title: 'Party Time!',
      lines: [
        'Candles, candles, one, two, three,',
        'A birthday party, come with me!',
        'Share a cake and eat some noodles,',
        'Play some games and laugh like poodles!',
      ],
      cn: ['蜡烛蜡烛，一、二、三，', '生日派对，跟我来！', '分享蛋糕，吃点面条，', '玩玩游戏，笑得像小狮子狗！'],
    },
    dialogue: {
      title: 'A Birthday Invitation', cn: '收到生日邀请', scene: '💌🎉', bot: 'Robo 同学',
      turns: [
        { bot: 'My birthday is coming! Can you come to my party?', cn: '我的生日快到了！你能来我的派对吗？', kid: ['Sure! When is the party?'], expect: ['sure', 'yes', 'when', 'ok'] },
        { bot: "It's on Saturday afternoon.", cn: '在星期六下午。', kid: ['Great! What can we do at the party?'], expect: ['what', 'do', 'great'] },
        { bot: "We can play games and share a cake. In my family, it's a tradition to eat noodles on birthdays.", cn: '我们可以玩游戏、分享蛋糕。在我家，生日吃面条是传统。', kid: ["Cool! In my family, it's a tradition to eat eggs."], expect: ['tradition', 'eggs', 'noodles', 'cool'] },
        { bot: 'Here is your invitation.', cn: '这是给你的请柬。', kid: ['Thank you! See you on Saturday.'], expect: ['thank', 'see you', 'saturday'] },
      ],
    },
    game: {
      type: 'match', title: '环球生日派对', cn: '把国家和它的生日传统连起来，再说出完整的句子！',
      pairs: [
        { left: '🇨🇳 China', right: 'eat long noodles', e: '🍜' },
        { left: '🇬🇧 the UK', right: 'blow out candles on a cake', e: '🎂' },
        { left: '🇲🇽 Mexico', right: 'hit a piñata', e: '🪅' },
        { left: '🇰🇷 Korea', right: 'eat seaweed soup', e: '🥣' },
        { left: '🇩🇰 Denmark', right: 'hang a flag outside the window', e: '🚩' },
      ],
      pattern: "In {left}, it's a tradition to {right} on birthdays.",
    },
    sound: {
      title: '字母 e 的长音 /iː/', key: 'she', mark: ['e', 'ee'],
      words: ['be', 'he', 'she', 'me', 'we', 'these', 'Chinese', 'Pete'],
      tongue: 'He, she and me, we three are free!',
      odd: { q: '哪个单词里的 e 读 /iː/（像 she）？', options: ['she', 'bed', 'pen'] },
    },
    story: {
      title: "Ling's Birthday Surprise", cn: '玲玲给奶奶的生日惊喜',
      pages: [
        { e: '👵🎂', en: "Tomorrow is Grandma's birthday. She is seventy years old.", cn: '明天是奶奶的生日，她七十岁了。' },
        { e: '👧🤔', en: 'Ling wants to give her a present. But what?', cn: '玲玲想送她一份礼物，可是送什么呢？' },
        { e: '👨🍜', en: '"In China, it\'s a tradition to eat long noodles on birthdays," says Dad.', cn: '"在中国，生日吃长寿面是一个传统。"爸爸说。' },
        { e: '👧🥚🍜', en: 'So Ling and Dad cook a big bowl of noodles with two eggs.', cn: '于是玲玲和爸爸煮了一大碗加了两个鸡蛋的面。' },
        { e: '✏️💌', en: 'Ling also writes a letter: "I love you, Grandma!"', cn: '玲玲还写了一封信："奶奶，我爱您！"' },
        { e: '👵😭😊', en: 'Grandma reads the letter and eats the noodles. She is so happy.', cn: '奶奶读了信，吃了面，她特别开心。' },
        { e: '💝', en: 'The best present is love.', cn: '最好的礼物是爱。' },
      ],
      questions: [
        { q: 'How old is Grandma?', cn: '奶奶多少岁？', options: ['seventy', 'seventeen', 'sixty'] },
        { q: 'What do Ling and Dad cook?', cn: '玲玲和爸爸做了什么？', options: ['noodles with eggs', 'a big cake', 'some soup'] },
        { q: 'What is the best present?', cn: '最好的礼物是什么？', options: ['love', 'a toy', 'a cake'] },
      ],
    },
    project: {
      title: 'Our Group Birthday Party Plan', cn: '小组生日派对计划',
      slots: {
        day: ['Saturday', 'Sunday', 'Friday afternoon'],
        place: ['at home', 'in the park', 'in the classroom'],
        food: ['long noodles', 'a big cake', 'eggs', 'fruit'],
        act: ['play games', 'sing songs', 'dance', 'make cards'],
        gift: ['cards', 'books', 'flowers'],
      },
      lines: ['Our group birthday party is on {day}.', 'It is {place}.', 'We can eat {food}.', 'We can {act} together.', "It's a tradition to give {gift} to our friends.", 'Come and join us!'],
    },
    quiz: {
      grammar: [
        { q: "It's a tradition ____ noodles on birthdays in China.", options: ['to eat', 'eat', 'eating'] },
        { q: 'Here is an ____ for you.', options: ['invitation', 'party', 'cake'] },
        { q: "Let's ____ the cake with everyone.", options: ['share', 'shares', 'sharing'] },
        { q: "—When is your birthday? —It's ____ May.", options: ['in', 'on', 'at'] },
        { q: 'My birthday is ____ 8th June.', options: ['on', 'in', 'at'] },
        { q: 'We often eat ____ on our birthdays.', options: ['noodles', 'a noodles', 'noodle'] },
        { q: 'Thank you ____ the present.', options: ['for', 'to', 'at'] },
      ],
      order: ["It's a tradition to eat noodles.", 'Can you come to my party?', "Let's share a cake together."],
      speak: [
        { cn: '说一说：生日吃面条是一个传统。', e: '🎂🍜', answer: "It's a tradition to eat noodles on birthdays." },
        { cn: '邀请朋友：你能来我的派对吗？', e: '💌🎉', answer: 'Can you come to my party?' },
      ],
      reading: {
        text: 'Dear Kitty, My birthday is on Sunday. I have a party at home. We can play games and share a big cake. My mum can cook long noodles for us. In my family, it\'s a tradition to eat noodles on birthdays. Please come at two o\'clock. Love, Alice',
        questions: [
          { q: "When is Alice's birthday?", options: ['On Sunday', 'On Saturday', 'On Friday'] },
          { q: 'What can they eat at the party?', options: ['a cake and noodles', 'eggs and milk', 'bread and juice'] },
        ],
      },
    },
    recite: {
      title: 'My Birthday',
      text: ['Today is my birthday.', 'I am ten years old.', 'My friends come to my party.', 'We play games and sing songs.', 'We share a big birthday cake.', "In China, it's a tradition to eat noodles on birthdays.", 'My mum cooks long noodles for me.', 'What a happy day!'],
    },
  },

  // ───────────────────────────── Unit 5 Visiting places ─────────────────────────────
  {
    id: 'u5', no: 5, title: 'Visiting places', cn: '参观好地方', island: '水乡岛', icon: '🌉', color: '#4A90C2',
    words: [
      { en: 'neighbourhood', cn: '社区；街坊', e: '🏘️' },
      { en: 'park', cn: '公园', e: '🏞️' },
      { en: 'shop', cn: '商店', e: '🏪' },
      { en: 'museum', cn: '博物馆', e: '🏛️' },
      { en: 'cinema', cn: '电影院', e: '🎬' },
      { en: 'supermarket', cn: '超市', e: '🛒' },
      { en: 'bridge', cn: '桥', e: '🌉' },
      { en: 'hospital', cn: '医院', e: '🏥' },
      { en: 'boat', cn: '小船', e: '🚣' },
    ],
    grammar: {
      title: 'Is / Are there ……? 那里有……吗？',
      points: [
        { rule: '—Is there a museum?  —Yes, there is. / No, there isn\'t.', tip: '问一个东西：Is there a / an ……？' },
        { rule: '—Are there any bridges?  —Yes, there are. / No, there aren\'t.', tip: '问很多东西：Are there any + 复数？' },
        { rule: 'There is a big park near my home.', tip: '回答时 is 对 is，are 对 are，千万别搞混！' },
      ],
    },
    chant: {
      title: 'In My Neighbourhood',
      lines: [
        'Is there a park? Yes, there is!',
        'Are there shops? Yes, there are!',
        'Is there a zoo? No, there isn\'t.',
        'But there are bridges, near and far!',
      ],
      cn: ['有公园吗？有的！', '有商店吗？有的！', '有动物园吗？没有。', '但是有很多桥，远远近近都是！'],
    },
    dialogue: {
      title: 'Visiting an Old Water Town', cn: '游览上海朱家角古镇', scene: '🌉🚣🏮', bot: '导游 Robo',
      turns: [
        { bot: 'Welcome to Zhujiajiao, an old water town in Shanghai!', cn: '欢迎来到朱家角，上海的一座古老水乡！', kid: ["Wow! It's beautiful. Are there any bridges here?"], expect: ['are there', 'bridge', 'bridges'] },
        { bot: 'Yes, there are. There are many old bridges.', cn: '有的，有很多古桥。', kid: ['Is there a museum?'], expect: ['is there', 'museum'] },
        { bot: "Yes, there is. It's near the river.", cn: '有的，就在河边。', kid: ['Is there a cinema?'], expect: ['cinema', 'is there'] },
        { bot: "No, there isn't. But you can take a boat!", cn: '没有。不过你可以坐船！', kid: ["Great! Let's take a boat."], expect: ['great', 'boat', "let's", 'ok'] },
      ],
    },
    game: {
      type: 'explore', title: '水乡侦探', cn: 'Robo 住在三个小镇中的一个。用 Is there / Are there 提问，推理出它住哪里！',
      places: [
        { e: '🏞️', one: 'a park', many: 'parks', kind: 'one' },
        { e: '🏛️', one: 'a museum', many: 'museums', kind: 'one' },
        { e: '🌉', one: 'a bridge', many: 'bridges', kind: 'many' },
        { e: '🏪', one: 'a shop', many: 'shops', kind: 'many' },
        { e: '🎬', one: 'a cinema', many: 'cinemas', kind: 'one' },
        { e: '🛒', one: 'a supermarket', many: 'supermarkets', kind: 'one' },
        { e: '🏥', one: 'a hospital', many: 'hospitals', kind: 'one' },
      ],
      towns: [
        { name: 'Town A', has: ['🏞️', '🏛️', '🌉', '🏪'] },
        { name: 'Town B', has: ['🏞️', '🎬', '🛒', '🌉'] },
        { name: 'Town C', has: ['🏛️', '🎬', '🏥', '🏪'] },
      ],
    },
    sound: {
      title: '字母 z 的发音 /z/', key: 'zebra', mark: ['z'],
      words: ['zoo', 'zero', 'zebra', 'lazy', 'size', 'amazing', 'prize', 'puzzle'],
      tongue: 'Zack the zebra zips to the zoo.',
      odd: { q: '哪个单词含有 /z/ 音？（像小蜜蜂 zzz）', options: ['zoo', 'sue', 'two'] },
    },
    story: {
      title: 'Ella in Amsterdam', cn: '艾拉游阿姆斯特丹',
      pages: [
        { e: '👧✈️🇳🇱', en: 'Ella is visiting Amsterdam with her family.', cn: '艾拉和家人在参观阿姆斯特丹。' },
        { e: '🌊🏘️', en: 'It is a city on the water. Is there a river? Yes, there are many!', cn: '这是一座水上城市。有河吗？有很多条呢！' },
        { e: '🌉🌉🌉', en: 'There are more than a thousand bridges here. Amazing!', cn: '这里有一千多座桥，太神奇了！' },
        { e: '🚲🚲🚲', en: 'There are bikes everywhere. People ride bikes to work.', cn: '到处都是自行车，人们骑车去上班。' },
        { e: '🏛️🖼️', en: 'Is there a museum? Yes, there is. Ella sees many old paintings.', cn: '有博物馆吗？有的。艾拉看了很多古老的画。' },
        { e: '🚤😊', en: 'Ella takes a boat. "It\'s like Zhujiajiao at home!" she says.', cn: '艾拉坐上小船。"这跟家乡的朱家角好像啊！"她说。' },
      ],
      questions: [
        { q: 'Are there many bridges in Amsterdam?', cn: '阿姆斯特丹有很多桥吗？', options: ['Yes, there are.', "No, there aren't."] },
        { q: 'How do people go to work there?', cn: '那里的人怎么上班？', options: ['By bike', 'By plane', 'On foot'] },
        { q: 'What does Ella see in the museum?', cn: '艾拉在博物馆里看到了什么？', options: ['old paintings', 'animals', 'films'] },
      ],
    },
    project: {
      title: 'A Photo of My Favourite Place', cn: '我最爱地方的照片介绍',
      slots: {
        adj: ['big', 'beautiful', 'old', 'new'],
        place: ['park', 'museum', 'cinema', 'supermarket', 'bridge'],
        there: ['There are many trees.', 'There is a long river.', 'There are some nice shops.', 'There are a lot of people.'],
        act: ['take photos', 'watch films', 'buy food', 'play with my friends', 'see old things'],
      },
      lines: ['This is a photo of my favourite place.', 'It is a {adj} {place} in my neighbourhood.', '{there}', 'I often {act} there.', 'I love this place!'],
    },
    quiz: {
      grammar: [
        { q: '—____ there a cinema near your home? —Yes, there is.', options: ['Is', 'Are', 'Do'] },
        { q: '—Are there any bridges in the town? —Yes, there ____.', options: ['are', 'is', "aren't"] },
        { q: '—Is there a museum? —No, there ____.', options: ["isn't", "aren't", 'is'] },
        { q: '____ there any shops in your neighbourhood?', options: ['Are', 'Is', 'Do'] },
        { q: 'There ____ a big park near my school.', options: ['is', 'are', 'am'] },
        { q: 'We can watch films in the ____.', options: ['cinema', 'museum', 'hospital'] },
        { q: 'We can buy food in the ____.', options: ['supermarket', 'museum', 'bridge'] },
      ],
      order: ['Is there a museum near here?', 'Are there any bridges in the town?', 'Yes, there are many old bridges.'],
      speak: [
        { cn: '问一问：附近有超市吗？', e: '🛒❓', answer: 'Is there a supermarket near here?' },
        { cn: '回答：是的，有很多桥。', e: '🌉🌉', answer: 'Yes, there are many bridges.' },
      ],
      reading: {
        text: 'Welcome to my neighbourhood! It is very nice. There is a big park. There are many trees and flowers in it. There is a supermarket near the park. Is there a cinema? No, there isn\'t. But there is a museum. I often go there with my grandpa.',
        questions: [
          { q: 'Is there a cinema in the neighbourhood?', options: ["No, there isn't.", 'Yes, there is.'] },
          { q: 'Where is the supermarket?', options: ['near the park', 'near the museum', 'in the school'] },
        ],
      },
    },
    recite: {
      title: 'My Neighbourhood',
      text: ['Welcome to my neighbourhood.', 'It is clean and quiet.', 'There is a big park near my home.', 'There are many trees and flowers in it.', "Is there a cinema? No, there isn't.", 'But there is a supermarket and a museum.', 'I love my neighbourhood.'],
    },
  },
];
