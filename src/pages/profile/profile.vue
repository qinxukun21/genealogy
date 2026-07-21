<template>
  <view class="page">
    <view class="profile">
      <view class="avatar">族</view>
      <view class="profile-info">
        <text class="name">{{ family.name }}族谱</text>
        <text class="sub">{{ family.hallName || '族谱管理' }}</text>
      </view>
    </view>

    <view class="section-header">设置</view>
    <view class="card group">
      <view class="row">
        <text class="row-label">家族信息</text>
        <text class="row-arrow">›</text>
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">数据管理</text>
        <text class="row-arrow">›</text>
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">关于</text>
        <text class="row-arrow">›</text>
      </view>
    </view>

    <text class="footer">族谱 · 测试号阶段</text>
  </view>
</template>

<script setup lang="ts">
import { useFamilyStore } from '@/store/family'
const { family } = useFamilyStore()
</script>

<style>
.page {
  padding: 24rpx 32rpx 80rpx;
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
  background: #1c1c1e;
  color: #fff;
  font-size: 46rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.name {
  font-size: 36rpx;
  font-weight: 700;
  color: #1c1c1e;
}
.sub {
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
