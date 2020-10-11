import axios from "axios";

//封装axios,使其可以在全局使用
//1.新建一个对象的变量
const MyHttpServer = {};
MyHttpServer.install = function(Vue) {
    //项目的接口基准地址
    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";

    // 1.添加请求拦截器
    axios.interceptors.request.use((config) => {
        //判断是否是进行登录请求
        if (config.url !== 'login') {
            //不是进行登录请求，就添加token令牌再请求
            //1.获取token值
            const token = localStorage.getItem("token");
            //2.获取用户数据是需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
            config.headers["Authorization"] = token;
        }
        return config;
    }, (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 2.添加响应拦截器
    axios.interceptors.response.use((response) => {
        // 对响应数据做点什么
        return response;
    }, (error) => {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
    // 2. 添加实例方法
    Vue.prototype.$http = axios;
};
//3.将封装好的对象导出
export default MyHttpServer;