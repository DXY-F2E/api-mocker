/**
 * 分词逻辑
 * @param {*} q
 */
function parseWord (q) {
  let result = []

  let parseResult = q.split(' ')
  // 只允许字母数字汉字和下划线并去重
  const filterCondition = new RegExp(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/)
  parseResult.map((word) => {
    filterCondition.test(word) && result.push(word)
  })
  result = [...new Set(result)]

  return result
}

module.exports = {
  parseWord
}
