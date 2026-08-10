/**
 * 删除成员（需 admin/owner），并清理它作为父母/配偶的引用。
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

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

  const { id, familyId } = event
  if (!id || !familyId) return { code: 400, msg: '参数不完整' }

  const role = await getRole(OPENID, familyId)
  if (role !== 'owner' && role !== 'admin') return { code: 403, msg: '仅管理员可删除成员' }

  const members = db.collection('members')
  await members.doc(id).remove()

  // 清理子女的父/母引用
  await members.where({ fatherId: id }).update({ data: { fatherId: _.remove() } })
  await members.where({ motherId: id }).update({ data: { motherId: _.remove() } })
  // 清理配偶双向引用
  await members.where({ spouseIds: id }).update({ data: { spouseIds: _.pull(id) } })

  return { code: 0 }
}