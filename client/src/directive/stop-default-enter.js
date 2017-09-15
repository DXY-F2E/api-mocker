export default {
  bind (el) {
    el.onkeydown = e => {
      if (e.keyCode === 13) {
        return false
      }
    }
  }
}
