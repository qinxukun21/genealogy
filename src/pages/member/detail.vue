<template>
  <view v-if="member" class="page">
    <!-- 头部 -->
    <view class="profile">
      <view class="avatar" :class="member.gender">{{ member.name.charAt(0) }}</view>
      <view class="profile-info">
        <view class="name-row">
          <text class="name">{{ member.name }}</text>
          <text class="gen-tag">{{ chineseNum(member.generation) }}世</text>
        </view>
        <text v-if="member.courtesyName || member.alias" class="alias">
          <text v-if="member.courtesyName">字 {{ member.courtesyName }}</text>
          <text v-if="member.courtesyName && member.alias"> · </text>
          <text v-if="member.alias">号 {{ member.alias }}</text>
        </text>
        <text class="gender">{{ genderText(member.gender) }}</text>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="section-header">基本信息</view>
    <view class="card group">
      <view class="row">
        <text class="row-label">生卒</text>
        <text class="row-value">{{ datesText }}</text>
      </view>
      <view v-if="member.hometown" class="row-separator" />
      <view v-if="member.hometown" class="row">
        <text class="row-label">籍贯</text>
        <text class="row-value">{{ member.hometown }}</text>
      </view>
      <view v-if="member.occupation" class="row-separator" />
      <view v-if="member.occupation" class="row">
        <text class="row-label">功名/职业</text>
        <text class="row-value">{{ member.occupation }}</text>
      </view>
    </view>

    <!-- 简介 -->
    <view v-if="member.summary" class="section-header">简介</view>
    <view v-if="member.summary" class="card content-card">
      <text class="content">{{ member.summary }}</text>
    </view>

    <!-- 传记 -->
    <view v-if="member.biography" class="section-header">传记</view>
    <view v-if="member.biography" class="card content-card">
      <text class="content">{{ member.biography }}</text>
    </view>

    <!-- 亲属 -->
    <view class="section-header">亲属</view>
    <view class="card group">
      <template v-for="(p, i) in parents" :key="'p' + p.id">
        <view v-if="i > 0" class="row-separator" />
        <view class="row" @click="goDetail(p.id)">
          <text class="row-label">{{ i === 0 ? '父亲' : '母亲' }}</text>
          <view class="row-right">
            <text class="row-value">{{ p.name }}</text>
            <text class="row-arrow">›</text>
          </view>
        </view>
      </template>
      <template v-for="(s, i) in spouses" :key="'s' + s.id">
        <view v-if="parents.length > 0 || i > 0" class="row-separator" />
        <view class="row" @click="goDetail(s.id)">
          <text class="row-label">配偶</text>
          <view class="row-right">
            <text class="row-value">{{ s.name }}</text>
            <text class="row-arrow">›</text>
          </view>
        </view>
      </template>
      <template v-for="(c, i) in children" :key="'c' + c.id">
        <view v-if="parents.length > 0 || spouses.length > 0 || i > 0" class="row-separator" />
        <view class="row" @click="goDetail(c.id)">
          <text class="row-label">子女</text>
          <view class="row-right">
            <text class="row-value">{{ c.name }}</text>
            <text class="row-arrow">›</text>
          </view>
        </view>
      </template>
      <view v-if="!parents.length && !spouses.length && !children.length" class="row">
        <text class="row-value empty-text">暂无亲属记录</text>
      </view>
    </view>

    <view class="actions">
      <button class="btn-primary" @click="goEdit">编辑</button>
    </view>
  </view>

  <view v-else class="not-found"><text>未找到该成员</text></view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useFamilyStore } from '@/store/family'

const { getMemberById, getChildrenOf, getSpousesOf } = useFamilyStore()

const memberId = ref('')
onLoad((options) => {
  memberId.value = options?.id || ''
})

const member = computed(() => getMemberById(memberId.value))

const parents = computed(() => {
  if (!member.value) return []
  const list = []
  if (member.value.fatherId) {
    const f = getMemberById(member.value.fatherId)
    if (f) list.push(f)
  }
  if (member.value.motherId) {
    const m = getMemberById(member.value.motherId)
    if (m) list.push(m)
  }
  return list
})
const spouses = computed(() => (member.value ? getSpousesOf(member.value.id) : []))
const children = computed(() => (member.value ? getChildrenOf(member.value.id) : []))

const datesText = computed(() => {
  if (!member.value) return ''
  if (!member.value.birthDate) return member.value.isAlive ? '在世' : '未知'
  if (member.value.deathDate) return `${member.value.birthDate} - ${member.value.deathDate}`
  return `${member.value.birthDate} 至今`
})

const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
function chineseNum(n: number): string {
  return chineseNums[n] ?? String(n)
}
function genderText(g: string): string {
  return g === 'male' ? '男' : g === 'female' ? '女' : '未知'
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/member/detail?id=${id}` })
}
function goEdit() {
  uni.navigateTo({ url: `/pages/member/edit?id=${memberId.value}` })
}
</script>

<style>
.page {
  padding: 24rpx 32rpx 120rpx;
}
.profile {
  display: flex;
  align-items: center;
  gap: 28rpx;
  background: #fff;
  padding: 36rpx 32rpx;
  border-radius: 24rpx;
  margin-bottom: 40rpx;
}
.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: #007aff;
  color: #fff;
  font-size: 46rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.avatar.female {
  background: #ff6482;
}
.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.name {
  font-size: 40rpx;
  font-weight: 700;
  color: #1c1c1e;
}
.gen-tag {
  font-size: 22rpx;
  color: #007aff;
  background: #eef4ff;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}
.alias {
  font-size: 26rpx;
  color: #8e8e93;
}
.gender {
  font-size: 26rpx;
  color: #8e8e93;
}
.section-header {
  font-size: 24rpx;
  color: #8e8e93;
  padding: 8rpx 8rpx 12rpx;
  letter-spacing: 1rpx;
}
.card {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
}
.group {
  margin-bottom: 40rpx;
}
.content-card {
  padding: 28rpx 32rpx;
  margin-bottom: 40rpx;
}
.content {
  font-size: 28rpx;
  color: #1c1c1e;
  line-height: 1.7;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  min-height: 48rpx;
}
.row-label {
  font-size: 28rpx;
  color: #8e8e93;
  flex-shrink: 0;
}
.row-value {
  font-size: 28rpx;
  color: #1c1c1e;
}
.row-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.row-arrow {
  font-size: 34rpx;
  color: #c7c7cc;
  font-weight: 300;
}
.row-separator {
  height: 1rpx;
  background: #e5e5ea;
  margin-left: 32rpx;
}
.empty-text {
  color: #c7c7cc;
}
.actions {
  margin-top: 20rpx;
}
.btn-primary {
  background: #007aff;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 20rpx;
  line-height: 88rpx;
}
.not-found {
  text-align: center;
  padding: 120rpx 0;
  color: #8e8e93;
}
</style>
