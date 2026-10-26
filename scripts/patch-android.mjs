// 给 Capacitor 生成的安卓工程补上麦克风权限、屏幕设置。可重复执行。
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifest = path.join(root, 'android/app/src/main/AndroidManifest.xml');
if (!fs.existsSync(manifest)) {
  console.error('✘ 没找到 android 工程，请先执行 npx cap add android');
  process.exit(1);
}
let xml = fs.readFileSync(manifest, 'utf8');
const perms = [
  'android.permission.RECORD_AUDIO',
  'android.permission.MODIFY_AUDIO_SETTINGS',
  'android.permission.INTERNET',
];
for (const p of perms) {
  if (!xml.includes(`"${p}"`)) {
    xml = xml.replace('<application', `<uses-permission android:name="${p}" />\n    <application`);
  }
}
// 让 App 能查询系统里的 TTS 引擎（Android 11+ 包可见性要求）
if (!xml.includes('android.intent.action.TTS_SERVICE')) {
  xml = xml.replace('<application', `<queries>\n        <intent>\n            <action android:name="android.intent.action.TTS_SERVICE" />\n        </intent>\n    </queries>\n    <application`);
}
// 平板上保持屏幕常亮由网页控制；这里只允许横竖屏自由旋转
xml = xml.replace(/android:screenOrientation="[^"]*"/g, '');
fs.writeFileSync(manifest, xml);
console.log('✔ AndroidManifest.xml 已补充麦克风与 TTS 查询权限');

// ── 版本号：从 package.json 同步到 app/build.gradle ──────────────────────────
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const [maj = 0, min = 0, pat = 0] = String(pkg.version || '1.0.0').split('.').map((n) => parseInt(n, 10) || 0);
const versionCode = maj * 10000 + min * 100 + pat; // 1.0.0 -> 10000
const appGradle = path.join(root, 'android/app/build.gradle');
if (fs.existsSync(appGradle)) {
  let g = fs.readFileSync(appGradle, 'utf8');
  g = g.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
       .replace(/versionName\s+"[^"]*"/, `versionName "${pkg.version || '1.0.0'}"`);
  // 关键：告诉 aapt 不要压缩/改动识别模型，保持 .tar.gz 原样打包（否则会被改成 .tar、
  // 甚至解压，导致运行时 vosk 加载模型失败）。
  if (!g.includes('androidResources') || !/noCompress[^\n]*gz/.test(g)) {
    g = g.replace(/android\s*\{/, (m) => `${m}\n    androidResources {\n        noCompress 'tar.gz', 'tar', 'gz'\n    }`);
    console.log("✔ 已为识别模型加 noCompress（保持 .tar.gz 原样打包）");
  }
  fs.writeFileSync(appGradle, g);
  console.log(`✔ 版本号 versionName=${pkg.version} versionCode=${versionCode}`);
}

// ── 国内镜像（--cn）：给 Gradle / Maven 加阿里云镜像，加速依赖下载 ──────────────
if (process.env.SE_CN === '1') {
  const mirrors = `
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/central' }
        maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
        maven { url 'https://maven.aliyun.com/repository/public' }`;
  for (const f of ['android/build.gradle', 'android/settings.gradle']) {
    const fp = path.join(root, f);
    if (!fs.existsSync(fp)) continue;
    let s = fs.readFileSync(fp, 'utf8');
    if (!s.includes('maven.aliyun.com')) {
      // 在每个 repositories { 之后插入镜像（优先走镜像，失败再回退官方源）
      s = s.replace(/repositories\s*\{/g, (m) => m + mirrors);
      fs.writeFileSync(fp, s);
      console.log(`✔ 已给 ${f} 添加阿里云 Maven 镜像`);
    }
  }
  // Gradle 发行包走腾讯云镜像
  const wrap = path.join(root, 'android/gradle/wrapper/gradle-wrapper.properties');
  if (fs.existsSync(wrap)) {
    let w = fs.readFileSync(wrap, 'utf8');
    if (w.includes('services.gradle.org')) {
      w = w.replace('https\\://services.gradle.org/distributions', 'https\\://mirrors.cloud.tencent.com/gradle');
      fs.writeFileSync(wrap, w);
      console.log('✔ Gradle 发行包改用腾讯云镜像');
    }
  }
}

// 应用名（中文）
const strings = path.join(root, 'android/app/src/main/res/values/strings.xml');
if (fs.existsSync(strings)) {
  let s = fs.readFileSync(strings, 'utf8');
  s = s.replace(/<string name="app_name">[^<]*<\/string>/, '<string name="app_name">松鼠英语岛</string>')
       .replace(/<string name="title_activity_main">[^<]*<\/string>/, '<string name="title_activity_main">松鼠英语岛</string>');
  fs.writeFileSync(strings, s);
}

// 用自带的松鼠图标替换默认图标（若存在 PNG）
const iconSrc = path.join(root, 'www/assets/icon-512.png');
if (fs.existsSync(iconSrc)) {
  const resDir = path.join(root, 'android/app/src/main/res');
  for (const d of fs.readdirSync(resDir)) {
    if (!d.startsWith('mipmap-')) continue;
    for (const f of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
      const target = path.join(resDir, d, f);
      if (fs.existsSync(target)) fs.copyFileSync(iconSrc, target);
    }
  }
  // 自适应图标的 xml 会引用 foreground，删除 anydpi 版本让系统直接用 PNG
  const anydpi = path.join(resDir, 'mipmap-anydpi-v26');
  if (fs.existsSync(anydpi)) fs.rmSync(anydpi, { recursive: true, force: true });
  console.log('✔ 已替换应用图标');
}
