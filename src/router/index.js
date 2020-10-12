import Vue from 'vue'
import Router from 'vue-router'
import {
    Message
} from "element-ui";
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/home/children/user/user.vue'
import Right from '@/components/home/children/right/right.vue'
import Role from '@/components/home/children/right/role.vue'

Vue.use(Router)

const router = new Router({
    routes: [{
        name: 'login',
        path: '/login',
        component: Login
    }, {
        name: 'home',
        path: '/',
        component: Home,
        children: [{
            name: 'users',
            path: 'users',
            component: User
        }, {
            name: 'rights',
            path: 'rights',
            component: Right
        }, {
            name: 'roles',
            path: 'roles',
            component: Role
        }]
    }]
})
router.beforeEach((to, form, next) => {
    //判读是否是登录页跳转
    if (to.path === '/login') {
        //是登录页跳转，进行下一步
        next()
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
            return
        }
        next()
    }
})

export default router;