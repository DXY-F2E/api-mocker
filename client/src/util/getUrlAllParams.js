export default (str = '') => {
  let res = {}
  let paramsArr = str.split('&')
  paramsArr.forEach((paramsPair) => {
    let keyValuePair = paramsPair.split('=')
    let key = keyValuePair[0]
    let value = keyValuePair[1]
    res[key] = value
  })
  return res
}
