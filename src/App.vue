<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { initCloud } from "@/api/cloud";
import { useFamilyStore } from "@/store/family";

onLaunch(() => {
  // 小程序端：初始化云开发并从云端加载数据；H5 端自动走 mock
  initCloud();
  const { loadRemote } = useFamilyStore();
  loadRemote();
});
onShow(() => {});
onHide(() => {});
</script>

<style>
page {
  background: #f0f0f2;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue",
    "Microsoft YaHei", sans-serif;
  color: #1d1d1f;
  font-size: 28rpx;
  -webkit-font-smoothing: antialiased;
}
</style>
