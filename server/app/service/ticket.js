const Crypto = require('crypto')
const Service = require('egg').Service

class Ticket extends Service {
  create (id, act, maxAge = 15 * 60 * 1000) {
    const Cipher = Crypto.createCipher('aes192', 'a password')
    const ticket = JSON.stringify({
      id,
      act,
      maxAge,
      date: new Date()
    })
    return Cipher.update(ticket, 'utf8', 'hex') + Cipher.final('hex')
  }
  check (ticket, act, id, modifiedTime) {
    const Decipher = Crypto.createDecipher('aes192', 'a password')
    let rs
    try {
      rs = Decipher.update(ticket, 'hex', 'utf8') + Decipher.final('utf8')
      rs = JSON.parse(rs)
    } catch (err) {
      return { success: false, msg: '未知ticket' }
    }
    const expires = +new Date(rs.date) + rs.maxAge
    if (expires < Date.now()) {
      return { success: false, msg: 'ticket过期' }
    }
    if (act !== rs.act) {
      return { success: false, msg: 'ticket错误' }
    }
    if (id && id !== rs.id) {
      return { success: false, msg: 'ticket有误' }
    }
    if (modifiedTime && modifiedTime > new Date(rs.date)) {
      return { success: false, msg: 'ticket失效' }
    }
    return { success: true, data: rs }
  }
}

module.exports = Ticket
