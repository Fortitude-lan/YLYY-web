
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

// 导航列表
export const fetchDaohangList = async (params, page = 1, limit = 10) => {
    try {
        const response = await get(API_ENDPOINTS.daohangfuwuAPI, { ...params, page, limit, });
        console.log(response.data.list)
        return response.data.list
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};