/**
 * 获取当前用户所有家族 + 当前家族成员（按 family_users 角色过滤）。
 * 返回 members 时把 _id 映射为 id，与前端 Member 类型一致。
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, msg: '未登录' }

  const users = await db.collection('users').where({ openid: OPENID }).limit(1).get()
  const user = users.data[0]
  if (!user) return { code: 401, msg: '用户不存在，请先登录' }

  // 用户关联的家族（含角色）
  const relRes = await db.collection('family_users').where({ userId: user._id }).get()
  const relList = relRes.data
  if (relList.length === 0) {
    return { code: 0, data: { families: [], members: [], currentFamilyId: '', currentRole: null } }
  }

  const familyIds = relList.map((r) => r.familyId)
  const famRes = await db.collection('families').where({ _id: _.in(familyIds) }).get()
  const families = famRes.data.map((f) => ({
    ...f,
    id: f._id,
    role: relList.find((r) => r.familyId === f._id)?.role || 'member',
  }))

  // 指定 familyId：校验该用户有权访问后返回该家族；否则默认第一个
  const requestedId = event && event.familyId
  const target = requestedId
    ? families.find((f) => f.id === requestedId)
    : families[0]
  if (!target) return { code: 403, msg: '无权访问该家族' }

  const currentRole = relList.find((r) => r.familyId === target.id)?.role || 'member'

  const memRes = await db.collection('members').where({ familyId: target.id }).get()
  const members = memRes.data.map((m) => ({ ...m, id: m._id }))

  return {
    code: 0,
    data: {
      families,
      currentFamilyId: target.id,
      currentRole,
      members,
    },
  }
}