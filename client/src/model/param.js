// 参数（属性）列表 模型
class Param {
  constructor (initParam = {}) {
    const { key = null, type = 'string', required = true, comment = null } = initParam
    this.key = key
    this.type = type
    this.required = required
    this.comment = comment
  }
}

export default Param
