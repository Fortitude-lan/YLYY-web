/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-25 10:19:07
 * @LastEditors: Hesin
 * @LastEditTime: 2024-11-20 16:47:43
 */

import { API_ENDPOINTS } from '@/api/userAPI';
import { get } from '@/utils/util';


//科室分类
export const fetcKeshifenlei = async () => {
    try {
        const response = await get(API_ENDPOINTS.keshifenleiAPI);
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 科室信息
export const fetchKeshiList = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.keshixinxiAPI, { ...params, page, limit, });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 科室详情信息
export const fetchKeshiInfo = async (id) => {
    try {
        const response = await get(API_ENDPOINTS.keshixinxiInfoAPI + '/' + id);
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
// 导航列表
export const fetchDaohangList = async (params, page, limit) => {
    try {
        const response = await get(API_ENDPOINTS.daohangfuwuAPI, { ...params, page, limit, });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};
//导航详情信息 
export const fetchDaohangInfo = async (id) => {
    try {
        const response = await get(API_ENDPOINTS.daohangfuwuInfoAPI + '/' + id);
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};