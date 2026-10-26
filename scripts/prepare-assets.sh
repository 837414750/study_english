#!/usr/bin/env bash
# 准备离线语音识别所需的两个文件：
#   www/lib/vosk.js                                  —— 浏览器端离线识别引擎（来自 npm 包 vosk-browser）
#   www/models/vosk-model-small-en-us-0.15.tar.gz    —— 英文小模型（约 40MB）
set -euo pipefail
cd "$(dirname "$0")/.."

MODEL_NAME="vosk-model-small-en-us-0.15"
MODEL_TGZ="www/models/${MODEL_NAME}.tar.gz"
MODEL_URL="${VOSK_MODEL_URL:-https://alphacephei.com/vosk/models/${MODEL_NAME}.zip}"

# 1) vosk.js
if [ ! -f node_modules/vosk-browser/dist/vosk.js ]; then
  echo "▶ 未找到 node_modules，先执行 npm install ..."
  npm install
fi
mkdir -p www/lib www/models
cp node_modules/vosk-browser/dist/vosk.js www/lib/vosk.js
echo "✔ 已复制 www/lib/vosk.js"

# 2) 模型
if [ -f "$MODEL_TGZ" ]; then
  echo "✔ 模型已存在：$MODEL_TGZ（如需重新下载，删除后再运行）"
  exit 0
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
LOCAL_ZIP="${MODEL_ZIP:-}"
if [ -n "$LOCAL_ZIP" ] && [ -f "$LOCAL_ZIP" ]; then
  echo "▶ 使用本地模型压缩包：$LOCAL_ZIP"
  cp "$LOCAL_ZIP" "$TMP/model.zip"
else
  echo "▶ 下载英文识别模型（约 40MB）：$MODEL_URL"
  echo "  如果网络慢，可以先用浏览器下载该 zip，再执行： MODEL_ZIP=/路径/${MODEL_NAME}.zip npm run prepare-assets"
  curl -L --fail --retry 3 -o "$TMP/model.zip" "$MODEL_URL"
fi

( cd "$TMP" && unzip -q model.zip )
SRC_DIR="$(find "$TMP" -maxdepth 2 -type d -name 'am' -prune -exec dirname {} \; | head -1)"
if [ -z "$SRC_DIR" ]; then
  echo "✘ 解压后没找到模型目录（应包含 am/ conf/ graph/ 等子目录）"; exit 1
fi
# vosk-browser 期望 tar.gz 内是一个顶层目录，里面是 am/ conf/ graph/ ivector/
rm -rf "$TMP/model" && mv "$SRC_DIR" "$TMP/model"
tar -czf "$MODEL_TGZ" -C "$TMP" model
echo "✔ 已生成 $MODEL_TGZ  ($(du -h "$MODEL_TGZ" | cut -f1))"
