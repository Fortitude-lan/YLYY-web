import { API_ENDPOINTS } from '@/api/userAPI';
import { post, get } from '@/utils/util';
//用户就诊卡充值卡
export const fetchCharge = async (params, info) => {
    try {

        const response = await await post(API_ENDPOINTS.chongzhiAPI, params);
        if (response.code == 0) {
            console.log('更新金额')
            console.log(info)
            const res = await post(API_ENDPOINTS.userUpdateAPI, info)
            console.log('response', res)
            return res.code
        }
        //更新余额
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};
// ksxinxiAPI: 'keshixinxi/update',//科室信息
// zxguahaoAPI: 'zaixianguahao/add',//挂号
export const fetchBook = async (params) => {
    try {
        const response = await await post(API_ENDPOINTS.zxguahaoAPI, params);
        return response.code
        //更新余额
    } catch (error) {
        console.error("Error sending chat message:", error);
    }
};