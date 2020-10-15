<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!-- 2.表格 -->
    <el-table :data="orderList" stripe style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column label="是否付款" width="120"
        ><template slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.pay_status === '1'"
            >已付款</el-tag
          >
          <el-tag type="danger" size="mini" v-if="scope.row.pay_status === '0'"
            >未付款</el-tag
          >
        </template></el-table-column
      >
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="120"
      ></el-table-column>
      <el-table-column label="下单时间" width="120">
        <template slot-scope="scope">{{
          scope.row.create_time | fmtdate
        }}</template></el-table-column
      >
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              @click="showEditOrderDia(scope.row)"
              circle
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 3.分页 -->
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
    <el-dialog title="修改地址" :visible.sync="dialogFormVisibleOrder">
      <el-form :model="form">
        <el-form-item label="订单编号" label-width="100px">
          <el-input
            disabled
            v-model="form.order_number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单价格" label-width="100px">
          <el-input v-model="form.order_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否付款" label-width="100px">
          <el-radio-group v-model="form.pay_status">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否发货" label-width="100px">
          <el-radio-group v-model="form.is_send">
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="省市区/县" label-width="100px">
          <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            clearable
            v-model="selectedOptions"
            :options="cityData"
            :props="defaultProp"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px">
          <el-input v-model="address_detail" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleOrder = false">取 消</el-button>
        <el-button type="primary" @click="editOrderInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import cityData from "./citydata.js";
export default {
  name: "Orders",
  data() {
    return {
      orderList: [],
      //分页数据
      pagenum: 1,
      pagesize: 5,
      total: -1,
      //控制对话宽显示隐藏
      dialogFormVisibleOrder: false,
      //对话框数据
      form: {},
      //详细地址
      address_detail: "",
      //级联选择器的绑定的数据
      cityData,
      selectedOptions: [],
      defaultProp: {
        label: "label",
        value: "value",
        expandTrigger: "hover"
      }
    };
  },
  created() {
    //页面创建完成时，执行
    this.getOrderList();
  },
  methods: {
    //发起请求，获取订单数据
    async getOrderList() {
      //1.发起请求获取订单数据
      const res = await this.$http.get(
        `orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //2.将需要的数据传到data中
      this.orderList = res.data.data.goods;
      this.total = res.data.data.total;
    },
    //每页条数
    handleSizeChange(val) {
      //1.改变条数
      this.pagesize = val;
      //2.让页数回到1
      this.pagenum = 1;
      //3.再次获取用户数据
      this.getOrderList();
    },
    //当前是第几页
    handleCurrentChange(val) {
      //1.改变页码
      this.pagenum = val;
      //2.再次获取用户数据
      this.getOrderList();
    },
    //弹出编辑对话框
    showEditOrderDia(order) {
      //1.将当前数据传入form中
      this.form = order;
      //2.显示对话框
      this.dialogFormVisibleOrder = true;
    },
    //点击对话框中的确定按钮事件
    async editOrderInfo() {
      //1.发起请求，修改服务器的数据
      const res = await this.$http.put(`orders/${this.form.order_id}`, {
        is_send: this.form.is_send,
        order_pay: "1",
        order_price: this.form.order_price,
        order_number: this.form.order_number,
        pay_status: this.form.pay_status
      });
      //2.获取需要的数据
      const { msg, status } = res.data.meta;
      //3.判断是否修改成功
      if (status === 201) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      //4.清空数据
      this.address_detail = "";
      this.selectedOptions = [];
      //4.关闭对话框
      this.dialogFormVisibleOrder = false;
    }
  }
};
</script>
<style></style>
