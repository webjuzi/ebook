import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/store'
    },
    // 阅读器
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
    // 书城、书架
    {
      path: '/store',
      component: () => import('../views/store/index.vue'),
      redirect: '/store/shelf',
      children: [
        // 书架
        {
          path: 'shelf',
          component: () => import('../views/store/StoreShelf.vue')
        },
        // 分组信息
        {
          path: 'category',
          component: () => import('../views/store/StoreCategory.vue')
        },
        // 书城首页
        {
          path: 'home',
          component: () => import('../views/store/StoreHome.vue')
        },
        // 分类列表
        {
          path: 'list',
          component: () => import('../views/store/StoreList.vue')
        },
        // 图书详情
        {
          path: 'detail',
          component: () => import('../views/store/StoreDetail.vue')
        },
        // 听书
        {
          path: 'speaking',
          component: () => import('../views/store/StoreSpeaking.vue')
        }
      ]
    }
  ]
})
