module.exports = (options, app) => {
    return function * auth (next) {
        if (this.request.url.indexOf('server') >= 0) {
            const cookie = this.cookies.get('mockerUser', {
                signed: true,
                encrypt: true
            })
            this.status = 401
        } else {
            yield next
        }
        // console.log(this.request)
    }
}
