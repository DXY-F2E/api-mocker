/**
 * 缓存service，可作为验证码服务，因为多进程非共同内存空间，故目前无用。
 */
const LRU = require('lru-cache')
const DEFAULT_MAX_AGE = 1 * 1000 * 60
const options = {
  max: 500,
  // length: function (n, key) { return n * 2 + key.length },
  // dispose: function (key, n) { n.close() },
  maxAge: DEFAULT_MAX_AGE
}
const Cache = LRU(options)

const Service = require('egg').Service

class CacheService extends Service {
  create (key, value, maxAge = DEFAULT_MAX_AGE) {
    return Cache.set(key, value, maxAge)
  }
  verifyCodeCache (key, length, maxAge = DEFAULT_MAX_AGE) {
    const code = Array.from({ length }, () => Math.ceil(Math.random() * 9)).join('')
    return this.create(key, code, maxAge) && code
  }
  get (key) {
    return Cache.get(key)
  }
  del (key) {
    return Cache.del(key)
  }
  has (key) {
    return Cache.has(key)
  }
}

module.exports = CacheService
