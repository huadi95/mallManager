<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="角色管理" level2="角色列表"></my-bread>
    <!-- 2.添加角色按钮 -->
    <el-row class="add-role-btn">
      <el-col>
        <el-button type="info" @click="showAddRoleDia()">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 3.表单 -->
    <template>
      <el-table :data="roleList" stripe style="width: 100%" height="400">
        <el-table-column type="expand" width="60">
          <template slot-scope="scope">
            <el-row v-for="(item, i) in scope.row.children" :key="i">
              <el-col :span="4">
                <el-tag @close="delRight(scope.row, item.id)" closable>{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(item1, i) in item.children" :key="i">
                  <el-col :span="4">
                    <el-tag
                      @close="delRight(scope.row, item1.id)"
                      closable
                      type="success"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      @close="delRight(scope.row, item2.id)"
                      closable
                      type="warning"
                      v-for="(item2, i) in item1.children"
                      :key="i"
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 当角色没有权限时显示,即scope.row.children.length为0时 -->
            <span v-if="scope.row.children.length === 0">未分配权限</span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="100"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        ></el-table-column>
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
              <el-button
                size="mini"
                plain
                @click="showSetRightDia(scope.row)"
                type="success"
                icon="el-icon-check"
                circle
              ></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 对话框 -->
    <!-- 1.修改或添加角色权限对话框 -->
    <el-dialog title="角色权限" :visible.sync="dialogFormVisibleRight">
      <!--
        data:数据源，格式必须是[]
        show-checkbox:选择框
        node-key:每个节点的唯一id,通常是数据源data中的key名id
        default-expanded-keys:默认展开[要展开的节点id]
        default-checked-keys:要选择的节点id
        props:配置项{label,children}
      -->
      <el-tree
        ref="tree"
        :data="treeList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRight()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 2.编辑角色的对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 3.添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="roleInfo">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="roleInfo.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="roleInfo.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      roleList: [],
      //控制修改或分配角色的对话框显示或隐藏
      dialogFormVisibleRight: false,
      //树形结构的数据
      treeList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      //角色拥有的权限
      arrCheck: [],
      //当前角色的id
      currRoleId: -1,
      //控制编辑角色的对话框显示或隐藏
      dialogFormVisibleEdit: false,
      //获取当前角色的数据
      form: [],
      //控制添加角色的对话框显示或隐藏
      dialogFormVisibleAdd: false,
      //添加角色的数据
      roleInfo: []
    };
  },
  created() {
    //在页面创建完成时触发数据请求
    this.getRoleList();
  },
  methods: {
    //请求角色表格数据事件
    async getRoleList() {
      //1.发起请求，获取角色管理的数据
      const res = await this.$http.get("roles");
      //2.结构获取需要的数据
      const {
        data,
        meta: { msg, status }
      } = res.data;
      //3.判断请求是否成功
      if (status === 200) {
        //请求成功
        //将角色列表数据传入data中
        this.roleList = data;
      } else {
        //请求失败
        //提示获取数据失败
        this.$message.warning(msg);
      }
    },
    //取消权限事件
    async delRight(role, rightId) {
      //:roleId	角色 ID	不能为空携带在url中
      // :rightId	权限 ID	不能为空携带在url中
      //1.发起请求，删除所要取消的权限
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      //2.重新渲染当前角色权限的视图
      role.children = res.data.data;
    },
    //显示修改或分配角色的对话框
    async showSetRightDia(role) {
      //0.获取当前角色的id
      this.currRoleId = role.id;
      //1.发起请求获取所有的角色权限
      const res = await this.$http.get("rights/tree");
      //2.将获取的所有角色权限数据传到data中
      this.treeList = res.data.data;
      //3.获取当前角色中拥有的权限id
      let arrTem = [];
      //4.遍历当前角色拥有的权限的id，并push到变量arrTem中
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arrTem.push(item3.id);
          });
        });
      });
      //5.将获取的当前角色中拥有的权限id传到data中
      this.arrCheck = arrTem;
      //6.显示修改或添加角色权限
      this.dialogFormVisibleRight = true;
    },
    //修改或分配角色事件
    async setRight() {
      //1.获取全部选中的标签权限id
      //getCheckedKeys()是el-tree内置的方法
      //getCheckedKeys()方法为:若节点可被选择（即 show-checkbox 为 true），
      //则返回目前被选中的节点的 key 所组成的数组
      let arr1 = this.$refs.tree.getCheckedKeys();
      //2.获取半选中的标签
      //getHalfCheckedKeys()是el-tree内置的方法
      //getHalfCheckedKeys()方法为:若节点可被选择（即 show-checkbox 为 true），
      //则返回目前半选中的节点的 key 所组成的数组
      let arr2 = this.$refs.tree.getHalfCheckedKeys();
      //3.获取上面两个数组
      let arr = [...arr1, ...arr2];
      //4.发起请求，将所选中的角色权限上传
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      //5.获取需要的数据
      const {
        meta: { msg, status }
      } = res.data;
      //6.判断是否修改或分配成功
      if (status === 200) {
        //成功
        //1.更新视图
        this.getRoleList();
        //2.提示成功信息
        this.$message.success(msg);
      } else {
        //失败
        //提示失败信息
        this.$message.warning(msg);
      }
      //7.关闭对话框
      this.dialogFormVisibleRight = false;
    },
    //删除角色事件
    showDelRight(roleId) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //1.发送请求删除数据
          const res = await this.$http.delete(`roles/${roleId}`);
          //2.获取需要的数据
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            //删除成功
            //1.让页面回到第一页
            this.pagenum = 1;
            //2.更新视图
            this.getRoleList();
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
    //弹出编辑角色对话框事件
    showEditRightDia(role) {
      //1.将当前角色的数据传到data中
      this.form = role;
      //2.弹出编辑角色的对话框
      this.dialogFormVisibleEdit = true;
    },
    //编辑角色事件
    async editRoleInfo() {
      //1.先判断角色名称是否为空
      if (this.form.roleName) {
        //角色名称不为空
        //1.发起请求，编辑用户角色
        //roleName	角色名称	不能为空
        //roleDesc	角色描述	可以为空
        const res = await this.$http.put(`roles/${this.form.id}`, {
          roleName: this.form.roleName,
          roleDesc: this.form.roleDesc
        });
        //2.弹出提示信息
        this.$message.success("编辑成功");
      } else {
        //角色名称为空
        //1.弹出提示信息
        this.$message.warning("角色名称不能为空，编辑失败");
        this.getRoleList();
      }
      //2.关闭对话框
      this.dialogFormVisibleEdit = false;
    },
    //显示添加用户的对话框事件
    showAddRoleDia() {
      //1.每次点击添加用户按钮前先进行清空
      this.roleInfo = {};
      //2.显示添加用户的对话框
      this.dialogFormVisibleAdd = true;
    },
    //添加角色事件
    async addRoleInfo() {
      //1.先判断角色名称是否为空
      if (this.roleInfo.roleName) {
        //角色名称不为空
        //1.发起请求，编辑用户角色
        //roleName	角色名称	不能为空
        //roleDesc	角色描述	可以为空
        const res = await this.$http.post(`roles`, {
          roleName: this.roleInfo.roleName,
          roleDesc: this.roleInfo.roleDesc
        });
        //2.提示成信息
        this.$message.success(res.data.meta.msg);
        //3.更新视图
        this.getRoleList();
      } else {
        //角色名称为空
        //1.弹出提示信息
        this.$message.warning("角色名称不能为空，编辑失败");
        this.getRoleList();
      }
      //2.关闭对话框
      this.dialogFormVisibleAdd = false;
    }
  }
};
</script>
<style scoped>
.add-role-btn {
  margin-top: 20px;
}
</style>
