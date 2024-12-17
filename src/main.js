

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './assets/css/style.scss'
import App from './App.vue'
import router from './router'
import store from './store';
import Vue3BaiduMapGL from 'vue3-baidu-map-gl'
const app = createApp(App)

app.use(ElementPlus, { locale: zhCn })
app.use(Antd)
app.use(store);
app.use(Vue3BaiduMapGL, {
    ak: '7iELRkWE3yRZ78tBcR5XGHvLL0XSuIu3',
    plugins: ['TrackAnimation', 'Mapvgl', 'Mapv', 'MapvThree']
})
app.use(router) // 注册路由
app.mount('#app')