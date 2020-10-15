import Vue from "vue";
import Router from "vue-router";
import {
    Message
} from "element-ui";

//页面路由
/* import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/home/children/user/user.vue'
import Right from '@/components/home/children/right/right.vue'
import Role from '@/components/home/children/right/role.vue'
import Goods from '@/components/home/children/goods/goodsList.vue'
import GoodsAdd from '@/components/home/children/goods/goodsAdd.vue'
import GoodsParams from '@/components/home/children/goods/goodsParams.vue'
import GoodsCate from '@/components/home/children/goods/goodsCate.vue'
import Orders from '@/components/home/children/order/orders.vue'
import Reports from '@/components/home/children/reports/reports.vue' */

//页面路由懒加载
//登录页
const Login = () =>
    import ('@/components/login/login.vue');

//首页
const Home = () =>
    import ('@/components/home/home.vue');

//用户管理页
const User = () =>
    import ('@/components/home/children/user/user.vue');

//权限管理页
const Right = () =>
    import ('@/components/home/children/right/right.vue');
const Role = () =>
    import ('@/components/home/children/right/role.vue');

//商品管理页
const Goods = () =>
    import ('@/components/home/children/goods/goodsList.vue');
const GoodsAdd = () =>
    import ('@/components/home/children/goods/goodsAdd.vue');
const GoodsParams = () =>
    import ('@/components/home/children/goods/goodsParams.vue');
const GoodsCate = () =>
    import ('@/components/home/children/goods/goodsCate.vue');

//订单管理页
const Orders = () =>
    import ('@/components/home/children/order/orders.vue');

//数据统计页
const Reports = () =>
    import ('@/components/home/children/reports/reports.vue');


Vue.use(Router);

const router = new Router({
    routes: [{
            path: "/",
            redirect: "/login"
        },
        {
            name: "login",
            path: "/login",
            component: Login
        },
        {
            name: "home",
            path: "/home",
            component: Home,
            children: [{
                    name: "users",
                    path: "/users",
                    component: User
                },
                {
                    name: "rights",
                    path: "/rights",
                    component: Right
                },
                {
                    name: "roles",
                    path: "/roles",
                    component: Role
                },
                {
                    name: "goods",
                    path: "/goods",
                    component: Goods
                },
                {
                    name: "add",
                    path: "/add",
                    component: GoodsAdd
                },
                {
                    name: "params",
                    path: "/params",
                    component: GoodsParams
                },
                {
                    name: "categories",
                    path: "/categories",
                    component: GoodsCate
                }, {
                    name: "orders",
                    path: "/orders",
                    component: Orders
                }, {
                    name: "reports",
                    path: "/reports",
                    component: Reports
                }
            ]
        }
    ]
});
router.beforeEach((to, form, next) => {
    //判读是否是登录页跳转
    if (to.path === "/login") {
        //是登录页跳转，进行下一步
        next();
    } else {
        //不是登录页跳转
        //1.获取token值
        const token = localStorage.getItem("token");
        //2.判断是否有token值
        if (!token) {
            //没有token值
            //1.提示信息
            Message.warning("尚未登录，请进行登录");
            //2.跳转到登录页登录
            router.push({
                name: "login"
            });
            return;
        }
        next();
    }
});

export default router;