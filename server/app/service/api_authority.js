const { authority } = require('../../constants')
const {
    OPERATION_ALL,
    OPERATION_MEMBER,
    OPERATION_DESIGNEE
} = authority

module.exports = app => {
    class ApiAuthority extends app.Service {
        update (apiId, authority) {
            authority = (typeof authority === 'object') ? authority : {}
            authority.modifiedTime = Date.now()
            return app.model.apiAuthority.findOneAndUpdate({
                apiId: apiId
            }, authority , {
                setDefaultsOnInsert: true,
                new: true,
                upsert: true
            })
        }
        get (apiId) {
            return app.model.apiAuthority.findOne({
                apiId: apiId
            })
        }
        isWritable(authority, group, authId) {
            if (!authority) {
                return { status: true }
            }
            const { mode, operator } = authority.operation
            switch (mode) {
                case OPERATION_ALL:
                    return { status: true }
                case OPERATION_MEMBER:
                    return {
                        status: !!group.member.find(m => m === authId),
                        msg: '仅组内成员可操作'
                    }
                case OPERATION_DESIGNEE:
                    return {
                        status: !!operator.find(o => o === authId),
                        msg: '仅指定人员可操作'
                    }
                default:
                    return { status: true }
            }
        }
    }
    return ApiAuthority;
};