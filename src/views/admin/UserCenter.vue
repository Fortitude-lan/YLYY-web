<template>
  <el-form
    :model="passwordForm"
    :rules="passwordRules"
    ref="FormRef"
    label-width="100px"
  >
    <el-form-item label="原密码" prop="oldPassword">
      <el-input
        v-model="passwordForm.oldPassword"
        :type="isPasswordVisible ? 'text' : 'password'"
        autocomplete="off"
      >
        <template #append>
          <component
            :is="isPasswordVisible ? PiEyeBold : PiEyeClosed"
            @click="togglePasswordVisibility"
            style="cursor: pointer; font-size: 20px"
          /> </template
      ></el-input>
    </el-form-item>

    <el-form-item label="新密码" prop="mima">
      <el-input
        v-model="passwordForm.mima"
        :type="isPasswordVisible ? 'text' : 'password'"
        autocomplete="off"
      >
        <template #append>
          <component
            :is="isPasswordVisible ? PiEyeBold : PiEyeClosed"
            @click="togglePasswordVisibility"
            style="cursor: pointer; font-size: 20px"
          /> </template
      ></el-input>
    </el-form-item>

    <el-form-item label="确认新密码" prop="password">
      <el-input
        v-model="passwordForm.password"
        :type="isPasswordVisible ? 'text' : 'password'"
        autocomplete="off"
      >
        <template #append>
          <component
            :is="isPasswordVisible ? PiEyeBold : PiEyeClosed"
            @click="togglePasswordVisibility"
            style="cursor: pointer; font-size: 20px"
          /> </template
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm">修改密码</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { PiEyeBold, PiEyeClosed } from "vue3-icons/pi";
import { getSession, fetchMima } from "@/services/backServices";

const passwordForm = ref({
  oldPassword: "",
  mima: "",
  password: "",
});

// 控制密码显示/隐藏的状态
const isPasswordVisible = ref(false);
// 切换密码可见性
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const passwordRules = {
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  mima: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "新密码至少6位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请确认新密码"));
        } else if (value !== passwordForm.value.mima) {
          callback(new Error("两次输入的新密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const FormRef = ref(null);

const submitForm = () => {
  if (!FormRef.value) return;

  FormRef.value.validate(async (valid) => {
    if (valid) {
      const role = localStorage.getItem("sessionTable");
      const userinfo = await getSession(role);
      if (passwordForm.value.oldPassword == userinfo.mima) {
        const params = {
          ...userinfo,
          mima: passwordForm.value.mima,
        };
        const res = await fetchMima(role, params);
        if (res == 0) {
          ElMessage({
            message: "修改成功",
            type: "success",
          });
          resetForm();
        }
      } else {
        ElMessage({
          message: "原密码不正确",
          type: "error",
        });
      }
    } else {
      console.log("表单验证失败");
    }
  });
};

const resetForm = () => {
  if (!FormRef.value) return;
  FormRef.value.resetFields();
};
</script>

<style scoped>
/* 自定义样式 */
</style>
