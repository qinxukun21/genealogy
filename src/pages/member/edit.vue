<template>
  <view class="page">
    <view class="section-header">基本信息</view>
    <view class="card group">
      <view class="row">
        <text class="row-label">姓名<text class="req">*</text></text>
        <input v-model="form.name" placeholder="必填" placeholder-class="ph" class="row-input" />
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">性别</text>
        <picker :range="genderOptions" range-key="text" @change="onGenderChange">
          <view class="row-picker">{{ genderText }}</view>
        </picker>
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">世系</text>
        <input v-model.number="form.generation" type="number" placeholder="第几世" placeholder-class="ph" class="row-input" />
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">字</text>
        <input v-model="form.courtesyName" placeholder="选填" placeholder-class="ph" class="row-input" />
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">号</text>
        <input v-model="form.alias" placeholder="选填" placeholder-class="ph" class="row-input" />
      </view>
    </view>

    <view class="section-header">生卒籍贯</view>
    <view class="card group">
      <view class="row">
        <text class="row-label">生年</text>
        <input v-model="form.birthDate" placeholder="如 1980" placeholder-class="ph" class="row-input" />
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">是否在世</text>
        <switch :checked="form.isAlive" color="#007AFF" @change="onAliveChange" />
      </view>
      <view v-if="!form.isAlive" class="row-separator" />
      <view v-if="!form.isAlive" class="row">
        <text class="row-label">卒年</text>
        <input v-model="form.deathDate" placeholder="如 2050" placeholder-class="ph" class="row-input" />
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">籍贯</text>
        <input v-model="form.hometown" placeholder="选填" placeholder-class="ph" class="row-input" />
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">功名/职业</text>
        <input v-model="form.occupation" placeholder="选填" placeholder-class="ph" class="row-input" />
      </view>
    </view>

    <view class="section-header">亲属关系</view>
    <view class="card group">
      <view class="row">
        <text class="row-label">父亲</text>
        <picker :range="fatherOptions" range-key="name" @change="onFatherChange">
          <view class="row-picker">{{ fatherName || '选填' }}</view>
        </picker>
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">母亲</text>
        <picker :range="motherOptions" range-key="name" @change="onMotherChange">
          <view class="row-picker">{{ motherName || '选填' }}</view>
        </picker>
      </view>
      <view class="row-separator" />
      <view class="row">
        <text class="row-label">配偶</text>
        <picker :range="spouseOptions" range-key="name" @change="onSpouseChange">
          <view class="row-picker">{{ spouseName || '选填' }}</view>
        </picker>
      </view>
    </view>

    <view class="section-header">简介传记</view>
    <view class="card group">
      <view class="row block">
        <text class="row-label">简介</text>
        <textarea v-model="form.summary" placeholder="简要介绍" placeholder-class="ph" class="row-textarea" />
      </view>
      <view class="row-separator" />
      <view class="row block">
        <text class="row-label">传记</text>
        <textarea v-model="form.biography" placeholder="详细生平" placeholder-class="ph" class="row-textarea" />
      </view>
    </view>

    <view class="actions">
      <button class="btn-primary" :disabled="!form.name" @click="onSave">
        {{ isEdit ? '保存修改' : '保存' }}
      </button>
    </view>
    <text class="footer">测试号阶段 · 数据仅存于内存，刷新后重置</text>
  </view>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useFamilyStore } from '@/store/family'
import type { Gender, Member } from '@/types'

const { members, getMemberById, addMember, updateMember } = useFamilyStore()

const editId = ref('') // 空 = 新增
const isEdit = computed(() => !!editId.value)

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

onLoad((options) => {
  editId.value = options?.id || ''
  if (editId.value) {
    const m = getMemberById(editId.value)
    if (m) fillForm(m)
  }
})

/** 编辑时回填表单 */
function fillForm(m: Member) {
  form.name = m.name
  form.gender = m.gender
  form.generation = m.generation || 1
  form.courtesyName = m.courtesyName || ''
  form.alias = m.alias || ''
  form.birthDate = m.birthDate || ''
  form.isAlive = m.isAlive
  form.deathDate = m.deathDate || ''
  form.hometown = m.hometown || ''
  form.occupation = m.occupation || ''
  form.fatherId = m.fatherId || ''
  form.motherId = m.motherId || ''
  form.spouseId = m.spouseIds?.[0] || ''
  form.summary = m.summary || ''
  form.biography = m.biography || ''
}

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

const others = computed(() => members.value.filter((m) => m.id !== editId.value))
const fatherOptions = computed(() => others.value.filter((m) => m.gender === 'male'))
const motherOptions = computed(() => others.value.filter((m) => m.gender === 'female'))
const spouseOptions = computed(() => others.value)

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
  const base = isEdit.value
    ? { ...(getMemberById(editId.value) as Member), updatedAt: now }
    : { id: 'm' + Date.now(), createdAt: now, updatedAt: now }
  const member: Member = {
    ...base,
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
  }
  if (isEdit.value) {
    updateMember(member)
  } else {
    addMember(member)
  }
  uni.showToast({ title: isEdit.value ? '已更新' : '已保存', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1000)
}
</script>

<style>
.page {
  padding: 24rpx 32rpx 120rpx;
}
.section-header {
  font-size: 24rpx;
  color: #86868b;
  padding: 4rpx 8rpx 12rpx;
  letter-spacing: 1rpx;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  border: 1rpx solid #e5e5ea;
  overflow: hidden;
}
.group {
  margin-bottom: 36rpx;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 32rpx;
  min-height: 56rpx;
}
.row.block {
  flex-direction: column;
  align-items: stretch;
  gap: 14rpx;
}
.row-label {
  font-size: 28rpx;
  color: #1d1d1f;
  flex-shrink: 0;
}
.req {
  color: #ff3b30;
  margin-left: 4rpx;
}
.row-input {
  flex: 1;
  font-size: 30rpx;
  color: #1d1d1f;
  text-align: right;
}
.row-picker {
  font-size: 30rpx;
  color: #1d1d1f;
}
.row-textarea {
  width: 100%;
  font-size: 28rpx;
  color: #1d1d1f;
  height: 120rpx;
  line-height: 1.6;
}
.ph {
  color: #aeaeb2;
}
.row-separator {
  height: 1rpx;
  background: #e5e5ea;
  margin-left: 32rpx;
}
.actions {
  margin-top: 16rpx;
}
.btn-primary {
  background: #007aff;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 16rpx;
  line-height: 88rpx;
}
.btn-primary[disabled] {
  background: #9ec4ff;
  color: #fff;
}
.footer {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #aeaeb2;
  margin-top: 24rpx;
}
</style>
