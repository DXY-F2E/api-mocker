const Service = require('egg').Service
const crypto = require('crypto')

class Dxy extends Service {
  async login (ticket) {
    const { url, system, appId, appSignKey } = this.config.dxyLogin
    const postData = {
      appId,
      appSignKey,
      ticket,
      system,
      nonce: crypto.randomBytes(8).toString('hex'), // 16位随机字符串
      timestamp: Math.ceil(+new Date() / 1000),
      ip: '192.168.207.105',
      useragent: this.ctx.request.header['user-agent']
    }
    const params = Object.keys(postData).sort().map(key => `${key}=${postData[key]}`).join('&')
    const sha1 = crypto.createHash('sha1')
    postData.sign = sha1.update(params).digest('hex')
    delete postData.appSignKey
    const rs = await this.ctx.curl(url, {
      method: 'POST',
      dataType: 'json',
      contentType: 'json',
      data: postData
    })
    return rs.data || {
      success: false,
      message: '请求错误'
    }
  }
}

module.exports = Dxy
