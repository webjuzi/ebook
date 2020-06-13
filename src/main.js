import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'// 配置Vuex
import i18n from './lang'// 国际化
import './assets/styles/icon.css'
import './assets/styles/global.scss'// 全局样式文件
// import './mock'
import './utils/boots'
import './utils/create-api'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
