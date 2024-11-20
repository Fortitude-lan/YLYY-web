<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-17 14:13:55
 * @LastEditors: Hesin
 * @LastEditTime: 2024-11-20 16:31:25
-->

<template>
  <div class="pageM">
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
        科室信息展示
      </h1>
    </div>
    <!-- 选择器 -->
    <el-form ref="formRef" :model="form" label-width="auto" class="form">
      <el-form-item label="科室分类" prop="keshifenlei">
        <el-select v-model="form.keshifenlei" :style="{ width: '180px' }">
          <el-option
            placeholder="请选择科室"
            v-for="item in ksflList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="科室号" prop="keshihao">
        <el-input v-model="form.keshihao" />
      </el-form-item>
      <el-form-item label="科室名" prop="keshimingcheng">
        <el-input v-model="form.keshimingcheng" />
      </el-form-item>
      <el-form-item label="医生姓名" prop="yishengxingming">
        <el-input v-model="form.yishengxingming" />
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
        v-for="item in ksxxList"
        :key="item.id"
        :xs="12"
        :sm="12"
        :md="6"
        :lg="4"
        :xl="4"
      >
        <el-card class="custom-card" @click="openDrawer(item)">
          <template #header>
            <h3>{{ item.keshimingcheng }}</h3>
          </template>
          <img
            :src="`${baseUrl}${item.tupian.split(',')[0]}`"
            style="width: 100%; height: 100%; display: block"
            :alt="item.title"
          />
        </el-card>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row style="margin: 30px 0">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :page-count="pagination.totalPage"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-row>
    <!-- 抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="科室详情信息"
      :direction="rtl"
      :before-close="handleClose"
      size="80%"
    >
      <div v-if="selectedItem">
        <p><strong>科室名称:</strong> {{ selectedItem.keshimingcheng }}</p>
        <!-- <p><strong>简介:</strong> {{ selectedItem.jianjie }}</p> -->

        <div style="width: 200px; height: 200px">
          <el-carousel indicator-position="none" height="200px">
            <el-carousel-item
              v-for="(image, index) in selectedItem.tupian.split(',')"
              :key="index"
            >
              <img
                :src="`${baseUrl}${image}`"
                style="width: 200px; height: 200px; object-fit: cover"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 信息表 -->
        <el-form ref="formRef" :model="ksxxInfo" class="form-layout">
          <div class="tt">
            <el-button @click.prevent="onSubmit(formRef)" class="edit-button"
              >挂号</el-button
            >
          </div>
          <div class="form-row">
            <!-- <el-form-item label="挂号编号" class="form-item">
              <el-input
                v-model="ksxxInfo.guahaobianhao"
                placeholder="挂号编号"
                required
                disabled
              /> </el-form-item
            > -->
            <el-form-item label="科室号 " class="form-item">
              <el-input
                v-model="ksxxInfo.keshihao"
                placeholder="科室号"
                required
                disabled
              />
            </el-form-item>
            <el-form-item label="科室分类" class="form-item">
              <el-input
                v-model="ksxxInfo.keshifenlei"
                placeholder="科室分类"
                required
                disabled
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="科室地址" class="form-item">
              <el-input
                v-model="ksxxInfo.keshidizhi"
                placeholder="科室地址"
                required
                disabled
              />
            </el-form-item>
            <el-form-item label="可挂号数" class="form-item">
              <el-input
                v-model="ksxxInfo.renshu"
                placeholder="可挂号数"
                required
                disabled
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="坐诊时间" class="form-item">
              <el-input
                v-model="ksxxInfo.zuozhenshijian"
                placeholder="坐诊时间"
                required
                disabled
              />
            </el-form-item>
            <el-form-item label="挂号费用" class="form-item">
              <el-input
                v-model="ksxxInfo.jine"
                placeholder="挂号费用"
                required
                disabled
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="医生工号" class="form-item">
              <el-input
                v-model="ksxxInfo.yishenggonghao"
                placeholder="医生工号"
                required
                disabled
              />
            </el-form-item>
            <el-form-item label="医生姓名" class="form-item">
              <el-input
                v-model="ksxxInfo.yishengxingming"
                placeholder="医生姓名"
                required
                disabled
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="医生职位" class="form-item">
              <el-input
                v-model="ksxxInfo.zhiwei"
                placeholder="医生职位"
                required
                disabled
              />
            </el-form-item>
            <el-form-item label="医生姓名" class="form-item">
              <el-input
                v-model="ksxxInfo.yishengxingming"
                placeholder="医生姓名"
                required
                disabled
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import {
  fetcKeshifenlei,
  fetchKeshiInfo,
  fetchKeshiList,
} from "@/services/departServices";
import { baseUrl } from "@/utils/util";

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});
// 控制 el-drawer 的显示状态
const drawerVisible = ref(false);
// 存储当前选中的项
const selectedItem = ref(null);
// 打开详情方法
const openDrawer = async (item) => {
  console.log("ssss", item);
  selectedItem.value = item;
  const info = await fetchKeshiInfo(item.id);
  ksxxInfo.value = info;

  localStorage.setItem("crossTable", `keshixinxi`);
  localStorage.setItem("crossObj", JSON.stringify(item));
  drawerVisible.value = true;
};
// 响应式数据
const ksflList = ref({});
const ksxxList = ref({});
const ksxxInfo = ref({});

