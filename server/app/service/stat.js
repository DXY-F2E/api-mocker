module.exports = app => {

    const API_BEHAVIOR_MOCK = 1

    class Stat extends app.Service {
        // 保存数据方法异步执行
        saveApiStat(apiId, behavior, result) {
            return new app.model.apiStat({
                apiId: apiId,
                behavior: behavior,
                result: result
            }).save()
        }
        requestApi(apiId, status, msg) {
            return this.saveApiStat(apiId, API_BEHAVIOR_MOCK, {
                status: status,
                msg: msg
            })
        }
        getMockStat(start, end) {
            return app.model.apiStat.aggregate([
              { $match: {
                behavior: API_BEHAVIOR_MOCK,
                createDay: {
                    $gte: start,
                    $lte: end
                }
              }},
              { $sort: {createDay: -1} },
              { $group: {
                // _id : { month: { $month: '$createTime' }, day: { $dayOfMonth: '$createTime' }, year: { $year: '$createTime' } },
                _id: '$createDay',
                count: { $sum: 1 }
              }}
            ])
        }
    }
    return Stat;
};