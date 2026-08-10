/**
 * 小程序登录：用 wx.login 的 openid 查 / 建 users 记录。
 * cloud.getWXContext().OPENID 由微信自动注入，无需前端传 code。
 */
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const { OPENID } = cloud.getWXContext()
  if (!OPENID) {
    return { code: 401, msg: '无法获取用户标识' }
  }

  const users = db.collection('users')
  const found = await users.where({ openid: OPENID }).limit(1).get()
  if (found.data.length > 0) {
    return { code: 0, data: found.data[0] }
  }

  const now = Date.now()
  const doc = {
    openid: OPENID,
    nickname: '',
    avatarUrl: '',
    isPlatformAdmin: false,
    createdAt: now,
    updatedAt: now,
  }
  const addRes = await users.add({ data: doc })
  return { code: 0, data: { _id: addRes._id, ...doc } }
}