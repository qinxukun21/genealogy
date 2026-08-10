/**
 * 删除跨家族婚姻关系（family_links）。
 * 权限：当前用户在两个家族中至少一个为 owner/admin。
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

async function getOwnedFamilies(openid) {
  const users = await db.collection('users').where({ openid }).limit(1).get()
  const user = users.data[0]
  if (!user) return []
  const rels = await db.collection('family_users').where({ userId: user._id }).get()
  return rels.data.filter((r) => r.role === 'owner' || r.role === 'admin').map((r) => r.familyId)
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, msg: '未登录' }

  const { id } = event || {}
  if (!id) return { code: 400, msg: '缺少链接ID' }

  const link = await db.collection('family_links').doc(id).get().catch(() => null)
  if (!link || !link.data) return { code: 404, msg: '链接不存在' }
  const { familyAId, familyBId } = link.data

  const owned = await getOwnedFamilies(OPENID)
  if (!owned.includes(familyAId) && !owned.includes(familyBId)) {
    return { code: 403, msg: '需要在至少一个家族中有管理权限' }
  }

  await db.collection('family_links').doc(id).remove()
  return { code: 0 }
}