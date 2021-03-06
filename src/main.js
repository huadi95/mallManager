import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import moment from "moment";
import "@/assets/css/base.css";
import MyHttpServer from "@/plugins/http.js";
//引入面包屑公共组件
import MyBread from '@/common/MyBread/MyBread.vue'
import App from "./App";
import router from "./router";

//使用vue插件
Vue.use(ElementUI);
Vue.use(MyHttpServer);

//是否用于生产环境
Vue.config.productionTip = false;

//全局过滤器，过滤时间
Vue.filter("fmtdate", v => {
    return moment(v).format("YYYY-MM-DD");
});

//自定义公共组件
Vue.component(MyBread.name, MyBread)
new Vue({
    el: "#app",
    router,
    components: {
        App
    },
    template: "<App/>"
});