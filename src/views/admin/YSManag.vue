<template>
  <!-- 选择器 -->
  <el-form ref="formRef" :model="form" label-width="auto" class="form">
    <el-form-item label="医生工号" prop="yishenggonghao">
      <el-input v-model="form.yishenggonghao" />
    </el-form-item>
    <el-form-item label="医生姓名" prop="yishengxingming">
      <el-input v-model="form.yishengxingming" />
    </el-form-item>
    <el-form-item class="form-btns">
      <el-button type="primary" @click="onSubmit(formRef)">查询</el-button>
      <el-button @click="resetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="noraml-btn">
    <button @click="addFormVisible = true">新增</button>
    <button @click="delSubmit()">删除</button>
  </div>
  <!-- 动态渲染表头 -->
  <el-table
    :data="tableData"
    @selection-change="handleSelectionChange"
    :row-key="(row) => row.id"
    ref="tableRef"
    style="width: 100%"
    class="table"
  >
    <!-- 多选框 -->
    <el-table-column type="selection" width="55"></el-table-column>

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
          <span v-if="column.prop === 'zhaopian'">
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
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button link type="primary" size="small"> 详情 </el-button>
        <el-popconfirm title="确定要删除吗?">
          <template #reference>
            <el-button link type="danger" size="small"> 删除 </el-button>
          </template>
          <template #actions="{ confirm, cancel }">
            <el-button size="small" @click="cancel">否</el-button>
            <el-button
              type="danger"
              size="small"
              @click="delConfirm(scope.row)"
            >
              是
            </el-button>
          </template>
        </el-popconfirm>
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

  <!-- 弹窗 add -->
  <el-dialog v-model="addFormVisible" title="新增" width="500">
    <el-form ref="addformRef" :model="addform" class="form-layout">
      <div class="form-row">
        <el-form-item label="工号" class="form-item">
          <el-input
            v-model="addform.yishenggonghao"
            placeholder="工号"
            required
          />
        </el-form-item>
        <el-form-item label="姓名" class="form-item">
          <el-input
            v-model="addform.yishengxingming"
            placeholder="姓名"
            required
          />
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="密码" class="form-item">
          <el-input
            type="password"
            v-model="addform.mima"
            placeholder="密码"
            required
          />
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="职位" class="form-item">
          <el-input v-model="addform.zhiwei" placeholder="职位" required />
        </el-form-item>
        <el-form-item label="性别" class="form-item">
          <el-select
            :style="{
              width: '120px',
            }"
            v-model="addform.xingbie"
            placeholder="选择性别"
            required
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="上传照片" class="form-item" prop="zhaopian">
          <el-upload
            v-model:file-list="fileList"
            :action="`${baseUrl}/file/upload`"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove"
            :auto-upload="true"
            multiple
          >
            <CiCirclePlus size="20" />
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onAddSubmit(addformRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  fetchYsPageAPI,
  fetchYsPageADDAPI,
  fetchYsPageDelAPI,
} from "@/services/backServices";
import { reactive, onMounted, ref } from "vue";
import { baseUrl } from "@/utils/util";
import { ElMessage, ElMessageBox } from "element-plus";
import { CiCirclePlus } from "vue3-icons/ci";

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});

const formRef = ref();
const form = reactive({
  yishenggonghao: "",
  yishengxingming: "",
});

// 上传文件列表
const fileList = ref([]);
const imgUrl = ref([]);
const addformRef = ref();
const addFormVisible = ref(false);
const addform = reactive({
  yishenggonghao: "",
  yishengxingming: "",
  mima: "",
  mima2: "",
  zhiwei: "",
  xingbie: "",
  zhaopian: null,
});

// 选中的行
const selectedRows = ref([]);
// 表头数据
const tableData = ref([]);
// 自定义表头
const columns = ref([
  { prop: "num", label: "序号", width: "80" },
  { prop: "yishengxingming", label: "医生姓名", width: "120" },
  { prop: "yishenggonghao", label: "工号", width: "180" },
  { prop: "xingbie", label: "性别", width: "100" },
  { prop: "zhaopian", label: "照片", width: "150" },
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
    const query = buildQueryParams(); // 使用统一查询方法

    const { list, totalPage, currPage } = await fetchYsPageAPI(
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
// 监听选中行变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
  console.log("当前选中的行:", selectedRows.value);
};

// 输出选中数据
const handleSelectedRows = () => {
  console.log("选中的行数据:", selectedRows.value);
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
// add
const onAddSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      const params = {
        ...addform,
        zhaopian: imgUrl.value.join(","),
      };
      const msg = await fetchYsPageADDAPI(params);
      if (msg == 0) {
        ElMessage({
          message: "新增成功",
          type: "success",
        });
        //
        addFormVisible.value = false;
        //更新
        await fetchData();
      } else {
        ElMessage({
          message: "新增失败",
          type: "error",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
// del raws
const delSubmit = () => {
  console.log("del");
  if (selectedRows.value.length <= 0) {
    ElMessage({
      message: "至少选择一行",
      type: "warning",
    });
  } else {
    ElMessageBox.confirm("确认删除选中行?", "删除", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const ids = selectedRows.value.map((i) => i.id);
        console.log(ids);
        const msg = await fetchYsPageDelAPI(ids);
        if (msg == 0) {
          ElMessage({
            type: "success",
            message: "删除成功",
          });
          //刷新
          await fetchData();
        }
      })
      .catch(() => {
        ElMessage({
          type: "error",
          message: "删除失败",
        });
      });
  }
};
//del raw
const delConfirm = async (row) => {
  console.log();
  const msg = await fetchYsPageDelAPI([row.id]);
  if (msg == 0) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //刷新
    await fetchData();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
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

// 上传成功回调
const handleUploadSuccess = (response, file, fileListRef) => {
  // 假设后端返回的是文件的URL
  imgUrl.value.push(`upload/${response.file}`); // 修改为实际的返回路径字段
  console.log("上传成功的图片URL:", imgUrl);

  ElMessage.success("图片上传成功");
};

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};
// 生命周期钩子，获取表头数据
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.table {
  height: 400px;
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
.noraml-btn button {
  margin-right: 10px;
}
</style>
