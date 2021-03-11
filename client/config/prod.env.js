var isTest = process.env.NODE_ENV === "test"
var isPro = process.env.NODE_ENV === "production"
var NODE_ENV = ''
if (isTest) {
  NODE_ENV = '"test"'
}else if(isPro) {
  NODE_ENV = '"production"'
}

module.exports = {
  NODE_ENV: NODE_ENV
}
