module.exports = app => {
    class ApiHistory extends app.Service {
        * get(apiId) {
            return app.model.apiHistory.find({
                apiId: apiId
            })
        }
        * create(api){
            return new app.model.apiHistory({
                apiId: api._id,
                data: api
            }).save()
        }
        * push(api) {
            const record = {
                data: api
            }
            return app.model.apiHistory.findOneAndUpdate({
                apiId: api._id
            }, {
                updateTime: Date.now(),
                $push: {
                    records: {
                        $each: [ record ],
                        $sort: { modifiedTime: 1 },
                        $slice: -5
                    }
                 }
            }, {
                setDefaultsOnInsert: true,
                new: true,
                upsert: true
            })
        }
    }
    return ApiHistory;
};