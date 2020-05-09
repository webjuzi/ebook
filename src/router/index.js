import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/store'
    },
    {
      path: '/ebook',
      component: () => import('../views/ebook/index.vue'),
      children: [
        {
          path: ':fileName',
          component: () => import('../components/ebook/EbookReader.vue')
        }
      ]
    },
    {
      path: '/store',
      component: () => import('../views/store/index.vue'),
      redirect: '/store/home',
      children: [
        {
          path: 'home',
          component: () => import('../views/store/StoreHome.vue')
        }
      ]
    }
  ]
})
