const CACHE_NAME = 'ApiMocker'
const DEFAULT_MAX_AGE = 1 * 1000 * 60

const ShareCache = require('node-shared-cache')
const Cache = new ShareCache.Cache(CACHE_NAME, 557056)
ShareCache.release(CACHE_NAME)

module.exports = app => {
    class CacheService extends app.Service {
        create (key, value, maxAge = DEFAULT_MAX_AGE) {
          return Cache.key = {
            value,
            expires: new Date(+ new Date() + maxAge).toString()
          }
        }
        verifyCodeCache (key, length, maxAge = DEFAULT_MAX_AGE) {
          const code = Array.from({length}, () => Math.ceil(Math.random() * 9)).join('')
          return this.create(key, code) && code
        }
        isExpires(key) {
          return new Date(Cache.key.expires) < new Date()
        }
        get (key) {
          return this.has(key) ? Cache.key.value : undefined
        }
        del (key) {
          return delete Cache.key
        }
        has (key) {
          const cache = Cache.key
          return cache !== undefined && new Date(cache.expires) >= new Date()
        }
    }
    return CacheService;
};