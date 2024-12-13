
import { API_ENDPOINTS } from '@/api/userAPI';
import { post, get } from '@/utils/util';
import {
    yhloginService,
} from "./headerServices";
// 登录
export const loginService = async (params) => {
    try {
        console.log(params)
        const { role } = params
        let res;

        if (role == 'yonghu') {
            res = await yhloginService({ username: params.username, password: params.password });
            return res
        }
        else {
            res = await get(`${role}/login`, { username: params.username, password: params.password });
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
        }

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
//修改密码
export const fetchMima = async (role, params) => {
    try {
        if (role == 'yonghu') {
            const res = await post(API_ENDPOINTS.userUpdateAPI, params);
            return res.code
        } else if (role == 'yisheng') {
            const time = new Date().getTime()
            console.log(params)
            const res = await post(API_ENDPOINTS.ysUpdateAPI, { ...params, addtime: time });
            return res.code
        }


    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//注册医生
export const signUpService = async (params) => {
    try {
        const res = await post(API_ENDPOINTS.signUpYSAPI, {
            ...params,
            jiuzhenkahao: new Date().getTime(),
            jine: 0,
        });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//医生修改
export const fetchYSSave = async (params) => {

    try {
        const response = await await post(API_ENDPOINTS.ysUpdateAPI, params);
        return response.code
    } catch (error) {
        console.error("Error sending ysUpdateAPI message:", error);
    }
};
// 科室信息
export const fetchKeshiPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.keshixinxiPageAPI, {
            ...params, page, limit, sort: 'id',
            order: 'desc'
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//科室分类list
export const fetchfenleiPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.keshifenleiPageAPI, {
            ...params, page, limit, sort: 'id',
            order: 'desc'
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//科室分类 add
export const fetchfenleiPageAdd = async (params) => {
    try {
        console.log(params)
        const res = await post(API_ENDPOINTS.keshifenleiPageADDAPI, { ...params });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//科室分类 del
export const keshifenleiPageDel = async (params) => {
    try {
        console.log(params)
        const res = await post(API_ENDPOINTS.keshifenleiPageDAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//用户列表
export const fetchUserPage = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.userPageAPI, {
            ...params, page, limit, sort: 'id', order: 'desc'
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//用户 add
export const fetchUserAdd = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.userAddAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//用户 del
export const fetchUserDel = async (params) => {
    try {
        // console.log(params)
        const res = await post(API_ENDPOINTS.userDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//医生 list
export const fetchYsPageAPI = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.ysPageAPI, {
            ...params, page, limit, sort: 'id',
            order: 'desc'
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//医生 add
export const fetchysPageAddAPI = async (params) => {
    try {
        console.log(params)
        const res = await post(API_ENDPOINTS.ysPageAddAPI, { ...params });
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//医生 del
export const fetchYsPageDelAPI = async (params) => {
    try {
        console.log(params)
        const res = await post(API_ENDPOINTS.ysPageDelAPI, params);
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

//挂号list
export const fetchZXGHList = async (params, page = 1, limit = 9999) => {
    try {
        const response = await get(API_ENDPOINTS.zaixianguahaoAPI, {
            ...params, page, limit
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};