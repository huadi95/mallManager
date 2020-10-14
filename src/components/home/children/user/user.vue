<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <!-- 2.搜索 -->
    <el-row class="search-row">
      <el-col>
        <el-input
          placeholder="请输入内容"
          @clear="clearUserInfo()"
          clearable
          v-model="query"
          class="input-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button type="success" @click="showUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.表单 -->
    <template>
      <el-table :data="userList" stripe style="width: 100%" height="350px">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="username" label="姓名" width="80"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="userList">{{ userList.row.create_time | fmtdate }}</template>
        </el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="userList">
            <el-switch
              v-model="userList.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeMgstate(userList.row)"
            ></el-switch>
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
                @click="showEditUserMsgBox(scope.row)"
                circle
              ></el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                @click="showDelUserMsgBox(scope.row.id)"
                circle
              ></el-button>
              <el-button
                size="mini"
                plain
                @click="showRolesUserMsgBox(scope.row)"
                type="success"
                icon="el-icon-check"
                circle
              ></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <!-- 弹出添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密 码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出修改用户角色权限的对话框 -->
    <el-dialog title="修改角色" :visible.sync="dialogFormVisibleRoles">
      <el-form>
        <el-form-item label="用户名" label-width="100px">{{currentRolesName}}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="currRoleId">
            <el-option label="请选择" disabled :value="-1"></el-option>
            <el-option
              v-for="(item,index) in currentRolesList"
              :key="index"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRoles = false">取 消</el-button>
        <el-button type="primary" @click="setRoles()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total: -1,
      userList: [],
      //控制添加用户的对话框的显示隐藏
      dialogFormVisibleAdd: false,
      //控制编辑用户的对话框的显示隐藏
      dialogFormVisibleEdit: false,
      //控制用户角色权限的对话框的显示隐藏
      dialogFormVisibleRoles: false,
      //用户信息
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //弹出角色框的用户名
      currentRolesName: "",
      //弹出角色框的用户角色
      currRoleId: -1,
      //用户的id
      currUserId: -1,
      //角色列表
      currentRolesList: []
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    //请求用户数据
    async getUserInfo() {
      //3.请求数据
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //4.解构赋值获取请求回来的数据中所需要的数据
      const {
        data: { total, users },
        meta: { msg, status }
      } = res.data;
      //5.判断是否请求成功
      if (status === 200) {
        //请求成功
        //1.将users数据赋值给userList
        this.userList = users;
        //2.获取总条数
        this.total = total;
      } else {
        //请求失败
        //1.提示获取数据失败
        this.$message.warning(msg);
      }
    },
    //每页条数
    handleSizeChange(val) {
      //1.改变条数
      this.pagesize = val;
      //2.让页数回到1
      this.pagenum = 1;
      //3.再次获取用户数据
      this.getUserInfo();
    },
    //当前是第几页
    handleCurrentChange(val) {
      //1.改变页码
      this.pagenum = val;
      //2.再次获取用户数据
      this.getUserInfo();
    },
    //搜索按钮事件
    searchUser() {
      this.getUserInfo();
    },
    //清空搜索框，重新获取数据
    clearUserInfo() {
      this.getUserInfo();
    },
    //添加用户事件-显示添加用户的对话框
    showUserDia() {
      //1.每次点击添加用户按钮前先进行清空
      this.form = {};
      //2.显示添加用户的对话框
      this.dialogFormVisibleAdd = true;
    },
    //添加用户事件-发送请求添加用户
    async addUserInfo() {
      //1.发送添加用户的请求
      const res = await this.$http.post("users", this.form);
      //2.获取请求回来的数据中所需要的数据
      const {
        data,
        meta: { msg, status }
      } = res.data;
      //3.判断是否添加用户成功
      if (status === 201) {
        //添加用户成功
        //1.提示成功
        this.$message.success(msg);
        //2.更新视图
        this.getUserInfo();
        //3.关闭对话框
        this.dialogFormVisibleAdd = false;
      } else {
        //添加用户失败
        //提示失败信息
        this.$message.warning(msg);
      }
    },
    //删除用户
    showDelUserMsgBox(userId) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //1.发送请求删除数据
          const res = await this.$http.delete(`users/${userId}`);
          //2.获取需要的数据
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            //删除成功
            //1.让页面回到第一页
            this.pagenum = 1;
            //2.更新视图
            this.getUserInfo();
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
    //显示编辑用户对话框
    showEditUserMsgBox(user) {
      //1.获取点击的用户信息
      this.form = user;
      //2.弹出对话框
      this.dialogFormVisibleEdit = true;
    },
    //编辑用户
    async editUserInfo() {
      //1.发送添加用户的请求
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      //2.获取需要的数据
      const {
        meta: { msg, status }
      } = res.data;
      //3.判断是否修改成功
      if (status === 200) {
        //修改成功
        //1.提示成功
        this.$message.success(msg);
        //2.更新视图
        this.getUserInfo();
        //3.关闭修改用户对话框
        this.dialogFormVisibleEdit = false;
      } else {
        //修改失败
        //提示失败信息
        this.$message.warning(msg);
      }
    },
    //修改用户状态
    async changeMgstate(user) {
      //1.发送修改用户状态的请求
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      //2.获取需要的数据
      const {
        meta: { msg, status }
      } = res.data;
      //3.判断是否修改成功
      if (status === 200) {
        //修改成功
        //1.提示成功
        this.$message.success(msg);
      } else {
        //修改失败
        //提示失败信息
        this.$message.warning(msg);
      }
    },
    //显示用户角色对话框
    async showRolesUserMsgBox(user) {
      //1.获取当前的用户名和id
      this.currentRolesName = user.username;
      this.currUserId = user.id;
      //2.弹出对话框
      this.dialogFormVisibleRoles = true;
      //3.发起请求，获取全部的角色列表
      const res = await this.$http.get("roles");
      //4.将获取的角色列表数组赋值到data中
      this.currentRolesList = res.data.data;
      //5.发起请求，获取用户当前的角色
      const res1 = await this.$http.get(`users/${this.currUserId}`);
      //6.将当前用户的角色传到data中
      this.currRoleId = res1.data.data.rid;
    },
    //修改用户角色框的用户角色
    async setRoles() {
      //0.关闭对话框
      this.dialogFormVisibleRoles = false;
      //1.发起请求，修改用户角色
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      //2.获取需要的数据
      const {
        meta: { msg, status }
      } = res.data;
      //3.判断是否修改成功
      if (status === 200) {
        //修改成功
        //1.提示成功
        this.$message.success(msg);
      } else {
        //修改失败
        //提示失败信息
        this.$message.warning(msg);
      }
    }
  }
};
</script>
<style scoped>
.box-card {
  height: 99%;
}
.search-row {
  margin-top: 20px;
}
.input-select {
  width: 300px;
}
</style>
