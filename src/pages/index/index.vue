<template>
  <view class="page">
    <!-- 家族概览 -->
    <view class="card overview">
      <view class="overview-header">
        <text class="family-name">{{ family.name }}族谱</text>
        <text v-if="family.hallName" class="hall">{{ family.hallName }}</text>
      </view>
      <text v-if="family.description" class="overview-desc">{{ family.description }}</text>
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
          <text class="stat-num stat-text">{{ originator?.name || '—' }}</text>
          <text class="stat-label">始祖</text>
        </view>
      </view>
    </view>

    <!-- 分组：族谱 -->
    <view class="section-header">族谱</view>
    <view class="card group">
      <view class="row" @click="go('/pages/tree/tree')">
        <text class="row-label">家族树</text>
        <text class="row-arrow">›</text>
      </view>
      <view class="row-separator" />
      <view class="row" @click="go('/pages/member/edit')">
        <text class="row-label">录入成员</text>
        <text class="row-arrow">›</text>
      </view>
    </view>

    <!-- 分组：其他 -->
    <view class="section-header">其他</view>
    <view class="card group">
      <view class="row" @click="go('/pages/profile/profile')">
        <text class="row-label">我的</text>
        <text class="row-arrow">›</text>
      </view>
    </view>

    <text class="footer">测试号阶段 · 数据为示例</text>
  </view>
</template>

<script setup lang="ts">
import { useFamilyStore } from '@/store/family'

const { family, memberCount, generationCount, originator } = useFamilyStore()

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
  border-radius: 24rpx;
  overflow: hidden;
}
.overview {
  padding: 36rpx 32rpx;
  margin-bottom: 40rpx;
}
.overview-header {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 12rpx;
}
.family-name {
  font-size: 44rpx;
  font-weight: 700;
  color: #1c1c1e;
  letter-spacing: 1rpx;
}
.hall {
  font-size: 24rpx;
  color: #8e8e93;
}
.overview-desc {
  font-size: 26rpx;
  color: #8e8e93;
  line-height: 1.6;
  margin-bottom: 28rpx;
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
  gap: 6rpx;
}
.stat-num {
  font-size: 40rpx;
  font-weight: 600;
  color: #1c1c1e;
}
.stat-text {
  font-size: 30rpx;
}
.stat-label {
  font-size: 22rpx;
  color: #8e8e93;
}
.stat-divider {
  width: 1rpx;
  height: 56rpx;
  background: #e5e5ea;
}
.section-header {
  font-size: 24rpx;
  color: #8e8e93;
  padding: 8rpx 8rpx 12rpx;
  letter-spacing: 1rpx;
}
.group {
  margin-bottom: 40rpx;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 32rpx;
  min-height: 48rpx;
}
.row-label {
  font-size: 30rpx;
  color: #1c1c1e;
}
.row-arrow {
  font-size: 36rpx;
  color: #c7c7cc;
  font-weight: 300;
}
.row-separator {
  height: 1rpx;
  background: #e5e5ea;
  margin-left: 32rpx;
}
.footer {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #c7c7cc;
  margin-top: 40rpx;
}
</style>
