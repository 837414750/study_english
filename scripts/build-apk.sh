#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# 松鼠英语岛 · 一键打包 APK（可安装到小米平板 5）
#
#   bash scripts/build-apk.sh             普通调试版（默认）
#   bash scripts/build-apk.sh --cn        国内网络：npm / Gradle / Maven 走国内镜像
#   bash scripts/build-apk.sh --release   正式签名版（第一次会生成 keystore/，请务必备份）
#   bash scripts/build-apk.sh --clean     删除旧的 android/ 工程重新生成
#   bash scripts/build-apk.sh --install   编译后直接装到已用 USB 连接的平板（需开 USB 调试）
#   可组合，例如： bash scripts/build-apk.sh --cn --release --install
#
# 模型下载慢时：先用浏览器下载
#   https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip
# 再执行：
#   MODEL_ZIP=~/Downloads/vosk-model-small-en-us-0.15.zip bash scripts/build-apk.sh --cn
#
# 需要：Node.js 20+、JDK 21、Android SDK（装 Android Studio 即自带，或 export ANDROID_HOME）
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")/.."

# ── 解析参数 ───────────────────────────────────────────────────────────────────
CN=0; RELEASE=0; CLEAN=0; INSTALL=0
for a in "$@"; do
  case "$a" in
    --cn) CN=1 ;;
    --release) RELEASE=1 ;;
    --clean) CLEAN=1 ;;
    --install) INSTALL=1 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "⚠ 未知参数：$a（可用：--cn --release --clean --install）" ;;
  esac
done
export SE_CN="$CN"

step() { echo ""; echo "── $1 ─────────────────────────────────────────"; }
die()  { echo "✘ $1" >&2; exit 1; }

echo "== 松鼠英语岛 · 打包 APK =="
[ "$CN" = 1 ]      && echo "  模式：国内镜像 (--cn)"
[ "$RELEASE" = 1 ] && echo "  模式：正式签名版 (--release)"
[ "$CLEAN" = 1 ]   && echo "  模式：清理重建 (--clean)"
[ "$INSTALL" = 1 ] && echo "  模式：编译后安装到平板 (--install)"

# ── 1/7 环境检查 ──────────────────────────────────────────────────────────────
step "1/7 检查打包环境"
command -v node >/dev/null || die "请先安装 Node.js 20+（推荐用 nvm：nvm install 20）"
NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
[ "${NODE_MAJOR:-0}" -ge 20 ] || die "当前 Node 版本 v$(node -v | sed 's/^v//')，Capacitor 7 需要 Node 20+。请 nvm use 20 后重试。"
echo "  Node.js $(node -v)"

command -v java >/dev/null || die "请先安装 JDK 21（Capacitor 7 需要）。macOS： brew install --cask zulu@21"
JAVA_MAJOR=$(java -version 2>&1 | head -1 | sed -E 's/.*version "([0-9]+).*/\1/')
if [ "${JAVA_MAJOR:-0}" -lt 17 ]; then
  die "当前 Java 版本为 $JAVA_MAJOR，Capacitor 7 需要 JDK 21（至少 17）。macOS： brew install --cask zulu@21，然后 export JAVA_HOME=\$(/usr/libexec/java_home -v 21)"
elif [ "${JAVA_MAJOR:-0}" -lt 21 ]; then
  echo "  ⚠ Java $JAVA_MAJOR 可编译，但 Capacitor 7 官方要求 JDK 21，建议升级。"
else
  echo "  Java $JAVA_MAJOR"
fi

if [ -z "${ANDROID_HOME:-}" ] && [ -z "${ANDROID_SDK_ROOT:-}" ]; then
  for d in "$HOME/Library/Android/sdk" "$HOME/Android/Sdk" "/usr/local/share/android-sdk" "/usr/local/lib/android/sdk"; do
    [ -d "$d" ] && export ANDROID_HOME="$d" && break
  done
fi
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
[ -n "$SDK" ] || die "没找到 Android SDK。装好 Android Studio 后重试，或 export ANDROID_HOME=/你的/sdk/路径"
export ANDROID_HOME="$SDK"; export ANDROID_SDK_ROOT="$SDK"
echo "  Android SDK: $SDK"
# android 工程需要一个 local.properties 指向 SDK
command -v adb >/dev/null || export PATH="$PATH:$SDK/platform-tools:$SDK/cmdline-tools/latest/bin"

# ── 2/7 安装依赖 ──────────────────────────────────────────────────────────────
step "2/7 安装依赖"
if [ "$CN" = 1 ]; then
  echo "  使用国内 npm 镜像 registry.npmmirror.com"
  npm install --registry=https://registry.npmmirror.com
