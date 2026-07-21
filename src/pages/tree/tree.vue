<template>
  <view class="tree-page">
    <view class="header">
      <text class="title">{{ family.name }}家族树</text>
      <text class="sub">共 {{ memberCount }} 人 · {{ generationCount }} 世</text>
    </view>

    <view v-if="flatList.length === 0" class="empty">
      <text>暂无族谱数据</text>
    </view>

    <view v-else class="tree-list">
      <view
        v-for="item in flatList"
        :key="item.member.id"
        class="node"
        :style="{ paddingLeft: 24 + item.depth * 40 + 'rpx' }"
        @click="goDetail(item.member.id)"
      >
        <view class="card">
          <view class="card-main">
            <text class="name">{{ item.member.name }}</text>
            <text v-if="item.member.courtesyName" class="courtesy">字 {{ item.member.courtesyName }}</text>
            <text class="gen">{{ chineseNum(item.member.generation) }}世</text>
          </view>
          <view class="card-sub">
            <text v-if="item.member.birthDate" class="dates">
              {{ item.member.birthDate }}{{ item.member.deathDate ? ' - ' + item.member.deathDate : ' 至今' }}
            </text>
            <text v-if="item.spouses.length" class="spouse">
              配偶：{{ item.spouses.map((s) => s.name).join('、') }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="tip">
      <text>点击成员查看详情</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFamilyStore, type TreeNode } from '@/store/family'
import type { Member } from '@/types'

const { family, memberCount, generationCount, buildTree } = useFamilyStore()

interface FlatNode {
  member: Member
  spouses: Member[]
  depth: number
}

function flatten(node: TreeNode, depth: number, list: FlatNode[]) {
  list.push({ member: node.member, spouses: node.spouses, depth })
  for (const child of node.children) {
    flatten(child, depth + 1, list)
  }
}

const flatList = computed<FlatNode[]>(() => {
  const tree = buildTree()
  if (!tree) return []
  const list: FlatNode[] = []
  flatten(tree, 0, list)
  return list
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
  padding: 20rpx 24rpx 80rpx;
}
.header {
  text-align: center;
  margin-bottom: 30rpx;
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
.empty {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
}
.tree-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.card {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
  border-left: 6rpx solid #8b4513;
}
.card-main {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  flex-wrap: wrap;
}
.name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.courtesy {
  font-size: 24rpx;
  color: #666;
}
.gen {
  font-size: 22rpx;
  color: #fff;
  background: #8b4513;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
}
.card-sub {
  margin-top: 10rpx;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.dates,
.spouse {
  font-size: 24rpx;
  color: #888;
}
.tip {
  text-align: center;
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #bbb;
}
</style>
