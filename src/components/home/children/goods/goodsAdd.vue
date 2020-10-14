<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2.提示信息el-alert -->
    <el-alert
      title="添加商品信息"
      center
      type="success"
      show-icon
      style="margin-top:20px;"
    ></el-alert>
    <!-- 3.操作步骤的步骤条 -->
    <el-steps
      :active="1 * active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 4.每个步骤要写的内容 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs
        v-model="active"
        @tab-click="tabChange"
        tab-position="left"
        style="height: 320px;overflow: auto;"
      >
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              expand-trigger="hover"
              v-model="selectedOptions"
              :options="options"
              :props="defaultProp"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- 显示的是该商品三级分类的动态参数 -->
          <el-form-item
            :label="item.attr_name"
            v-for="(item, i) in arrPyparams"
            :key="i"
          >
            <!-- 复选框 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                :label="item1"
                v-for="(item1, i) in item.attr_vals"
                :key="i"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <!-- 显示的是该商品三级分类的静态参数 -->
          <el-form-item
            :label="item.attr_name"
            v-for="(item, i) in arrStaticparams"
            :key="i"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- 图片上传 -->
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <!-- 富文本 -->
          <el-form-item style="text-align: center">
            <quill-editor
              v-model="form.goods_introduce"
              style="margin:15px;"
            ></quill-editor>
            <el-button type="primary" @click="getGoodsAdd()"
              >点我-添加商品</el-button
            >
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  name: "GoodsAdd",
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      //要提交的全部数据的对象
      //goods_name	商品名称	不能为空
      //goods_cat	以为','分割的分类列表	不能为空
      //goods_price	价格	不能为空
      //goods_number	数量	不能为空
      //goods_weight	重量	不能为空
      //goods_introduce	介绍	可以为空
      //pics	上传的图片临时路径（对象）	可以为空
      //attrs	商品的参数（数组）	可以为空
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //级联选择器的绑定的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //该商品的动态参数
      arrPyparams: [],
      //该商品的静态参数
      arrStaticparams: [],
      //上传图片的请求头添加token
      headers: {
        Authorization: localStorage.getItem("token")
      }
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
    //级联选择器的change改变触发事件
    handleChange() {},
    //点击不同的tab时触发
    async tabChange() {
      //判断是否是在第二个按钮
      if (this.active === "2") {
        //1.判断商品是否是三级分类
        if (this.selectedOptions.length !== 3) {
          //消息提示
          this.$message.warning("请先选择商品的三级分类");
          //终止执行
          return;
        }
        //2.发起请求，获取该商品的动态参数
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        //3.将请求的数据传到data中
        this.arrPyparams = res.data.data;
        //4.将arrPyparams的attr_vals转化成数组
        this.arrPyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
      } else if (this.active === "3") {
        //判断是否在第三个按钮
        //是的话就请求该商品的静态参数
        //1.判断商品是否是三级分类
        if (this.selectedOptions.length !== 3) {
          //消息提示
          this.$message.warning("请先选择商品的三级分类");
          //终止执行
          return;
        }
        //2.发起请求，获取该商品的动态参数
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        //3.将请求的数据传到data中
        this.arrStaticparams = res.data.data;
      }
    },
    //上传图片的相关事件
    //file形参是图片的所有参数
    handlePreview(file) {},
    handleRemove(file) {
      //1.找出当前要删除图片所在的位置
      const index = this.form.pics.findIndex(
        item => item.pic == file.response.data.tmp_path
      );
      //2.删除图片的位置
      this.form.pics.splice(index, 1);
    },
    handleSuccess(file) {
      //1.添加图片的路径进入form
      this.form.pics.push({
        pic: file.data.tmp_path
      });
    },
    //添加商品事件
    async getGoodsAdd() {
      //1.添加分类数据传入form中
      this.form.goods_cat = this.selectedOptions.join(",");
      //2.获取商品的静态参数和动态参数
      //获取动态数据
      const arr1 = this.arrPyparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      //获取静态数据
      const arr2 = this.arrPyparams.map(item => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      //3.将获取的静态和动态数据传入form中
      this.form.attrs = [...arr1, ...arr2];
      //4.发起请求，将数据传到服务器
      const res = await this.$http.post("goods", this.form);
      //5.获取需要的数据
      const { msg, status } = res.data.meta;
      //6.判断是否添加商品成功
      if (status === 201) {
        //添加成功
        //1.提示成功信息
        this.$message.success(msg);
        //2.跳转回商品列表
        this.$router.push({ name: "goods" });
      } else {
        //添加失败
        //1.提示失败信息
        this.$message.warning(msg);
      }
    }
  }
};
</script>
<style scoped></style>
