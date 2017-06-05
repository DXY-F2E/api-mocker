module.exports = app => {
    class Api extends app.Service {
        createApis (apis) {
            return app.model.api.insertMany(apis)
        }
        create (api) {
            api.creator = this.ctx.authUser._id
            return app.model.api(api).save()
        }
        update (apiId, api) {
            api.modifiedTime = Date.now()
            return app.model.api.findOneAndUpdate({
                _id: apiId
            }, api, { new: true })
        }
        getList (cond, page, limit) {
            return app.model.api
                            .find(cond)
                            .sort({modifiedTime: -1, createTime: -1})
                            .skip((page - 1) * limit )
                            .limit(limit)
                            .lean()
        }
        * geiRichList (cond, page, limit) {
            const apis = yield this.getList(cond, page, limit)
            const userIds = apis.reduce((acc, a) => a.creator ? acc.concat(a.creator) : acc, [])
            const users = yield this.service.user.getByIds(userIds)
            const usersMap = {}
            users.forEach(u => usersMap[u._id] = u)
            return apis.map(api => {
                api.creator = usersMap[api.creator]
                return api
            })
        }
    }
    return Api;
};