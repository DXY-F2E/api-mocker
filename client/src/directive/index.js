import sideBar from './side-bar'
import stopDefaultEnter from './stop-default-enter'
export default {
  install (Vue) {
    Vue.directive('sideBar', sideBar)
    Vue.directive('stopDefaultEnter', stopDefaultEnter)
  }
}
