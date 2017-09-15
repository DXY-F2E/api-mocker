module.exports = () => {
  return function * apiStat (next) {
    const { id } = this.params
    try {
      yield next
      this.service.stat.requestApi(id, true)
    } catch (err) {
      this.status = err.status || 500
      this.body = err
      this.service.stat.requestApi(id, false, err.message)
    }
  }
}
