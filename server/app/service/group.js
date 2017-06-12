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
        getUserGroups(user, rights) {
            return app.model.group.find({
                [rights]: user,
                isDeleted: false
            }).sort({
                createTime: -1
            })
        }
        getById(groupId) {
            return app.model.group.findOne({
                _id: groupId
            })
        }
        * delete(groupId) {
            const group = yield this.getById(groupId)
            return app.model.group.findOneAndUpdate({
                _id: groupId,
                manager: this.ctx.authUser._id
            }, {
                modifiedTime: Date.now(),
                name: group.name + '_已删除',
                isDeleted: true
            })
        }
        getManageGroup() {
            return this.getUserGroups(this.ctx.authUser._id, 'manager')
        }
        getUnmanaged() {
            return this.getUserGroups(null, 'manager')
        }
        claim (groupId) {
            return app.model.group.findOneAndUpdate({
                _id: groupId,
                manager: null
            }, {
                modifiedTime: Date.now(),
                manager: this.ctx.authUser._id
            })
        }
    }
    return Group;
};