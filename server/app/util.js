function * generateApiURL (app) {
  return `/client/${yield app.model.api.count().exec()}`
}
exports.generateApiURL = generateApiURL
