<template>
  <!-- 选择器 -->
  <el-form ref="formRef" :model="form" label-width="auto" class="form">
    <el-form-item label="账号" prop="zhanghao">
      <el-input v-model="form.zhanghao" />
    </el-form-item>
    <el-form-item class="form-btns">
      <el-button type="primary" @click="onSubmit(formRef)">查询</el-button>
      <el-button @click="resetForm(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="noraml-btn">
    <button @click="openAdd()">新增</button>
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
          <span v-else-if="column.prop === 'zhaopian'">
            <img
              :src="`${httpURL}${scope.row[column.prop]}`"
              alt="图片"
              style="width: 50px; height: 50px; object-fit: cover"
            />
          </span>
          <!-- 其他列默认渲染 -->
          <span v-else>
            {{ scope.row[column.prop] }}
          </span>
        </div>
      </template>
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column fixed="right" label="操作" min-width="150">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="openUpdate(scope.row)"
        >
          修改
        </el-button>
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
  <!-- 抽屉 修改 -->
  <el-drawer v-model="drawerVisible" title="修改信息" size="80%">
    <el-form ref="infoformRef" :model="infoValidateForm" class="form-layout">
      <div class="form-row">
        <el-form-item label="账号" class="form-item" required>
          <el-input
            v-model="infoValidateForm.zhanghao"
            placeholder="账号"
            required
          />
        </el-form-item>
        <el-form-item label="密码" class="form-item" required>
          <el-input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="infoValidateForm.mima"
            placeholder="密码"
            required
          >
            <template #append>
              <component
                :is="isPasswordVisible ? PiEyeBold : PiEyeClosed"
                @click="togglePasswordVisibility"
                style="cursor: pointer; font-size: 20px"
              />
            </template>
          </el-input>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="姓名" class="form-item">
          <el-input
            v-model="infoValidateForm.xingming"
            placeholder="姓名"
            required
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            :style="{ width: '180px' }"
            v-model="infoValidateForm.xingbie"
            placeholder="选择性别"
            required
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="电话" class="form-item">
          <el-input
            v-model="infoValidateForm.lianxidianhua"
            placeholder="电话"
            required
          />
        </el-form-item>
        <el-form-item label="年龄" class="form-item">
          <el-input
            type="number"
            v-model="infoValidateForm.nianling"
            placeholder="年龄"
            required
          ></el-input>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="就诊卡号" class="form-item">
          <el-input
            v-model="infoValidateForm.jiuzhenkahao"
            placeholder="就诊卡号"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="就诊余额" class="form-item">
          <el-input
            v-model="infoValidateForm.jine"
            placeholder="就诊余额"
            required
          />
        </el-form-item>
      </div>
      <el-form-item label="症状描述" class="form-item">
        <el-input
          type="textarea"
          v-model="infoValidateForm.zhengzhuangmiaoshu"
          placeholder="症状"
          required
        ></el-input>
      </el-form-item>
      <div class="form-row">
        <el-form-item label="照片" class="form-item">
          <el-upload
            class="upload-demo"
            drag
            :action="`${baseUrl}/file/upload`"
            :headers="headers"
            :show-file-list="false"
            :on-success="(res) => handleUpdateImage(res, 'update')"
          >
            <img
              :style="{
                border: '1px dashed #999',
                cursor: 'pointer',
                color: '#999',
                borderRadius: '6px',
                textAlign: 'center',
                background: '#f9f9f9',
                width: '150px',
                fontSize: '32px',
                lineHeight: '100px',
                height: 'auto',
              }"
              v-if="infoValidateForm.zhaopian"
              :src="`${httpURL}${infoValidateForm.zhaopian}`"
              class="avatar"
            />

            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
          </el-upload>
        </el-form-item>
      </div>
      <div class="tt">
        <el-button
          type="primary"
          @click.prevent="onUpdateSubmit(infoformRef)"
          class="edit-button"
          >提交</el-button
        >
      </div>
    </el-form>
  </el-drawer>
  <!-- 抽屉 add -->
  <el-drawer v-model="adddrawerVisible" title="添加用户" size="80%">
    <el-form ref="addformRef" :model="addValidateForm" class="form-layout">
      <div class="form-row">
        <el-form-item label="账号" class="form-item" required>
          <el-input
            v-model="addValidateForm.zhanghao"
            placeholder="账号"
            required
          />
        </el-form-item>
        <el-form-item label="密码" class="form-item" required>
          <el-input
            :type="isPasswordVisible ? 'text' : 'password'"
            v-model="addValidateForm.mima"
            placeholder="密码"
            required
          >
            <template #append>
              <component
                :is="isPasswordVisible ? PiEyeBold : PiEyeClosed"
                @click="togglePasswordVisibility"
                style="cursor: pointer; font-size: 20px"
              />
            </template>
          </el-input>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="姓名" class="form-item">
          <el-input
            v-model="addValidateForm.xingming"
            placeholder="姓名"
            required
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            :style="{ width: '180px' }"
            v-model="addValidateForm.xingbie"
            placeholder="选择性别"
            required
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="电话" class="form-item">
          <el-input
            v-model="addValidateForm.lianxidianhua"
            placeholder="电话"
            required
          />
        </el-form-item>
        <el-form-item label="年龄" class="form-item">
          <el-input
            type="number"
            v-model="addValidateForm.nianling"
            placeholder="年龄"
            required
          ></el-input>
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item label="就诊卡号" class="form-item">
          <el-input
            v-model="addValidateForm.jiuzhenkahao"
            placeholder="就诊卡号"
            required
          ></el-input>
        </el-form-item>
        <el-form-item label="就诊余额" class="form-item">
          <el-input
            v-model="addValidateForm.jine"
            placeholder="就诊余额"
            required
          />
        </el-form-item>
      </div>
      <el-form-item label="症状描述" class="form-item">
        <el-input
          type="textarea"
          v-model="addValidateForm.zhengzhuangmiaoshu"
          placeholder="症状"
          required
        ></el-input>
      </el-form-item>
      <div class="form-row">
        <el-form-item label="照片" class="form-item">
          <el-upload
            class="upload-demo"
            drag
            :action="`${baseUrl}/file/upload`"
            :headers="headers"
            :show-file-list="false"
            :on-success="(res) => handleUpdateImage(res, 'add')"
          >
            <img
              :style="{
                border: '1px dashed #999',
                cursor: 'pointer',
                color: '#999',
                borderRadius: '6px',
                textAlign: 'center',
                background: '#f9f9f9',
                width: '150px',
                fontSize: '32px',
                lineHeight: '100px',
                height: 'auto',
              }"
              v-if="addValidateForm.zhaopian"
              :src="`${httpURL}${addValidateForm.zhaopian}`"
              class="avatar"
            />

            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
          </el-upload>
        </el-form-item>
      </div>
      <div class="tt">
        <el-button
          type="primary"
          @click.prevent="onAddSubmit(addformRef)"
          class="edit-button"
          >提交</el-button
        >
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup>
import {
  fetchUserPage,
  fetchUserDel,
  fetchUserAdd,
} from "@/services/backServices";
import { reactive, onMounted, ref } from "vue";
import { TiTick } from "vue3-icons/ti";
import { PiEyeBold, PiEyeClosed } from "vue3-icons/pi";
import { fetchUserSave } from "@/services/headerServices";
import { ElMessage, ElMessageBox } from "element-plus";
import { baseUrl, httpURL } from "@/utils/util";

