# 🐿️ 松鼠英语岛

给上海四年级孩子用的**离线**英语学习 App，内容对应**上海教育出版社 2024 版《英语》四年级上册（五·四学制）**：Starter + Unit 1~10。
运行在小米平板 5（Android）上，不联网、不上传任何录音。

## 功能一览

| 模块 | 说明 |
|---|---|
| 🗺️ 冒险地图 | 11 座岛对应 11 个单元。测验和背诵都 ≥ 过关线（默认 90）才点亮并解锁下一座；可设置"学校已学到第几单元"直接开放 |
| 📅 今日任务 | 先复习到期卡片 → 再学当前单元的下一关 → 测验低于 70 分时先回去补基础 |
| 7 个关卡 | 单词岛 · 歌谣屋 · 对话馆（和机器人 Robo 情景对话）· 语法游戏 · 语音站 · 故事屋 · 大任务 |
| 🎮 语法游戏 | 每单元一个：快反应、校园寻宝、猜同学、动物直播间、环球生日、水乡侦探、秋天感叹机、早餐日历、诚实小法官、时间大富翁、天气预报员 |
| 📝 单元测验 | 听力 20 · 词汇 20 · 语法 30 · 口语 20 · 阅读 10，满分 100；没过关只重做错题 |
| 🎤 背诵挑战 | 看全文 → 挖空 → 首字母 → 完全背诵四步；完整度 50 + 准确度 30 + 流利度 20；没过关只补背橙色句子 |
| 🔁 复习本 | Leitner 卡片盒 + 艾宾浩斯间隔（1/2/4/7/15/30 天），单词、句子、错题都会进来 |
| 🐿️ 宠物 / 收集册 / 作品墙 | 经验升级换装、喂松果、单词卡金银卡、大任务作品和录音 |
| 👨‍👩‍👧 家长中心 | 学习报告、薄弱点、录音回放与人工判定、**内容池**（自己加单词/句子/课本课文/测验题，支持批量粘贴和 JSON 导入导出）、过关线和时长等设置 |

所有对话、歌谣、故事、背诵短文均为原创，课本原文可由家长在"内容池"里自行录入。

## 打包 APK（任选一种）

### 方式 A：在你的 Mac 上打包（推荐）

需要：**Node.js 20+**、**JDK 21**、Android Studio（装好后会自带 Android SDK）。
> macOS 快速装齐：`nvm install 20 && nvm use 20`；`brew install --cask zulu@21`；再装一次 Android Studio 并在 SDK Manager 里装好 Android SDK 和 Build-Tools。

```bash
cd squirrel-english
bash scripts/build-apk.sh            # 普通调试版（默认）
bash scripts/build-apk.sh --cn       # 国内网络：npm / Gradle / Maven 走国内镜像
bash scripts/build-apk.sh --release  # 正式签名版（第一次会生成 keystore/，务必备份）
bash scripts/build-apk.sh --clean    # 删掉旧的 android/ 工程重新生成
bash scripts/build-apk.sh --install  # 编译后直接装到已用 USB 连接的平板
# 可组合： bash scripts/build-apk.sh --cn --release --install
```

脚本分 7 步：① 检查 Node/JDK/SDK → ② 安装依赖 → ③ 复制离线识别引擎、下载英文识别模型（约 40MB）→
④ 内容自检 → ⑤ 生成安卓工程并补上麦克风权限、图标、应用名、版本号 → ⑥ Gradle 编译 →
⑦ **校验 APK 内容（7 项：网页内核 / 课程内容 / vosk.js / 模型>30MB / TextToSpeech 插件 / RECORD_AUDIO 权限 / 体积）**。
7 项全过才算成功，完成后得到 **`dist/squirrel-english.apk`**。

> 模型下载慢的话：先用浏览器下载 `https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip`，然后
> `MODEL_ZIP=~/Downloads/vosk-model-small-en-us-0.15.zip bash scripts/build-apk.sh --cn`
>
> 加 `--cn` 后脚本会自动给 Gradle/Maven 配好阿里云、腾讯云镜像，不用手动改 `build.gradle`。

### 方式 B：GitHub 云端打包

把整个文件夹推到一个 GitHub 仓库，`.github/workflows/build-apk.yml` 会自动打包；在仓库的 **Actions → 最新一次运行 → Artifacts** 下载 `squirrel-english-apk`。

## 安装到小米平板 5

1. 把 apk 传到平板（微信文件传输、数据线、网盘都可以），点击安装；提示"未知来源"时允许即可。
2. 第一次打开：允许**麦克风**权限。
3. **英文发音**：App 使用系统的文字转语音引擎。若听不到英文，打开「设置 → 更多设置 → 语言和输入法 → 文字转语音输出」，选择支持英语的引擎并下载英语语音数据（可在应用商店安装 Google 文字转语音，或开源的 sherpa-onnx TTS Engine）。App 内「家长中心 → 设置」可试听。
4. 离线识别模型首次加载约 10~30 秒，之后会快很多。

## 在电脑上预览

```bash
npm run prepare-assets   # 可选：准备离线识别（不准备则用 Chrome 自带识别）
npm run serve            # 打开 http://localhost:8080 （请用 Chrome）
```

## 目录结构

```
www/                     网页内核（打包进 APK）
  index.html
  css/app.css
  js/app.js              路由、学习时长、宠物升级
  js/content/            11 个单元的原创内容（units-a.js / units-b.js）
  js/store.js            进度、设置、内容池、录音（localStorage + IndexedDB）
  js/speech.js           发音（安卓原生 TTS）+ 离线识别（Vosk）+ 录音
  js/scoring.js          逐词对齐打分（背诵/跟读/对话意图匹配）
  js/srs.js              记忆曲线复习、今日计划
  js/screens/            各页面
  js/games/              11 个语法游戏
  lib/vosk.js            ← prepare-assets 生成
  models/*.tar.gz        ← prepare-assets 生成
scripts/                 打包、预览、自检脚本
```

## 自己扩展内容

最简单的是在 App 里「家长中心 → 内容池」添加。想批量加，用"导入 JSON"，格式：

```json
{
  "type": "squirrel-english-content", "v": 1,
  "custom": {
    "u1": {
      "words": [{ "en": "playground", "cn": "操场", "e": "🛝" }],
      "sentences": [{ "en": "Let's meet in the library.", "cn": "我们在图书馆见。" }],
      "recite": [{ "title": "课本 p.10", "text": ["This is my school.", "It is very big."] }],
      "quiz": [{ "q": "There ____ a big hall.", "options": ["is", "are", "am"] }]
    }
  }
}
```

单元编号：`starter`、`u1`~`u10`；`quiz.options` 第一个是正确答案。也可以直接改 `www/js/content/` 里的源文件，改完运行 `npm run check` 自检。
