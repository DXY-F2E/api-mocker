const pathToRegexp = require('path-to-regexp')
const allMethods = ['get', 'post', 'put', 'patch', 'delete']
module.exports = app => {
  const apiStat = app.middlewares.apiStat()
  const credentials = app.middlewares.credentials()
  /* 分组 */
  app.get('/server/group/all', 'group.getAll') // 获取全部接口组
  app.get('/server/group', 'group.query') // 查询接口
  app.post('/server/group', 'group.create')
  app.get('/server/group/manage', 'group.getManageGroup')
  app.get('/server/group/unmanaged', 'group.getUnmanaged')
  app.put('/server/group/:id/claim', 'group.claim') // 认领分组，这是历史原因导致的接口，可以不关心
  app.delete('/server/group/:id', 'group.delete')
  app.put('/server/group/:id', 'group.update')
  app.put('/server/group/follower/:groupId', 'group.follow')
  app.delete('/server/group/follower/:groupId', 'group.unfollow')
  /* 接口 */
  app.get('/server/api/', 'api.query')
  app.get('/server/api/manage', 'api.getManageApi')
  app.get('/server/api/:groupId/manage', 'api.getApisByGroupManager')
  app.get('/server/api/:groupId', 'api.query')
  app.get('/server/api/:groupId/:apiId', 'api.getApi')
  app.post('/server/api/:groupId', 'api.createApi')
  app.post('/server/api/:groupId/batch', 'api.createGroupApis')
  app.put('/server/api/follower/:apiId', 'api.follow')
  app.delete('/server/api/follower/:apiId', 'api.unfollow')
  app.put('/server/api/:groupId/:apiId', 'api.modifyApi')
  app.delete('/server/api/:groupId/:apiId', 'api.delete')

  app.get('/server/history/api/:apiId', 'history.getApi')
  app.get('/server/authority/api/:apiId', 'authority.getApi')
  app.put('/server/authority/api/:apiId', 'authority.modifyApi')

  // stat
  app.get('/server/stat/mock', 'stat.mock')

  app.post('/client/real', 'client.real')

  // mock data
  const urlRegexp = pathToRegexp('/mock-by-url/:url*', [])
  allMethods.forEach(method => {
    app[method](urlRegexp, credentials, apiStat, 'client.mockByUrl')
  })

  const mockUrl = pathToRegexp('/client/:id/:url*', [])
  // const mockUrl = '/client/:id'
  allMethods.forEach(method => {
    app[method](mockUrl, credentials, apiStat, 'client.mock')
  })

  /* 用户相关 */
  app.post('/auth/user/dxy-login', 'user.dxyLogin')
  app.get('/auth/user', 'user.get')
  app.post('/auth/user/register', 'user.create')
  app.post('/auth/user/login', 'user.login')
  app.get('/auth/user/logout', 'user.logout')
  app.post('/auth/user/recovery/password/ticket', 'user.sentResetPassTicket')
  app.post('/auth/user/recovery/password/code', 'user.sentResetPassCode')
  app.put('/auth/user/recovery/password', 'user.resetPasswordByTicket')
  app.put('/server/user/password', 'user.updatePassword')
  app.put('/server/user', 'user.update')
  app.get('/server/user/search', 'user.search')
  // 收藏相关
  app.post('/server/user/favorites/:groupId', 'user.addFavorite')
  app.delete('/server/user/favorites/:groupId', 'user.removeFavorite')
  // app.get('/server/user/favorites', 'user.getAllFavorite')
}