else
  npm install
fi

# ── 3/7 准备离线语音资源（vosk.js + 识别模型）────────────────────────────────
step "3/7 准备离线语音识别资源"
bash scripts/prepare-assets.sh

# ── 4/7 内容自检 ──────────────────────────────────────────────────────────────
step "4/7 课程内容与打分算法自检"
node scripts/selftest.mjs

# ── 5/7 生成 / 修补安卓工程 ──────────────────────────────────────────────────
step "5/7 生成并修补安卓工程"
if [ "$CLEAN" = 1 ] && [ -d android ]; then
  echo "  删除旧的 android/ 工程（--clean）"
  rm -rf android
fi
if [ ! -d android ]; then
  echo "  首次生成 android 工程 ..."
  npx --yes cap add android
fi
# 写 local.properties，保证 Gradle 找得到 SDK
printf 'sdk.dir=%s\n' "$SDK" > android/local.properties
# 权限、图标、应用名、版本号、（--cn 时）国内 Maven/Gradle 镜像
node scripts/patch-android.mjs
# 把 www/ 复制进工程并注册插件
npx --yes cap sync android

# ── 6/7 编译 ─────────────────────────────────────────────────────────────────
step "6/7 Gradle 编译（首次下载依赖较慢，请耐心等待）"
mkdir -p dist
pushd android >/dev/null
chmod +x gradlew
GRADLE_FLAGS=""
[ "$CN" = 1 ] && GRADLE_FLAGS="--no-daemon"

if [ "$RELEASE" = 1 ]; then
  # ---- 正式签名版 ----
  KS_DIR="../keystore"; KS="$KS_DIR/squirrel-english.jks"; KS_PROP="$KS_DIR/keystore.properties"
  mkdir -p "$KS_DIR"
  if [ ! -f "$KS" ]; then
    echo "  未找到签名证书，生成新的（有效期 30 年）：$KS"
    STORE_PW="squirrel$(date +%s | tail -c 6)"
    keytool -genkeypair -v -keystore "$KS" -alias squirrel -keyalg RSA -keysize 2048 -validity 10950 \
      -storepass "$STORE_PW" -keypass "$STORE_PW" \
      -dname "CN=Squirrel English, OU=Family, O=Family, L=Shanghai, S=Shanghai, C=CN"
    printf 'storeFile=squirrel-english.jks\nstorePassword=%s\nkeyAlias=squirrel\nkeyPassword=%s\n' "$STORE_PW" "$STORE_PW" > "$KS_PROP"
    echo "  ⚠⚠ 请务必备份整个 keystore/ 目录！换证书后老用户将无法覆盖升级。"
  fi
  # shellcheck disable=SC1090
  STORE_PW=$(grep storePassword "$KS_PROP" | cut -d= -f2)
  KEY_ALIAS=$(grep keyAlias "$KS_PROP" | cut -d= -f2)
  KEY_PW=$(grep keyPassword "$KS_PROP" | cut -d= -f2)

  ./gradlew $GRADLE_FLAGS assembleRelease
  UNSIGNED=$(find app/build/outputs/apk/release -name '*.apk' | head -1)
  [ -n "$UNSIGNED" ] || die "没找到 release APK，编译可能失败"

  # zipalign + apksigner（从 build-tools 里找最新版本）
  BT=$(ls -d "$SDK"/build-tools/* 2>/dev/null | sort -V | tail -1)
  [ -n "$BT" ] || die "没找到 build-tools，请在 Android Studio 的 SDK Manager 里安装 Build-Tools"
  "$BT/zipalign" -f 4 "$UNSIGNED" app/build/outputs/apk/release/aligned.apk
  "$BT/apksigner" sign --ks "../keystore/squirrel-english.jks" \
    --ks-pass "pass:$STORE_PW" --ks-key-alias "$KEY_ALIAS" --key-pass "pass:$KEY_PW" \
    --out app/build/outputs/apk/release/signed.apk app/build/outputs/apk/release/aligned.apk
  popd >/dev/null
  cp android/app/build/outputs/apk/release/signed.apk dist/squirrel-english.apk
else
  # ---- 调试版 ----
  ./gradlew $GRADLE_FLAGS assembleDebug
  popd >/dev/null
  cp android/app/build/outputs/apk/debug/app-debug.apk dist/squirrel-english.apk
fi
APK=dist/squirrel-english.apk
echo "  已生成 $APK"

# ── 7/7 校验 APK 内容 ────────────────────────────────────────────────────────
step "7/7 检查 APK 内容"
# 这一段只是只读校验：关掉 errexit/pipefail，避免 grep 命中后提前关管道触发 Broken pipe 被误判为失败
set +e +o pipefail
PASS=0; FAIL=0
LIST_FILE="$(mktemp)"; TTS_FILE="$(mktemp)"
unzip -l "$APK" > "$LIST_FILE"
unzip -p "$APK" assets/capacitor.plugins.json > "$TTS_FILE" 2>/dev/null
has()  { grep -q "$1" "$LIST_FILE"; }           # 基于临时文件，无管道，不会有 SIGPIPE
ok()   { echo "  ✅ $1"; PASS=$((PASS+1)); }
no()   { echo "  ❌ $1"; FAIL=$((FAIL+1)); }

# 1 网页内核
if has "assets/public/index.html" && has "assets/public/js/app.js"; then ok "网页内核（index.html + js/app.js）"; else no "网页内核缺失"; fi
# 2 课程内容
if has "assets/public/js/content/units-a.js" && has "assets/public/js/content/units-b.js"; then ok "课程内容（11 个单元）"; else no "课程内容缺失"; fi
# 3 离线识别引擎
if has "assets/public/lib/vosk.js"; then ok "离线识别引擎 vosk.js"; else no "vosk.js 缺失（请检查 prepare-assets）"; fi
# 4 识别模型 >30MB
MODEL_BYTES=$(grep -m1 "assets/public/models/.*\.tar\.gz" "$LIST_FILE" | awk '{print $1}')
if [ -n "$MODEL_BYTES" ] && [ "$MODEL_BYTES" -gt 31457280 ]; then
  ok "识别模型 ($((MODEL_BYTES/1024/1024)) MB)"
else
  no "识别模型缺失或过小（应 >30MB，实际 ${MODEL_BYTES:-0} 字节）"
fi
# 5 TextToSpeech 插件注册
if grep -q "text-to-speech" "$TTS_FILE" 2>/dev/null; then
  ok "TextToSpeech 插件已注册"
elif unzip -p "$APK" classes.dex classes2.dex classes3.dex 2>/dev/null | grep -qa "TextToSpeechPlugin"; then
  ok "TextToSpeech 插件已编入"
else
  no "没检测到 TextToSpeech 插件（原生发音可能不可用）"
fi
rm -f "$LIST_FILE" "$TTS_FILE"
# 6 RECORD_AUDIO 权限
AAPT=$(ls -d "$SDK"/build-tools/*/aapt 2>/dev/null | sort -V | tail -1 || true)
if [ -n "$AAPT" ] && "$AAPT" dump permissions "$APK" 2>/dev/null | grep -q "android.permission.RECORD_AUDIO"; then
  ok "RECORD_AUDIO 麦克风权限"
