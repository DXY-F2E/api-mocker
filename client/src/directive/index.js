import sideBar from './side-bar'
import stopDefaultEnter from './stop-default-enter'
import drag from './drag'
import scroll from './scroll'
export default {
  install (Vue) {
    Vue.directive('sideBar', sideBar)
    Vue.directive('stopDefaultEnter', stopDefaultEnter)
    Vue.directive('drag', drag)
    Vue.directive('scroll', scroll)
  }
}
