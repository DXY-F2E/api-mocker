const Service = require('egg').Service

class ApiHistory extends Service {
  get (apiId) {
    return this.ctx.model.ApiHistory.findOne({
      apiId
    })
  }
  create (api) {
    return this.ctx.model.ApiHistory({
      apiId: api._id,
      data: api
    }).save()
  }
  push (api) {
    const { _id, name } = this.ctx.authUser
    const record = {
      data: api,
      operator: _id,
      operatorName: name
    }
    return this.ctx.model.ApiHistory.findOneAndUpdate({
      apiId: api._id
    }, {
      updateTime: Date.now(),
      $push: {
        records: {
          $each: [ record ],
          $sort: { createTime: 1 },
          $slice: -5
        }
      }
    }, {
      setDefaultsOnInsert: true,
      new: true,
      upsert: true
    })
  }
}

module.exports = ApiHistory
