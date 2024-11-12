<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-17 14:13:55
 * @LastEditors: Hesin
 * @LastEditTime: 2024-11-12 23:25:29
-->

<template>
    <div class="departM">
      <!-- title -->
      <div
        :style="{
          width: '100%',
          textAlign: 'center',
          background:
            'url(http://codegen.caihongy.cn/20221027/fc985400d2a2484d8d9e17eb893d2c05.png) no-repeat 10% center,url(http://codegen.caihongy.cn/20221027/6602c4fb09df4bd4881cabfef19d2ed3.png) no-repeat 90% center',
        }"
      >
        <h1
          :style="{
            fontSize: '24px',
            textAlign: 'center',
            color: '#005aad',
            textShadow: '2px 4px 2px #eee',
            fontWeight: 'bold',
          }"
        >
          公告信息
        </h1>
      </div>
      <!-- 选择器 -->
      <el-form ref="formRef" :model="form" label-width="auto" class="form">
        <el-form-item label="出发地" prop="chufadi">
          <el-input v-model="form.chufadi" />
        </el-form-item>
        <el-form-item class="form-btns">
          <el-button type="primary" @click="onSubmit(formRef)">查询</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 内容 -->
      <el-row :gutter="20">
        <!-- 设置卡片间距 -->
        <el-col
          v-for="item in newsLIst"
          :key="item.id"
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-card class="custom-card">
            <template #header>
              <h3>{{ item.title }}</h3>
            </template>
            <div class="news">
              <img
                :src="`/springbootYL/${item.picture}`"
                style="
                  width: 150px;
                  height: 150px;
                  display: block;
                  border-radius: 10px;
                  padding: 5px;
                  background-color: #fff;
                  border: 1px solid #eee;
                "
                :alt="item.title"
              />
              <p>{{ item.introduction }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script setup>
  import { reactive, onMounted, ref } from "vue";
  import { fetchNewsList } from "@/services/homeServices";
  // 响应式数据
  const newsLIst = ref({});
  
  // 异步获取数据
  const fetchData = async () => {
    try {
      newsLIst.value = await fetchNewsList();
    } catch (error) {
      console.error("Error fetching Home Page:", error);
    }
  };
  const formRef = ref();
  const form = reactive({
    chufadi: "",
    mididi: "",
  });
  
  //查找
  const onSubmit = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        const query = {};
        console.log(form);
        if (form.chufadi) {
          query.chufadi = `%${form.chufadi}%`;
        }
        if (form.mudedi) {
          query.mudedi = `%${form.mudedi}%`;
        }
        // 发送请求
        newsLIst.value = await fetchNewsList(query);
        console.log("submit!");
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  
  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };
  
  // 在组件挂载时调用 fetchData
  onMounted(fetchData);
  </script>
  
  <style lang="scss" scoped>
  .departM {
    padding: 0 5%;
  }
  .form {
    margin: 20px 0;
    width: 70vw;
    display: flex;
    :deep(.el-form-item) {
      padding-left: 10px;
    }
  }
  .form-btns {
    :deep(.el-form-item__content) {
      min-width: 150px;
      display: flex;
    }
  }
  .custom-card {
    cursor: pointer;
    height: 250px; /* 固定卡片高度 */
    margin: 15px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 使内容均匀分布 */
    :deep(.el-card__header) {
      height: 45px;
      padding: 10px;
      h3 {
        padding: 0px 10px;
        box-shadow: rgb(221, 221, 221) 1px 1px 1px;
        margin: 4px 0px 0px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgb(51, 51, 51);
        border-radius: 8px;
        background: radial-gradient(
          circle,
          rgb(250, 250, 250) 0%,
          rgba(220, 230, 250, 0.5) 100%
        );
        line-height: 30px;
        font-size: 14px;
      }
    }
    :deep(.el-card__body) {
      height: 290px;
      padding: 10px;
    }
    .news {
      display: flex;
      justify-content: space-between;
      p {
        padding: 0 5px;
        margin: 0;
        font-size: 14px;
        height: 160px;
        overflow: hidden; /* 隐藏超出部分 */
        text-overflow: ellipsis; /* 在超出文本末尾显示省略号 */
        display: -webkit-box; /* 使用弹性盒子模型 */
        -webkit-line-clamp: 7; /* 限制显示3行文本 */
        -webkit-box-orient: vertical; /* 设置盒子的方向为垂直 */
        white-space: normal; /* 允许文本换行 */
      }
    }
    &:hover {
      transform: translateY(-5px);
      transition: transform 0.5s ease;
    }
  }
  </style>
  