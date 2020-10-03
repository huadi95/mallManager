<template>
  <div class="login-warp">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formdata"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click.prevent="handleLogin()"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      formdata: {
        username: 'admin',
        password: '123456'
      }
    };
  },
  methods: {
    async handleLogin() {
      //1.获取登录的信息
      const {data:{data,meta:{msg,status}}} =await this.$http.post("login", this.formdata);
      //2.判断登录是否成功
      if(status === 200){
        //登录成功
        //0.保存token值
        localStorage.setItem('token',data.token);
        //1.跳转到首页
        this.$router.push({name:'home'})
        //2.提示成功信息
        this.$message.success(msg);
      }else{
        //登录失败
        //提示失败信息
        this.$message.error(msg);
      }
    }
  }
};
</script>
<style scoped>
.login-warp {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
}
.login-btn {
  width: 100%;
}
</style>
