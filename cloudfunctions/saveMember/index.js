/**
 * 新增 / 更新成员。
 * 权限：当前用户在家族内角色为 owner 或 admin。
 * 新增时用前端传入的 member.id 作为文档 _id（保证本地/云端 id 一致）。
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

/** 获取用户在某个家族的角色 */
async function getRole(openid, familyId) {
  const users = await db.collection('users').where({ openid }).limit(1).get()
  const user = users.data[0]
  if (!user) return null
  const rels = await db
    .collection('family_users')
    .where({ userId: user._id, familyId })
    .limit(1)
    .get()
  return rels.data[0]?.role || null
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, msg: '未登录' }

  const { member, familyId } = event
  if (!member || !member.id || !familyId) return { code: 400, msg: '参数不完整' }

  const role = await getRole(OPENID, familyId)
  if (role !== 'owner' && role !== 'admin') return { code: 403, msg: '仅管理员可修改成员' }

  const members = db.collection('members')
  const now = Date.now()
  // 只落允许的字段，避免覆盖 createdAt 等
  const data = {
    name: member.name,
    courtesyName: member.courtesyName || '',
    alias: member.alias || '',
    gender: member.gender,
    generation: member.generation || 1,
    birthDate: member.birthDate || '',
    deathDate: member.deathDate || '',
    isAlive: member.isAlive !== false,
    hometown: member.hometown || '',
    occupation: member.occupation || '',
    summary: member.summary || '',
    biography: member.biography || '',
    avatar: member.avatar || '',
    fatherId: member.fatherId || '',
    motherId: member.motherId || '',
    spouseIds: member.spouseIds || [],
    remark: member.remark || '',
    updatedAt: now,
  }

  const exists = await members.doc(member.id).get().catch(() => null)
  if (exists && exists.data) {
    await members.doc(member.id).update({ data })
  } else {
    await members.add({ data: { _id: member.id, familyId, createdAt: now, ...data } })
  }
  return { code: 0, data: { id: member.id } }
}