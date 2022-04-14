import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import "./assets/css/global.css"
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入第三方表格插件
import ZkTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// axios
import axios from 'axios'
// 请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求拦截器
axios.interceptors.request.use((config)=>{
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios


Vue.config.productionTip = false


Vue.component('tree-table', ZkTable);
Vue.use(VueQuillEditor)


Vue.filter('dateFormat', function(dateTime){
  const dt = new Date(dateTime);

  const y = dt.getFullYear();
  const m = dt.getMonth() + 1;
  const d = dt.getDate();

  return `${y}-${m}-${d}`;


})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
