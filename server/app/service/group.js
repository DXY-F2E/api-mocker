module.exports = app => {
    class Group extends app.Service {
        updateTime(groupId) {
            // 此方法允许异步执行
            return app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true}).exec()
        }
        create(group) {
            const authId = this.ctx.authUser._id
            const _group = {
                name: group.name,
                creator: authId,
                manager: authId
            }
            return app.model.group(_group).save()
        }
    }
    return Group;
};