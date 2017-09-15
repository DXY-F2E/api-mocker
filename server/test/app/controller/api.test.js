const mock = require('egg-mock')
const mongoose = require('mongoose')

describe('test/app/controller/api.test.js', () => {
  before(() => {
    app = mock.app()
    return app.ready()
  })

  it('should get /', (done) => {
    request(app.callback())
      .get('/server/api')
      .expect(200, done)
  })

  it('should forbid put /group/api', (done) => {
    request(app.callback())
      .put('/server/api/group/api')
      .expect(403, done)
  })

  it('should forbit put /${groupId}/api', (done) => {
    const id = mongoose.Types.ObjectId().toString()
    request(app.callback())
             .put(`/server/api/${id}/api`)
             .expect(403, done)
  })

  it('should put /${groupId}/${apiId}', done => {
    const id = mongoose.Types.ObjectId().toString()
    request(app.callback())
             .put(`/server/api/${id}/${id}`)
             .expect(200, done)
  })

  it('should get /api/${gid}/${apiid}', done => {
    const id = mongoose.Types.ObjectId().toString()
    request(app.callback())
             .get(`/server/api/${id}/${id}`)
             .expect(200, done)
  })

  it('should get /api/${gid}', (done) => {
    const id = mongoose.Types.ObjectId().toString()
    request(app.callback())
             .get(`/server/api/${id}`)
             .expect(200, done)
  })

  /* it ('should forbid get /api/id', done => {
  *     request(app.callback())
  *         .get('/server/api/id')
  *         .expect(403, done)

  * }) */

  it('should forbid post /api', (done) => {
    request(app.callback())
      .post('/server/api/gid')
      .expect(403, done)
  })

  it('should post /api', (done) => {
    const id = mongoose.Types.ObjectId().toString()
    request(app.callback())
             .post(`/server/api/${id}`)
             .send({name: 'mock', dsl: {}})
             .expect(200, done)
  })

  it('should delete /api/${apiid}', done => {
    const id = mongoose.Types.ObjectId().toString()
    request(app.callback()).delete(`/server/api/${id}/${id}`).expect(204, done)
  })

  afterEach(() => {
    mock.restore()
  })
  // it ('should get /')
})
