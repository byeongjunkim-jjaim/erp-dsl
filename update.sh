#!/usr/bin/env bash
# 사용법: ./update.sh <압축푼-폴더> [patch|minor|major]
#   예) ./update.sh ~/Downloads/erp-dsl-n minor
#
# 하는 일: 웹에서 받은 최신본을 이 레포에 덮어쓰고(=.npmrc·.git·node_modules 보존),
#          버전 올리고, push하고, GitHub Packages에 발행한다.
set -euo pipefail

SRC="${1:-}"
BUMP="${2:-patch}"
REPO="$(cd "$(dirname "$0")" && pwd)"

# --- 입력 검증 ---
if [[ -z "$SRC" ]]; then
  echo "❌ 사용법: ./update.sh <압축푼-폴더> [patch|minor|major]"
  echo "   예)    ./update.sh ~/Downloads/erp-dsl-n minor"
  exit 1
fi
SRC="${SRC%/}"                          # 끝 슬래시 제거
if [[ ! -d "$SRC" ]]; then
  echo "❌ 폴더가 없습니다: $SRC"
  exit 1
fi
if [[ ! -f "$SRC/package.json" ]]; then
  echo "⚠️  $SRC 안에 package.json이 안 보입니다. 압축이 한 겹 더 들어가 있을 수 있어요."
  echo "    (예: $SRC/package/ 또는 $SRC/erp-dsl/ 안을 가리켜야 할 수도)"
  exit 1
fi

echo "▶ 재료: $SRC"
echo "▶ 공장: $REPO"
echo "▶ 버전: $BUMP"
echo

# --- 1. 덮어쓰기 (.git·node_modules·.npmrc·update.sh 보존) ---
# 웹에서 받은 건 '소스 트리'다. 레포의 발행 설정(package.json)·git 설정(.gitignore)·
# 인증(.npmrc)은 레포가 주인이므로 절대 덮어쓰지 않는다.
# (웹 package.json이 @your-org placeholder라 덮으면 발행이 깨졌던 사고 방지)
# 버전업은 아래 npm version이 담당하므로, 웹의 version 값도 가져오지 않는다.
rsync -av --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.npmrc' \
  --exclude='.gitignore' \
  --exclude='.npmignore' \
  --exclude='package.json' \
  --exclude='update.sh' \
  "$SRC/" "$REPO/"

cd "$REPO"

# --- 2. 변경 없으면 종료 ---
if [[ -z "$(git status --porcelain)" ]]; then
  echo "✅ 바뀐 내용이 없습니다. 발행할 것 없음."
  exit 0
fi

# --- 3. 변경 요약 + tar 검수 ---
echo
echo "=== 바뀐 파일 ==="
git status --short
echo
echo "=== 이번에 발행될 파일(검수) ==="
npm pack --dry-run 2>&1 | grep 'npm notice' | grep -iE '\.(ts|tsx|md|json|css)$' || true
echo

# --- 4. 확인 후 발행 ---
read -r -p "위 내용으로 커밋·$BUMP 버전업·발행할까요? [y/N] " ans
if [[ "$ans" != "y" && "$ans" != "Y" ]]; then
  echo "🛑 중단. (덮어쓰기는 이미 반영됨 — git restore로 되돌릴 수 있음)"
  exit 0
fi

git add -A
git commit -m "sync: 웹 최신본 반영"
npm version "$BUMP" -m "release: %s"
git push --follow-tags
npm publish

echo
echo "🎉 발행 완료. 소비자는 'npm install @byeongjunkim-jjaim/erp-dsl@latest' 로 받으면 됨."
