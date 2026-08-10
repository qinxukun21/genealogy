/**
 * 一键初始化（幂等，可重复执行）：
 * 1. 创建集合：users / families / members / family_users / invites
 * 2. 若 members 为空，写入种子"张氏"家族（与前端 mock 一致，id 相同）
 * 3. 把当前调用用户设为该家族 owner
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const COLLECTIONS = ['users', 'families', 'members', 'family_users', 'invites']

const FAMILY_ID = 'f1'
const ORIGINATOR_ID = 'm1'

const seedFamily = {
  _id: FAMILY_ID,
  name: '张氏',
  surname: '张',
  hallName: '清河堂',
  originatorId: ORIGINATOR_ID,
  description: '张氏家族，源出清河，世代耕读传家。',
}

const seedMembers = [
  { _id: 'm1', name: '张文渊', courtesyName: '博源', alias: '松溪', gender: 'male', generation: 1, birthDate: '1920', deathDate: '2005', isAlive: false, hometown: '浙江绍兴', occupation: '教书先生', summary: '始祖，奠定耕读家风。', spouseIds: ['m2'] },
  { _id: 'm2', name: '王秀英', gender: 'female', generation: 1, birthDate: '1925', deathDate: '2010', isAlive: false, hometown: '浙江绍兴', summary: '张文渊之妻，持家有方。', spouseIds: ['m1'] },
  { _id: 'm3', name: '张明德', courtesyName: '守仁', gender: 'male', generation: 2, birthDate: '1948', isAlive: true, hometown: '浙江绍兴', occupation: '工程师', fatherId: 'm1', motherId: 'm2', spouseIds: ['m4'] },
  { _id: 'm4', name: '李慧珍', gender: 'female', generation: 2, birthDate: '1950', isAlive: true, hometown: '江苏苏州', occupation: '教师', spouseIds: ['m3'] },
  { _id: 'm5', name: '张明义', gender: 'male', generation: 2, birthDate: '1952', isAlive: true, hometown: '浙江绍兴', occupation: '商人', fatherId: 'm1', motherId: 'm2', spouseIds: ['m6'] },
  { _id: 'm6', name: '刘芳', gender: 'female', generation: 2, birthDate: '1955', isAlive: true, hometown: '上海', spouseIds: ['m5'] },
  { _id: 'm7', name: '张建华', courtesyName: '子恒', gender: 'male', generation: 3, birthDate: '1975', isAlive: true, hometown: '浙江绍兴', occupation: '医生', fatherId: 'm3', motherId: 'm4', spouseIds: ['m8'] },
  { _id: 'm8', name: '陈静', gender: 'female', generation: 3, birthDate: '1978', isAlive: true, hometown: '浙江杭州', occupation: '律师', spouseIds: ['m7'] },
  { _id: 'm9', name: '张建民', gender: 'male', generation: 3, birthDate: '1978', isAlive: true, hometown: '浙江绍兴', occupation: '大学讲师', fatherId: 'm3', motherId: 'm4', spouseIds: [] },
  { _id: 'm10', name: '张建红', gender: 'female', generation: 3, birthDate: '1980', isAlive: true, hometown: '浙江绍兴', occupation: '设计师', fatherId: 'm5', motherId: 'm6', spouseIds: [] },
  { _id: 'm11', name: '张梓晨', gender: 'male', generation: 4, birthDate: '2005', isAlive: true, hometown: '浙江绍兴', fatherId: 'm7', motherId: 'm8', spouseIds: [] },
  { _id: 'm12', name: '张梓涵', gender: 'female', generation: 4, birthDate: '2008', isAlive: true, hometown: '浙江绍兴', fatherId: 'm7', motherId: 'm8', spouseIds: [] },
]

async function ensureCollections() {
  for (const name of COLLECTIONS) {
    try {
      await db.createCollection(name)
    } catch (e) {
      // 已存在则忽略
    }
  }
}

exports.main = async () => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, msg: '无法获取用户标识' }

  await ensureCollections()

  const users = await db.collection('users').where({ openid: OPENID }).limit(1).get()
  let user = users.data[0]
  if (!user) {
    const now = Date.now()
    user = { openid: OPENID, nickname: '', avatarUrl: '', isPlatformAdmin: false, createdAt: now, updatedAt: now }
    const addRes = await db.collection('users').add({ data: user })
    user._id = addRes._id
  }

  const seeded = []
  const members = db.collection('members')

  // 幂等：仅当 members 为空时写入种子
  const count = await members.count()
  if (count.total === 0) {
    const now = Date.now()
    for (const m of seedMembers) {
      await members.add({ data: { familyId: FAMILY_ID, createdAt: now, updatedAt: now, ...m } })
    }
    await db.collection('families').add({ data: { ...seedFamily, createdAt: now, updatedAt: now } })
    seeded.push('family')
  }

  // 幂等：把当前用户设为 owner（若尚无关系）
  const familyUsers = db.collection('family_users')
  const rel = await familyUsers.where({ userId: user._id, familyId: FAMILY_ID }).limit(1).get()
  if (rel.data.length === 0) {
    await familyUsers.add({
      data: { userId: user._id, familyId: FAMILY_ID, role: 'owner', createdAt: Date.now() },
    })
  }

  return { code: 0, data: { seeded, userId: user._id, familyId: FAMILY_ID, role: 'owner' } }
}