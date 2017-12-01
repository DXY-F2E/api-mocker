module.exports = () => {
  return async function credentials (ctx, next) {
    ctx.set('Access-Control-Allow-Credentials', 'true')
    await next()
  }
}
