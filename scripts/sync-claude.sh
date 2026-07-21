#!/usr/bin/env bash
# 同步 Claude Code 对话记录到 GitHub 私有仓库
# 用法: bash scripts/sync-claude.sh [push|pull]
#
# 原理: Claude Code 的对话记录存储在 ~/.claude/ 下的普通文件
#       (projects/*.jsonl、plans/、memory/、settings.json)。
#       用一个 GitHub 私有仓库管理它们，即可跨机器同步。
#
# 初次使用前，需先初始化 ~/.claude 的 git 仓库并关联远程私有仓库。
set -e

CLAUDE_DIR="$HOME/.claude"

if [ ! -d "$CLAUDE_DIR/.git" ]; then
  echo "✗ $CLAUDE_DIR 尚未初始化为 git 仓库"
  echo "  请先在 ~/.claude 执行: git init && git remote add origin <你的私有仓库地址>"
  echo "  并创建 .gitignore 排除 .credentials.json 等敏感文件"
  exit 1
fi

cd "$CLAUDE_DIR"
ACTION="${1:-push}"

if [ "$ACTION" = "push" ]; then
  echo "→ 同步 Claude Code 记录到云端 (push)..."
  git add -A
  git commit -m "sync claude history $(date +%Y-%m-%d_%H:%M)" || echo "  (无变更可提交)"
  git pull --rebase || true
  git push
  echo "✓ 完成"
elif [ "$ACTION" = "pull" ]; then
  echo "→ 从云端拉取 Claude Code 记录 (pull)..."
  git pull
  echo "✓ 完成"
else
  echo "用法: bash scripts/sync-claude.sh [push|pull]"
  exit 1
fi
