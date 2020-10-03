<template>
  <!-- 整个页面容器 -->
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="22"
          ><div class="middle">
            <img src="../../assets/img/logo.png" alt="无法显示图片" />
            <h3>电商后台管理系统</h3>
          </div></el-col
        >
        <el-col :span="2" class="exit-btn"
          ><el-button type="info" @click="handleSignout()">退出</el-button></el-col
        >
      </el-row>
    </el-header>
    <!-- 内容 -->
    <el-container>
      <!-- 内容左边导航栏 -->
      <el-aside width="200px" class="aside">
        <el-menu unique-opened>
          <!-- 1.用户管理 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
              <el-menu-item
                ><i class="el-icon-menu"></i><span>用户列表</span></el-menu-item
              >
          </el-submenu>
          <!-- 2.权限管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
              <el-menu-item
                ><i class="el-icon-menu"></i><span>角色列表</span></el-menu-item
              >
              <el-menu-item
                ><i class="el-icon-menu"></i><span>权限列表</span></el-menu-item
              >
          </el-submenu>
          <!-- 3.商品管理 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
              <el-menu-item
                ><i class="el-icon-menu"></i><span>商品列表</span></el-menu-item
              >
              <el-menu-item
                ><i class="el-icon-menu"></i><span>分类参数</span></el-menu-item
              >
              <el-menu-item
                ><i class="el-icon-menu"></i><span>商品分类</span></el-menu-item
              >
          </el-submenu>
          <!-- 4.订单管理 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
              <el-menu-item
                ><i class="el-icon-menu"></i><span>订单列表</span></el-menu-item
              >
          </el-submenu>
          <!-- 5.数据统计 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
              <el-menu-item
                ><i class="el-icon-menu"></i><span>数据报表</span></el-menu-item
              >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容右边数据 -->
      <el-main class="mian">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  beforeCreate() {
    //1.获取token值
    const token = localStorage.getItem('token');
    //2.判断是否有token值
    if(!token){
      //没有token值，跳转到登录页登录
      this.$router.push({name:'login'})
    }
    //有token值，继续渲染页面
  },
  methods: {
    //退出事件
    handleSignout(){
      //1.清除token值
      localStorage.clear();
      //2.弹出退出成功提示
      this.$message.success('退出成功');
      //3.跳转到登录页
      this.$router.push({name:'login'})
    }
  },
};
</script>
<style scoped>
.container {
  height: 100%;
}
/* 头部样式 */
.header {
  background-color: #373f41;
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
  background-color: #333744;
}
/* 内容右侧样式 */
.mian {
  background-color: #e9eef3;
  height: 100%;
}
</style>
