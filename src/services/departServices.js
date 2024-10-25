/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-25 10:19:07
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-25 13:32:12
 */

import { API_ENDPOINTS } from '@/api/userAPI';
import { get } from '@/utils/util';


//科室分类
export const fetcKeshifenlei = async () => {
    try {
        const response = await get(API_ENDPOINTS.keshifenleiAPI,);
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 科室信息
export const fetchKeshiList = async (params, page = 1, limit = 10) => {
    try {
        const response = await get(API_ENDPOINTS.keshixinxiAPI, { ...params, page, limit, });
        console.log(response.data.list)
        return response.data.list
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