// 分页状态
const pagination = reactive({
  currentPage: 1, // 当前页码
  pageSize: 10, // 每页条数
  totalPage: 0, // 总页数，从接口返回
});
// 控制 el-drawer 的显示状态
const drawerVisible = ref(false);
const adddrawerVisible = ref(false);
const selectRow = ref({});

const formRef = ref();
const form = reactive({
  zhanghao: "",
});
const infoformRef = ref();
const infoValidateForm = reactive({
  id: "",
  zhanghao: "",
  mima: "",
  xingming: "",
  xingbie: "",
  zhaopian: "",
  lianxidianhua: "",
  nianling: "",
  jiuzhenkahao: "",
  jine: 0,
  zhengzhuangmiaoshu: "",
  addtime: "",
});
const addformRef = ref();
const addValidateForm = reactive({
  id: "",
  zhanghao: "",
  mima: "",
  xingming: "",
  xingbie: "",
  zhaopian: null,
  lianxidianhua: "",
  nianling: "",
  jiuzhenkahao: "",
  jine: 0,
  zhengzhuangmiaoshu: "",
  addtime: "",
});
// 选中的行
const selectedRows = ref([]);
// 表头数据
const tableData = ref([]);
// 自定义表头
const columns = ref([
  { prop: "num", label: "序号", width: "80" },
  { prop: "zhanghao", label: "账号", width: "130" },
  { prop: "xingming", label: "姓名", width: "100" },
  { prop: "xingbie", label: "性别", width: "80" },
  { prop: "nianling", label: "年龄", width: "80" },
  { prop: "zhaopian", label: "头像", width: "100" },
  { prop: "lianxidianhua", label: "联系电话", width: "150" },
  { prop: "jiuzhenkahao", label: "就诊卡号", width: "150" },
  { prop: "jine", label: "余额", width: "150" },
]);

