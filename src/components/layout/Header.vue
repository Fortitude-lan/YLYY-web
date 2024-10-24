<!--
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2024-10-18 12:52:21
 * @LastEditors: Hesin
 * @LastEditTime: 2024-10-24 09:59:03
-->
<template>
  <header class="header">
    <div class="logo">LOGO</div>
    <nav class="menu">
      <ul class="menu-list">
        <li
          class="menu-item"
          v-for="(route, index) in frontendMenuList"
          :key="index"
        >
          <router-link :to="route.path">{{ route.name }}</router-link>
        </li>
      </ul>
    </nav>
    <el-button class="login-btn" plain @click="dialogVisible = true"
      >登录/注册</el-button
    >
    <!-- <button class="register">注册</button> -->
  </header>
  <el-dialog
    v-model="dialogVisible"
    title=""
    width="700"
    :style="{ background: 'transparent' }"
  >
    <template #default>
      <div class="sign-box">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div class="signup">
          <label for="chk" aria-hidden="true">注册</label>
          <el-form
            ref="formSignupRef"
            :model="signupValidateForm"
            class="form-layout"
          >
            <div class="form-row">
              <el-form-item label="账号" class="form-item">
                <el-input
                  v-model="signupValidateForm.username"
                  placeholder="账号"
                  required
                />
              </el-form-item>
              <el-form-item label="电话号码" class="form-item">
                <el-input
                  v-model="signupValidateForm.phone"
                  placeholder="电话"
                  required
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="密码" class="form-item">
                <el-input
                  type="password"
                  v-model="signupValidateForm.password"
                  placeholder="密码"
                  required
                />
              </el-form-item>
              <el-form-item label="确认密码" class="form-item">
                <el-input
                  type="password"
                  v-model="signupValidateForm.confirmPassword"
                  placeholder="确认密码"
                  required
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="姓名" class="form-item">
                <el-input
                  v-model="signupValidateForm.name"
                  placeholder="姓名"
                  required
                />
              </el-form-item>
              <el-form-item label="就诊卡号" class="form-item">
                <el-input
                  v-model="signupValidateForm.cardNumber"
                  placeholder="就诊卡号"
                  required
                />
              </el-form-item>
            </div>
            <div class="form-row">
              <div class="form-item">
                <el-form-item label="性别">
                  <el-select
                    v-model="signupValidateForm.gender"
                    placeholder="选择性别"
                    required
                  >
                    <el-option label="男" value="male"></el-option>
                    <el-option label="女" value="female"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                  <el-input
                    v-model="signupValidateForm.age"
                    type="number"
                    placeholder="请输入年龄"
                    required
                  ></el-input>
                </el-form-item>
              </div>
              <el-form-item label="上传照片" class="form-item">
                <el-upload
                  class="upload-demo"
                  drag
                  action="/upload"
                  show-file-list
                  v-model="signupValidateForm.photo"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">点击上传</div>
                </el-upload>
              </el-form-item>
            </div>

            <el-button
              type="primary"
              @click.prevent="handleSignUp(formSignupRef)"
              >注册</el-button
            >
          </el-form>
        </div>
        <div class="signin">
          <el-form
            ref="formSigninRef"
            :model="signinValidateForm"
            class="form-layout"
          >
            <label for="chk" aria-hidden="true">登录</label>
            <el-form-item label="用户名" class="form-item">
              <el-input
                v-model="signinValidateForm.username"
                placeholder="用户名"
                required
              />
            </el-form-item>
            <el-form-item label="密  码" class="form-item">
              <el-input
                type="password"
                v-model="signinValidateForm.password"
                placeholder="密码"
                required
              />
            </el-form-item>
            <button type="submit" @click.prevent="handleLogin(formSigninRef)">
              登录
            </button>
          </el-form>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getFrontendRoutes } from "@/router/index";
import { reactive, ref } from "vue";
import { loginService } from "@/services/headerServices";
import { ElMessage } from "element-plus";

