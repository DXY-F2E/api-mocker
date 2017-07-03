module.exports = app => {
    class ApiAuthority extends app.Service {
        update(apiId, authority) {
            authority.modifiedTime = Date.now()
            return app.model.apiHistory.findOneAndUpdate({
                apiId: apiId
            }, authority , {
                setDefaultsOnInsert: true,
                new: true,
                upsert: true
            })
        }
    }
    return ApiAuthority;
};