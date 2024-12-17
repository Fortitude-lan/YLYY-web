
<template>
  <div>
    <div class="news-container">系统首页</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  fetcSystemIntro,
  fetchNewsList,
  fetchAbout,
} from "@/services/homeServices";

// 响应式数据
const aboutUsDetail = ref({});
const systemIntro = ref({});
const newsList = ref([]);

// 异步获取数据
const fetchData = async () => {
  try {
    systemIntro.value = await fetcSystemIntro();
    aboutUsDetail.value = await fetchAbout();
    newsList.value = await fetchNewsList();
  } catch (error) {
    console.error("Error fetching Home Page:", error);
  }
};

// 在组件挂载时调用 fetchData
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.news-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px;

  width: 100%;
  margin: 20px auto;
}

.aboutus-box {
  border: 1px solid #dfdfdf;
  padding: 20px;
  box-shadow: 1px 2px 3px #eee;
  margin: 0px 0 20px;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
  width: 49%;
  height: 550px;
}
</style>
