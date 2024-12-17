
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'; // 引入 Vuex store
import { ElMessage } from "element-plus";

// 布局
import Index from '@/views/user/index.vue'
import BackIndex from '@/views/admin/index.vue'
/* ***********前台 start************ */
//首页
import Home from '@/views/user/Home.vue'
//科室导航中心
import DepartmentNavigationCenter from '@/views/user/DepartmentNavigationCenter.vue'
//导航服务
import LocationNav from '@/views/user/LocationNav.vue'
//公告信息
import News from '@/views/user/News.vue'
import NewsDetail from '@/views/user/NewsDetail.vue'

//个人中心
import UserCen from '@/views/user/UserCen.vue';
//个人中心--个人信息
import UInfo from '@/views/user/usercenter/UInfo.vue';
//个人中心--客服
import Chat from '@/views/user/usercenter/Chat.vue'

/* ***********前台 end************ */

/* ***********后台 start************ */
import Login from '@/views/admin/Login.vue'
import HomeBack from '@/views/admin/Home.vue'
import UserCenter from '@/views/admin/UserCenter.vue'
import UserInfo from '@/views/admin/UserInfo.vue'
import YSManag from '@/views/admin/YSManag.vue'
import DepManag from '@/views/admin/DepManag.vue'
import DepSort from '@/views/admin/DepSort.vue'
/* ***********后台 end************ */

import NotFound from '@/views/404.vue'
//OK import Home from '@/views/Home.vue'
//OK import Login from '@/views/login.vue'
// import UpdatePassword from '@/views/update-password.vue'
// import pay from '@/views/pay.vue'
// import register from '@/views/register.vue'
// import center from '@/views/center.vue'
// import news from '@/views/modules/news/list.vue'
// import shangpinpingjia from '@/views/modules/shangpinpingjia/list.vue'
// import yonghu from '@/views/modules/yonghu/list.vue'
// import shangpinfenlei from '@/views/modules/shangpinfenlei/list.vue'
// import chat from '@/views/modules/chat/list.vue'
// import discussshangpinxinxi from '@/views/modules/discussshangpinxinxi/list.vue'
// import shangpinxinxi from '@/views/modules/shangpinxinxi/list.vue'
// import orders from '@/views/modules/orders/list.vue'
// import storeup from '@/views/modules/storeup/list.vue'
// import config from '@/views/modules/config/list.vue'
// import heimingdan from '@/views/modules/heimingdan/list.vue'

//图标
import { IoFileTray } from "vue3-icons/io5";
import { RiCustomerService2Line } from "vue3-icons/ri";
import { FaRegUser } from "vue3-icons/fa6";
import { CiStar } from "vue3-icons/ci";

