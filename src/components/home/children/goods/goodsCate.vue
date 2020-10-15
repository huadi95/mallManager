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
              @click="showEditCateDia(scope.row)"
              circle
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              @click="showDelCate(scope.row.cat_id)"
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
    <!-- 1.添加分类对话框 -->
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
    <!-- 2.编辑分类动态参数的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="cateInfo">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="cateInfo.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="级别" label-width="100px">
          <span v-if="cateInfo.cat_level === 0">一级</span>
          <span v-if="cateInfo.cat_level === 1">二级</span>
          <span v-if="cateInfo.cat_level === 2">三级</span>
        </el-form-item>
        <el-form-item label="是否有效" label-width="100px">
          <el-radio-group v-model="cateInfo.cat_deleted">
            <el-radio :label="false">是</el-radio>
            <el-radio :label="true">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ElTreeGrid from "element-tree-grid";
export default {
  name: "GoodsCate",
  components: {
    ElTreeGrid
  },
  data() {
    return {
      //显示隐藏添加分类的对话框
      dialogFormVisibleAdd: false,
      //显示隐藏编辑分类的对话框
      dialogFormVisibleEdit: false,
      //编辑分类对话框数据
      cateInfo: {},
      //添加分类对话框的数据
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
      //3.获取需要的数据
      const { msg, status } = res.data.meta;
      //4.判断是否请求成功
      if (status === 201) {
        //更新视图
        this.getGoodsCate();
        //提示信息
        this.$message.success(msg);
      } else {
        //提示信息
        this.$message.warning(msg);
      }
      //5.关闭对话框
      this.dialogFormVisibleAdd = false;
    },
    //点击编辑按钮触发-显示分类编辑对话框
    showEditCateDia(cate) {
      //1.当前点击要编辑的数据
      this.cateInfo = cate;
      //2.打开对话框
      this.dialogFormVisibleEdit = true;
    },
    //点击分类编辑对话框中的确定按钮触发
    async editCateInfo() {
      //1.发起请求，修改数据
      const res = await this.$http.put(
        `categories/${this.cateInfo.cat_id}`,
        this.cateInfo
      );
      //2.获取需要的数据
      const { msg, status } = res.data.meta;
      //3.判断是否请求成功
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      //4.关闭对话框
      this.dialogFormVisibleEdit = false;
    },
    //操作中的删除按钮事件
    showDelCate(cateId) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
          //1.发送请求删除数据
          const res = await this.$http.delete(`categories/${cateId}`);
          //2.获取需要的数据
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            //删除成功
            //1.让页面回到第一页
            this.pagenum = 1;
            //2.更新视图
            this.getGoodsCate();
            //3.提示删除成功信息
            this.$message({
              type: "success",
              message: msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style>
.box-card {
  height: 99%;
}
</style>
