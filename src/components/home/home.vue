<template>
  <!-- 整个页面容器 -->
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="24" class="header-row">
          <div class="middle">
            <img src="../../assets/img/logo.png" alt="无法显示图片" />
            <h3>电商后台管理系统</h3>
          </div>
          <div class="exit-btn">
            <el-button type="info" @click="handleSignout()">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <!-- 内容 -->
    <el-container>
      <!-- 内容左边导航栏 -->
      <el-aside width="200px" class="aside">
        <el-menu unique-opened router>
          <!-- 1.用户管理 -->
          <el-submenu :index="''+item.order" v-for="(item,index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item1.path" v-for="(item1,i) in item.children" :key="i">
              <i class="el-icon-menu"></i>
              <span>{{item1.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容右边数据 -->
      <el-main class="mian">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menus: []
    };
  },
  created() {
    //1.在创建完成时获取导航栏数据
    this.getNavBar();
  },
  methods: {
    //退出事件
    handleSignout() {
      //1.清除token值
      localStorage.clear();
      //2.弹出退出成功提示
      this.$message.success("退出成功");
      //3.跳转到登录页
      this.$router.push({ name: "login" });
    },
    //发起请求，获取左侧导航栏内容
    async getNavBar() {
      //1.发起请求，获取左侧导航栏数据
      const res = await this.$http.get("menus");
      //2.将获取的数据传到data中
      this.menus = res.data.data;
    }
  }
};
</script>
<style scoped>
.container {
  height: 100vh;
}
/* 头部样式 */
.header {
  width: 100%;
  background-color: #373f41;
}
.header-row {
  display: flex;
  justify-content: space-between;
}
.middle {
  display: flex;
  color: #fff;
}
.middle img {
  margin-top: 10px;
  height: 40px;
}
.exit-btn {
  padding-top: 10px;
}
/* 内容左侧样式 */
.aside {
  height: 100%;
  background-color: #333744;
}
/* 内容右侧样式 */
.mian {
  background-color: #e9eef3;
  height: 100%;
}
</style>
