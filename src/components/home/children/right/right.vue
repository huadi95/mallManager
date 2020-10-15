<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 2.表格 -->
    <el-table
      :data="rightList"
      border
      style="width: 100%;margin-top:20px;"
      height="400"
    >
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "Right",
  data() {
    return {
      rightList: []
    };
  },
  created() {
    //在页面创建完成时触发数据请求
    this.getRightList();
  },
  methods: {
    async getRightList() {
      //1.发起请求，获取权限管理的数据
      const res = await this.$http.get("rights/list");
      //2.结构获取需要的数据
      const {
        data,
        meta: { msg, status }
      } = res.data;
      //3.判断请求是否成功
      if (status === 200) {
        //请求成功
        //将权限列表数据传入data中
        this.rightList = data;
      } else {
        //请求失败
        //提示获取数据失败
        this.$message.warning(msg);
      }
    }
  }
};
</script>
<style scoped></style>
