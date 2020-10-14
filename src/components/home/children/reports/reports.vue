<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!-- 2.图形数据 -->
    <div id="main" style="width: 750px;height:400px;margin-top:20px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  name: "Reports",
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  async mounted() {
    // 1.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    //2.绘制图表
    //发送请求获取数据
    const { data: res } = await this.$http.get("reports/type/1");
    //3.判断是否获取数据成功
    if (res.meta.status !== 200) return this.$message("获取折线图数据失败!");
    //3.数据合并
    const result = { ...this.options, ...res.data };
    //4.传入数据渲染图表
    myChart.setOption(result);
  }
};
</script>
<style>
.box-card {
  height: 99%;
}
</style>
