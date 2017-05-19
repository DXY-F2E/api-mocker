module.exports = (options, app) => {
    const redirect = () => {
        this.status = 302
        this.body = {
            redirectUrl: '/login'
        }
    }
    return function * auth (next) {
        if (this.request.url.indexOf('server') >= 0) {
            const cookie = this.cookies.get('mockerUser', {
                signed: true,
                encrypt: true
            })
            redirect()
        } else {
            yield next
        }
        console.log(this.request.url)
    }
}
