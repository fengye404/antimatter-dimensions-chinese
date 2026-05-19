#!/bin/bash
# Antimatter Dimensions 中文版构建脚本
# 
# 使用方法: bash scripts/build-chinese.sh
#
set -e

echo "========================================"
echo "  反物质维度 - 中文版构建"
echo "========================================"
echo ""

# 1. 构建原版
echo "[1/3] 构建原版游戏..."
npm run build:master
echo "✓ 原版构建完成"
echo ""

# 2. 中文版构建后处理
echo "[2/3] 处理中文版构建产物..."
node i18n/inject.js
echo "✓ 中文版构建后处理完成"
echo ""

# 3. 验证
echo "[3/3] 验证构建输出..."
if [ -f "dist/index.html" ]; then
  if grep -q "__AD_I18N__" dist/index.html; then
    echo "✗ 错误: 构建产物仍包含运行时翻译注入"
    exit 1
  else
    echo "✓ 未注入运行时翻译引擎"
  fi
  
  if grep -q "反物质维度" dist/index.html; then
    echo "✓ 页面标题已翻译"
  else
    echo "⚠ 警告: 页面标题未翻译"
  fi
  
  echo ""
  echo "========================================"
  echo "  ✅ 中文版构建完成！"
  echo "  输出目录: dist/"
  echo "========================================"
else
  echo "✗ 错误: dist/index.html 不存在"
  exit 1
fi
