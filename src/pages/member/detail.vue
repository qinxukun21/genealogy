<template>
  <view v-if="member" class="detail-page">
    <!-- 头部 -->
    <view class="profile">
      <view class="avatar">{{ member.name.charAt(0) }}</view>
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
    <view class="section">
      <text class="section-title">基本信息</text>
      <view class="info-row">
        <text class="label">生卒</text>
        <text class="value">{{ datesText }}</text>
      </view>
      <view v-if="member.hometown" class="info-row">
        <text class="label">籍贯</text>
        <text class="value">{{ member.hometown }}</text>
      </view>
      <view v-if="member.occupation" class="info-row">
        <text class="label">功名/职业</text>
        <text class="value">{{ member.occupation }}</text>
      </view>
    </view>

    <!-- 简介 -->
    <view v-if="member.summary" class="section">
      <text class="section-title">简介</text>
      <text class="content">{{ member.summary }}</text>
    </view>

    <!-- 传记 -->
    <view v-if="member.biography" class="section">
      <text class="section-title">传记</text>
      <text class="content">{{ member.biography }}</text>
    </view>

    <!-- 亲属关系 -->
    <view class="section">
      <text class="section-title">亲属</text>
      <view v-if="parents.length" class="rel-group">
        <text class="rel-label">父母</text>
        <view class="rel-list">
          <text v-for="p in parents" :key="p.id" class="rel-item" @click="goDetail(p.id)">{{ p.name }}</text>
        </view>
      </view>
      <view v-if="spouses.length" class="rel-group">
        <text class="rel-label">配偶</text>
        <view class="rel-list">
          <text v-for="s in spouses" :key="s.id" class="rel-item" @click="goDetail(s.id)">{{ s.name }}</text>
        </view>
      </view>
      <view v-if="children.length" class="rel-group">
        <text class="rel-label">子女</text>
        <view class="rel-list">
          <text v-for="c in children" :key="c.id" class="rel-item" @click="goDetail(c.id)">{{ c.name }}</text>
        </view>
      </view>
      <text v-if="!parents.length && !spouses.length && !children.length" class="empty-rel">暂无亲属记录</text>
    </view>

    <view class="actions">
      <button class="btn-edit" @click="goEdit">编辑</button>
    </view>
  </view>

  <view v-else class="not-found">
    <text>未找到该成员</text>
  </view>
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
.detail-page {
  padding: 20rpx 24rpx 120rpx;
}
.profile {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #8b4513;
  color: #fff;
  font-size: 44rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-weight: bold;
  color: #333;
}
.gen-tag {
  font-size: 22rpx;
  color: #fff;
  background: #8b4513;
  padding: 2rpx 14rpx;
  border-radius: 8rpx;
}
.alias {
  font-size: 26rpx;
  color: #666;
}
.gender {
  font-size: 26rpx;
  color: #888;
}
.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0e6d6;
}
.info-row {
  display: flex;
  padding: 10rpx 0;
}
.label {
  width: 160rpx;
  font-size: 26rpx;
  color: #999;
}
.value {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}
.content {
  display: block;
  font-size: 26rpx;
  color: #444;
  line-height: 1.7;
}
.rel-group {
  margin-bottom: 16rpx;
}
.rel-label {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}
.rel-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.rel-item {
  font-size: 28rpx;
  color: #8b4513;
  background: #f7efe6;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
}
.empty-rel {
  font-size: 26rpx;
  color: #bbb;
}
.actions {
  margin-top: 20rpx;
}
.btn-edit {
  background: #8b4513;
  color: #fff;
  font-size: 30rpx;
  border-radius: 12rpx;
}
.not-found {
  text-align: center;
  padding: 120rpx 0;
  color: #999;
}
</style>
