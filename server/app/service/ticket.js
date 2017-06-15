const Crypto = require('crypto')
module.exports = app => {
    class Ticket extends app.Service {
        create(id, act, maxAge = 15 * 60 * 1000){
            const Cipher = Crypto.createCipher('aes192', 'a password');
            const ticket = JSON.stringify({
              id,
              act,
              expires: new Date(+ new Date() + maxAge)
            })
            return Cipher.update(ticket, 'utf8', 'hex') + Cipher.final('hex')
        }
        check(ticket, act) {
          const Decipher = Crypto.createDecipher('aes192', 'a password')
          let rs;
          try {
            rs = Decipher.update(ticket, 'hex', 'utf8') + Decipher.final('utf8');
            rs = JSON.parse(rs)
          } catch (err) {
            return { success: false, msg: '未知ticket' }
          }
          if (new Date(rs.expires) < new Date()) {
            return { success: false, msg: 'ticket过期' }
          }
          if (act !== rs.act) {
            return { success: false, msg: 'ticket错误' }
          }
          return {success: true}
        }
    }
    return Ticket;
};