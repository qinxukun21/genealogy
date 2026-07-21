<template>
  <view class="page">
    <!-- 家族卡片 -->
    <view class="card profile">
      <view class="avatar">族</view>
      <view class="profile-info">
        <text class="name">{{ family.name }}族谱</text>
        <text class="sub">{{ family.hallName || '族谱管理' }}</text>
      </view>
      <view class="profile-stat">
        <text class="stat-num">{{ memberCount }}</text>
        <text class="stat-label">族人</text>
      </view>
    </view>

    <!-- 分组：族谱 -->
    <view class="section-header">族谱</view>
    <view class="card group">
      <view class="row">
        <text class="row-label">家族信息</text>
        <view class="row-right">
          <text class="row-value">{{ family.name }} · {{ family.hallName || '无堂号' }}</text>
          <text class="row-arrow">›</text>
        </view>
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">世代统计</text>
        <view class="row-right">
          <text class="row-value">{{ generationCount }} 世 · {{ memberCount }} 人</text>
          <text class="row-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 分组：数据 -->
    <view class="section-header">数据</view>
    <view class="card group">
      <view class="row">
        <text class="row-label">数据管理</text>
        <text class="row-arrow">›</text>
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">导出族谱</text>
        <text class="row-arrow">›</text>
      </view>
    </view>

    <!-- 分组：关于 -->
    <view class="section-header">关于</view>
    <view class="card group">
      <view class="row">
        <text class="row-label">关于应用</text>
        <text class="row-arrow">›</text>
      </view>
    </view>

    <text class="footer">族谱 · 测试号阶段 v0.1</text>
  </view>
</template>

<script setup lang="ts">
import { useFamilyStore } from '@/store/family'
const { family, memberCount, generationCount } = useFamilyStore()
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
.profile {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  margin-bottom: 36rpx;
}
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #1d1d1f;
  color: #fff;
  font-size: 40rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.name {
  font-size: 34rpx;
  font-weight: 700;
  color: #1d1d1f;
}
.sub {
  font-size: 24rpx;
  color: #86868b;
}
.profile-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
}
.stat-num {
  font-size: 36rpx;
  font-weight: 600;
  color: #1d1d1f;
}
.stat-label {
  font-size: 20rpx;
  color: #86868b;
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
  padding: 26rpx 32rpx;
  min-height: 48rpx;
}
.row-label {
  font-size: 30rpx;
  color: #1d1d1f;
}
.row-right {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.row-value {
  font-size: 26rpx;
  color: #86868b;
}
.row-arrow {
  font-size: 32rpx;
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
  color: #aeaeb2;
  margin-top: 32rpx;
}
</style>
