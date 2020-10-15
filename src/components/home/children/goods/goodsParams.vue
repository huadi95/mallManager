<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 2.提示信息el-alert -->
    <el-alert title="只允许为第三级分类设置参数" type="error" style="margin-top:20px;"></el-alert>

    <!-- 3.级联选择器,选择三级分类参数 -->
    <el-form style="margin-top:20px;">
      <el-form-item label="商品分类">
        <!-- 级联选择器 -->
        <el-cascader
          expand-trigger="hover"
          :show-all-levels="false"
          clearable
          v-model="selectedOptions"
          :options="options"
          :props="defaultProp"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- 4.动态参数和静态参数 -->
    <el-tabs type="card">
      <el-tab-pane label="动态参数">
        <!-- 按钮 -->
        <el-button type="danger" @click="showAddDynamicDia(many)">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrPyparams" stripe style="width: 100%">
          <el-table-column type="expand" width="60" label="#">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row.attr_vals,scope.row.attr_name,scope.row.attr_id,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row.attr_name,scope.row.attr_id)"
                @blur="handleInputConfirm(scope.row.attr_vals,scope.row.attr_name,scope.row.attr_id)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDynamicDia(scope.row)"
                  circle
                ></el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  icon="el-icon-delete"
                  @click="showDelParams(scope.row.attr_id)"
                  circle
                ></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数">
        <!-- 静态参数按钮 -->
        <el-button type="danger" @click="showAddDynamicDia(only)">设置静态参数</el-button>
        <!-- 表单 -->
        <el-table :data="arrStaticparams" stripe style="width: 100%">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditStaticDia(scope.row)"
                  circle
                ></el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  icon="el-icon-delete"
                  @click="showDelParams(scope.row.attr_id)"
                  circle
                ></el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 对话框 -->
    <!-- 1.添加分类参数的对话框 -->
    <el-dialog title="添加参数" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="addForm">
        <el-form-item label="属性名称" label-width="100px">
          <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性值" label-width="100px">
          <el-input v-model="addForm.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addParamsInfo()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 2.编辑分类动态参数的对话框 -->
    <el-dialog title="编辑参数" :visible.sync="dialogFormVisibleEditDynamic">
      <el-form :model="form">
        <el-form-item label="参数名称" label-width="100px">
          <el-input v-model="form.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditDynamic = false">取 消</el-button>
        <el-button type="primary" @click="editDynamicInfo()">确 定</el-button>
      </div>
    </el-dialog>
     <!-- 3.编辑分类静态参数的对话框 -->
    <el-dialog title="编辑参数" :visible.sync="dialogFormVisibleEditStatic">
      <el-form :model="staticForm">
        <el-form-item label="参数名称" label-width="100px">
          <el-input v-model="staticForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数值" label-width="100px">
          <el-input v-model="staticForm.attr_vals" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEditStatic = false">取 消</el-button>
        <el-button type="primary" @click="editStaticInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "GoodsParams",
  data() {
    return {
      //级联选择器的绑定的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //表格数据
      //该商品的动态参数
      arrPyparams: [],
      //该商品的静态参数
      arrStaticparams: [],
      inputVisible: false,
      inputValue: "",
      //控制添加动态参数的对话框显示隐藏
      dialogFormVisibleAdd: false,
      //添加动态参数的数据
      addForm: {
        attr_name: "",
        attr_sel:"",
        attr_vals: ""
      },
      //处于静态参数
      only:'only',
      //处于动态参数
      many:'many',
      //编辑动态参数的数据
      form: {
        attr_name: ""
      },
      //控制编辑动态参数的对话框显示隐藏
      dialogFormVisibleEditDynamic: false,
      //控制编辑静态参数的对话框显示隐藏
      dialogFormVisibleEditStatic:false,
      //编辑静态参数的数据
      staticForm: {
      },
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    //发起请求，获取分类商品数据
    async getGoodCate() {
      //1.发起请求，获取三级分类列表
      const res = await this.$http.get(`categories?type=3`);
      //2.将获取的数据传到data中
      this.options = res.data.data;
    },
    //tag点击x按钮时触发
    async handleClose(attr_vals, attr_name, attr_id, tag) {
      //1.删除点击的tag
      attr_vals.splice(attr_vals.indexOf(tag), 1);
      //2.获取发起put请求的参数，上传到服务器
      const putData = {
        attr_name: attr_name,
        attr_sel: "many",
        attr_vals: attr_vals.join(",")
      };
      //3.发起请求，删除tag数据
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr_id}`,
        putData
      );
    },
    //点击+ New Tag按钮时触发
    showInput() {
      //1.打开input
      this.inputVisible = true;
      //2.获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //按回车键或者失去焦点是触发
    async handleInputConfirm(attr_vals, attr_name, attr_id, tag) {
      //1.获取input里面的value值
      let inputValue = this.inputValue;
      //2.判断inputValue里面是否有值
      if (inputValue) {
        //inputValue有值
        //1.将里面的值添加到attr_vals里面
        attr_vals.push(inputValue);
        //2.获取发起put请求的参数，上传到服务器
        const putData = {
          attr_name: attr_name,
          attr_sel: "many",
          attr_vals: attr_vals.join(",")
        };
        //3.发起请求，删除tag数据
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${attr_id}`,
          putData
        );
      }
      //3.关闭input
      this.inputVisible = false;
      //4.清空input里面的value值
      this.inputValue = "";
    },
    //级联选择器改变是触发
    async handleChange() {
      //判断是否为三级分类
      if (this.selectedOptions.length === 3) {
        //1.发起请求，获取该商品的动态参数
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        //2.将请求的数据传到data中
        this.arrPyparams = res.data.data;
        //3.将arrPyparams的attr_vals转化成数组
        this.arrPyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
        //4.发起请求，获取该商品的静态参数
        const res1 = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        //5.将请求的数据传到data中
        this.arrStaticparams = res1.data.data;
      }
    },
    //点击添加动态和静态参数按钮触发
    //cate参数是区别动态按钮点击和静态按钮点击传来的'many'和'only'参数
    showAddDynamicDia(cate) {
      //1.先判断是否选中商品参数是否为第三级
      if(this.selectedOptions.length === 3){
        //是第三级参数
        //1.清空对话框数据
      this.addForm = {
        attr_name: "",
        attr_sel:cate,
        attr_vals: ""
      };
      //2.显示添加动态参数的对话框
      this.dialogFormVisibleAdd = true;
      }else{
        //不是第三级参数
        //提示信息
        this.$message.warning("当前不是处于第三级参数")
      }

    },
    //点击添加动态和静态参数中的确定按钮触发
    async addParamsInfo() {
      //1.发起请求，提交数据
      const res = await this.$http.post(
        `categories/${this.selectedOptions[2]}/attributes`,
       this.addForm
      );
      //2.获取需要的数据
      const { msg, status } = res.data.meta;
      //3.判断是否修改成功并提升信息
      if (status === 201) {
        //提示成功信息
        this.$message.success(msg);
        //更新视图
        this.handleChange()
      } else {
        //提示失败信息
        this.$message.warning(msg);
      }
      //4.关闭对话框
      this.dialogFormVisibleAdd = false;
    },
    //点击动态编辑按钮显示对话框
    showEditDynamicDia(dynamic) {
      //1.获取动态数据
      this.form = dynamic;
      //2.显示对话框
      this.dialogFormVisibleEditDynamic = true;
    },
    //点击动态的编辑对话框确定按钮触发
    async editDynamicInfo() {
      //1.获取要修改的数据
      const putData = {
        attr_name: this.form.attr_name,
        attr_sel: this.many,
        attr_vals: this.form.attr_vals.join(",")
      };
      //2.发起请求，修改数据
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${this.form.attr_id}`,
        putData
      );
      //3.获取需要的数据
      const { msg, status } = res.data.meta;
      //4.判断是否修改成功并提升信息
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      //5.关闭对话框
      this.dialogFormVisibleEditDynamic = false;
    },
    //静态和动态的删除按钮事件
    showDelParams(paramsId){
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
          //1.发送请求删除数据
          const res = await this.$http.delete(`categories/${this.selectedOptions[2]}/attributes/${paramsId}`);
          //2.获取需要的数据
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            //删除成功
            //1.让页面回到第一页
            this.pagenum = 1;
            //2.更新视图
            this.handleChange();
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
    },
    //点击静态编辑按钮显示对话框
    showEditStaticDia(data){
      //1.获取动态数据
      this.staticForm = data;
      //2.显示对话框
      this.dialogFormVisibleEditStatic = true;
    },
     //点击静态的编辑对话框确定按钮触发
    async editStaticInfo(){
      //1.获取要修改的数据
      const putData = {
        attr_name: this.staticForm.attr_name,
        attr_sel: this.only,
        attr_vals: this.staticForm.attr_vals
      };
      //2.发起请求，修改数据
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${this.staticForm.attr_id}`,
        putData
      );
      //3.获取需要的数据
      const { msg, status } = res.data.meta;
      //4.判断是否修改成功并提升信息
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      //5.关闭对话框
      this.dialogFormVisibleEditStatic = false;
    }
  }
};
</script>
<style scoped>
.box-card {
  height: 99%;
  overflow: hidden;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
