<template>
  <view class="home">
    <!-- 家族概览 -->
    <view class="family-card">
      <view class="family-name">{{ family.name }}族谱</view>
      <view v-if="family.hallName" class="hall-name">堂号 · {{ family.hallName }}</view>
      <view v-if="family.description" class="family-desc">{{ family.description }}</view>
      <view class="stats">
        <view class="stat">
          <text class="stat-num">{{ memberCount }}</text>
          <text class="stat-label">族人</text>
        </view>
        <view class="stat">
          <text class="stat-num">{{ generationCount }}</text>
          <text class="stat-label">世代</text>
        </view>
        <view class="stat">
          <text class="stat-num stat-name">{{ originator?.name || '—' }}</text>
          <text class="stat-label">始祖</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="entries">
      <view class="entry" @click="go('/pages/tree/tree')">
        <text class="entry-icon">🌳</text>
        <view class="entry-text">
          <text class="entry-title">家族树</text>
          <text class="entry-desc">查看族人谱系与世代</text>
        </view>
        <text class="entry-arrow">›</text>
      </view>
      <view class="entry" @click="go('/pages/member/edit')">
        <text class="entry-icon">➕</text>
        <view class="entry-text">
          <text class="entry-title">录入成员</text>
          <text class="entry-desc">添加新的族人</text>
        </view>
        <text class="entry-arrow">›</text>
      </view>
      <view class="entry" @click="go('/pages/profile/profile')">
        <text class="entry-icon">👤</text>
        <view class="entry-text">
          <text class="entry-title">我的</text>
          <text class="entry-desc">个人中心</text>
        </view>
        <text class="entry-arrow">›</text>
      </view>
    </view>

    <view class="footer-tip">
      <text>测试号阶段 · 数据为示例 mock</text>
    </view>
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
.home {
  padding: 24rpx;
}
.family-card {
  background: linear-gradient(135deg, #8b4513, #a0522d);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
}
.family-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
}
.hall-name {
  font-size: 26rpx;
  color: #f0e0c8;
  margin-top: 12rpx;
}
.family-desc {
  font-size: 24rpx;
  color: #e8d5b8;
  margin-top: 12rpx;
  line-height: 1.6;
}
.stats {
  display: flex;
  margin-top: 30rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}
.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}
.stat-name {
  font-size: 30rpx;
}
.stat-label {
  font-size: 22rpx;
  color: #e8d5b8;
  margin-top: 6rpx;
}
.entries {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.entry {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
}
.entry-icon {
  font-size: 48rpx;
  margin-right: 24rpx;
}
.entry-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.entry-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.entry-desc {
  font-size: 24rpx;
  color: #999;
}
.entry-arrow {
  font-size: 40rpx;
  color: #ccc;
}
.footer-tip {
  text-align: center;
  margin-top: 40rpx;
  font-size: 22rpx;
  color: #bbb;
}
</style>
