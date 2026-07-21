#!/usr/bin/env bash
# 一键同步代码 + Claude Code 对话记录
# 用法: bash scripts/sync-all.sh [start|end]
#
#   start - 开始工作时：拉取最新代码和对话记录（VSCode 打开项目时自动运行）
#   end   - 结束工作时：推送代码和对话记录

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ACTION="${1:-start}"

if [ "$ACTION" = "start" ]; then
  echo "🌅 开始工作：拉取最新代码和对话记录..."
  echo ""
  echo "[1/2] 拉取代码..."
  cd "$PROJECT_DIR"
  git pull --rebase 2>&1 || echo "  ⚠ 代码拉取失败（可能有未提交改动或网络问题）"
  echo ""
  echo "[2/2] 拉取 Claude 对话记录..."
  bash "$SCRIPT_DIR/sync-claude.sh" pull 2>&1 || echo "  ⚠ 对话记录拉取失败"
  echo ""
  echo "✓ 准备就绪，可以开始工作"

elif [ "$ACTION" = "end" ]; then
  echo "🌙 结束工作：推送代码和对话记录..."
  echo ""
  echo "[1/2] 推送 Claude 对话记录..."
  bash "$SCRIPT_DIR/sync-claude.sh" push 2>&1 || echo "  ⚠ 对话记录推送失败"
  echo ""
  echo "[2/2] 推送代码..."
  cd "$PROJECT_DIR"
  if [ -n "$(git status --porcelain)" ]; then
    echo "  ⚠ 检测到未提交的代码改动，请先手动提交："
    echo "    git add -A && git commit -m \"...\""
  fi
  git push 2>&1 || echo "  ⚠ 代码推送失败"
  echo ""
  echo "✓ 已同步到云端"

else
  echo "用法: bash scripts/sync-all.sh [start|end]"
  echo "  start - 开始工作：拉取代码和对话记录"
  echo "  end   - 结束工作：推送代码和对话记录"
  exit 1
fi
