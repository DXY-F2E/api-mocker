function buildApisFormJson (json, group) {
  return json.map(i => ({...i, group: group._id}))
}

module.exports = buildApisFormJson
