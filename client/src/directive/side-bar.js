// 75-K, 66-B, 默认 按下 ctrl + k + b 隐藏侧边栏
const switchSideBar = (el) => {
  if (el.clientWidth) {
    el.style.display = 'none'
  } else {
    el.style.display = 'block'
  }
}
const funcMap = {}
const matchLength = (mapKeys, keys) => mapKeys.filter((k, i) => k === keys[i]).length
const matchKey = mapKeys => {
  let codes = []
  return e => {
    const key = e.keyCode
    if ((e.ctrlKey || e.metaKey) && !!mapKeys.find(k => key === k)) {
      codes.push(key)
      const length = matchLength(mapKeys, codes)
      if (length === mapKeys.length) {
        codes = []
        return true
      }
      if (length === codes.length) {
        return false
      }
      codes = []
      return false
    } else {
      codes = []
      return false
    }
  }
}
const getEleId = el => el.id || 'defalut'
export default {
  inserted (el, { value = [75, 66] }) {
    const elId = getEleId(el)
    const isMatchKey = matchKey(value)
    const onKeydown = el => e => isMatchKey(e) && switchSideBar(el)
    funcMap[elId] = onKeydown(el)
    document.addEventListener('keydown', funcMap[elId])
  },
  unbind (el) {
    const elId = getEleId(el)
    document.removeEventListener('keydown', funcMap[elId])
    delete funcMap[elId]
  }
}
