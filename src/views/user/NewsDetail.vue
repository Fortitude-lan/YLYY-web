<template>
  <div class="page">
    <div class="newitem">
      <div class="tt">
        <h2>{{ newsItem.title }}</h2>
        <span>时间：{{ newsItem.addtime }}</span>
      </div>
      <div class="content">
        <div class="c1">
          <div v-html="newsItem.content"></div>
          <img
            :src="`${baseUrl}${newsItem.picture}`"
            style="
              width: 150px;
              height: 150px;
              display: block;
              border-radius: 10px;
              padding: 5px;
              background-color: #fff;
              border: 1px solid #eee;
            "
          />
        </div>
        <div>
          <strong>本篇文章：{{ newsItem.title }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { baseUrl } from "@/utils/util";

const route = useRoute();

const newsItem = ref({
  id: "", //
  title: "", //
  introduction: "", //
  picture: "", //
  content: "", //
  addtime: "", //
});
const fetchData = async () => {
  //info
  const item = JSON.parse(localStorage.getItem("newsdetail"));
  newsItem.value = item;
};
// 在组件挂载时调用 fetchData
onMounted(fetchData);
</script>
<style lang="scss" scoped>
.page {
  min-height: 400px;
  width: 1000px;
  margin: 80px auto 20px;
}

.newitem {
  text-align: center;
  .tt {
    display: flex;
    flex-direction: column;
    justify-content: center;
    span {
      color: #aaa;
      margin: 20px 0 30px;
    }
    border-bottom: 3px solid #449ad9;
  }

  .content {
    padding: 20px 0;
    text-align: left;
    text-indent: 2rem;
    .c1 {
      min-height: 300px;
    }
  }
}
</style>
