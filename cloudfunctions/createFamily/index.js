/**
 * 创建新家族：写 families + 把当前用户设为 owner（family_users）。
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) return { code: 401, msg: '未登录' }

  const name = (event && event.name || '').trim()
  if (!name) return { code: 400, msg: '家族名不能为空' }

  const users = await db.collection('users').where({ openid: OPENID }).limit(1).get()
  const user = users.data[0]
  if (!user) return { code: 401, msg: '用户不存在，请先登录' }

  const surname = (event && event.surname || '').trim() || name.slice(0, 1)
  const now = Date.now()
  const famRes = await db.collection('families').add({
    data: {
      name,
      surname,
      hallName: '',
      description: '',
      originatorId: '',
      createdAt: now,
      updatedAt: now,
    },
  })
  const familyId = famRes._id

  await db.collection('family_users').add({
    data: { userId: user._id, familyId, role: 'owner', createdAt: now },
  })

  return { code: 0, data: { id: familyId, name, surname } }
}