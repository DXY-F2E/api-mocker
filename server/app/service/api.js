module.exports = app => {
    class Api extends app.Service {
        * createApis (apis) {
            return app.model.api.insertMany(apis)
        }
    }
    return Api;
};