module.exports = app => {
    app.get('/mock-api/server/group', 'group.getAll')
    app.post('/mock-api/server/group', 'group.create')
    app.delete('/mock-api/server/group/:id', 'group.delete')

    app.get('/mock-api/server/api/', 'api.getAll')
    app.get('/mock-api/server/api/:groupId', 'api.getAll')
    app.get('/mock-api/server/api/:groupId/:apiId', 'api.getApi')
    app.post('/mock-api/server/api/:groupId', 'api.createApi')
    app.put('/mock-api/server/api/:groupId/:apiId', 'api.modifyApi')
    app.delete('/mock-api/server/api/:groupId/:apiId', 'api.delete')

    app.get('/mock-api/client/:id', 'client.show')
    app.post('/mock-api/client/:id', 'client.create')
    app.put('/mock-api/client/:id', 'client.put')
    app.delete('/mock-api/client/:id', 'client.delete')

    app.post('/mock-api/client/real', 'client.real')
}
