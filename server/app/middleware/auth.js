module.exports = options => {
  return async function auth (ctx, next) {
    let url = ctx.url
    if (url.indexOf('?') > 0) {
      url = url.substr(0, url.indexOf('?'))
    }
    if (url.indexOf('server') >= 0 && url.indexOf('client') < 0) {
      const user = ctx.service.cookie.getUser()
      if (user) {
        const findUser = await ctx.model.User.findById(user._id)
        // document object => object
        ctx.authUser = JSON.parse(JSON.stringify(findUser))
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
