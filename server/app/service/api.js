module.exports = app => {
    class Api extends app.Service {
        getById (apiId) {
            return app.model.api.find({
                _id: apiId,
                isDeleted: false
            })
        }
        createApis (apis) {
            return app.model.api.insertMany(apis)
        }
        create (api) {
            const authId = this.ctx.authUser._id
            api.creator = authId
            api.manager = authId
            api.follower = [authId]
            return app.model.api(api).save()
        }
        update (apiId, api) {
            api.modifiedTime = Date.now()
            return app.model.api.findOneAndUpdate({
                _id: apiId
            }, api, { new: true })
        }
        delete (apiId) {
            return app.model.api.findOneAndUpdate({
                _id: apiId,
                manager: this.ctx.authUser._id
            }, {
                modifiedTime: Date.now(),
                isDeleted: true
            })
        }
        getList (cond, page, limit) {
            return app.model.api
                            .find(cond)
                            .sort({modifiedTime: -1, createTime: -1})
                            .skip((page - 1) * limit )
                            .limit(limit)
        }
        getManageList (page, limit) {
            const cond = {
                manager: this.ctx.authUser._id,
                isDeleted: false
            }
            return this.getList(cond)
        }
        * geiRichList (cond, page, limit) {
            const apis = (yield this.getList(cond, page, limit)).map(a => a.toObject())
            const userIds = apis.reduce((acc, a) => a.manager ? acc.concat(a.manager) : acc, [])
            const users = yield this.service.user.getByIds(userIds)
            const usersMap = {}
            users.forEach(u => usersMap[u._id] = u)
            return apis.map(api => {
                api.manager = usersMap[api.manager]
                return api
            })
        }
    }
    return Api;
};