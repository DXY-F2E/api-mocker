class Param {
  constructor (initParam = {}) {
    const { key = null, type = 'string', required = true, comment = null } = initParam
    // const required = initParam.required === undefined ? false : initParam.required
    console.log(key, required)
    this.key = key
    this.type = type
    this.required = required
    this.comment = comment
  }
}

export default Param
