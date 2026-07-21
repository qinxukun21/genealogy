/** 性别 */
export type Gender = 'male' | 'female' | 'unknown'

/** 家族成员 */
export interface Member {
  /** 成员唯一 ID */
  id: string
  /** 姓名 */
  name: string
  /** 字 */
  courtesyName?: string
  /** 号 */
  alias?: string
  /** 性别 */
  gender: Gender
  /** 世系（第几世，始祖为 1） */
  generation: number
  /** 生年（YYYY 或 YYYY-MM） */
  birthDate?: string
  /** 卒年 */
  deathDate?: string
  /** 是否在世 */
  isAlive: boolean
  /** 籍贯 */
  hometown?: string
  /** 功名 / 职业 */
  occupation?: string
  /** 简介 */
  summary?: string
  /** 传记（详细生平） */
  biography?: string
  /** 头像 URL */
  avatar?: string
  /** 父亲 ID */
  fatherId?: string
  /** 母亲 ID */
  motherId?: string
  /** 配偶 ID 列表（双向：A 含 B，则 B 含 A） */
  spouseIds: string[]
  /** 备注 */
  remark?: string
  /** 创建时间（ISO 字符串） */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/** 家族 */
export interface Family {
  /** 家族唯一 ID */
  id: string
  /** 家族名（如"张氏"） */
  name: string
  /** 姓氏 */
  surname: string
  /** 堂号 */
  hallName?: string
  /** 始祖 ID（第一世成员） */
  originatorId?: string
  /** 家族简介 */
  description?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}
