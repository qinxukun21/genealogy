<template>
  <view class="tree-page">
    <view class="header">
      <text class="title">{{ family.name }}家族树</text>
      <text class="sub">共 {{ memberCount }} 人 · {{ generationCount }} 世</text>
    </view>

    <view class="legend">
      <view class="legend-item"><view class="shape male"></view><text>男</text></view>
      <view class="legend-item"><view class="shape female"></view><text>女</text></view>
      <text class="legend-tip">左右滑动浏览 · 点击节点查看详情</text>
    </view>

    <scroll-view scroll-x class="tree-scroll" v-if="layout">
      <view class="tree-canvas" :style="{ width: layout.width + 'rpx', height: layout.height + 'rpx' }">
        <!-- 连线 -->
        <view
          v-for="(line, i) in layout.lines"
          :key="'l' + i"
          class="line"
          :style="lineStyle(line)"
        />
        <!-- 节点 -->
        <view
          v-for="node in layout.nodes"
          :key="node.id"
          class="node"
          :class="node.gender"
          :style="{ left: node.x + 'rpx', top: node.y + 'rpx' }"
          @click="goDetail(node.id)"
        >
          <text class="node-name">{{ node.name }}</text>
          <text class="node-gen">{{ chineseNum(node.generation) }}世</text>
        </view>
      </view>
    </scroll-view>

    <view v-else class="empty"><text>暂无族谱数据</text></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFamilyStore, type TreeNode } from '@/store/family'
import type { Gender } from '@/types'

const { family, memberCount, generationCount, buildTree } = useFamilyStore()

// 布局参数（rpx）
const NODE_W = 100
const NODE_H = 100
const SPOUSE_GAP = 30
const SIBLING_GAP = 30
const ROW_H = 200

interface PlacedNode {
  id: string
  name: string
  gender: Gender
  generation: number
  x: number
  y: number
}
interface PlacedLine {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** 子树宽度（含配偶） */
function subtreeWidth(node: TreeNode): number {
  const selfWidth =
    node.spouses.length > 0
      ? NODE_W * (1 + node.spouses.length) + SPOUSE_GAP * node.spouses.length
      : NODE_W
  if (node.children.length === 0) return selfWidth
  const childrenWidth = node.children.reduce(
    (sum, c, i) => sum + subtreeWidth(c) + (i > 0 ? SIBLING_GAP : 0),
    0,
  )
  return Math.max(selfWidth, childrenWidth)
}

function doLayout(tree: TreeNode): {
  nodes: PlacedNode[]
  lines: PlacedLine[]
  width: number
  height: number
} {
  const nodes: PlacedNode[] = []
  const lines: PlacedLine[] = []

  function place(node: TreeNode, x: number, y: number) {
    const selfWidth =
      node.spouses.length > 0
        ? NODE_W * (1 + node.spouses.length) + SPOUSE_GAP * node.spouses.length
        : NODE_W
    const width = subtreeWidth(node)
    const nodeStartX = x + (width - selfWidth) / 2

    // 主成员
    nodes.push({
      id: node.member.id,
      name: node.member.name,
      gender: node.member.gender,
      generation: node.member.generation,
      x: nodeStartX,
      y,
    })

    // 配偶（横向相邻 + 婚姻线）
    let spouseX = nodeStartX + NODE_W + SPOUSE_GAP
    for (const s of node.spouses) {
      nodes.push({
        id: s.id,
        name: s.name,
        gender: s.gender,
        generation: s.generation,
        x: spouseX,
        y,
      })
      lines.push({
        x1: nodeStartX + NODE_W,
        y1: y + NODE_H / 2,
        x2: spouseX,
        y2: y + NODE_H / 2,
      })
      spouseX += NODE_W + SPOUSE_GAP
    }

    // 子女
    if (node.children.length > 0) {
      const childrenTotalWidth = node.children.reduce(
        (sum, c, i) => sum + subtreeWidth(c) + (i > 0 ? SIBLING_GAP : 0),
        0,
      )
      let childX = x + (width - childrenTotalWidth) / 2
      const childY = y + ROW_H
      const parentCenterX = nodeStartX + selfWidth / 2
      const parentBottomY = y + NODE_H
      const midY = y + NODE_H + (ROW_H - NODE_H) / 2

      // 父母向下竖线
      lines.push({ x1: parentCenterX, y1: parentBottomY, x2: parentCenterX, y2: midY })

      const childCenters: number[] = []
      for (const child of node.children) {
        const cw = subtreeWidth(child)
        childCenters.push(childX + cw / 2)
        place(child, childX, childY)
        childX += cw + SIBLING_GAP
      }
      // 子女横线（兄弟连线）
      if (childCenters.length > 1) {
        lines.push({
          x1: childCenters[0],
          y1: midY,
          x2: childCenters[childCenters.length - 1],
          y2: midY,
        })
      }
      // 各子女向上竖线
      for (const cx of childCenters) {
        lines.push({ x1: cx, y1: midY, x2: cx, y2: childY })
      }
    }
  }

  place(tree, 0, 0)

  const maxX = Math.max(...nodes.map((n) => n.x + NODE_W))
  const maxY = Math.max(...nodes.map((n) => n.y + NODE_H))
  return { nodes, lines, width: maxX + 40, height: maxY + 40 }
}

const layout = computed(() => {
  const tree = buildTree()
  if (!tree) return null
  return doLayout(tree)
})

function lineStyle(line: PlacedLine) {
  if (line.y1 === line.y2) {
    return {
      left: Math.min(line.x1, line.x2) + 'rpx',
      top: line.y1 + 'rpx',
      width: Math.abs(line.x2 - line.x1) + 'rpx',
      height: '2rpx',
    }
  }
  return {
    left: line.x1 + 'rpx',
    top: Math.min(line.y1, line.y2) + 'rpx',
    width: '2rpx',
    height: Math.abs(line.y2 - line.y1) + 'rpx',
  }
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/member/detail?id=${id}` })
}

const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
function chineseNum(n: number): string {
  return chineseNums[n] ?? String(n)
}
</script>

<style>
.tree-page {
  padding: 20rpx 0 80rpx;
}
.header {
  text-align: center;
  margin-bottom: 20rpx;
  padding: 0 24rpx;
}
.title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #8b4513;
}
.sub {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}
.legend {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 16rpx;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #666;
}
.shape {
  width: 28rpx;
  height: 28rpx;
  background: #fff;
  border: 3rpx solid #8b4513;
}
.shape.male {
  border-radius: 6rpx;
}
.shape.female {
  border-radius: 50%;
}
.legend-tip {
  font-size: 22rpx;
  color: #bbb;
  margin-left: auto;
}
.tree-scroll {
  width: 100%;
  white-space: nowrap;
}
.tree-canvas {
  position: relative;
  margin: 0 24rpx;
}
.line {
  position: absolute;
  background: #b08968;
}
.node {
  position: absolute;
  width: 100rpx;
  height: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 3rpx solid #8b4513;
  box-sizing: border-box;
}
.node.male {
  border-radius: 8rpx;
}
.node.female {
  border-radius: 50%;
}
.node-name {
  font-size: 22rpx;
  font-weight: bold;
  color: #333;
}
.node-gen {
  font-size: 18rpx;
  color: #999;
  margin-top: 2rpx;
}
.empty {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
}
</style>