// 提取前端路由的函数
export const getFrontendRoutes = () => {
    const frontRoute = routes.find(route => route.path === '/front');
    return frontRoute ? frontRoute.children.filter(child => child.show === true) : [];
};
export const getBackRoutes = () => {
    const backRoute = routes.find(route => route.path === '/back');
    return backRoute ? backRoute.children.filter(child => child.show === true) : [];
};
export const getBackRoutesYS = () => {
    const backRoute = routes.find(route => route.path === '/back');
    return backRoute ? backRoute.children.filter(child => child.show === true && (child.auth == 0 || child.auth == 1)) : [];
};
export const getBackRoutesUser = () => {
    const backRoute = routes.find(route => route.path === '/back');
    return backRoute ? backRoute.children.filter(child => child.show === true && (child.auth == 0 || child.auth == 2)) : [];
};
export const getUrls = () => {
    let urls = [];
    const backRoute = routes.find(route => route.path === '/back');
    // 如果当前路由有children，首先处理父路由
    if (backRoute.children && backRoute.children.length > 0) {
        // 添加当前路由的路径
        urls.push(backRoute.path);

        // 遍历子路由并拼接到路径中
        backRoute.children.forEach(child => {
            if (child.path) {
                urls.push(backRoute.path + '/' + child.path); // 拼接父路由路径和子路由路径
            }
        });
    }

    return urls;
}
//2.配置路由 
//auth 0 1 2 管理员 医生 用户 
const routes = [
    {
        path: '/front',
        name: '首页',
        component: Index,
        children: [
            {
                // 这里不设置值，是把main作为默认页面
                path: '',
                name: '首页',
                component: Home,
                icon: ''
            },

            {
                path: 'news',
                name: '公告信息',
                show: true,
                component: News,
                icon: IoFileTray
            },
            {
                path: 'newsdetail/:id', // 动态路由参数 :id
                name: '公告详情', // 详情
                component: NewsDetail,
                props: true // 将动态路由参数传递给组件
            },
            {
                path: 'departmentNavigationCenter',
                name: '科室导航中心',
                show: true,
                component: DepartmentNavigationCenter,
                icon: IoFileTray,
            },
            {
                path: 'locationNav',
                name: '导航服务',
                show: true,
                component: LocationNav,
                icon: IoFileTray
            },
            {
                path: 'userCen',
                name: '个人中心',
                show: true,
                component: UserCen,
                meta: { requiresAuth: true },
                icon: FaRegUser,
                children: [
                    {
                        // 这里不设置值，是把main作为默认页面
                        path: '',
                        name: '个人详情',
                        component: UInfo,
                        icon: CiStar
                    },
                    {
                        path: 'chat',
                        name: '智能客服',
                        show: true,
                        component: Chat,
                        icon: RiCustomerService2Line
                    },
                ]
            },

        ]
    },
    {
        path: '/back',
        name: '后台',
        component: BackIndex,
        meta: { requiresAuth: true },
        children: [{
            // 这里不设置值，是把main作为默认页面
            path: '',
            name: '系统首页',
            component: HomeBack,
            icon: ''
        },
        {
            path: 'usercenter',
            name: '用户中心',
            auth: 0,
            show: true,
            icon: IoFileTray,
            children: [{
                // 这里不设置值，是把main作为默认页面
                path: 'index',
                name: '修改密码',
                component: UserCenter,
                icon: ''
            },
            {
                // 这里不设置值，是把main作为默认页面
                path: 'userinfo',
                name: '个人信息',
                component: UserInfo,
                icon: ''
            }]
        },
        {
            path: 'ys',
            name: '医生管理',
            auth: 1,
            show: true,
            component: YSManag,
            icon: IoFileTray,
        },
        {
            path: 'depMa',
            name: '科室管理',
            show: true,
            icon: IoFileTray,
            children: [{
                // 这里不设置值，是把main作为默认页面
                path: 'index',
                name: '科室信息',
                component: DepManag,
                icon: ''
            },
            {
                path: 'sort',
                name: '科室分类',
                component: DepSort,
                icon: ''
            }
            ]
        }
            // {
            //     path: '/updatePassword',
            //     name: '修改密码',
            //     component: UpdatePassword,
            //     meta: { icon: '', title: 'updatePassword' }
            // }, {
            //     path: '/pay',
            //     name: '支付',
            //     component: pay,
            //     meta: { icon: '', title: 'pay' }
            // }, {
            //     path: '/center',
            //     name: '个人信息',
            //     component: center,
            //     meta: { icon: '', title: 'center' }
            // }
            //     , {
            //     path: '/heimingdan',
            //     name: '黑名单',
            //     component: heimingdan
            // }
            //     , {
            //     path: '/news',
            //     name: '商品资讯',
            //     component: news
            // }
            //     , {
            //     path: '/shangpinpingjia',
            //     name: '商品评价',
            //     component: shangpinpingjia
            // }
            //     , {
            //     path: '/yonghu',
            //     name: '用户',
            //     component: yonghu
            // }
            //     , {
            //     path: '/shangpinfenlei',
            //     name: '商品分类',
            //     component: shangpinfenlei
            // }
            //     , {
            //     path: '/chat',
            //     name: '客服管理',
            //     component: chat
            // }
            //     , {
            //     path: '/discussshangpinxinxi',
            //     name: '商品信息评论',
            //     component: discussshangpinxinxi
            // }
            //     , {
            //     path: '/shangpinxinxi',
            //     name: '商品信息',
            //     component: shangpinxinxi
            // }
            //     , {
            //     path: '/orders/:status',
            //     name: '订单管理',
            //     component: orders
            // }
            //     , {
            //     path: '/storeup',
            //     name: '心愿单管理',
            //     component: storeup
            // }
            //     , {
            //     path: '/config',
            //     name: '轮播图管理',
            //     component: config
            // }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        show: true,
        icon: IoFileTray,
    },
    // {
    //     path: '/register',
    //     name: 'register',
    //     component: register,
    //     meta: { icon: '', title: 'register' }
    // },
    {
        path: '/',
        redirect: '/front', // 默认跳转到 /index
    },
    {
        path: '/:catchAll(.*)',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
// 路由守卫
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem("adminName"); // 直接从 localStorage 获取角色信息
    const isLoggedIn = !!role; // 判断用户是否登录
    store.commit('setLoginState', { isLoggedIn, username: isLoggedIn ? role : '' }); // 

    console.log('s守卫', to.meta.requiresAuth && !isLoggedIn)
    if (to.meta.requiresAuth && !isLoggedIn) {
        ElMessage({
            message: "无权访问,请登录!",
            type: "error",
        });
        next({ path: '/front' }); // 如果需要认证且未登录，重定向到登录页
    } else {
        next(); // 否则正常导航
    }
});
export default router