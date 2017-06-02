module.exports = app => {
    class Group extends app.Service {
        updateTime (groupId) {
            return app.model.group.update({_id: groupId}, {modifiedTime: Date.now()}, {new: true})
        }
    }
    return Group;
};