// 构建查询参数
const buildQueryParams = () => {
  const query = {};
  if (form.zhanghao) {
    query.zhanghao = `%${form.zhanghao}%`;
  }
  return query;
};
//获取数据
const fetchData = async () => {
  try {
    const query = buildQueryParams(); // 使用统一查询方法
    const { list, totalPage, currPage } = await fetchUserPage(
      query,
      pagination.currentPage,
      pagination.pageSize
    );
    // 获取list信息
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

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 控制密码显示/隐藏的状态
const isPasswordVisible = ref(false);
// 切换密码可见性
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
const openUpdate = async (row) => {
  // 回显数据到表单
  infoValidateForm.addtime = row.addtime || "";
  infoValidateForm.zhengzhuangmiaoshu = row.zhengzhuangmiaoshu || "";
  infoValidateForm.jine = Number(row.jine) || 0;
  infoValidateForm.jiuzhenkahao = row.jiuzhenkahao || "";
  infoValidateForm.nianling = row.nianling || "";
  infoValidateForm.lianxidianhua = row.lianxidianhua || "";
  infoValidateForm.zhaopian = row.zhaopian || null;
  infoValidateForm.xingbie = row.xingbie || "";
  infoValidateForm.xingming = row.xingming || "";
  infoValidateForm.mima = row.mima || "";
  infoValidateForm.zhanghao = row.zhanghao || "";
  infoValidateForm.id = row.id || "";

  selectRow.value = row;
  drawerVisible.value = true;
};
//打开抽屉
const openAdd = async () => {
  adddrawerVisible.value = true;
};
// 上传图片成功后回调
const handleUpdateImage = (response, type) => {
  //图片的URL
  let imageUrl;
  if (type == "add") {
    imageUrl = `upload/${response.file}`; // 修改为实际的返回路径字段
    console.log(imageUrl);

    addValidateForm.zhaopian = imageUrl; // 更新表单中的图片路径
  } else {
    imageUrl = `upload/${response.file}`; // 修改为实际的返回路径字段
    console.log(imageUrl);

    infoValidateForm.zhaopian = imageUrl; // 更新表单中的图片路径
  }

  // 提示用户上传成功
  ElMessage({
    message: "图片上传成功",
    type: "success",
  });
};
const headers = ref({
  Token: localStorage.getItem("Token"),
});
const onAddSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = {
        ...selectRow.value,
        ...addValidateForm,
      };
      const msg = await fetchUserAdd(params);
      if (msg === 0) {
        ElMessage({
          message: "添加成功",
          type: "success",
        });
        adddrawerVisible.value = false;
        formEl.resetFields();
        await fetchData();
      } else {
        ElMessage({
          message: "添加失败",
          type: "error",
        });
      }
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
const onUpdateSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const msg = await fetchUserSave(infoValidateForm);
      if (msg === 0) {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
        drawerVisible.value = false;
        await fetchData();
      } else {
        ElMessage({
          message: "修改失败",
          type: "error",
        });
      }
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
// del
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
        const msg = await fetchUserDel(ids);
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
//del row
const delConfirm = async (row) => {
  console.log(row);
  const msg = await fetchUserDel([row.id]);
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
.tt {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.form-row {
  display: flex;
  justify-content: space-between;
}
.form-layout {
  padding: 0 20px;
  box-sizing: border-box;
  :deep(.el-form-item__label) {
    min-width: 100px;
  }
  :deep(.el-form-item) {
    width: 48%;
  }
}
</style>
