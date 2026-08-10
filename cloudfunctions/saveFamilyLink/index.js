/**
 * 建立跨家族婚姻关系（family_links）。
 * 权限：当前用户在两个家族中至少一个为 owner/admin。
 * 幂等：若两成员间已有链接（任一方向）则不重复创建。
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

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

  const { familyAId, memberAId, familyBId, memberBId } = event || {}
  if (!familyAId || !memberAId || !familyBId || !memberBId) return { code: 400, msg: '参数不完整' }
  if (familyAId === familyBId) return { code: 400, msg: '同一家族内请用配偶关系' }

  const owned = await getOwnedFamilies(OPENID)
  if (!owned.includes(familyAId) && !owned.includes(familyBId)) {
    return { code: 403, msg: '需要在至少一个家族中有管理权限' }
  }

  const links = db.collection('family_links')
  // 幂等：检查任一方向是否已存在
  const dup = await links
    .where(
      _.or([
        { familyAId, memberAId, familyBId, memberBId },
        { familyAId: familyBId, memberAId: memberBId, familyBId: familyAId, memberBId: memberAId },
      ]),
    )
    .limit(1)
    .get()
  if (dup.data.length > 0) {
    return { code: 0, data: { id: dup.data[0]._id } }
  }

  const addRes = await links.add({
    data: { familyAId, memberAId, familyBId, memberBId, createdAt: Date.now() },
  })
  return { code: 0, data: { id: addRes._id } }
}