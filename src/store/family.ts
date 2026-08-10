import { reactive, computed, ref } from 'vue'
import type { Family, Member } from '@/types'
import { getFamily, getAllMembers } from '@/api/mock'
import {
  isCloudAvailable,
  login,
  initDb,
  getFamilyData,
  saveMember,
  deleteMember as cloudDeleteMember,
} from '@/api/cloud'

export interface TreeNode {
  member: Member
  spouses: Member[]
  children: TreeNode[]
}

const state = reactive({
  family: getFamily() as Family,
  members: getAllMembers() as Member[],
})

/** 是否已从云端加载（H5 恒为 false，走 mock） */
const loaded = ref(false)
/** 当前用户在家族内的角色 */
const currentRole = ref<'owner' | 'admin' | 'member' | null>(null)

export function useFamilyStore() {
  const family = computed(() => state.family)
  const members = computed(() => state.members)
  const memberCount = computed(() => state.members.length)
  const generationCount = computed(() =>
    state.members.reduce((max: number, m) => Math.max(max, m.generation), 0),
  )
  const originator = computed(() =>
    state.family.originatorId ? getMemberById(state.family.originatorId) : undefined,
  )

  function getMemberById(id: string): Member | undefined {
    return state.members.find((m) => m.id === id)
  }

  function getChildrenOf(id: string): Member[] {
    return state.members.filter((m) => m.fatherId === id || m.motherId === id)
  }

  function getSpousesOf(id: string): Member[] {
    const m = getMemberById(id)
    if (!m) return []
    return m.spouseIds.map((sid) => getMemberById(sid)).filter(Boolean) as Member[]
  }

  /** 按世系分组 */
  function getMembersByGeneration(): Member[][] {
    const groups: Member[][] = []
    for (const m of state.members) {
      const idx = m.generation - 1
      if (!groups[idx]) groups[idx] = []
      groups[idx].push(m)
    }
    return groups.filter(Boolean)
  }

  /** 构建家族树（从始祖递归；嫁入配偶作为节点 spouses，不单独递归） */
  function buildTree(rootId?: string): TreeNode | null {
    const id = rootId ?? state.family.originatorId
    if (!id) return null
    const root = getMemberById(id)
    if (!root) return null
    return buildNode(root)
  }

  function buildNode(member: Member): TreeNode {
    const children = getChildrenOf(member.id)
    return {
      member,
      spouses: getSpousesOf(member.id),
      children: children.map((c) => buildNode(c)),
    }
  }

  /**
   * 从云端加载数据（仅小程序端有效）。
   * 流程：登录 → 若无家族则初始化种子 → 拉取家族数据。
   * H5 端无云，直接保留 mock。
   */
  async function loadRemote(): Promise<void> {
    if (!isCloudAvailable()) return
    try {
      await login()
      let data = await getFamilyData()
      if (!data.currentFamilyId) {
        await initDb()
        data = await getFamilyData()
      }
      if (data.currentFamilyId && data.families.length > 0) {
        state.family = data.families[0]
        state.members = data.members
        currentRole.value = data.currentRole
      }
      loaded.value = true
    } catch (e) {
      // 云端不可用（未部署云函数等）时保留内存 mock，不影响浏览
      console.error('[cloud] loadRemote failed, fallback to mock:', e)
    }
  }

  /** 新增成员（维护配偶双向关系；小程序同步云端） */
  function addMember(member: Member): void {
    state.members.push(member)
    for (const sid of member.spouseIds) {
      const s = getMemberById(sid)
      if (s && !s.spouseIds.includes(member.id)) {
        s.spouseIds.push(member.id)
      }
    }
    if (isCloudAvailable()) {
      saveMember(member, state.family.id).catch((e) => console.error('[cloud] addMember', e))
    }
  }

  /** 更新成员（同步更新配偶双向关系；小程序同步云端） */
  function updateMember(member: Member): void {
    const idx = state.members.findIndex((m) => m.id === member.id)
    if (idx < 0) return
    const old = state.members[idx]
    // 移除旧关系中已不再保留的配偶
    for (const sid of old.spouseIds) {
      if (!member.spouseIds.includes(sid)) {
        const s = getMemberById(sid)
        if (s) s.spouseIds = s.spouseIds.filter((x) => x !== member.id)
      }
    }
    // 登记新关系中尚未双向的配偶
    for (const sid of member.spouseIds) {
      const s = getMemberById(sid)
      if (s && !s.spouseIds.includes(member.id)) {
        s.spouseIds.push(member.id)
      }
    }
    state.members[idx] = { ...old, ...member }
    if (isCloudAvailable()) {
      saveMember(member, state.family.id).catch((e) => console.error('[cloud] updateMember', e))
    }
  }

  /** 删除成员（同时从配偶、子女关系里移除引用；小程序同步云端） */
  function deleteMember(id: string): void {
    const target = getMemberById(id)
    if (!target) return
    // 从配偶双向关系移除
    for (const sid of target.spouseIds) {
      const s = getMemberById(sid)
      if (s) s.spouseIds = s.spouseIds.filter((x) => x !== id)
    }
    // 从子女的父/母引用移除
    for (const m of state.members) {
      if (m.fatherId === id) m.fatherId = undefined
      if (m.motherId === id) m.motherId = undefined
    }
    state.members = state.members.filter((m) => m.id !== id)
    if (isCloudAvailable()) {
      cloudDeleteMember(id, state.family.id).catch((e) => console.error('[cloud] deleteMember', e))
    }
  }

  return {
    family,
    members,
    memberCount,
    generationCount,
    originator,
    loaded,
    currentRole,
    getMemberById,
    getChildrenOf,
    getSpousesOf,
    getMembersByGeneration,
    buildTree,
    addMember,
    updateMember,
    deleteMember,
    loadRemote,
  }
}