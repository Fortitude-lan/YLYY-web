/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-21 09:07:55
 * @LastEditors: Hesin
 * @LastEditTime: 2024-11-19 15:15:36
 */
import axios from 'axios';
export const baseUrl = '/springbootYL'
// 创建 Axios 实例
const http = axios.create({
    baseURL: baseUrl, // 替换为你的 API 基础 URL
    timeout: 10000, // 请求超时设置
});

// 请求拦截器
http.interceptors.request.use(
    config => {
        console.log('请求拦截')
        // 从 localStorage 获取 token
        const token = localStorage.getItem('Token'); // 假设 token 存储在 localStorage 中
        // 如果 token 存在，添加 Authorization 头部
        if (token) {
            config.headers['Token'] = token; // 设置自定义 Token 头
            config.headers['x-requested-with'] = 'XMLHttpRequest';
        }

        return config; // 返回配置对象
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        console.log(response.data)
        if (response.data.code === 401) {
            console.error('未登录，跳转到登录页');
            // 清空本地存储
            localStorage.clear();
            window.location.href = '/login';
        }
        return response.data; // 返回响应数据
    },
    error => {
        return Promise.reject(error);
    }
);
export default http;

// 封装 GET 请求
export const get = async (url, params = {}) => {
    return await http.get(url, { params });
};

// 封装 POST 请求
export const post = async (url, data = {}) => {
    return await http.post(url, data);
};

// 其他 HTTP 方法可以在这里添加