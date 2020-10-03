import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import moment from "moment";
import "@/assets/css/base.css";
import MyHttpServer from "@/plugins/http.js";
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

new Vue({
    el: "#app",
    router,
    components: {
        App
    },
    template: "<App/>"
});