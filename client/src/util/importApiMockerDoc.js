function buildApisFormApiMockerDoc (json, group) {
  let {resources = []} = json
  resources.forEach((api) => {
    api.group = group._id
  })
  return resources
}

export default buildApisFormApiMockerDoc
