const Param = require('./param')

// 字段结构 模型
class Schema {
  constructor (index = 1) {
    this.status = 200
    this.statusText = `status${index}`
    this.example = null
    this.params = [new Param()]
  }
}

module.exports = Schema
