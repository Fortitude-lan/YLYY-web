import { API_ENDPOINTS } from '@/api/userAPI';
import { get } from '@/utils/util';

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
            localStorage.setItem('role', '用户');
            // localStorage.setItem('keyPath', this.$config.indexNav.length + 2);
        }
        return res.code

    } catch (error) {
        console.error('Error fetching carousel images:', error);
        throw error; // 抛出错误以供调用者处理
    }
};