<template>
  <div>
    <div class="news-container">
      <!-- 系统简介 -->
      <div
        :style="{
          border: '1px solid #dfdfdf',
          padding: '20px',
          boxShadow: '1px 2px 3px #eee',
          overflow: 'hidden',
          marginBottom: '40px',
          borderRadius: '16px',
          background: '#fff',
          width: '100%',
        }"
      >
        <div class="pheading">
          <h1>
            {{ systemIntro.title }}<span> {{ systemIntro.subtitle }}</span>
          </h1>
        </div>
        <div :style="{ display: 'flex', justifyContent: 'space-between' }">
          <div
            :style="{ width: '48%', display: 'flex', flexDirection: 'column' }"
          >
            <div>{{ systemIntro.content }}</div>
            <div
              :style="{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }"
            >
              <img
                :style="{
                  boxShadow: '1px 1px 1px #ddd',
                  borderRadius: '8px',
                  width: '48%',
                  height: '120px',
                }"
                :src="`/springbootYL/${systemIntro.picture2}`"
              />
              <img
                :style="{
                  boxShadow: '1px 1px 1px #ddd',
                  borderRadius: '8px',
                  width: '48%',
                  height: '120px',
                }"
                :src="`/springbootYL/${systemIntro.picture3}`"
              />
            </div>
          </div>
          <img
            :style="{
              boxShadow: '1px 1px 1px #ddd',
              margin: '0px',
              objectFit: 'cover',
              borderRadius: '8px',
              display: 'block',
              width: '48%',
              height: '360px',
            }"
            :src="`/springbootYL/${systemIntro.picture1}`"
          />
        </div>
      </div>
      <!-- 关于 -->
      <div class="aboutus-box">
        <div class="pheading">
          <h1>
            {{ aboutUsDetail.title }} <span> {{ aboutUsDetail.subtitle }}</span>
          </h1>
        </div>
        <div
          :style="{
            width: '100%',
            padding: '0px',
            float: 'left',
            display: 'inline-block',
            height: 'auto',
          }"
        >
          <img
            :style="{
              boxShadow: '1px 1px 1px #ddd',
              margin: '0px',
              objectFit: 'cover',
              borderRadius: '8px',
              display: 'block',
              width: '48%',
              float: 'left',
              height: '170px',
            }"
            :src="`/springbootYL/${aboutUsDetail.picture1}`"
          />
          <img
            :style="{
              margin: '0 0px',
              objectFit: 'cover',
              borderRadius: '8px',
              display: 'block',
              width: '48%',
              float: 'right',
              height: '170px',
            }"
            :src="`/springbootYL/${aboutUsDetail.picture2}`"
          />
          <img
            :style="{
              margin: '0 10px',
              objectFit: 'cover',
              flex: 1,
              display: 'none',
              height: '100px',
            }"
            :src="`/springbootYL/${aboutUsDetail.picture3}`"
          />
        </div>
        <div
          :style="{
            padding: '20px',
            color: '#666',
            textIndent: '2em',
            overflow: 'hidden',
            lineHeight: '24px',
            fontSize: '14px',
          }"
        >
          {{ aboutUsDetail.content }}
        </div>
      </div>
      <!-- 公告 -->
      <div class="aboutus-box">
        <div class="pheading">
          <h1>信息公告板 <span>News Aboard</span></h1>
        </div>
        <div
          v-if="newsList.length > 0"
          :style="{ width: '100%', height: '375px', overflowY: 'scroll' }"
        >
          <div
            v-for="(news, index) in newsList"
            :key="index"
            :style="{
              boxSizing: 'border-box',
              padding: '10px',
              boxShadow: '1px 1px 1px #ddd,inset 0px 0px 56px 0px #eee',
              margin: '10px 0',
              borderRadius: '8px',
              background: '#f5f5f5',
              display: 'flex',
              width: '100%',
              height: 'auto',
              cursor: 'pointer',
              overflow: 'hidden',
            }"
            class="list-item animation-box"
          >
            <div
              :style="{
                width: '98%',
                padding: '0 10px',
                height: 'auto',
                order: '2',
              }"
            >
              <div
                :style="{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  color: '#333',
                  fontSize: '14px',
                  lineHeight: '24px',
                  textOverflow: 'ellipsis',
                  fontWeight: 'bold',
                }"
              >
                {{ news.title }}
              </div>
              <div
                :style="{
                  fontSize: '14px',
                  lineHeight: '24px',
                  overflow: 'hidden',
                  color: '#666',
                  textIndent: '2em',
                  height: '48px',
                }"
              >
                {{ news.introduction }}
              </div>
              <div
                :style="{ color: '#999', fontSize: '12px', lineHeight: '24px' }"
              >
                {{ news.addtime.split(" ")[0] }}
              </div>
            </div>
            <img
              :style="{
                width: '100px',
                objectFit: 'cover',
                borderRadius: '8px',
                height: '100px',
              }"
              :src="`/springbootYL/${news.picture}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  fetcSystemIntro,
  fetchNewsList,
  fetchAbout,
} from "@/services/homeServices";
import News from "@/components/News.vue";

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
