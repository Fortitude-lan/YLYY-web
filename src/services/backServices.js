import { API_ENDPOINTS } from '@/api/userAPI';
import { post, get } from '@/utils/util';

// 登录
export const loginService = async (params) => {
    try {
        console.log(params)
        const { role } = params
        const res = await get(`${role}/login`, { username: params.username, password: params.password });
        if (res.code === 0) {
            console.log(res)
            localStorage.setItem('Token', res.token);
            localStorage.setItem('sessionTable', role);
            if (role == 'users') {
                localStorage.setItem('role', '管理员');
                localStorage.setItem('loginTable', 'yisheng');
            } else if (role == 'yisheng') {
                localStorage.setItem('role', '医生');
            }
            getSession(role);
        }
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 获取用户 Session 的方法
export const getSession = async (role) => {
    try {
        // 发起请求，直接在请求头中带上 token
        const response = await get(`${role}/session`);
        console.log(response.code === 0, response.data)
        // 处理请求结果
        if (response.code === 0) {
            const sessionData = response.data;
            // 存储用户 session 信息到 localStorage
            localStorage.setItem("userid", sessionData.id);
            // 
            if (role == 'users') {
                localStorage.setItem("adminName", sessionData.username);
            } else if (role == 'yisheng') {
                localStorage.setItem('adminName', sessionData.yishenggonghao);
            }

            if (sessionData.vip) {
                localStorage.setItem("vip", sessionData.vip);
            }

            // 判断头像字段并存储
            // const headportrait = sessionData.touxiang || sessionData.headportrait || "";
            // localStorage.setItem("headportrait", headportrait);

            return response.data
        } else {
            console.error("Error fetching session data:", response.data.message);
        }
    } catch (error) {
        console.error("Error in getSession:", error);
    }
};