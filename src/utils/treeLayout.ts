import type { Member } from '@/types'
import type { TreeNode } from '@/store/family'

/** 家族树布局常量与算法（供单家族树 / 拼接网络共用） */

export const NODE_W = 140
export const NODE_H = 112
export const SPOUSE_GAP = 24
export const SIBLING_GAP = 28
export const ROW_H = 220

export interface PlacedNode {
  id: string
  name: string
  gender: string
  generation: number
  x: number
  y: number
  dates: string
}
export interface PlacedLine {
  x1: number
  y1: number
  x2: number
  y2: number
  /** 是否为跨家族婚姻连线 */
  marriage?: boolean
}

export function lineStyle(line: PlacedLine) {
  if (line.y1 === line.y2) {
    return {
      left: Math.min(line.x1, line.x2) + 'rpx',
      top: line.y1 + 'rpx',
      width: Math.abs(line.x2 - line.x1) + 'rpx',
      height: (line.marriage ? 3 : 2) + 'rpx',
    }
  }
  return {
    left: line.x1 + 'rpx',
    top: Math.min(line.y1, line.y2) + 'rpx',
    width: '2rpx',
    height: Math.abs(line.y2 - line.y1) + 'rpx',
  }
}
export interface TreeLayout {
  nodes: PlacedNode[]
  lines: PlacedLine[]
  width: number
  height: number
}

export function datesOf(m: Member): string {
  if (m.birthDate && m.deathDate) return `${m.birthDate}–${m.deathDate}`
  return m.birthDate || m.deathDate || ''
}

export function subtreeWidth(node: TreeNode): number {
  const selfWidth =
    node.spouses.length > 0
      ? NODE_W * (1 + node.spouses.length) + SPOUSE_GAP * node.spouses.length
      : NODE_W
  if (node.children.length === 0) return selfWidth
  const childrenWidth = node.children.reduce(
    (sum, c, i) => sum + subtreeWidth(c) + (i > 0 ? SIBLING_GAP : 0),
    0,
  )
  return Math.max(selfWidth, childrenWidth)
}

export function doLayout(tree: TreeNode): TreeLayout {
  const nodes: PlacedNode[] = []
  const lines: PlacedLine[] = []

  function place(node: TreeNode, x: number, y: number) {
    const selfWidth =
      node.spouses.length > 0
        ? NODE_W * (1 + node.spouses.length) + SPOUSE_GAP * node.spouses.length
        : NODE_W
    const width = subtreeWidth(node)
    const nodeStartX = x + (width - selfWidth) / 2

    nodes.push({
      id: node.member.id,
      name: node.member.name,
      gender: node.member.gender,
      generation: node.member.generation,
      x: nodeStartX,
      y,
      dates: datesOf(node.member),
    })

    let spouseX = nodeStartX + NODE_W + SPOUSE_GAP
    for (const s of node.spouses) {
      nodes.push({
        id: s.id,
        name: s.name,
        gender: s.gender,
        generation: s.generation,
        x: spouseX,
        y,
        dates: datesOf(s),
      })
      lines.push({
        x1: nodeStartX + NODE_W,
        y1: y + NODE_H / 2,
        x2: spouseX,
        y2: y + NODE_H / 2,
      })
      spouseX += NODE_W + SPOUSE_GAP
    }

    if (node.children.length > 0) {
      const childrenTotalWidth = node.children.reduce(
        (sum, c, i) => sum + subtreeWidth(c) + (i > 0 ? SIBLING_GAP : 0),
        0,
      )
      let childX = x + (width - childrenTotalWidth) / 2
      const childY = y + ROW_H
      const parentCenterX = nodeStartX + selfWidth / 2
      const parentBottomY = y + NODE_H
      const midY = y + NODE_H + (ROW_H - NODE_H) / 2

      lines.push({ x1: parentCenterX, y1: parentBottomY, x2: parentCenterX, y2: midY })

      const childCenters: number[] = []
      for (const child of node.children) {
        const cw = subtreeWidth(child)
        childCenters.push(childX + cw / 2)
        place(child, childX, childY)
        childX += cw + SIBLING_GAP
      }
      if (childCenters.length > 1) {
        lines.push({
          x1: childCenters[0],
          y1: midY,
          x2: childCenters[childCenters.length - 1],
          y2: midY,
        })
      }
      for (const cx of childCenters) {
        lines.push({ x1: cx, y1: midY, x2: cx, y2: childY })
      }
    }
  }

  place(tree, 0, 0)

  const maxX = Math.max(...nodes.map((n) => n.x + NODE_W))
  const maxY = Math.max(...nodes.map((n) => n.y + NODE_H))
  return { nodes, lines, width: maxX + 40, height: maxY + 40 }
}