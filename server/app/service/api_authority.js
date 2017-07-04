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
    }
    return ApiAuthority;
};