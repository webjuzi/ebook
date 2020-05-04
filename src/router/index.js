import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/ebook'
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
    }
  ]
})
