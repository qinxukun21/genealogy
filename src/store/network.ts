import { ref } from 'vue'
import type { Member } from '@/types'
import type { NetworkData, NetworkNode } from '@/api/cloud'
import { getNetwork } from '@/api/cloud'
import { isCloudAvailable } from '@/api/cloud'
import type { TreeNode } from '@/store/family'
import { doLayout, NODE_W, NODE_H, type PlacedNode, type TreeLayout } from '@/utils/treeLayout'

/** 拼接视图 store：把多个家族按婚姻关系拼成一张网 */

const nodes = ref<NetworkNode[]>([])
const links = ref<NetworkData['links']>([])

/** 用单个家族的成员自建树（始祖为根） */
function buildFamilyTree(members: Member[], originatorId?: string): TreeNode | null {
  const getById = (id: string) => members.find((m) => m.id === id)
  const getChildrenOf = (id: string) => members.filter((m) => m.fatherId === id || m.motherId === id)
  const getSpousesOf = (id: string) => {
    const m = getById(id)
    if (!m) return []
    return m.spouseIds.map((sid) => getById(sid)).filter(Boolean) as Member[]
  }
  function buildNode(member: Member): TreeNode {
    return {
      member,
      spouses: getSpousesOf(member.id),
      children: getChildrenOf(member.id).map((c) => buildNode(c)),
    }
  }
  if (!originatorId) return null
  const root = getById(originatorId)
  return root ? buildNode(root) : null
}

/** 在布局中查找某成员节点的坐标 */
function nodePos(layout: TreeLayout, id: string): { x: number; y: number } {
  const n = layout.nodes.find((nd) => nd.id === id)
  return n ? { x: n.x, y: n.y } : { x: 0, y: 0 }
}

export interface NetworkLayout {
  nodes: PlacedNode[]
  lines: TreeLayout['lines']
  width: number
  height: number
}

/**
 * 把多个家族拼成一张网：
 * 从当前家族出发，按婚姻关系 BFS 排序家族，从左到右摆放；
 * 相邻家族通过受关联成员的 y 对齐，画一条水平婚姻连线。
 */
export function buildNetworkLayout(rootFamilyId: string): NetworkLayout {
  const layoutByFamily: Record<string, TreeLayout | null> = {}
  for (const n of nodes.value) {
    const tree = buildFamilyTree(n.members, n.family.originatorId)
    layoutByFamily[n.familyId] = tree ? doLayout(tree) : null
  }

  // 邻接表：familyId -> [{ other, link, local, otherMember }]
  const adj: Record<string, { other: string; local: string; otherMember: string }[]> = {}
  for (const l of links.value) {
    ;(adj[l.familyAId] = adj[l.familyAId] || []).push({
      other: l.familyBId,
      local: l.memberAId,
      otherMember: l.memberBId,
    })
    ;(adj[l.familyBId] = adj[l.familyBId] || []).push({
      other: l.familyAId,
      local: l.memberBId,
      otherMember: l.memberAId,
    })
  }

  // BFS 排序 + 记录每个家族从哪个父家族连过来
  const visited = new Set([rootFamilyId])
  const order: string[] = [rootFamilyId]
  const from: Record<string, { parent: string; local: string; childMember: string }> = {}
  const queue = [rootFamilyId]
  while (queue.length > 0) {
    const fid = queue.shift()!
    for (const e of adj[fid] || []) {
      if (visited.has(e.other)) continue
      visited.add(e.other)
      order.push(e.other)
      queue.push(e.other)
      from[e.other] = { parent: fid, local: e.local, childMember: e.otherMember }
    }
  }

  // 摆放
  const GAP = 80
  const placed: Record<string, { x: number; y: number; layout: TreeLayout }> = {}
  for (const fid of order) {
    const layout = layoutByFamily[fid]
    if (!layout) continue
    if (!placed[fid] && Object.keys(placed).length === 0) {
      placed[fid] = { x: 0, y: 0, layout }
      continue
    }
    const edge = from[fid]
    const parentPlace = edge ? placed[edge.parent] : null
    if (!parentPlace) continue
    const parentMemberY = nodePos(parentPlace.layout, edge.local).y + parentPlace.y
    const childMemberY0 = nodePos(layout, edge.childMember).y
    const translateY = parentMemberY - childMemberY0
    const translateX = parentPlace.x + parentPlace.layout.width + GAP
    placed[fid] = { x: translateX, y: translateY, layout }
  }

  // 合成
  const allNodes: PlacedNode[] = []
  const allLines: TreeLayout['lines'] = []
  for (const fid of Object.keys(placed)) {
    const p = placed[fid]
    for (const n of p.layout.nodes) allNodes.push({ ...n, x: n.x + p.x, y: n.y + p.y })
    for (const l of p.layout.lines)
      allLines.push({ ...l, x1: l.x1 + p.x, y1: l.y1 + p.y, x2: l.x2 + p.x, y2: l.y2 + p.y })
  }
  // 跨家族婚姻连线
  for (const childFid of Object.keys(from)) {
    const edge = from[childFid]
    const parentPlace = placed[edge.parent]
    const childPlace = placed[childFid]
    if (!parentPlace || !childPlace) continue
    const pm = nodePos(parentPlace.layout, edge.local)
    const cm = nodePos(childPlace.layout, edge.childMember)
    const x1 = parentPlace.x + pm.x + NODE_W
    const yMid = parentPlace.y + pm.y + NODE_H / 2
    const x2 = childPlace.x + cm.x
    allLines.push({ x1, y1: yMid, x2, y2: yMid, marriage: true })
  }

  // 归一化 y：整体平移使最小 y 为 0，避免负坐标被裁掉
  const minY = allNodes.length ? Math.min(...allNodes.map((n) => n.y)) : 0
  if (minY < 0) {
    for (const n of allNodes) n.y -= minY
    for (const l of allLines) {
      l.y1 -= minY
      l.y2 -= minY
    }
  }

  const xs = allNodes.map((n) => n.x + NODE_W)
  const ys = allNodes.map((n) => n.y + NODE_H)
  return {
    nodes: allNodes,
    lines: allLines,
    width: (xs.length ? Math.max(...xs) : 0) + 40,
    height: (ys.length ? Math.max(...ys) : 0) + 40,
  }
}

/** 拉取拼接视图数据（小程序端） */
export async function loadNetwork(familyId: string): Promise<void> {
  if (!isCloudAvailable()) return
  const data = await getNetwork(familyId)
  nodes.value = data.nodes
  links.value = data.links
}

export function useNetworkStore() {
  return { nodes, links, loadNetwork, buildNetworkLayout }
}