module.exports = () => {
  return function * credentials (next) {
    this.set('Access-Control-Allow-Credentials', 'true')
    yield next
  }
}
