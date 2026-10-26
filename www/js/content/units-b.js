// 松鼠英语岛 · 原创学习内容（Unit 6 ~ Unit 10）
// 约定：所有选择题 options[0] 为正确答案，运行时会自动打乱顺序。

const FOOD = ['milk', 'eggs', 'bread', 'porridge', 'fruit', 'juice'];
const FREQ = ['every day', 'once a week', 'twice a week', 'three times a week', 'five times a week'];
const TIMES = ["six o'clock", 'half past six', "seven o'clock", 'a quarter past seven', 'half past seven', "twelve o'clock", 'half past four', "six o'clock in the evening", 'half past eight', "nine o'clock"];
const WEATHER = ['sunny', 'rainy', 'cloudy', 'windy', 'snowy'];

export const UNITS_B = [
  // ───────────────────────────── Unit 6 It's autumn! ─────────────────────────────
  {
    id: 'u6', no: 6, title: "It's autumn!", cn: '秋天来啦', island: '金秋岛', icon: '🍁', color: '#D9822B',
    words: [
      { en: 'autumn', cn: '秋天', e: '🍂' },
      { en: 'fall', cn: '秋天（美式）', e: '🍁' },
      { en: 'leaf', cn: '树叶', e: '🍃' },
      { en: 'fruit', cn: '水果', e: '🍇' },
      { en: 'apple', cn: '苹果', e: '🍎' },
      { en: 'farm', cn: '农场', e: '🚜' },
      { en: 'fly south', cn: '向南飞', e: '🦢➡️' },
      { en: 'pumpkin', cn: '南瓜', e: '🎃' },
      { en: 'harvest', cn: '丰收', e: '🌾' },
      { en: 'cool', cn: '凉爽的', e: '🍃😌' },
    ],
    grammar: {
      title: '感叹句 How ……!  多么……啊！',
      points: [
        { rule: 'How beautiful!  真美啊！  How big!  好大啊！', tip: 'How + 形容词 + ! 用来表达惊喜、赞叹。' },
        { rule: 'How beautiful the leaves are!  树叶多美啊！', tip: '还可以说完整：How + 形容词 + 主语 + is/are!' },
        { rule: 'In autumn, the leaves fall. Birds fly south.', tip: '复数小知识：leaf → leaves（f 变 ves）。' },
      ],
    },
    chant: {
      title: 'Autumn Is Here',
      lines: [
        'Red leaves, yellow leaves, falling down,',
        'Golden fields all around the town.',
        'Apples, pumpkins, big and round,',
        'How beautiful! Autumn is found!',
      ],
      cn: ['红叶子、黄叶子，飘落下来，', '金色的田野围绕着小镇。', '苹果、南瓜，又大又圆，', '多美啊！秋天来啦！'],
    },
    dialogue: {
      title: 'An Autumn Outing', cn: '秋游去农场', scene: '🚜🍎🍂', bot: '农场主 Robo',
      turns: [
        { bot: 'Welcome to my farm! Look at the apple trees.', cn: '欢迎来到我的农场！看那些苹果树。', kid: ['How nice! Can I pick some apples?'], expect: ['how', 'nice', 'pick', 'apples', 'beautiful'] },
        { bot: "Sure. And look at the leaves. They're red and yellow.", cn: '当然。再看看树叶，红红黄黄的。', kid: ['How beautiful!'], expect: ['how', 'beautiful', 'nice'] },
        { bot: 'Here is a big pumpkin.', cn: '这里有个大南瓜。', kid: ['Wow! How big!'], expect: ['how', 'big', 'wow'] },
        { bot: "Look up! The birds are flying south. It's getting cool.", cn: '抬头看！鸟儿们正往南飞，天气变凉了。', kid: ['Goodbye, birds! See you next spring!'], expect: ['bye', 'goodbye', 'birds', 'spring'] },
        { bot: 'Here is a basket of fruit for you.', cn: '这一篮水果送给你。', kid: ['Thank you! How happy I am!'], expect: ['thank', 'happy'] },
      ],
    },
    game: {
      type: 'exclaim', title: '秋天感叹机', cn: '看图选出最合适的感叹句，再大声、有感情地说出来！',
      scenes: [
        { e: '🍁🍂🌳', cn: '满山红叶', options: ['How beautiful!', 'How hot!', 'How sad!'] },
        { e: '🎃🎃', cn: '超级大南瓜', options: ['How big!', 'How small!', 'How cold!'] },
        { e: '🍎😋', cn: '咬一口苹果', options: ['How sweet!', 'How sour!', 'How noisy!'] },
        { e: '🌬️🥶', cn: '秋风吹来', options: ['How cool!', 'How hot!', 'How sweet!'] },
        { e: '🐶🍂', cn: '小狗在落叶里打滚', options: ['How cute!', 'How bad!', 'How tall!'] },
        { e: '🌾🌞', cn: '金色的稻田', options: ['How nice!', 'How dirty!', 'How dark!'] },
        { e: '🦢🦢🦢', cn: '大雁排成人字形', options: ['How amazing!', 'How boring!', 'How sad!'] },
      ],
    },
    sound: {
      title: '字母 y 的发音 /j/', key: 'year', mark: ['y'],
      words: ['yes', 'yellow', 'yo-yo', 'year', 'young', 'yummy', 'yogurt', 'you'],
      tongue: 'Yellow yo-yos for young you!',
      odd: { q: '哪个单词以 /j/ 音开头？', options: ['yes', 'less', 'mess'] },
    },
    story: {
      title: 'Autumn on Chongming Island', cn: '崇明岛的秋天',
      pages: [
        { e: '🏝️🍂', en: "It's autumn. Kevin and his family visit Chongming Island.", cn: '秋天到了，凯文一家去崇明岛游玩。' },
        { e: '🌾🌞', en: 'The rice fields are golden. It is harvest time.', cn: '稻田一片金黄，正是丰收的季节。' },
        { e: '🍊🧺', en: 'They pick oranges on a farm. The oranges are sweet.', cn: '他们在农场摘橘子，橘子很甜。' },
        { e: '🍁🚲', en: 'They ride bikes under the red and yellow trees.', cn: '他们在红红黄黄的树下骑自行车。' },
        { e: '🦢🦢🌊', en: 'Many birds are flying to the wetland. They come from the north.', cn: '许多鸟儿正飞向湿地，它们从北方飞来。' },
        { e: '😮✨', en: '"How amazing!" says Kevin. "Autumn is so colourful!"', cn: '"太神奇了！"凯文说，"秋天真是五彩缤纷！"' },
      ],
      questions: [
        { q: 'What colour are the rice fields?', cn: '稻田是什么颜色的？', options: ['golden', 'green', 'white'] },
        { q: 'What do they pick on the farm?', cn: '他们在农场摘什么？', options: ['oranges', 'apples', 'pumpkins'] },
        { q: 'Where are the birds flying to?', cn: '鸟儿飞向哪里？', options: ['the wetland', 'the city', 'the mountains'] },
      ],
    },
    project: {
      title: 'A Poem for Autumn', cn: '给秋天写首小诗',
      slots: {
        adj: ['beautiful', 'cool', 'nice', 'golden'],
        c1: ['red', 'yellow', 'orange', 'brown'],
        c2: ['yellow', 'red', 'brown', 'orange'],
        fruit: ['apples', 'pears', 'oranges', 'grapes'],
        taste: ['sweet', 'big', 'juicy', 'yummy'],
      },
      lines: ['Autumn, autumn, how {adj}!', 'The leaves are {c1} and {c2}.', 'The {fruit} are {taste}.', 'The birds fly south, high in the sky.', 'Autumn, autumn, I love you!'],
    },
    quiz: {
      grammar: [
        { q: 'Look at the red leaves. ____ beautiful!', options: ['How', 'What', 'Who'] },
        { q: '____ big the pumpkin is!', options: ['How', 'Where', 'When'] },
        { q: 'In autumn, the ____ fall from the trees.', options: ['leaves', 'leafs', 'leaf'] },
        { q: "Autumn is also called ____ in American English.", options: ['fall', 'spring', 'summer'] },
        { q: 'Many birds fly ____ in autumn.', options: ['south', 'up the tree', 'into the house'] },
        { q: 'The apples are red. They ____ sweet.', options: ['are', 'is', 'am'] },
        { q: 'We pick apples ____ the farm.', options: ['on', 'of', 'to'] },
      ],
      order: ['How beautiful the leaves are!', 'The birds fly south in autumn.', 'We pick apples on the farm.'],
      speak: [
        { cn: '看到金黄的田野，感叹：真美啊！', e: '🌾✨', answer: 'How beautiful!' },
        { cn: '说一说：秋天树叶从树上落下来。', e: '🍂🌳', answer: 'In autumn, the leaves fall from the trees.' },
      ],
      reading: {
        text: "It's autumn. The weather is cool. My family go to a farm. There are many fruit trees. The apples are red and the pears are yellow. We pick lots of fruit. The birds fly south. How happy we are!",
        questions: [
          { q: 'What colour are the pears?', options: ['yellow', 'red', 'green'] },
          { q: 'Where does the family go?', options: ['to a farm', 'to a zoo', 'to a museum'] },
        ],
      },
    },
    recite: {
      title: 'Autumn Is Here',
      text: ['Autumn is here.', 'The weather is cool.', 'The leaves are red and yellow.', 'They dance in the wind.', 'The apples on the farm are big and sweet.', 'The birds fly south.', 'How beautiful autumn is!', 'I love autumn days.'],
    },
  },

  // ───────────────────────────── Unit 7 My healthy breakfast ─────────────────────────────
  {
    id: 'u7', no: 7, title: 'My healthy breakfast', cn: '健康早餐', island: '早餐岛', icon: '🥛', color: '#E0A52C',
    words: [
      { en: 'breakfast', cn: '早餐', e: '🍳' },
      { en: 'bread', cn: '面包', e: '🍞' },
      { en: 'juice', cn: '果汁', e: '🧃' },
      { en: 'milk', cn: '牛奶', e: '🥛' },
      { en: 'banana', cn: '香蕉', e: '🍌' },
      { en: 'porridge', cn: '粥', e: '🥣' },
      { en: 'sandwich', cn: '三明治', e: '🥪' },
      { en: 'vegetables', cn: '蔬菜', e: '🥦' },
      { en: 'healthy', cn: '健康的', e: '💪' },
      { en: 'sweets', cn: '糖果', e: '🍬' },
    ],
    grammar: {
      title: 'How often ……?  多久一次？',
      points: [
        { rule: '—How often do you drink milk?  —Every day.', tip: 'How often 问"频率"——多久做一次。' },
        { rule: 'once a week 一周一次 / twice a week 一周两次 / three times a week 一周三次', tip: '一次 once，两次 twice，三次以上：数字 + times。' },
        { rule: 'She has bread twice a week.', tip: 'she / he 作主语时：have → has，eat → eats，drink → drinks。' },
      ],
    },
    chant: {
      title: 'My Breakfast Chant',
      lines: [
        'Milk, milk, every day,',
        'Eggs three times, hip hip hooray!',
        'Bread and porridge, banana too,',
        'A healthy breakfast, good for you!',
      ],
      cn: ['牛奶牛奶，天天喝，', '鸡蛋一周吃三次，好耶！', '面包、粥，还有香蕉，', '健康的早餐，对你好！'],
    },
    dialogue: {
      title: 'Ask Doctor Robo', cn: '健康小医生问早餐', scene: '👨‍⚕️🍳', bot: 'Robo 医生',
      turns: [
        { bot: 'Good morning! What do you have for breakfast?', cn: '早上好！你早餐吃什么？', kid: ['I have bread, eggs and milk.'], expect: ['have', 'bread', 'eggs', 'milk', 'porridge', 'noodles'] },
        { bot: 'How often do you drink milk?', cn: '你多久喝一次牛奶？', kid: ['Every day.', 'Five times a week.'], expect: ['every day', 'times', 'once', 'twice'] },
        { bot: 'How often do you eat vegetables for breakfast?', cn: '你早餐多久吃一次蔬菜？', kid: ['Twice a week.', 'Once a week.'], expect: ['once', 'twice', 'times', 'every'] },
        { bot: 'Do you eat sweets for breakfast?', cn: '你早餐吃糖吗？', kid: ["No, I don't. Sweets are not healthy."], expect: ['no', "don't", 'not'] },
        { bot: "Great! That's a healthy breakfast.", cn: '太棒了！这是一份健康的早餐。', kid: ['Thank you, Doctor Robo!'], expect: ['thank'] },
      ],
    },
    game: {
      type: 'calendar', title: '早餐日历侦探', cn: '数一数这一周吃了几次，回答 How often？',
      people: ['Sam', 'Lucy', 'Grandpa', 'Mum'],
      foods: [
        { en: 'eggs', e: '🥚' }, { en: 'milk', e: '🥛' }, { en: 'bread', e: '🍞' },
        { en: 'bananas', e: '🍌' }, { en: 'porridge', e: '🥣' }, { en: 'juice', e: '🧃' },
      ],
    },
    sound: {
      title: '字母组合 sh 的发音 /ʃ/', key: 'ship', mark: ['sh'],
      words: ['ship', 'fish', 'shop', 'shoe', 'wash', 'sheep', 'shower', 'shout'],
      tongue: 'She sells fresh fish in a shop by the ship.',
      odd: { q: '哪个单词含有 /ʃ/ 音（像让人安静的"嘘"）？', options: ['ship', 'sip', 'chip'] },
    },
    story: {
      title: "Little Bear's Breakfast", cn: '小熊的早餐',
      pages: [
        { e: '🐻🍬🍭', en: 'Little Bear loves sweets. He eats sweets for breakfast every day.', cn: '小熊爱吃糖，他每天早餐都吃糖。' },
        { e: '🐻😪', en: 'At school, he is always tired. He can\'t run fast.', cn: '在学校他总是很累，跑不快。' },
        { e: '🐼👩‍⚕️', en: '"You need a healthy breakfast," says Doctor Panda.', cn: '"你需要一份健康的早餐。"熊猫医生说。' },
        { e: '🥣🥚🍌🥛', en: 'Now Little Bear has porridge, an egg, a banana and milk.', cn: '现在小熊早餐吃粥、一个鸡蛋、一根香蕉，还喝牛奶。' },
        { e: '🍬1️⃣', en: 'He eats sweets only once a week.', cn: '他一周只吃一次糖。' },
        { e: '🐻🏃💨🏆', en: 'Now he is strong. He runs very fast!', cn: '现在他很强壮，跑得飞快！' },
      ],
      questions: [
        { q: 'What does Little Bear eat for breakfast at first?', cn: '一开始小熊早餐吃什么？', options: ['sweets', 'eggs', 'porridge'] },
        { q: 'How often does he eat sweets now?', cn: '现在他多久吃一次糖？', options: ['Once a week', 'Every day', 'Twice a week'] },
        { q: 'Who helps Little Bear?', cn: '谁帮助了小熊？', options: ['Doctor Panda', 'Mr Owl', 'Rabbit Rosy'] },
      ],
    },
    project: {
      title: 'A Healthy Breakfast Survey', cn: '健康早餐小调查',
      slots: { f1: FOOD, q1: FREQ, f2: FOOD, q2: FREQ, f3: FOOD, q3: FREQ, veg: ['vegetables', 'bananas', 'apples'] },
      lines: ['I have {f1} {q1}.', 'My mum has {f2} {q2}.', 'My dad has {f3} {q3}.', 'We eat {veg} too.', 'A healthy breakfast makes us strong!'],
    },
    quiz: {
      grammar: [
        { q: '—How ____ do you drink milk? —Every day.', options: ['often', 'many', 'much'] },
        { q: 'I eat eggs ____ a week.', options: ['twice', 'two', 'second'] },
        { q: 'She has bread three ____ a week.', options: ['times', 'time', 'timing'] },
        { q: '—How often does he eat bananas? —____ a week.', options: ['Once', 'One', 'First'] },
        { q: 'A healthy breakfast ____ good for us.', options: ['is', 'are', 'am'] },
        { q: 'I have ____ egg and a glass of milk.', options: ['an', 'a', 'two'] },
        { q: 'Tom ____ porridge for breakfast every day.', options: ['has', 'have', 'having'] },
      ],
      order: ['How often do you eat eggs?', 'I drink milk every day.', 'She has bread twice a week.'],
      speak: [
        { cn: '问一问：你多久吃一次香蕉？', e: '🍌❓', answer: 'How often do you eat bananas?' },
        { cn: '回答：一周三次。', e: '3️⃣📅', answer: 'Three times a week.' },
      ],
      reading: {
        text: "Hi, I'm Sam. Breakfast is important. I have breakfast every day. I drink milk every morning. I eat eggs three times a week. I have porridge twice a week. I don't eat sweets for breakfast. My breakfast is healthy.",
        questions: [
          { q: 'How often does Sam eat eggs?', options: ['Three times a week', 'Twice a week', 'Every day'] },
          { q: 'Does Sam eat sweets for breakfast?', options: ["No, he doesn't.", 'Yes, he does.'] },
        ],
      },
    },
    recite: {
      title: 'A Healthy Breakfast',
      text: ['Breakfast is very important.', 'Every morning, I have a healthy breakfast.', 'I drink a glass of milk every day.', 'I eat an egg five times a week.', 'I have bread or porridge too.', 'I eat fruit twice a week.', 'A healthy breakfast makes me strong and happy.'],
    },
  },

  // ───────────────────────────── Unit 8 Be honest ─────────────────────────────
  {
    id: 'u8', no: 8, title: 'Be honest', cn: '做诚实的孩子', island: '诚实岛', icon: '😇', color: '#8A72C8',
    words: [
      { en: 'honest', cn: '诚实的', e: '😇' },
      { en: 'tell the truth', cn: '说实话', e: '💬✅' },
      { en: 'never tell a lie', cn: '从不说谎', e: '🙅🤥' },
      { en: "keep one's word", cn: '遵守诺言', e: '🤝✅' },
      { en: 'give ... back', cn: '归还', e: '↩️🎁' },
      { en: 'wallet', cn: '钱包', e: '👛' },
      { en: 'mistake', cn: '错误', e: '❗' },
      { en: 'sorry', cn: '对不起', e: '🙇' },
      { en: 'promise', cn: '承诺', e: '🤙' },
    ],
    grammar: {
      title: 'should / shouldn\'t  应该 / 不应该',
      points: [
        { rule: 'We should tell the truth.  我们应该说实话。', tip: 'should 后面跟动词原形，不管主语是谁都不变！' },
        { rule: "You shouldn't tell lies.  你不应该说谎。", tip: "shouldn't = should not。" },
        { rule: '—Should I say sorry?  —Yes, you should.', tip: '问"应该……吗"：把 should 放到最前面。' },
      ],
    },
    chant: {
      title: 'Be an Honest Child',
      lines: [
        'Find a wallet? Give it back!',
        'Break a cup? Tell the truth, Jack!',
        'Make a promise? Keep your word,',
        'Honest kids are the best in the world!',
      ],
      cn: ['捡到钱包？还回去！', '打碎杯子？说实话，杰克！', '许下承诺？遵守诺言，', '诚实的孩子是世界上最棒的！'],
    },
    dialogue: {
      title: 'The Right Thing to Do', cn: '捡到钱包怎么办', scene: '👛🤔', bot: 'Robo 同学',
      turns: [
        { bot: "Look! There's a wallet on the ground.", cn: '看！地上有个钱包。', kid: ['Whose wallet is it? We should give it back.'], expect: ['should', 'give', 'back'] },
        { bot: 'There is a lot of money in it. Should we keep it?', cn: '里面有很多钱。我们应该留着吗？', kid: ["No, we shouldn't. We should be honest."], expect: ['no', "shouldn't", 'should not', 'honest'] },
        { bot: "OK. Let's take it to the teacher.", cn: '好吧，我们把它交给老师。', kid: ['Good idea!'], expect: ['good', 'idea', 'ok', 'yes'] },
        { bot: 'The teacher says we are honest children!', cn: '老师说我们是诚实的孩子！', kid: ['Great! We should always tell the truth.'], expect: ['truth', 'tell', 'great', 'always'] },
      ],
    },
    game: {
      type: 'judge', title: '诚实小法官', cn: '读读这些小故事，判断他们应该怎么做！',
      cases: [
        { e: '🧒⚽💥🪟', cn: 'Tom 踢球打碎了窗户。', en: 'Tom breaks a window.', options: ['He should tell the truth.', 'He should run away.'] },
        { e: '👧👛', cn: 'Amy 捡到一个钱包。', en: 'Amy finds a wallet.', options: ['She should give it back.', 'She should keep it.'] },
        { e: '👦🤙👦', cn: 'Ben 答应周日帮朋友。', en: 'Ben promises to help his friend on Sunday.', options: ['He should keep his word.', 'He should forget it.'] },
        { e: '👩‍🦰📝', cn: 'Kitty 没写完作业。', en: "Kitty didn't finish her homework.", options: ['She should say sorry and finish it.', "She should copy her friend's homework."] },
        { e: '👦🍪👧', cn: 'Leo 偷吃了妹妹的饼干。', en: "Leo eats his sister's cookie.", options: ['He should say sorry.', 'He should tell a lie.'] },
        { e: '👩📚', cn: 'Mia 从图书馆借了一本书。', en: 'Mia borrows a book from the library.', options: ['She should give it back on time.', 'She should keep it forever.'] },
      ],
    },
    sound: {
      title: '长元音 i 的三种拼法 /aɪ/：i_e · ie · igh', key: 'time · lie · night', mark: ['i_e', 'ie', 'igh'],
      words: ['time', 'bike', 'kite', 'pie', 'tie', 'lie', 'night', 'light', 'right'],
      tongue: 'I like to fly my kite at night with a light.',
      odd: { q: '哪个单词里的 i 读 /aɪ/（像 kite）？', options: ['kite', 'kit', 'sit'] },
    },
    story: {
      title: 'The Empty Pot', cn: '空花盆（中国民间故事改编）',
      pages: [
        { e: '👑🌸', en: 'Long ago, there was an old king. He loved flowers.', cn: '很久以前，有一位老国王，他很喜欢花。' },
        { e: '👑🌱🧒🧒', en: 'He gave every child a seed. "Show me your flower in spring!" he said.', cn: '他给每个孩子一颗种子，说："春天把你的花给我看！"' },
        { e: '👦🪴', en: 'A boy named Ping planted his seed. He watered it every day.', cn: '一个叫小平的男孩种下了种子，每天浇水。' },
        { e: '🪴😢', en: 'But nothing grew. His pot was empty.', cn: '可是什么也没长出来，他的花盆是空的。' },
        { e: '🧒🌺🌼', en: 'In spring, other children came with beautiful flowers.', cn: '春天，其他孩子都捧着美丽的花来了。' },
        { e: '👦🪴👑', en: 'Ping came with his empty pot. He told the truth.', cn: '小平捧着空花盆来了，他说了实话。' },
        { e: '👑😊🔥🌱', en: '"The seeds were cooked. They can\'t grow!" the king smiled. "Ping is honest."', cn: '"那些种子是煮过的，根本长不出来！"国王笑着说，"小平是诚实的。"' },
      ],
      questions: [
        { q: 'What did the king give the children?', cn: '国王给了孩子们什么？', options: ['seeds', 'flowers', 'pots'] },
        { q: "Why was Ping's pot empty?", cn: '为什么小平的花盆是空的？', options: ['The seeds were cooked.', "He didn't water it.", 'He lost the seed.'] },
        { q: 'What did the king think of Ping?', cn: '国王觉得小平怎么样？', options: ['He is honest.', 'He is lazy.', 'He is funny.'] },
      ],
    },
    project: {
      title: 'Tips for Being an Honest Child', cn: '诚实小贴士',
      slots: {
        t2: ['keep our word', 'give things back', 'say sorry for our mistakes'],
        t3: ['tell lies', "take other people's things", "copy others' homework"],
        t4: ['say sorry for our mistakes', 'keep our word', 'give things back'],
      },
      lines: ['Tips for being an honest child:', 'We should always tell the truth.', 'We should {t2}.', "We shouldn't {t3}.", 'We should {t4}.', "Let's be honest children!"],
    },
    quiz: {
      grammar: [
        { q: 'We ____ tell lies.', options: ["shouldn't", 'should', 'can'] },
        { q: 'You find a pen. You should give it ____.', options: ['back', 'up', 'on'] },
        { q: 'He ____ keep his word.', options: ['should', 'shoulds', 'shoulding'] },
        { q: 'An honest child always tells the ____.', options: ['truth', 'lie', 'mistake'] },
        { q: '—Should I say sorry? —Yes, you ____.', options: ['should', "shouldn't", "can't"] },
        { q: 'We should ____ our homework on time.', options: ['finish', 'finishes', 'finishing'] },
        { q: 'Never ____ a lie.', options: ['tell', 'tells', 'telling'] },
      ],
      order: ['We should tell the truth.', "You shouldn't tell lies.", 'He should give the wallet back.'],
      speak: [
        { cn: '劝一劝：我们应该把它还回去。', e: '👛↩️', answer: 'We should give it back.' },
        { cn: '说一说：我们不应该说谎。', e: '🙅🤥', answer: "We shouldn't tell lies." },
      ],
      reading: {
        text: "Dan breaks Lily's toy car. He feels scared. Should he hide it? No, he shouldn't. He goes to Lily and says, \"I'm sorry. I broke your car.\" Lily says, \"It's OK. Thank you for telling me the truth.\" They fix the car together.",
        questions: [
          { q: 'What does Dan break?', options: ["Lily's toy car", 'a window', 'a cup'] },
          { q: 'Does Dan tell the truth?', options: ['Yes, he does.', "No, he doesn't."] },
        ],
      },
    },
    recite: {
      title: 'Be Honest',
      text: ['We should be honest children.', 'We should always tell the truth.', 'We should never tell a lie.', 'If we find something, we should give it back.', 'If we make a promise, we should keep our word.', 'Honest children are good children.'],
    },
  },

  // ───────────────────────────── Unit 9 What time is it? ─────────────────────────────
  {
    id: 'u9', no: 9, title: 'What time is it?', cn: '现在几点了', island: '时钟岛', icon: '⏰', color: '#3E9C9C',
    words: [
      { en: 'time', cn: '时间', e: '⏳' },
      { en: 'clock', cn: '钟', e: '🕰️' },
      { en: 'hour hand', cn: '时针（短针）', e: '🕐短' },
      { en: 'minute hand', cn: '分针（长针）', e: '🕐长' },
      { en: "seven o'clock", cn: '七点整', e: '🕖' },
      { en: 'half past eleven', cn: '十一点半', e: '🕦' },
      { en: 'ten to four', cn: '差十分四点（3:50）', e: '3:50' },
      { en: 'a quarter past three', cn: '三点一刻（3:15）', e: '3:15' },
      { en: 'get up', cn: '起床', e: '🛏️⏰' },
      { en: 'go to bed', cn: '上床睡觉', e: '🛌' },
    ],
    grammar: {
      title: 'What time is it? —— It\'s ……',
      points: [
        { rule: "—What time is it?  —It's seven o'clock.", tip: "整点：数字 + o'clock。" },
        { rule: "It's half past eleven. (11:30)  It's a quarter past three. (3:15)", tip: 'past = 过了：分钟数 + past + 小时。半小时用 half，一刻钟用 a quarter。' },
        { rule: "It's ten to four. (3:50)  It's a quarter to nine. (8:45)", tip: 'to = 差：还差几分钟到下一个整点。' },
      ],
    },
    chant: {
      title: 'Tick Tock, What\'s the Time?',
      lines: [
        "Tick tock, tick tock, what's the time?",
        "It's seven o'clock, time to rise and shine!",
        "Tick tock, tick tock, what's the time?",
        "It's half past eight, I'm in bed at nine!",
      ],
      cn: ['滴答滴答，几点了？', '七点整，该起床啦！', '滴答滴答，几点了？', '八点半，九点我就上床睡觉！'],
    },
    dialogue: {
      title: 'Happy New Year!', cn: '跨年倒计时', scene: '🎆🕦', bot: 'Robo 同学',
      turns: [
        { bot: "It's New Year's Eve! What time is it now?", pic: '11:30', cn: '今天是除夕夜（新年前夜）！现在几点了？', kid: ["It's half past eleven."], expect: ['half past eleven', 'eleven', 'half'] },
        { bot: 'When is the countdown?', cn: '什么时候倒计时？', kid: ["At twelve o'clock."], expect: ['twelve'] },
        { bot: 'Look at the clock. What time is it now?', pic: '11:50', cn: '看钟，现在几点了？', kid: ["It's ten to twelve."], expect: ['ten to twelve', 'ten to', 'eleven fifty'] },
        { bot: "It's time! Ten, nine, eight, seven, six, five, four ...", cn: '时间到！十、九、八、七、六、五、四……', kid: ['Three, two, one! Happy New Year!'], expect: ['happy new year', 'new year', 'one'] },
      ],
    },
    game: { type: 'clock', title: '时间大富翁', cn: '看钟说时间，答对就掷骰子往前走，先到终点就赢！' },
    sound: {
      title: '字母组合 qu 的发音 /kw/', key: 'queen', mark: ['qu'],
      words: ['question', 'queen', 'quick', 'quiet', 'quiz', 'quilt', 'squirrel', 'square'],
      tongue: 'The quick queen asks a quiet question.',
      odd: { q: '哪个单词含有 /kw/ 音？', options: ['queen', 'green', 'keen'] },
    },
    story: {
      title: 'Sunny and the Magic Clock', cn: '小松鼠和魔法钟',
      pages: [
        { e: '🐿️😴', en: 'Sunny the squirrel is always late.', cn: '小松鼠桑尼总是迟到。' },
        { e: '🦉🕰️', en: 'One day, Mr Owl gives him a magic clock.', cn: '一天，猫头鹰先生送给他一个魔法钟。' },
        { e: '🕖🔔', en: '"Ring! Ring! It\'s seven o\'clock. Get up, Sunny!" says the clock.', cn: '"叮铃铃！七点了，起床啦，桑尼！"钟说。' },
        { e: '🕗🏫', en: '"It\'s eight o\'clock. Time for school!"', cn: '"八点了，该上学了！"' },
        { e: '🕘🛌', en: '"It\'s nine o\'clock. Time for bed!"', cn: '"九点了，该睡觉了！"' },
        { e: '🐿️⏰😊', en: 'Now Sunny is never late. He knows time is important.', cn: '现在桑尼再也不迟到了，他知道时间很重要。' },
      ],
      questions: [
        { q: 'What is Sunny\'s problem?', cn: '桑尼有什么问题？', options: ['He is always late.', 'He is always hungry.', 'He is always sad.'] },
        { q: 'What does Mr Owl give Sunny?', cn: '猫头鹰先生送给桑尼什么？', options: ['a magic clock', 'a book', 'a nut'] },
        { q: 'When does Sunny go to bed?', cn: '桑尼几点睡觉？', options: ["At nine o'clock", "At eight o'clock", "At seven o'clock"] },
      ],
    },
    project: {
      title: 'My Day', cn: '我的一天时间表',
      slots: { t1: TIMES, t2: TIMES, t3: TIMES, t4: TIMES, t5: TIMES },
      lines: ['I get up at {t1}.', 'I go to school at {t2}.', 'I have lunch at {t3}.', 'I do my homework at {t4}.', 'I go to bed at {t5}.', 'Time is important!'],
    },
    quiz: {
      grammar: [
        { q: "—What time ____ it? —It's seven o'clock.", options: ['is', 'are', 'am'] },
        { q: '7:30 is ____.', options: ['half past seven', 'seven half', 'half past eight'] },
        { q: '3:50 is ____.', options: ['ten to four', 'ten past three', 'ten to three'] },
        { q: 'The ____ hand is long.', options: ['minute', 'hour', 'short'] },
        { q: "I get up ____ seven o'clock.", options: ['at', 'in', 'on'] },
        { q: '8:15 is ____.', options: ['a quarter past eight', 'a quarter to eight', 'fifteen to eight'] },
        { q: "It's twelve o'clock. It's time ____ lunch.", options: ['for', 'to', 'at'] },
      ],
      order: ['What time is it?', "It's half past eleven.", "I go to bed at nine o'clock."],
      speak: [
        { cn: '看钟说时间（7:00）', e: '🕖', answer: "It's seven o'clock." },
        { cn: '看钟说时间（2:30）', e: '🕝', answer: "It's half past two." },
      ],
      reading: {
        text: "Peter gets up at half past six. He has breakfast at seven o'clock. He goes to school at a quarter past seven. School starts at eight o'clock. He has lunch at twelve. He goes home at half past four.",
        questions: [
          { q: 'When does Peter get up?', options: ['At half past six', "At seven o'clock", 'At a quarter past seven'] },
          { q: 'What time does school start?', options: ["At eight o'clock", 'At twelve', 'At half past four'] },
        ],
      },
    },
    recite: {
      title: 'My Busy Day',
      text: ["What time is it? It's seven o'clock.", "It's time to get up.", 'I go to school at half past seven.', "Classes begin at eight o'clock.", 'I go home at a quarter past four.', "I go to bed at nine o'clock.", 'Time is important.', "Let's not waste it."],
    },
  },

  // ───────────────────────────── Unit 10 Weather ─────────────────────────────
  {
    id: 'u10', no: 10, title: 'Weather', cn: '天气', island: '天气岛', icon: '🌦️', color: '#5B7FD6',
    words: [
      { en: 'weather', cn: '天气', e: '🌦️' },
      { en: 'sunny', cn: '晴朗的', e: '☀️' },
      { en: 'rainy', cn: '下雨的', e: '🌧️' },
      { en: 'cloudy', cn: '多云的', e: '☁️' },
      { en: 'windy', cn: '有风的', e: '🌬️' },
      { en: 'snowy', cn: '下雪的', e: '❄️' },
      { en: 'degree', cn: '度（温度）', e: '🌡️' },
      { en: 'weather report', cn: '天气预报', e: '📺🌦️' },
      { en: 'umbrella', cn: '雨伞', e: '☂️' },
      { en: 'warm', cn: '温暖的', e: '🌤️' },
    ],
    grammar: {
      title: "How's the weather in ……?  ……天气怎么样？",
      points: [
        { rule: "—How's the weather in Beijing?  —It's windy and cold.", tip: "How's = How is。回答用 It's + 天气词。" },
        { rule: "It's twenty degrees.  It's minus five degrees.", tip: '温度：数字 + degrees；零下用 minus。' },
        { rule: '重音 Stress：WEAther · SUNny · re-PORT · um-BREL-la', tip: '读单词时，重读的音节要读得响一点、长一点。' },
      ],
    },
    chant: {
      title: 'Rain or Shine',
      lines: [
        "Sunny days, let's fly a kite,",
        'Rainy days, read books inside.',
        'Windy, cloudy, snowy too,',
        'Every day is good for you!',
      ],
      cn: ['晴天，我们去放风筝，', '雨天，在家里读书。', '刮风、多云，还有下雪，', '每一天都是好日子！'],
    },
    dialogue: {
      title: 'The Weather Reports', cn: '和北京的朋友聊天气', scene: '📱🌦️', bot: '北京朋友 Robo',
      turns: [
        { bot: "Hello! I'm calling from Beijing.", cn: '你好！我在北京给你打电话。', kid: ["Hi! How's the weather in Beijing?"], expect: ['weather', 'how'] },
        { bot: "It's windy and cold. It's five degrees. How's the weather in Shanghai?", cn: '刮风又冷，只有五度。上海天气怎么样？', kid: ["It's sunny and warm.", "It's rainy today."], expect: ['sunny', 'warm', 'rainy', 'cloudy', 'windy', 'cold'] },
        { bot: 'What do you like to do on sunny days?', cn: '晴天你喜欢做什么？', kid: ['I like to fly a kite.', 'I like to play in the park.'], expect: ['like', 'fly', 'play', 'go', 'ride'] },
        { bot: 'It will be rainy here tomorrow. What should I take?', cn: '明天这里会下雨。我该带什么？', kid: ['You should take an umbrella.'], expect: ['umbrella', 'should'] },
        { bot: 'Thanks! Bye!', cn: '谢谢！再见！', kid: ['Bye! Have a nice day!'], expect: ['bye', 'nice', 'day'] },
      ],
    },
    game: {
      type: 'weather', title: '小小天气预报员', cn: '看天气地图回答问题，最后录一段你自己的天气预报！',
      cities: [
        { name: 'Beijing', cn: '北京', w: 'windy', e: '🌬️', t: 5, feel: 'cold' },
        { name: 'Shanghai', cn: '上海', w: 'sunny', e: '☀️', t: 20, feel: 'warm' },
        { name: 'Harbin', cn: '哈尔滨', w: 'snowy', e: '❄️', t: -10, feel: 'very cold' },
        { name: 'Guangzhou', cn: '广州', w: 'rainy', e: '🌧️', t: 25, feel: 'warm' },
        { name: 'Kunming', cn: '昆明', w: 'cloudy', e: '☁️', t: 18, feel: 'cool' },
        { name: 'Sanya', cn: '三亚', w: 'sunny', e: '☀️', t: 30, feel: 'hot' },
      ],
    },
    sound: {
      title: '单词重音 Stress', key: 'WEA-ther', type: 'stress',
      stress: [
        { w: 'weather', parts: ['wea', 'ther'], s: 0 },
        { w: 'sunny', parts: ['sun', 'ny'], s: 0 },
        { w: 'report', parts: ['re', 'port'], s: 1 },
        { w: 'degree', parts: ['de', 'gree'], s: 1 },
        { w: 'umbrella', parts: ['um', 'brel', 'la'], s: 1 },
        { w: 'tomorrow', parts: ['to', 'mor', 'row'], s: 1 },
        { w: 'cloudy', parts: ['cloud', 'y'], s: 0 },
        { w: 'today', parts: ['to', 'day'], s: 1 },
      ],
      words: ['weather', 'sunny', 'report', 'degree', 'umbrella', 'tomorrow', 'cloudy', 'today'],
      tongue: "It's SUNny toDAY, so PLAY in the PARK!",
      odd: { q: '哪个单词的重音在第二个音节？', options: ['report', 'sunny', 'windy'] },
    },
    story: {
      title: 'Animal Weather Helpers', cn: '动物天气预报员',
      pages: [
        { e: '🐸🌧️', en: 'Frogs are good weather helpers. Before rain, they croak loudly.', cn: '青蛙是天气好帮手，下雨前它们会大声呱呱叫。' },
        { e: '🐜🐜🏠', en: 'Ants move their homes before a big rain.', cn: '大雨来临前，蚂蚁会搬家。' },
        { e: '🐦⬇️', en: 'When swallows fly low, it may be rainy soon.', cn: '燕子低飞，可能很快就要下雨了。' },
        { e: '🐌🌦️', en: 'Snails come out on cloudy, wet days.', cn: '阴天潮湿的日子，蜗牛会爬出来。' },
        { e: '🐿️🌰❄️', en: 'Squirrels collect lots of nuts before a cold, snowy winter.', cn: '寒冷下雪的冬天来临前，松鼠会收集很多坚果。' },
        { e: '📺😊', en: 'Animals are special weather reporters. Can you be one too?', cn: '动物们是特别的天气预报员，你也能当一个吗？' },
      ],
      questions: [
        { q: 'What do frogs do before rain?', cn: '下雨前青蛙会做什么？', options: ['They croak loudly.', 'They sleep.', 'They fly.'] },
        { q: 'When swallows fly low, it may be ____ soon.', cn: '燕子低飞，可能很快会……', options: ['rainy', 'sunny', 'hot'] },
        { q: 'What do squirrels collect before winter?', cn: '冬天前松鼠收集什么？', options: ['nuts', 'leaves', 'flowers'] },
      ],
    },
    project: {
      title: 'Weather Reports for Two Cities', cn: '两座城市的天气预报',
      slots: {
        c1: ['Shanghai', 'Beijing', 'Harbin', 'Sanya'], w1: WEATHER, t1: ['five', 'ten', 'fifteen', 'twenty', 'thirty'],
        c2: ['Beijing', 'Shanghai', 'Kunming', 'Guangzhou'], w2: WEATHER,
        tip: ['Take an umbrella!', 'Wear a warm coat!', 'Wear a hat and drink water!', 'Fly a kite in the park!'],
      },
      lines: ['Good morning! Here is the weather report.', "It's {w1} in {c1} today.", "It's {t1} degrees.", "In {c2}, it's {w2}.", '{tip}', 'Thank you for watching!'],
    },
    quiz: {
      grammar: [
        { q: "—How's the weather ____ Harbin? —It's snowy.", options: ['in', 'at', 'on'] },
        { q: "—____ the weather today? —It's rainy.", options: ["How's", "What's", "Where's"] },
        { q: "It's ____ today. Take an umbrella.", options: ['rainy', 'sunny', 'rain'] },
        { q: "It's very cold. It's minus five ____.", options: ['degrees', 'degree', 'times'] },
        { q: "There are many clouds. It's ____.", options: ['cloudy', 'cloud', 'clouds'] },
        { q: "It's windy. Let's fly a ____.", options: ['kite', 'cake', 'bike'] },
        { q: "It's sunny ____ hot in Sanya.", options: ['and', 'but', 'or'] },
      ],
      order: ["How's the weather in Beijing?", "It's sunny and warm today.", 'Take an umbrella with you.'],
      speak: [
        { cn: '看图播报：上海今天晴天。', e: '☀️🏙️', answer: "It's sunny in Shanghai today." },
        { cn: '问一问：北京天气怎么样？', e: '❓🌦️', answer: "How's the weather in Beijing?" },
      ],
      reading: {
        text: "Here is the weather report for today. It's sunny in Sanya. It's thirty degrees. It's hot. It's snowy in Harbin. It's minus ten degrees. It's very cold. In Shanghai, it's cloudy and cool. Have a nice day!",
        questions: [
          { q: "How's the weather in Harbin?", options: ['snowy and very cold', 'sunny and hot', 'cloudy and cool'] },
          { q: "What's the temperature in Sanya?", options: ['thirty degrees', 'ten degrees', 'minus ten degrees'] },
        ],
      },
    },
    recite: {
      title: 'Weather Report',
      text: ['Good morning, everyone!', 'Here is the weather report.', "It's sunny in Shanghai today.", "It's twenty degrees.", "It's warm and nice.", "In Beijing, it's windy and cold.", "It's only five degrees.", 'Please wear a warm coat.', 'Have a nice day!'],
    },
  },
];
