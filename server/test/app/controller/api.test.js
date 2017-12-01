/* eslint-disable */
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api.test.js', () => {

  it('should get /', () => app
      .httpRequest()
      .get('/server/api')
      .expect(401))

})
