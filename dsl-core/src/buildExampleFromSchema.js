var Mock = require('mockjs')

function buildExampleFromSchema (schema) {
  if (schema.example && typeof schema.example === 'object') {
    return Mock.mock(schema.example)
  }
  const example = {}
  schema.params.forEach(param => {
    if (!param.key) return
    example[param.key] = (param.example || param.example === false) ? param.example : buildExample(param)
  })
  return Mock.mock(example)
};
function buildExample (param) {
  switch (param.type) {
    case 'object':
      return buildExampleFromSchema(param)
    case 'array':
      return [buildExample(param.items)]
    case 'number':
      return Math.ceil(Math.random() * 10000)
    case 'boolean':
      return Math.ceil(Math.random() * 2) > 1
    default:
      return 'value'
  }
};
module.exports = buildExampleFromSchema
