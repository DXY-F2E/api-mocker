/**
 *
 * @param {HTMLElement} el - 要放置的 dom 节点
 * @param {Function} onChange - 修改完后的回调
 */
function setDragLine (el, onChange) {
  if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative'
  let line = document.createElement('div')
  line.style.position = 'absolute'
  line.style.right = '-5px'
  line.style.top = 0
  line.style.height = '100%'
  line.style.width = '10px'
  line.style.cursor = 'col-resize'
  line.style.backgroundColor = 'transparent'

  line.addEventListener('mousedown', e => {
    document.documentElement.style.cursor = 'col-resize'
    document.documentElement.style.pointerEvents = 'none'
    function onmousemove (e) {
      el.style.width = `${e.clientX - el.offsetLeft + 5}px`
    }
    function onmouseup (e) {
      onChange(e.clientX - el.offsetLeft + 5)
      document.documentElement.style.cursor = ''
      document.documentElement.style.pointerEvents = ''
      document.onmousemove = null
      document.onmouseup = null
    }
    document.onmousemove = onmousemove
    document.onmouseup = onmouseup

    return false
  })

  el.appendChild(line)
  el.addEventListener('scroll', e => {
    line.style.top = el.scrollTop + 'px'
  })
}

export default {
  /**
   * dom 插入父节点时调用
   * @param {HTMLElement} el - 当前 dom 节点
   * @param {any} binding - vue 自定义指令绑定的数据
   */
  inserted (el, binding) {
    let option = binding.value || {}
    let { value, onChange } = option
    if (value) el.style.width = `${value}px`
    setDragLine(el, onChange)
  }
}
