function Schema (index = 1) {
  this.status = 200
  this.statusText = `status${index}`
  this.example = null
  this.params = [{
    key: null,
    type: 'string',
    required: true,
    comment: null
  }]
}
module.exports = Schema
