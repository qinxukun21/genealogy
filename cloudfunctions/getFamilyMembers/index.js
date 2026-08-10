/**
 * 获取指定家族的成员列表（需用户有权访问该家族）。
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, msg: '未登录' }

  const familyId = event && event.familyId
  if (!familyId) return { code: 400, msg: '缺少家族ID' }

  const users = await db.collection('users').where({ openid: OPENID }).limit(1).get()
  const user = users.data[0]
  if (!user) return { code: 401, msg: '用户不存在，请先登录' }

  const rel = await db
    .collection('family_users')
    .where({ userId: user._id, familyId })
    .limit(1)
    .get()
  if (rel.data.length === 0) return { code: 403, msg: '无权访问该家族' }

  const memRes = await db.collection('members').where({ familyId }).get()
  return {
    code: 0,
    data: memRes.data.map((m) => ({ ...m, id: m._id })),
  }
}