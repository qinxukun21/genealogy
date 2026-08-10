<template>
  <view class="page">
    <!-- 家族概览 -->
    <view class="card overview">
      <!-- 家族选择器 -->
      <picker v-if="families.length > 1" :range="families" range-key="name" @change="onFamilyChange">
        <view class="family-switch">
          <text class="family-switch-name">{{ family.name }}</text>
          <text class="family-switch-caret">▾</text>
        </view>
      </picker>
      <view class="overview-top">
        <view class="overview-title">
          <text class="family-name">{{ family.name }}族谱</text>
          <text v-if="family.hallName" class="hall">{{ family.hallName }}</text>
        </view>
        <text v-if="family.description" class="overview-desc">{{ family.description }}</text>
      </view>
      <view class="stats">
        <view class="stat">
          <text class="stat-num">{{ memberCount }}</text>
          <text class="stat-label">族人</text>
        </view>
        <view class="stat-divider" />
        <view class="stat">
          <text class="stat-num">{{ generationCount }}</text>
          <text class="stat-label">世代</text>
        </view>
        <view class="stat-divider" />
        <view class="stat">
          <text class="stat-num stat-text">{{ originator?.name || '-' }}</text>
          <text class="stat-label">{{ originatorDates || '始祖' }}</text>
        </view>
      </view>
    </view>

    <!-- 分组：族谱 -->
    <view class="section-header">族谱</view>
    <view class="card group">
      <view class="row" @click="go('/pages/tree/tree')">
        <view class="row-left">
          <view class="row-icon icon-blue">
            <text class="icon-text">树</text>
          </view>
          <view class="row-info">
            <text class="row-label">家族树</text>
            <text class="row-sub">图谱化查看世代谱系</text>
          </view>
        </view>
        <text class="row-arrow">›</text>
      </view>
      <view class="row-separator" />
      <view class="row" @click="go('/pages/member/edit')">
        <view class="row-left">
          <view class="row-icon icon-green">
            <text class="icon-text">录</text>
          </view>
          <view class="row-info">
            <text class="row-label">录入成员</text>
            <text class="row-sub">添加新的族人</text>
          </view>
        </view>
        <text class="row-arrow">›</text>
      </view>
    </view>

    <!-- 分组：其他 -->
    <view class="section-header">其他</view>
    <view class="card group">
      <view class="row" @click="go('/pages/profile/profile')">
        <view class="row-left">
          <view class="row-icon icon-gray">
            <text class="icon-text">我</text>
          </view>
          <view class="row-info">
            <text class="row-label">我的</text>
            <text class="row-sub">设置与关于</text>
          </view>
        </view>
        <text class="row-arrow">›</text>
      </view>
    </view>

    <text class="footer">测试号阶段 · 数据为示例</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFamilyStore } from '@/store/family'

const { family, families, memberCount, generationCount, originator, switchFamily } =
  useFamilyStore()

const originatorDates = computed(() => {
  const o = originator.value
  if (!o || !o.birthDate) return ''
  return o.deathDate ? `${o.birthDate}–${o.deathDate}` : o.birthDate
})

function onFamilyChange(e: { detail: { value: number } }) {
  const f = families.value[e.detail.value]
  if (f) switchFamily(f.id)
}

function go(url: string) {
  uni.navigateTo({ url })
}
</script>

<style>
.page {
  padding: 24rpx 32rpx 80rpx;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  border: 1rpx solid #e5e5ea;
  overflow: hidden;
}
.overview {
  padding: 32rpx;
  margin-bottom: 36rpx;
}
.family-switch {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 18rpx;
}
.family-switch-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #007aff;
}
.family-switch-caret {
  font-size: 22rpx;
  color: #007aff;
}
.overview-top {
  margin-bottom: 24rpx;
}
.overview-title {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 10rpx;
}
.family-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: 1rpx;
}
.hall {
  font-size: 24rpx;
  color: #86868b;
}
.overview-desc {
  font-size: 26rpx;
  color: #86868b;
  line-height: 1.6;
}
.stats {
  display: flex;
  align-items: center;
  padding-top: 24rpx;
  border-top: 1rpx solid #e5e5ea;
}
.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.stat-num {
  font-size: 38rpx;
  font-weight: 600;
  color: #1d1d1f;
}
.stat-text {
  font-size: 28rpx;
}
.stat-label {
  font-size: 22rpx;
  color: #86868b;
}
.stat-divider {
  width: 1rpx;
  height: 52rpx;
  background: #e5e5ea;
}
.section-header {
  font-size: 24rpx;
  color: #86868b;
  padding: 4rpx 8rpx 12rpx;
  letter-spacing: 1rpx;
}
.group {
  margin-bottom: 36rpx;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
}
.row-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}
.row-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-blue {
  background: #007aff;
}
.icon-green {
  background: #34c759;
}
.icon-gray {
  background: #8e8e93;
}
.icon-text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
}
.row-info {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}
.row-label {
  font-size: 30rpx;
  color: #1d1d1f;
}
.row-sub {
  font-size: 22rpx;
  color: #86868b;
}
.row-arrow {
  font-size: 34rpx;
  color: #c7c7cc;
  font-weight: 300;
}
.row-separator {
  height: 1rpx;
  background: #e5e5ea;
  margin-left: 104rpx;
}
.footer {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #aeaeb2;
  margin-top: 32rpx;
}
</style>
