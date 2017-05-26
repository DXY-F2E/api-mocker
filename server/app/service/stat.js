module.exports = app => {
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
            return this.saveApiStat(apiId, 1, {
                status: status,
                msg: msg
            })
        }
    }
    return Stat;
};