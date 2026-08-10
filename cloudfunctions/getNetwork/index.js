/**
 * 获取拼接视图所需数据：
 * 当前家族 + 通过 family_links 直接关联的家族（每个带全部成员）+ 所有 family_links。
 * 返回结构：
 * {
 *   nodes: [ { familyId, family, role, members } ],
 *   links: [ { id, familyAId, memberAId, familyBId, memberBId } ]
 * }
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, msg: '未登录' }

  const rootFamilyId = event && event.familyId
  if (!rootFamilyId) return { code: 400, msg: '缺少家族ID' }

  const users = await db.collection('users').where({ openid: OPENID }).limit(1).get()
  const user = users.data[0]
  if (!user) return { code: 401, msg: '用户不存在，请先登录' }

  // 校验用户有权访问家族
  const rels = await db.collection('family_users').where({ userId: user._id }).get()
  const relMap = {} // familyId -> role
  for (const r of rels.data) relMap[r.familyId] = r.role
  if (!relMap[rootFamilyId]) return { code: 403, msg: '无权访问该家族' }

  // 收集直接关联的家族（含根家族）
  const familyIds = new Set([rootFamilyId])
  const linkRes = await db
    .collection('family_links')
    .where(_.or([{ familyAId: rootFamilyId }, { familyBId: rootFamilyId }]))
    .get()
  const links = linkRes.data
  for (const l of links) {
    familyIds.add(l.familyAId)
    familyIds.add(l.familyBId)
  }

  // 拉取家族 + 成员
  const famRes = await db.collection('families').where({ _id: _.in([...familyIds]) }).get()
  const famMap = {}
  for (const f of famRes.data) famMap[f._id] = f

  const memRes = await db.collection('members').where({ familyId: _.in([...familyIds]) }).get()
  const membersByFamily = {}
  for (const m of memRes.data) {
    if (!membersByFamily[m.familyId]) membersByFamily[m.familyId] = []
    membersByFamily[m.familyId].push({ ...m, id: m._id })
  }

  const nodes = [...familyIds].map((fid) => {
    const fam = famMap[fid] || {}
    return {
      familyId: fid,
      family: { ...fam, id: fid },
      role: relMap[fid] || 'member',
      members: membersByFamily[fid] || [],
    }
  })

  return {
    code: 0,
    data: {
      nodes,
      links: links.map((l) => ({
        id: l._id,
        familyAId: l.familyAId,
        memberAId: l.memberAId,
        familyBId: l.familyBId,
        memberBId: l.memberBId,
      })),
    },
  }
}