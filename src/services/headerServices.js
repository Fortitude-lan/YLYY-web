/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-22 19:25:39
 * @LastEditors: Hesin
 * @LastEditTime: 2024-11-19 17:12:16
 */
import { API_ENDPOINTS } from '@/api/userAPI';
import { post, get } from '@/utils/util';

// 登录
export const loginService = async (params) => {
    try {
        const res = await get(API_ENDPOINTS.loginAPI, { ...params, table: 'yonghu' });
        console.log(res)
        if (res.code === 0) {
            localStorage.setItem('Token', res.token);
            localStorage.setItem('UserTableName', 'yonghu');
            localStorage.setItem('sessionTable', 'yonghu');
            localStorage.setItem('username', params.username);
            localStorage.setItem('adminName', params.username);
            // localStorage.setItem('userid', params.username);
            localStorage.setItem('role', '用户');
            // localStorage.setItem('keyPath', 8);
            getSession();
        }
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};


// 获取轮播图数据
export const fetchCarouselImages = async (page = 1, limit = 3) => {
    try {
        const response = await get(API_ENDPOINTS.lunbotuAPI, { page, limit });
        // console.log(response.data.list.map(item => item.value))

        return response.data.list
            .filter(item => item.name.includes('picture') && item.value)
            .map(item => item.value);

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//聊天
export const fetchChat = async () => {
    getSession();
    try {
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中
        const response = await get(API_ENDPOINTS.chatAPI, {
            userid: userid,
            sort: "addtime",
            order: "asc",
            limit: 1000,
        });
        console.log(response)
        if (response.code === 0) {
            return response.data.list
        } else {
            return []
        }
    } catch (error) {
        console.error("Error fetching chat:", error);
        throw error;
    }
};
export const fetchAddChat = async (ask) => {
    const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中
    try {
        const params = {
            ask,
            userid
        }
        const response = await await post(API_ENDPOINTS.chatAddAPI, params);
        console.log(response)
        return 1
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};
// 获取用户 Session 的方法
export const getSession = async () => {
    try {
        // 发起请求，直接在请求头中带上 token
        const response = await get(API_ENDPOINTS.userInfoAPI);
        console.log(response.code === 0, response.data)

        // 处理请求结果
        if (response.code === 0) {
            const sessionData = response.data;

            // 存储用户 session 信息到 localStorage
            localStorage.setItem("userid", sessionData.id);
            if (sessionData.vip) {
                localStorage.setItem("vip", sessionData.vip);
            }
            // 判断头像字段并存储
            const headportrait = sessionData.touxiang || sessionData.headportrait || "";
            localStorage.setItem("headportrait", headportrait);
            return response.data
        } else {
            console.error("Error fetching session data:", response.data.message);
        }
    } catch (error) {
        console.error("Error in getSession:", error);
    }
};
//信息修改

export const fetchUpdateUserInfo = async (params) => {

    try {
        const timestamp = new Date().getTime();
        const userid = localStorage.getItem("userid"); // 假设用户ID存储在 localStorage 中
        const resParams = {
            addtime: timestamp,
            id: userid,
            ...params
        }
        const response = await await post(API_ENDPOINTS.userUpdateAPI, resParams);
        return response.code
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};