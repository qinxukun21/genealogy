import { reactive, computed } from 'vue'
import type { Family, Member } from '@/types'
import { getFamily, getAllMembers } from '@/api/mock'

export interface TreeNode {
  member: Member
  spouses: Member[]
  children: TreeNode[]
}

const state = reactive({
  family: getFamily() as Family,
  members: getAllMembers() as Member[],
})

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

  /** 新增成员（维护配偶双向关系） */
  function addMember(member: Member): void {
    state.members.push(member)
    for (const sid of member.spouseIds) {
      const s = getMemberById(sid)
      if (s && !s.spouseIds.includes(member.id)) {
        s.spouseIds.push(member.id)
      }
    }
  }

  return {
    family,
    members,
    memberCount,
    generationCount,
    originator,
    getMemberById,
    getChildrenOf,
    getSpousesOf,
    getMembersByGeneration,
    buildTree,
    addMember,
  }
}
