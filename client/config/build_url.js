var buildUrl = '/'
if(process.env.NODE_ENV === 'test') {
  buildUrl += '_develop'
}

module.exports = buildUrl
