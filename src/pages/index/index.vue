<template>
  <view class="content">
    <view class="header">
      <text class="title">族谱</text>
      <text class="subtitle">传承家族记忆 · 续写血脉源流</text>
    </view>

    <view class="entries">
      <view class="entry" @click="go('/pages/tree/tree')">
        <text class="entry-title">家族树</text>
        <text class="entry-desc">查看族人谱系与世代关系</text>
      </view>
      <view class="entry" @click="go('/pages/profile/profile')">
        <text class="entry-title">我的</text>
        <text class="entry-desc">个人中心与家族管理</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const go = (url: string) => {
  uni.navigateTo({ url })
}
</script>

<style>
.content {
  padding: 40rpx;
}

.header {
  text-align: center;
  margin-top: 60rpx;
  margin-bottom: 80rpx;
}

.title {
  display: block;
  font-size: 64rpx;
  font-weight: bold;
  color: #8B4513;
}

.subtitle {
  display: block;
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #999;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.entry {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  border-left: 8rpx solid #8B4513;
}

.entry-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.entry-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #999;
}
</style>
