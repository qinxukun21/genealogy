<template>
  <view class="tree-page">
    <view class="header">
      <text class="title">{{ networkMode ? '家族网络' : family.name + '家族树' }}</text>
      <text class="sub">{{ networkMode ? '多家族拼接' : memberCount + ' 人 · ' + generationCount + ' 世' }}</text>
      <view class="network-toggle" @click="toggleNetwork">
        <text class="toggle-label">拼接</text>
        <switch :checked="networkMode" color="#007AFF" style="transform: scale(0.7)" @change="toggleNetwork" />
      </view>
    </view>

    <view class="legend">
      <view class="legend-item"><view class="dot male"></view><text>男</text></view>
      <view class="legend-item"><view class="dot female"></view><text>女</text></view>
      <text class="legend-tip">{{ networkMode ? '拼接：多家族并排' : '左右滑动 · 点击查看详情' }}</text>
    </view>

    <scroll-view scroll-x class="tree-scroll" v-if="layout">
      <view class="tree-canvas" :style="{ width: layout.width + 'rpx', height: layout.height + 'rpx' }">
        <view
          v-for="(line, i) in layout.lines"
          :key="'l' + i"
          class="line"
          :class="{ 'marriage-line': line.marriage }"
          :style="lineStyle(line)"
        />
        <view
          v-for="node in layout.nodes"
          :key="node.id"
          class="node"
          :class="node.gender"
          :style="{ left: node.x + 'rpx', top: node.y + 'rpx' }"
          @click="goDetail(node.id)"
        >
          <text class="node-name">{{ node.name }}</text>
          <text v-if="node.dates" class="node-dates">{{ node.dates }}</text>
          <text class="node-gen">{{ chineseNum(node.generation) }}世</text>
        </view>
      </view>
    </scroll-view>

    <view v-else class="empty"><text>{{ networkMode ? '暂无关联家族' : '暂无族谱数据' }}</text></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFamilyStore } from '@/store/family'
import { useNetworkStore } from '@/store/network'
import { doLayout, NODE_W, NODE_H, lineStyle, type PlacedLine } from '@/utils/treeLayout'

const { family, memberCount, generationCount, buildTree, currentFamilyId } = useFamilyStore()
const { loadNetwork, buildNetworkLayout } = useNetworkStore()

const networkMode = ref(false)
const networkReady = ref(false)

async function toggleNetwork() {
  networkMode.value = !networkMode.value
  if (networkMode.value) {
    try {
      await loadNetwork(currentFamilyId.value)
      networkReady.value = true
      uni.showToast({ title: '已拼接关联家族', icon: 'none' })
    } catch (e) {
      uni.showToast({ title: '拼接加载失败', icon: 'none' })
      networkMode.value = false
    }
  }
}

const layout = computed(() => {
  if (networkMode.value) {
    if (!networkReady.value) return null
    return buildNetworkLayout(currentFamilyId.value)
  }
  const tree = buildTree()
  return tree ? doLayout(tree) : null
})

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
  padding: 24rpx 0 80rpx;
}
.header {
  text-align: center;
  margin-bottom: 12rpx;
  padding: 0 32rpx;
}
.title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #1d1d1f;
}
.sub {
  display: block;
  font-size: 24rpx;
  color: #86868b;
  margin-top: 6rpx;
}
.network-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  margin-top: 8rpx;
}
.toggle-label {
  font-size: 24rpx;
  color: #86868b;
}
.legend {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 0 32rpx 24rpx;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: #86868b;
}
.dot {
  width: 6rpx;
  height: 24rpx;
  border-radius: 3rpx;
}
.dot.male {
  background: #007aff;
}
.dot.female {
  background: #ff6482;
}
.legend-tip {
  font-size: 22rpx;
  color: #aeaeb2;
  margin-left: auto;
}
.tree-scroll {
  width: 100%;
  white-space: nowrap;
}
.tree-canvas {
  position: relative;
  margin: 0 32rpx;
}
.line {
  position: absolute;
  background: #c7c7cc;
}
.line.marriage-line {
  background: #34c759;
  height: 3rpx;
}
.node {
  position: absolute;
  width: 140rpx;
  height: 112rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 14rpx;
  border: 1rpx solid #e5e5ea;
  border-left: 5rpx solid #007aff;
  box-sizing: border-box;
  gap: 2rpx;
}
.node.female {
  border-left-color: #ff6482;
}
.node-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #1d1d1f;
}
.node-dates {
  font-size: 18rpx;
  color: #86868b;
}
.node-gen {
  font-size: 18rpx;
  color: #aeaeb2;
}
.empty {
  text-align: center;
  padding: 80rpx 0;
  color: #86868b;
}
</style>