// 控制对话框显示状态
const dialogVisible = ref(false);
// 获取前端路由
const frontendRoutes = getFrontendRoutes();
const frontendMenuList = [
  { path: "/front", name: "首页" }, // 补充第一个路由
  ...frontendRoutes.flatMap((child) => ({
    path: `/front/${child.path}`, // 使用绝对路径
    name: child.name,
  })),
];

console.log(frontendMenuList);

const formSignupRef = ref();
const signupValidateForm = reactive({
  username: "",
  phone: "",
  password: "",
  confirmPassword: "",
  name: "",
  cardNumber: "",
  gender: "",
  age: "",
  photo: null,
});
const formSigninRef = ref();
const signinValidateForm = reactive({
  username: "",
  password: "",
});
const handleLogin = (formEl) => {
  if (!formSigninRef) return; // 处理注册逻辑
  formEl.validate(async (valid) => {
    if (valid) {
      const params = {
        ...signinValidateForm,
      };
      console.log(params);
      const msg = await loginService(params);
      if (msg == 0) {
        ElMessage({
          message: "登陆成功",
          type: "success",
        });
      } else {
        ElMessage.error("密码或账号错误");
      }
    } else {
      console.log("error submit!");
    }
  });
};
const handleSignUp = (formEl) => {
  if (!formSignupRef) return; // 处理注册逻辑
  formEl.validate((valid) => {
    if (valid) {
      console.log(signupValidateForm.username);
    } else {
      console.log("error submit!");
    }
  });
};
</script>

<style lang="scss" scoped>
/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}

.menu {
  flex-grow: 1;
}

.menu-list {
  display: flex;
  justify-content: center; /* 使菜单居中 */
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin: 0 15px;
  cursor: pointer;
  a {
    color: #fff;
  }
}

.form-layout {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  justify-content: space-between;
}

.form-item {
  flex: 1; /* 等宽 */
  margin-right: 20px; /* 控制项之间的间距 */
}

.form-item:last-child {
  margin-right: 0; /* 最后一个不需要右边距 */
}

.sign-box {
  width: 100%;
  height: 550px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 5px 20px 50px #000;
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);

  #chk {
    display: none;
  }

  label {
    color: #fff;
    font-size: 2.3em;
    justify-content: center;
    display: flex;
    margin: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.5s ease-in-out;
  }
  input {
    width: 60%;
    height: 2rem;
    background: #e0dede;
    justify-content: center;
    display: flex;
    margin: 20px auto;
    padding: 12px;
    border: none;
    outline: none;
    border-radius: 5px;
  }
  button {
    width: 60%;
    height: 40px;
    margin: 10px auto;
    justify-content: center;
    display: block;
    color: #fff;
    background: #573b8a;
    font-size: 1em;
    font-weight: bold;
    margin-top: 30px;
    outline: none;
    border: none;
    border-radius: 5px;
    transition: 0.2s ease-in;
    cursor: pointer;
  }
  button:hover {
    background: #6d44b8;
  }
  .signin {
    height: 450px;
    background: #eee;
    border-radius: 60% / 10%;
    transform: translateY(-200px);
    transition: 0.8s ease-in-out;
    label {
      color: #573b8a;
      transform: scale(0.8);
    }
    ::v-deep .el-form-item__label {
      width: 100px;
    }
    ::v-deep .el-input {
      width: 90%;
    }
    ::v-deep .el-input,
    button {
      height: 3rem;
    }
  }
  .signup {
    position: relative;
    width: 100%;
    height: 590px;
    label {
      margin: 30px;
    }
    ::v-deep .el-form-item__label {
      color: #fff !important;
    }
  }

  #chk:checked ~ .signin {
    transform: translateY(-580px);
  }
  #chk:checked ~ .signin label {
    transform: scale(1);
  }
  #chk:checked ~ .signup label {
    transform: scale(0.8);
  }

  :global(.el-dialog) {
    margin-top: 70px !important;
  }
  .upload-demo {
    width: 100px;
    height: 100px;
  }
}
</style>