elif grep -q "android.permission.RECORD_AUDIO" android/app/src/main/AndroidManifest.xml 2>/dev/null; then
  ok "RECORD_AUDIO 麦克风权限（源 Manifest 已含）"
else
  no "缺少 RECORD_AUDIO 权限"
fi
# 7 APK 体积合理
APK_BYTES=$(wc -c < "$APK")
if [ "$APK_BYTES" -gt 33554432 ]; then
  ok "APK 体积 $((APK_BYTES/1024/1024)) MB（含离线模型，正常）"
else
  no "APK 体积仅 $((APK_BYTES/1024/1024)) MB，可能没打进模型"
fi

echo ""
echo "  校验结果：$PASS/7 通过$([ "$FAIL" -gt 0 ] && echo "，$FAIL 项未通过" || true)"
[ "$FAIL" -eq 0 ] || die "APK 校验未全部通过，请查看上面的 ❌ 项并修复根因后重新打包。"
set -e  # 校验通过，恢复严格模式

# ── 可选：安装到平板 ─────────────────────────────────────────────────────────
if [ "$INSTALL" = 1 ]; then
  step "安装到已连接的平板"
  command -v adb >/dev/null || die "没找到 adb。请把 \$ANDROID_HOME/platform-tools 加入 PATH。"
  DEVS=$(adb devices | grep -cw device || true)
  [ "$DEVS" -ge 1 ] || die "没检测到设备。请用 USB 连接平板并在「开发者选项」里打开「USB 调试」，首次连接要在平板上点「允许」。"
  adb install -r "$APK"
  echo "  ✔ 已安装到平板，去桌面找「松鼠英语岛」图标。"
fi

echo ""
echo "✔ 打包完成：$APK  ($(du -h "$APK" | cut -f1))"
echo "  把它传到小米平板（微信/数据线/网盘均可），点击安装即可。"
[ "$RELEASE" = 1 ] && echo "  ⚠ 记得备份 keystore/ 目录，以后升级要用同一个证书。"
