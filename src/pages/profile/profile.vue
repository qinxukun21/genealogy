<template>
  <view class="content">
    <view class="placeholder">
      <text class="emoji">👤</text>
      <text class="title">我的</text>
      <text class="desc">个人中心与家族管理</text>
    </view>
  </view>
</template>

<script setup lang="ts">
</script>

<style>
.content {
  padding: 40rpx;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120rpx;
}

.emoji {
  font-size: 120rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-top: 30rpx;
}

.desc {
  font-size: 28rpx;
  color: #999;
  margin-top: 16rpx;
}
</style>
