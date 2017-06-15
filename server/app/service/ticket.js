const Crypto = require('crypto')
const Cipher = Crypto.createCipher('aes192', 'a password');
const Decipher = Crypto.createDecipher('aes192', 'a password')
module.exports = app => {
    class TicketHistory extends app.Service {
        create(id, act, maxAge = 15 * 60 * 1000){
            const ticket = JSON.stringify({
              id,
              act,
              expires: new Date(+ new Date() + maxAge)
            })
            return Cipher.update(ticket, 'utf8', 'hex') + Cipher.final('hex')
        }
        check(ticket, act) {
          try {
            let rs = Decipher.update(ticket, 'hex', 'utf8') + Decipher.final('utf8');
            rs = JSON.parse(rs)
          } catch (err) {
            this.error('ticket错误')
          }
          if (rs.expires > new Date()) {
            this.error('ticket过期')
          }
          if (act !== rs.act) {
            this.error('ticket错误')
          }
          return true
        }
    }
    return TicketHistory;
};