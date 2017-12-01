module.exports = app => {
  class ApiHistory extends app.Service {
    get (apiId) {
      return app.model.ApiHistory.findOne({
        apiId
      })
    }
    create (api) {
      return app.model.ApiHistory({
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
      return app.model.ApiHistory.findOneAndUpdate({
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
  return ApiHistory
}
