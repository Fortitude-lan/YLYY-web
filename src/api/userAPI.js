/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-21 09:07:55
 * @LastEditors: Hesin
 * @LastEditTime: 2024-12-18 09:31:01
 */
export const API_ENDPOINTS = {
  lunbotuAPI: '/config/list', //轮播图接口
  systemInfoAPI: '/systemintro/detail/1', //系统简介
  newsAPI: '/news/list', //公告接口
  aboutusAPI: '/aboutus/detail/1', //关于接口
  loginAPI: '/yonghu/login', //登录接口
  keshifenleiAPI: '/option/keshifenlei/keshifenlei',//科室分类
  keshixinxiAPI: '/keshixinxi/list',//科室信息list
  keshixinxiInfoAPI: '/keshixinxi/detail',//科室信息list
  daohangfuwuAPI: '/daohangfuwu/list',//导航信息list
  daohangfuwuInfoAPI: 'daohangfuwu/detail',//导航信息
  chatAPI: '/chat/list',//聊天客服
  chatAddAPI: '/chat/add',//聊天
  userInfoAPI: '/yonghu/session',//用户信息
  userUpdateAPI: '/yonghu/update',//用户信息修改
  upload: '/file/upload',//用户信息修改
  ysUpdateAPI: 'yisheng/update',//医生改密码
  signUpYSAPI: 'yisheng/register',//医生注册
  payAPI: 'jiuzhenkachongzhi/update',//就诊卡充值




  // 后台
  keshixinxiPageAPI: '/keshixinxi/page',//科室信息list
  keshifenleiPageAPI: 'keshifenlei/page',//科室分类list
  keshifenleiPageADDAPI: 'keshifenlei/save',//科室分类 修改 {keshifenlei}
  keshifenleiPageDAPI: 'keshifenlei/delete',//科室分类 删 [id,...]
  ysPageAPI: 'yisheng/page',//医生查询
  ysPageADDAPI: 'yisheng/save',//医生查询 add
  ysPageDelAPI: 'yisheng/delete',//医生查询 删 [id,...]
  ksxinxiAPI: 'keshixinxi/update',//科室信息
  zxguahaoAPI: 'zaixianguahao/add',//挂号
  zaixianguahaoAPI: 'zaixianguahao/list',//挂号list
  userPageAPI: 'yonghu/page',//用户列表
  userAddAPI: 'yonghu/save',//用户add
  userDelAPI: 'yonghu/delete',//用户 删除
  //后台 用户
  chongzhiAPI: 'jiuzhenkachongzhi/save',//充值金额
};