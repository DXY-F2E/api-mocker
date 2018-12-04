import sideBar from './side-bar'
import stopDefaultEnter from './stop-default-enter'
import drag from './drag'
export default {
  install (Vue) {
    Vue.directive('sideBar', sideBar)
    Vue.directive('stopDefaultEnter', stopDefaultEnter)
    Vue.directive('drag', drag)
  }
}
