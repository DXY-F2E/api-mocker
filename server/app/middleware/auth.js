module.exports = options => {
  return async function auth (ctx, next) {
    if (ctx.url.indexOf('server') >= 0) {
      const user = ctx.service.cookie.getUser()
      if (user) {
        ctx.authUser = await ctx.model.User.findById(user._id)

        // 超级管理员
        if (user.isManager) {
          ctx.isManager = true
        }

        await next()
      } else {
        ctx.status = 401
      }
    } else {
      await next()
    }
  }
}
