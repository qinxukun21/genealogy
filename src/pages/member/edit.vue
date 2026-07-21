<template>
  <view class="edit-page">
    <view class="form-section">
      <text class="form-title">基本信息</text>
      <view class="form-item">
        <text class="form-label">姓名 <text class="req">*</text></text>
        <input v-model="form.name" placeholder="请输入姓名" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">性别</text>
        <picker :range="genderOptions" range-key="text" @change="onGenderChange">
          <view class="form-picker">{{ genderText }}</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">世系</text>
        <input v-model.number="form.generation" type="number" placeholder="第几世（数字）" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">字</text>
        <input v-model="form.courtesyName" placeholder="字" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">号</text>
        <input v-model="form.alias" placeholder="号" class="form-input" />
      </view>
    </view>

    <view class="form-section">
      <text class="form-title">生卒籍贯</text>
      <view class="form-item">
        <text class="form-label">生年</text>
        <input v-model="form.birthDate" placeholder="如 1980" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">是否在世</text>
        <switch :checked="form.isAlive" @change="onAliveChange" />
      </view>
      <view v-if="!form.isAlive" class="form-item">
        <text class="form-label">卒年</text>
        <input v-model="form.deathDate" placeholder="如 2050" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">籍贯</text>
        <input v-model="form.hometown" placeholder="籍贯" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">功名/职业</text>
        <input v-model="form.occupation" placeholder="功名/职业" class="form-input" />
      </view>
    </view>

    <view class="form-section">
      <text class="form-title">亲属关系</text>
      <view class="form-item">
        <text class="form-label">父亲</text>
        <picker :range="fatherOptions" range-key="name" @change="onFatherChange">
          <view class="form-picker">{{ fatherName || '请选择' }}</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">母亲</text>
        <picker :range="motherOptions" range-key="name" @change="onMotherChange">
          <view class="form-picker">{{ motherName || '请选择' }}</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">配偶</text>
        <picker :range="spouseOptions" range-key="name" @change="onSpouseChange">
          <view class="form-picker">{{ spouseName || '请选择' }}</view>
        </picker>
      </view>
    </view>

    <view class="form-section">
      <text class="form-title">简介传记</text>
      <view class="form-item">
        <text class="form-label">简介</text>
        <textarea v-model="form.summary" placeholder="简要介绍" class="form-textarea" />
      </view>
      <view class="form-item">
        <text class="form-label">传记</text>
        <textarea v-model="form.biography" placeholder="详细生平" class="form-textarea" />
      </view>
    </view>

    <view class="actions">
      <button class="btn-save" :disabled="!form.name" @click="onSave">保存</button>
    </view>
    <view class="tip"><text>测试号阶段：数据仅存于内存，刷新后重置</text></view>
  </view>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useFamilyStore } from '@/store/family'
import type { Gender, Member } from '@/types'

const { members, addMember } = useFamilyStore()

const form = reactive({
  name: '',
  gender: 'male' as Gender,
  generation: 1,
  courtesyName: '',
  alias: '',
  birthDate: '',
  isAlive: true,
  deathDate: '',
  hometown: '',
  occupation: '',
  fatherId: '',
  motherId: '',
  spouseId: '',
  summary: '',
  biography: '',
})

const genderOptions: { text: string; value: Gender }[] = [
  { text: '男', value: 'male' },
  { text: '女', value: 'female' },
  { text: '未知', value: 'unknown' },
]
const genderText = computed(
  () => genderOptions.find((g) => g.value === form.gender)?.text || '男',
)

function onGenderChange(e: { detail: { value: number } }) {
  form.gender = genderOptions[e.detail.value].value
}
function onAliveChange(e: any) {
  form.isAlive = e.detail.value
}

const fatherOptions = computed(() => members.value.filter((m) => m.gender === 'male'))
const motherOptions = computed(() => members.value.filter((m) => m.gender === 'female'))
const spouseOptions = computed(() => members.value)

const fatherName = computed(() => fatherOptions.value.find((m) => m.id === form.fatherId)?.name)
const motherName = computed(() => motherOptions.value.find((m) => m.id === form.motherId)?.name)
const spouseName = computed(() => spouseOptions.value.find((m) => m.id === form.spouseId)?.name)

function onFatherChange(e: { detail: { value: number } }) {
  form.fatherId = fatherOptions.value[e.detail.value]?.id || ''
}
function onMotherChange(e: { detail: { value: number } }) {
  form.motherId = motherOptions.value[e.detail.value]?.id || ''
}
function onSpouseChange(e: { detail: { value: number } }) {
  form.spouseId = spouseOptions.value[e.detail.value]?.id || ''
}

function onSave() {
  if (!form.name) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  const now = new Date().toISOString()
  const member: Member = {
    id: 'm' + Date.now(),
    name: form.name,
    courtesyName: form.courtesyName || undefined,
    alias: form.alias || undefined,
    gender: form.gender,
    generation: form.generation || 1,
    birthDate: form.birthDate || undefined,
    deathDate: form.isAlive ? undefined : form.deathDate || undefined,
    isAlive: form.isAlive,
    hometown: form.hometown || undefined,
    occupation: form.occupation || undefined,
    summary: form.summary || undefined,
    biography: form.biography || undefined,
    fatherId: form.fatherId || undefined,
    motherId: form.motherId || undefined,
    spouseIds: form.spouseId ? [form.spouseId] : [],
    createdAt: now,
    updatedAt: now,
  }
  addMember(member)
  uni.showToast({ title: '已保存', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1000)
}
</script>

<style>
.edit-page {
  padding: 20rpx 24rpx 120rpx;
}
.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.form-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0e6d6;
}
.form-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f7f7f7;
}
.form-label {
  width: 160rpx;
  font-size: 26rpx;
  color: #666;
  flex-shrink: 0;
}
.req {
  color: #dd524d;
}
.form-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}
.form-picker {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}
.form-textarea {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  height: 120rpx;
}
.actions {
  margin-top: 20rpx;
}
.btn-save {
  background: #8b4513;
  color: #fff;
  font-size: 30rpx;
  border-radius: 12rpx;
}
.btn-save[disabled] {
  background: #c9a37a;
  color: #fff;
}
.tip {
  text-align: center;
  margin-top: 20rpx;
  font-size: 22rpx;
  color: #bbb;
}
</style>
