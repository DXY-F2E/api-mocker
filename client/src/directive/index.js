import sideBar from './side-bar';
export default {
    install(Vue) {
        Vue.directive('sideBar', sideBar);
    }
};
