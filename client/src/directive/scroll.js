function scrollIntoView (el, isScroll) {
  if (!isScroll) return
  el.scrollIntoViewIfNeeded()
}

export default {
  /**
   * dom 插入父节点时调用
   * @param {HTMLElement} el - 当前 dom 节点
   * @param {any} binding - vue 自定义指令绑定的数据
   */
  inserted (el, binding) {
    scrollIntoView(el, binding.value)
  },
  /**
   * 绑定的数据修改时调用
   * @param {HTMLElement} el - 当前 dom 节点
   * @param {any} binding - vue 自定义指令绑定的数据
   */
  update (el, binding) {
    scrollIntoView(el, binding.value)
  }
}
