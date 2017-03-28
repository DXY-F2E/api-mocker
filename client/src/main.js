// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import store from './store';
import router from './router';
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-default/index.css';
import 'element-ui/lib/theme-default/reset.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Vuex);
Vue.prototype.$http = axios;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});
