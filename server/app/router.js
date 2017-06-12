module.exports = app => {
    const apiStat = app.middlewares.apiStat()
    const credentials = app.middlewares.credentials()

    app.get('/server/group', 'group.getAll')
    app.post('/server/group', 'group.create')
    app.get('/server/group/manage', 'group.getManageGroup')
    app.get('/server/group/unmanaged', 'group.getUnmanaged')
    app.put('/server/group/:id/claim', 'group.claim')
    app.delete('/server/group/:id', 'group.delete')

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

    // stat
    app.get('/server/stat/mock', 'stat.mock')

    // mock data
    app.get('/client/:id', credentials, apiStat, 'client.show')
    app.post('/client/:id', credentials, apiStat, 'client.create')
    app.put('/client/:id', credentials, apiStat, 'client.put')
    app.delete('/client/:id', credentials, apiStat, 'client.delete')

    app.post('/client/real', 'client.real')


    // user
    app.get('/auth/user', 'user.get')
    app.post('/auth/user/register', 'user.create')
    app.post('/auth/user/login', 'user.login')
    app.get('/auth/user/logout', 'user.logout')
    app.put('/server/user', 'user.update')
}
