import type { Family, Member } from '@/types'

/**
 * Mock 数据：示例"张氏"家族，4 世 12 人。
 * 测试号阶段使用，接入云开发后替换为云端数据。
 */

const now = '2026-01-01T00:00:00.000Z'

const family: Family = {
  id: 'f1',
  name: '张氏',
  surname: '张',
  hallName: '清河堂',
  originatorId: 'm1',
  description: '张氏家族，源出清河，世代耕读传家。',
  createdAt: now,
  updatedAt: now,
}

const members: Member[] = [
  {
    id: 'm1',
    name: '张文渊',
    courtesyName: '博源',
    alias: '松溪',
    gender: 'male',
    generation: 1,
    birthDate: '1920',
    deathDate: '2005',
    isAlive: false,
    hometown: '浙江绍兴',
    occupation: '教书先生',
    summary: '始祖，奠定耕读家风。',
    biography:
      '张文渊，字博源，号松溪，生于民国九年（1920）。幼读私塾，后执教乡里，育才无数。为人忠厚，治家严谨，立下"耕读传家"家训，为张氏一族之始祖。',
    spouseIds: ['m2'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm2',
    name: '王秀英',
    gender: 'female',
    generation: 1,
    birthDate: '1925',
    deathDate: '2010',
    isAlive: false,
    hometown: '浙江绍兴',
    summary: '张文渊之妻，持家有方。',
    spouseIds: ['m1'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm3',
    name: '张明德',
    courtesyName: '守仁',
    gender: 'male',
    generation: 2,
    birthDate: '1948',
    isAlive: true,
    hometown: '浙江绍兴',
    occupation: '工程师',
    summary: '张文渊长子，工程师，已退休。',
    biography:
      '张明德，字守仁，张文渊长子。1968 年考入大学，毕业后从事工程技术工作，参与多项重大工程建设。育有二子。',
    fatherId: 'm1',
    motherId: 'm2',
    spouseIds: ['m4'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm4',
    name: '李慧珍',
    gender: 'female',
    generation: 2,
    birthDate: '1950',
    isAlive: true,
    hometown: '江苏苏州',
    occupation: '教师',
    summary: '张明德之妻，小学教师。',
    spouseIds: ['m3'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm5',
    name: '张明义',
    gender: 'male',
    generation: 2,
    birthDate: '1952',
    isAlive: true,
    hometown: '浙江绍兴',
    occupation: '商人',
    summary: '张文渊次子，经商。',
    fatherId: 'm1',
    motherId: 'm2',
    spouseIds: ['m6'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm6',
    name: '刘芳',
    gender: 'female',
    generation: 2,
    birthDate: '1955',
    isAlive: true,
    hometown: '上海',
    summary: '张明义之妻。',
    spouseIds: ['m5'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm7',
    name: '张建华',
    courtesyName: '子恒',
    gender: 'male',
    generation: 3,
    birthDate: '1975',
    isAlive: true,
    hometown: '浙江绍兴',
    occupation: '医生',
    summary: '张明德长子，外科医生。',
    biography:
      '张建华，字子恒，张明德长子。医学博士，现为三甲医院外科主任医师。育一子一女。',
    fatherId: 'm3',
    motherId: 'm4',
    spouseIds: ['m8'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm8',
    name: '陈静',
    gender: 'female',
    generation: 3,
    birthDate: '1978',
    isAlive: true,
    hometown: '浙江杭州',
    occupation: '律师',
    summary: '张建华之妻，律师。',
    spouseIds: ['m7'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm9',
    name: '张建民',
    gender: 'male',
    generation: 3,
    birthDate: '1978',
    isAlive: true,
    hometown: '浙江绍兴',
    occupation: '大学讲师',
    summary: '张明德次子，高校讲师。',
    fatherId: 'm3',
    motherId: 'm4',
    spouseIds: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm10',
    name: '张建红',
    gender: 'female',
    generation: 3,
    birthDate: '1980',
    isAlive: true,
    hometown: '浙江绍兴',
    occupation: '设计师',
    summary: '张明义之女，设计师，已外嫁。',
    fatherId: 'm5',
    motherId: 'm6',
    spouseIds: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm11',
    name: '张梓晨',
    gender: 'male',
    generation: 4,
    birthDate: '2005',
    isAlive: true,
    hometown: '浙江绍兴',
    summary: '张建华之子，在读大学。',
    fatherId: 'm7',
    motherId: 'm8',
    spouseIds: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'm12',
    name: '张梓涵',
    gender: 'female',
    generation: 4,
    birthDate: '2008',
    isAlive: true,
    hometown: '浙江绍兴',
    summary: '张建华之女，在读中学。',
    fatherId: 'm7',
    motherId: 'm8',
    spouseIds: [],
    createdAt: now,
    updatedAt: now,
  },
]

export function getFamily(): Family {
  return family
}

export function getAllMembers(): Member[] {
  return members
}

export function getMember(id: string): Member | undefined {
  return members.find((m) => m.id === id)
}

export function getChildren(id: string): Member[] {
  return members.filter((m) => m.fatherId === id || m.motherId === id)
}

export function getSpouses(id: string): Member[] {
  const m = getMember(id)
  if (!m) return []
  return m.spouseIds.map((sid) => getMember(sid)).filter(Boolean) as Member[]
}

/** 世系数 */
export function getGenerationCount(): number {
  return members.reduce((max: number, m) => Math.max(max, m.generation), 0)
}
