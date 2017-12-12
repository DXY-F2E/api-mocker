module.exports = () => {
  return async function apiStat (ctx, next) {
    const { id } = ctx.params
    try {
      await next()
      ctx.service.stat.requestApi(id, true)
    } catch (err) {
      ctx.status = err.status >= 100 ? err.status : 500
      ctx.body = err
      ctx.service.stat.requestApi(id, false, err.message)
    }
  }
}
