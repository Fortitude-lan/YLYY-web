<template>
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
  <!-- 动态渲染表头 -->
  <el-table :data="tableData" style="width: 100%" class="table">
    <!-- 动态渲染表头 -->
    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :prop="column.prop"
      :label="column.label"
      :width="column.width || 'auto'"
    >
      <!-- 重写列内容 -->
      <template #default="scope">
        <div>
          <!-- 获取当前行数据（item） -->
          <span v-if="column.prop === 'num'">
            {{
              (pagination.currentPage - 1) * pagination.pageSize +
              scope.$index +
              1
            }}
            <!-- 显示当前列的值，并显示当前行号 -->
          </span>
          <span v-if="column.prop === 'tupian'">
            <div
              v-for="(img, imgIndex) in scope.row[column.prop].split(',')"
              :key="imgIndex"
              style="display: inline-block; margin-right: 8px"
            >
              <!-- {{ baseUrl }}/{{ img }} -->
              <img
                :src="`${baseUrl}/${img}`"
                alt="图片"
                style="width: 50px; height: 50px; object-fit: cover"
              />
            </div>
          </span>
          <!-- 其他列默认渲染 -->
          <span v-else>
            {{ scope.row[column.prop] }}
          </span>
        </div>
      </template>
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column fixed="right" label="操作" min-width="80">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="deleteRow(scope.$index)"
        >
          详情
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-row style="margin: 20px 0 0">
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
</template>

<script setup>
import { fetchKeshiPage } from "@/services/backServices";
import { fetcKeshifenlei } from "@/services/departServices";
import { reactive, onMounted, ref } from "vue";
import { baseUrl } from "@/utils/util";

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});
const ksflList = ref({});
const formRef = ref();
const form = reactive({
  keshifenlei: "全部",
  keshihao: "",
  keshimingcheng: "",
  yishengxingming: "",
});

// 表头数据
const tableData = ref([]);
// 自定义表头
const columns = ref([
  { prop: "num", label: "序号", width: "80" },
  { prop: "keshihao", label: "科室号", width: "150" },
  { prop: "keshifenlei", label: "科室分类", width: "120" },
  { prop: "keshimingcheng", label: "科室名称", width: "180" },
  { prop: "keshidizhi", label: "科室地址", width: "200" },
  { prop: "tupian", label: "图片", width: "300" },
  { prop: "renshu", label: "人数", width: "100" },
  { prop: "zuozhenshijian", label: "坐诊时间", width: "180" },
  { prop: "jine", label: "金额", width: "120" },
  { prop: "yishenggonghao", label: "医生工号", width: "150" },
  { prop: "yishengxingming", label: "医生姓名", width: "150" },
  { prop: "zhiwei", label: "职位", width: "120" },
  { prop: "addtime", label: "添加时间", width: "200" },
]);

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
//获取数据
const fetchData = async () => {
  try {
    ksflList.value = await fetcKeshifenlei();
    ksflList.value.unshift("全部");
    const query = buildQueryParams(); // 使用统一查询方法

    const { list, totalPage, currPage } = await fetchKeshiPage(
      query,
      pagination.currentPage,
      pagination.pageSize
    );
    // 获取科室信息，包含分页
    tableData.value = list;
    pagination.totalPage = totalPage || 0; // 更新总页数
    pagination.currentPage = currPage || 1; // 更新当前页码
  } catch (error) {
    console.error("Failed to fetch table columns:", error);
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
// 生命周期钩子，获取表头数据
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.table {
  height: 430px;
}
.form {
  margin: 10px 0;
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
</style>