const formRef = ref();
const form = reactive({
  keshifenlei: "全部",
  keshihao: "",
  keshimingcheng: "",
  yishengxingming: "",
});
// 构建查询参数
const buildQueryParams = () => {
  const query = {};
  if (form.keshifenlei && form.keshifenlei !== "全部") {
    query.keshifenlei = form.keshifenlei;
  }
  if (form.keshihao) {
    query.keshihao = `%${form.keshihao}%`;
  }
  if (form.keshimingcheng) {
    query.keshimingcheng = `%${form.keshimingcheng}%`;
  }
  if (form.yishengxingming) {
    query.yishengxingming = `%${form.yishengxingming}%`;
  }
  return query;
};
// 异步获取数据
const fetchData = async () => {
  try {
    ksflList.value = await fetcKeshifenlei();
    ksflList.value.unshift("全部");
    // 获取科室信息，包含分页
    const query = buildQueryParams(); // 使用统一查询方法
    const { list, totalPage, currPage } = await fetchKeshiList(
      query,
      pagination.currentPage,
      pagination.pageSize
    );
    ksxxList.value = list;
    pagination.totalPage = totalPage || 0; // 更新总页数
    pagination.currentPage = currPage || 1; // 更新当前页码
  } catch (error) {
    console.error("Error fetching Home Page:", error);
  }
};
//查找
const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      pagination.currentPage = 1; // 查询时重置为第一页
      await fetchData();
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
// 切换页码
const handlePageChange = async (page) => {
  pagination.currentPage = page;
  await fetchData();
};

// 每页条数仍然由前端控制（可选）
const handleSizeChange = async (size) => {
  pagination.pageSize = size;
  pagination.currentPage = 1; // 重置为第一页
  await fetchData();
};

// 在组件挂载时调用 fetchData
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.pageM {
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
  height: 280px; /* 固定卡片高度 */
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
      color: rgb(51, 51, 51);
      border-radius: 8px;
      background: radial-gradient(
        circle,
        rgb(250, 250, 250) 0%,
        rgba(220, 230, 250, 0.5) 100%
      );
      line-height: 30px;
      font-size: 14px;
      text-overflow: ellipsis;
    }
  }
  :deep(.el-card__body) {
    height: 290px;
    padding: 10px;
  }
  &:hover {
    transform: translateY(-5px);
    transition: transform 0.5s ease;
  }
}

.edit-button {
  margin: 10px 0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.form-layout {
  :deep(.el-form-item__label) {
    min-width: 80px;
  }
}
</style>
