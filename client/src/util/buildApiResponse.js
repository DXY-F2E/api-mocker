import buildSchemaFromExample from './buildSchemaFromExample'
export default (api) => {
  if (api.options.response) {
    return api
  }
  api.options.response = [buildSchemaFromExample(api.dsl)]
  return api
}
