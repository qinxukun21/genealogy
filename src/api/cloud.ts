/**
 * 微信云开发调用层。
 * 仅小程序端（mp-weixin）使用 wx.cloud；H5 端无云能力，走 mock 回退。
 */
import { CLOUD_ENV_ID } from '@/config'
import type { Family, Member } from '@/types'

/** 是否微信小程序端（编译期常量，自动 tree-shake） */
export function isCloudAvailable(): boolean {
  // #ifdef MP-WEIXIN
  return true
  // #endif
  // #ifndef MP-WEIXIN
  return false
  // #endif
}

function getWx(): any {
  return (globalThis as any).wx
}

let inited = false

/** 初始化云开发（幂等） */
export function initCloud(): void {
  if (!isCloudAvailable()) return
  const wx = getWx()
  if (!wx || !wx.cloud) return
  if (!inited) {
    wx.cloud.init({ env: CLOUD_ENV_ID, traceUser: true })
    inited = true
  }
}

/** 调用云函数，统一解包 result */
export async function callFunction<T = any>(name: string, data?: object): Promise<T> {
  if (!isCloudAvailable()) throw new Error('cloud unavailable on this platform')
  const wx = getWx()
  const res = await wx.cloud.callFunction({ name, data: data || {} })
  const result = (res && res.result) || {}
  if (result.code && result.code !== 0) {
    throw new Error(result.msg || `云函数 ${name} 调用失败`)
  }
  return result.data as T
}

/** 接口返回的数据结构 */
export interface CloudUser {
  _id: string
  openid: string
  nickname?: string
  avatarUrl?: string
  isPlatformAdmin?: boolean
}

export interface CloudFamily extends Family {
  role?: 'owner' | 'admin' | 'member'
}

export interface FamilyData {
  families: CloudFamily[]
  currentFamilyId: string
  currentRole: 'owner' | 'admin' | 'member' | null
  members: Member[]
}

/** 小程序登录（openid → users 表） */
export function login(): Promise<CloudUser> {
  return callFunction<CloudUser>('login')
}

export interface InitDbData {
  seeded: string[]
  userId: string
  familyId: string
  role: string
}

/** 一键初始化：建集合 + 种子家族 + 设当前用户为 owner */
export function initDb(): Promise<InitDbData> {
  return callFunction<InitDbData>('initDb')
}

/** 获取当前用户所有家族 + 当前家族成员 */
export function getFamilyData(): Promise<FamilyData> {
  return callFunction<FamilyData>('getFamilyData')
}

export interface SaveMemberData {
  id: string
}

/** 新增 / 更新成员（需 admin/owner） */
export function saveMember(member: Member, familyId: string): Promise<SaveMemberData> {
  return callFunction<SaveMemberData>('saveMember', { member, familyId })
}

/** 删除成员（需 admin/owner） */
export function deleteMember(id: string, familyId: string): Promise<void> {
  return callFunction<void>('deleteMember', { id, familyId })
}