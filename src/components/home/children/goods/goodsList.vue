<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2.搜索 -->
    <el-row class="search-row">
      <el-col>
        <el-input
          placeholder="请输入内容"
          @clear="clearGoodsInfo()"
          clearable
          v-model="query"
          class="input-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchGoods()"
          ></el-button>
        </el-input>
        <el-button type="success" @click="$router.push({ name: 'add' })"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 3.表单 -->
    <template>
      <el-table
        :data="goodsList"
        border
        stripe
        style="width: 100%"
        height="350px"
      >
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="80"
        ></el-table-column>
        <el-table-column label="创建日期" width="100">
          <template slot-scope="goodsList">{{
            goodsList.row.upd_time | fmtdate
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-row>
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                @click="showEditGoodsDia(scope.row)"
                circle
              ></el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                @click="showDelGoods(scope.row.goods_id)"
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <!-- 弹出编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="商品名称" label-width="100px">
          <el-input v-model="form.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="100px">
          <el-input v-model="form.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" label-width="100px">
          <el-input v-model="form.goods_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" label-width="100px">
          <el-input v-model="form.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" label-width="100px">
          <el-input
            v-model="form.goods_introduce"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "GoodsList",
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 10,
      total: -1,
      goodsList: [],
      //控制编辑用户的对话框的显示隐藏
      dialogFormVisibleEdit: false,
      //用户信息
      form: {}
    };
  },
  created() {
    this.getGoodsInfo();
  },
  methods: {
    //请求用户数据
    async getGoodsInfo() {
      //3.请求数据
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //4.解构赋值获取请求回来的数据中所需要的数据
      const {
        data: { total, goods },
        meta: { msg, status }
      } = res.data;
      //5.判断是否请求成功
      if (status === 200) {
        //请求成功
        //1.将goodss数据赋值给goodsList
        this.goodsList = goods;
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
      this.getGoodsInfo();
    },
    //当前是第几页
    handleCurrentChange(val) {
      //1.改变页码
      this.pagenum = val;
      //2.再次获取用户数据
      this.getGoodsInfo();
    },
    //搜索按钮事件
    searchGoods() {
      this.getGoodsInfo();
    },
    //清空搜索框，重新获取数据
    clearGoodsInfo() {
      this.getGoodsInfo();
    },
    //删除用户
    showDelGoods(goodsId) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //1.发送请求删除数据
          const res = await this.$http.delete(`goods/${goodsId}`);
          //2.获取需要的数据
          const {
            meta: { msg, status }
          } = res.data;
          console.log(res.data);
          if (status === 200) {
            //删除成功
            //1.让页面回到第一页
            this.pagenum = 1;
            //2.更新视图
            this.getGoodsInfo();
            //3.提示删除成功信息
            this.$message({
              type: "success",
              message: msg
            });
          } else {
            //删除失败
            //提示删除失败信息
            this.$message.warning(msg);
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
    async showEditGoodsDia(goods) {
      //1.发起请求，获取该商品的详细数据
      const res = await this.$http.get(`goods/${goods.goods_id}`);
      //2.将需要的数据传到data中
      this.form = res.data.data;
      //3.弹出对话框
      this.dialogFormVisibleEdit = true;
    },
    //编辑用户
    async editGoodsInfo() {
      //1.发送添加用户的请求
      const res = await this.$http.put(
        `goods/${this.form.goods_id}`,
        this.form
      );
      //2.获取需要的数据
      const {
        meta: { msg, status }
      } = res.data;
      //3.判断是否修改成功
      if (status === 200) {
        //修改成功
        //1.提示成功
        this.$message.success("编辑商品成功");
        //2.更新视图
        this.getGoodsInfo();
        //3.关闭修改用户对话框
        this.dialogFormVisibleEdit = false;
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
