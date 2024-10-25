/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-17 13:34:11
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-25 18:09:17
 */

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './assets/css/style.scss'
import App from './App.vue'
import router from './router'
const app = createApp(App)

app.use(ElementPlus)
app.use(Antd)
app.use(router) // 注册路由
app.mount('#app')