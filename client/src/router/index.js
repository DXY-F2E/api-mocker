import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './config'
Vue.use(VueRouter)

// 路由跳转置顶
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return {
      x: 0,
      y: 0
    }
  }
}

const router = new VueRouter({
  routes,
  scrollBehavior
})

export default router
