<template>
  <!-- 整个页面容器 -->
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">Header</el-header>
    <!-- 内容 -->
    <el-container>
      <!-- 内容左边导航栏 -->
      <el-aside width="200px" class="aside">Aside</el-aside>
      <!-- 内容右边数据 -->
      <el-main class="mian">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home"
};
</script>
<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.mian {
  background-color: #b9eef3;
  height: 100%;
}
</style>
