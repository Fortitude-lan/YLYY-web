/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-21 09:07:55
 * @LastEditors: Hesin
 * @LastEditTime: 2024-11-19 13:28:20
 */

//轮播图接口

import { API_ENDPOINTS } from '@/api/userAPI';
import { get } from '@/utils/util';


//系统简介
export const fetcSystemIntro = async (page = 1, limit = 10, sort = 'addtime', order = 'desc') => {
    try {
        const response = await get(API_ENDPOINTS.systemInfoAPI,);
        // console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 公告
export const fetchNewsList = async (params, page, limit, sort = 'addtime', order = 'desc') => {
    try {
        const response = await get(API_ENDPOINTS.newsAPI, { ...params, page, limit, sort, order });
        // console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

// 关于
export const fetchAbout = async () => {
    try {
        const response = await get(API_ENDPOINTS.aboutusAPI);
        // console.log(response.data)
        return response.data

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};

