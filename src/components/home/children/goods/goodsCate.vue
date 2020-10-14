<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 2.添加分类按钮 -->
    <el-row style="margin-top:10px;">
      <el-col :span="24">
        <el-button type="success" @click="showCateAddDia()">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="cateList" stripe style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-if="scope.row.cat_level === 1">二级</span>
          <span v-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-if="scope.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              @click="showEditRightDia(scope.row)"
              circle
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              @click="showDelRight(scope.row.id)"
              circle
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="100px">
          <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            clearable
            v-model="selectedOptions"
            :options="options"
            :props="defaultProp"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCateInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
var ElTreeGrid = require("element-tree-grid");
export default {
  name: "GoodsCate",
  components: {
    ElTreeGrid
  },
  data() {
    return {
      //显示隐藏添加分类的对话框
      dialogFormVisibleAdd: false,
      //对话框数据
      cateInfo: [],
      //对话框的数据
      form: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0
      },
      //级联选择器的绑定的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        checkStrictly: true
      },
      //表格数据
      cateList: [],
      //分页数据
      pagenum: 1,
      pagesize: 5,
      total: -1
    };
  },
  created() {
    //创建完成时触发该事件
    this.getGoodsCate();
  },
  methods: {
    //发起请求，获取商品分类数据
    async getGoodsCate() {
      //1.发起请求，获取商品的三级分类数据
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //2.将获取的数据传到data中
      this.cateList = res.data.data.result;
      this.total = res.data.data.total;
    },
    //每页条数
    handleSizeChange(val) {
      //1.改变条数
      this.pagesize = val;
      //2.让页数回到1
      this.pagenum = 1;
      //3.再次获取用户数据
      this.getGoodsCate();
    },
    //当前是第几页
    handleCurrentChange(val) {
      //1.改变页码
      this.pagenum = val;
      //2.再次获取用户数据
      this.getGoodsCate();
    },
    //点击添加分类按钮事件
    async showCateAddDia() {
      //0.清空form
      this.form.cat_name = "";
      //1.发起请求获取商品的全部二级分类数据
      const res = await this.$http.get(`categories?type=2`);
      //2.将获取的数据传到data中
      this.options = res.data.data;
      //3.打开对话框
      this.dialogFormVisibleAdd = true;
    },
    //点击添加分类对话框确定按钮触发
    async addCateInfo() {
      //1.判断当前是几级的商品分类
      //获取post请求需要的参数
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
        this.form.cat_level = 0;
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
        this.form.cat_level = 1;
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
        this.form.cat_level = 2;
      }
      //2.发起请求，提交添加的数据
      const res = await this.$http.post("categories", this.form);
      //3.更新视图
      this.getGoodsCate();
      //4.关闭对话框
      this.dialogFormVisibleAdd = false;
    }
  }
};
</script>
<style>
.box-card {
  height: 99%;
}
</style>
