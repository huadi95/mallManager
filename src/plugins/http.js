import axios from "axios";

//封装axios,使其可以在全局使用
//1.新建一个对象的变量
const MyHttpServer = {};
MyHttpServer.install = function(Vue) {
    //项目的接口基准地址
    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";
    // 2. 添加实例方法
    Vue.prototype.$http = axios;
};
//3.将封装好的对象导出
export default MyHttpServer;
