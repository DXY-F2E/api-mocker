const pathToRegexp = require('path-to-regexp')
module.exports = app => {
  const apiStat = app.middlewares.apiStat()
  const credentials = app.middlewares.credentials()

  app.get('/server/group', 'group.getAll')
  app.post('/server/group', 'group.create')
  app.get('/server/group/manage', 'group.getManageGroup')
  app.get('/server/group/unmanaged', 'group.getUnmanaged')
  app.put('/server/group/:id/claim', 'group.claim') // 认领分组，这是历史原因导致的接口，可以不关心
  app.delete('/server/group/:id', 'group.delete')
  app.put('/server/group/:id', 'group.update')

  app.get('/server/api/', 'api.getAll')
  app.get('/server/api/manage', 'api.getManageApi')
  app.get('/server/api/:groupId', 'api.getAll')
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
  const mockUrl = pathToRegexp('/client/:id/:url*', [])
  // const mockUrl = '/client/:id'
  app.get(mockUrl, credentials, apiStat, 'client.show')
  app.post(mockUrl, credentials, apiStat, 'client.create')
  app.put(mockUrl, credentials, apiStat, 'client.put')
  app.delete(mockUrl, credentials, apiStat, 'client.delete')

  // user
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
}
