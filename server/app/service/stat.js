module.exports = app => {
  const API_BEHAVIOR_MOCK = 1 // 数据统计行为->请求mock数据

  class Stat extends app.Service {
    // 保存数据方法异步执行
    saveApiStat (apiId, behavior, result) {
      return app.model.ApiStat({
        apiId,
        behavior,
        result
      }).save()
    }
    requestApi (apiId, status, msg) {
      return this.saveApiStat(apiId, API_BEHAVIOR_MOCK, {
        status,
        msg
      })
    }
    getMockStat (start, end) {
      return app.model.ApiStat.aggregate([
        {
          $match: {
            behavior: API_BEHAVIOR_MOCK,
            createDay: {
              $gte: start,
              $lte: end
            }
          }
        },
        {
          $group: {
            _id: '$createDay',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    }
  }
  return Stat
}
