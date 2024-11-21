<template>
  <el-form ref="formRef" :model="infoValidateForm" class="form-layout">
    <div class="form-row">
      <el-form-item label="工号" class="form-item" prop="yishenggonghao">
        <el-input
          v-model="infoValidateForm.yishenggonghao"
          placeholder="工号"
          required
        />
      </el-form-item>
      <el-form-item label="姓名" class="form-item" prop="yishengxingming">
        <el-input
          v-model="infoValidateForm.yishengxingming"
          placeholder="姓名"
          required
        />
      </el-form-item>
    </div>
    <div class="form-row">
      <el-form-item label="职位" class="form-item" prop="zhiwei">
        <el-input
          v-model="infoValidateForm.zhiwei"
          placeholder="职位"
          required
        />
      </el-form-item>
      <el-form-item label="性别" class="form-item" prop="xingbie">
        <el-select
          :style="{
            width: '120px',
          }"
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
      <el-form-item label="上传照片" class="form-item">
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
        <el-dialog>
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
    </div>

    <el-button type="primary" @click.prevent="handleSubmit(formRef)"
      >更新</el-button
    >
  </el-form>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { baseUrl } from "@/utils/util";
import { CiCirclePlus } from "vue3-icons/ci";
import { getSession, updateYSService } from "@/services/backServices";
const fileList = ref([]); // 存储上传的文件列表
const imgUrl = ref([]);
// 响应式数据
const userInfo = ref({});

const formRef = ref();
const infoValidateForm = reactive({
  yishenggonghao: "",
  yishengxingming: "",
  zhiwei: "",
  xingbie: "",
  zhaopian: null,
  id:'',
  mima:''
});
// 异步获取数据
const fetchData = async () => {
  try {
    const role = localStorage.getItem("sessionTable");

    userInfo.value = await getSession(role);
    // 回显数据到表单
    infoValidateForm.yishenggonghao = userInfo.value.yishenggonghao || "";
    infoValidateForm.yishengxingming = userInfo.value.yishengxingming || "";
    infoValidateForm.zhiwei = userInfo.value.zhiwei || "";
    infoValidateForm.xingbie = userInfo.value.xingbie || "";
    infoValidateForm.zhaopian = userInfo.value.zhaopian || "";
    infoValidateForm.id = userInfo.value.id || "";
    infoValidateForm.mima = userInfo.value.mima || "";

    // 将图片路径转为 fileList 格式
    const photos = userInfo.value.zhaopian.split(","); // 将逗号分隔的字符串转为数组
    fileList.value = photos.map((path) => {
      return {
        name: path.split("/").pop(), // 提取文件名
        url: baseUrl + "/" + path, // 使用完整路径作为图片地址
      };
    });
    console.log(fileList);
  } catch (error) {
    console.error("Error fetching Home Page:", error);
  }
};
// 修改处理
const handleSubmit = (formEl) => {
  if (!formRef) return; // 处理注册逻辑
  formEl.validate(async (valid) => {
    if (valid) {
      const params = {
        ...infoValidateForm,
        zhaopian: imgUrl.value.join(","),
      };
      const res = await updateYSService(params);
      if (res == 0) {
        ElMessage({
          message: `${yishenggonghao} 注册成功`,
          type: "success",
        });
      } else {
        ElMessage({
          message: "注册失败",
          type: "error",
        });
      }
    } else {
      console.log("error submit!");
    }
  });
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
// 在组件挂载时调用 fetchData
onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
/* 自定义样式 */
.form-layout {
  :deep(.el-form-item__label) {
    min-width: 120px;
  }
}
</style>
