<template>
  <view class="content">
    <view class="placeholder">
      <text class="emoji">🌳</text>
      <text class="title">家族树</text>
      <text class="desc">此处将展示家族世代谱系图</text>
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
