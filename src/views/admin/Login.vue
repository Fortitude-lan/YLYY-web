<template>
  <div class="page-box">
    <div class="sign-box">
      <input type="checkbox" id="chk" aria-hidden="true" />
      <div class="signin">
        <el-form
          ref="formSigninRef"
          :model="signinValidateForm"
          class="form-layout"
          status-icon
          :rules="rules"
        >
          <label for="chk" aria-hidden="true">登录</label>
          <el-form-item label="账  号" class="form-item" prop="username">
            <el-input
              v-model="signinValidateForm.username"
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item label="密  码" class="form-item" prop="password">
            <el-input
              type="password"
              v-model="signinValidateForm.password"
              placeholder="密码"
            />
          </el-form-item>
          <el-form-item label="角  色" class="form-item" prop="role">
            <el-radio-group v-model="signinValidateForm.role">
              <el-radio value="users">管理员</el-radio>
              <el-radio value="yisheng">医生</el-radio>
            </el-radio-group>
          </el-form-item>
          <button type="submit" @click.prevent="handleLogin(formSigninRef)">
            登录
          </button>
        </el-form>
      </div>
      <div class="signup">
        <el-form
          ref="formSignupRef"
          :model="signupValidateForm"
          class="form-layout"
        >
          <label for="chk" aria-hidden="true">注册</label>
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

          <el-button type="primary" @click.prevent="handleSignUp(formSignupRef)"
            >注册</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getFrontendRoutes } from "@/router/index";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { ElMessage } from "element-plus";
import { loginService, getSession } from "@/services/backServices";
import { reactive, ref, onMounted, computed } from "vue";
// 获取路由
const store = useStore();
const router = useRouter();

// 注册
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
// 登录
const formSigninRef = ref();
const signinValidateForm = reactive({
  username: "",
  password: "",
  role: "",
});
const rules = reactive({
  username: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入账号"));
        } else {
          // 防止递归调用 validateField
          if (
            signinValidateForm.username !== "" &&
            !formSigninRef.value._isValidating
          ) {
            if (!formSigninRef.value) return;

            // 设置标志防止重复验证
            formSigninRef.value._isValidating = true;
            formSigninRef.value.validateField("username", () => {
              formSigninRef.value._isValidating = false; // 完成验证后清除标志
            });
          }
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (signinValidateForm.password !== "") {
            if (!formSigninRef.value) return;
            formSigninRef.value.validateField("password");
          }
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  role: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请选择角色"));
        } else {
          if (signinValidateForm.role !== "") {
            if (!formSigninRef.value) return;
            formSigninRef.value.validateField("role");
          }
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

// 登录处理
const handleLogin = (formEl) => {
  if (!formSigninRef) return; // 处理注册逻辑
  formEl.validate(async (valid) => {
    if (valid) {
      const params = {
        ...signinValidateForm,
      };
      const msg = await loginService(params);
      if (msg == 0) {
        ElMessage({
          message: "登陆成功",
          type: "success",
        });
        //get UIID
        // getSession(params.role);
        // 更新 Vuex 的登录状态
        store.commit("SET_LOGIN", {
          isLoggedIn: true,
          username: params.username,
        });
        // 等待 Vuex 状态更新后再跳转
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
            console.log('sssss')
            // 跳转到 /back 页面
            router.push({ path: "/back" });
          }, 100); // 适当延迟，例如100毫秒
        });
      } else {
        ElMessage.error("密码或账号错误");
      }
    } else {
      console.log("error submit!");
    }
  });
};
// 注册处理
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
// 退出登录
const handleLogout = () => {
  // 退出登录逻辑
  localStorage.clear();
  // 更新 Vuex 的登录状态
  store.commit("SET_LOGIN", { isLoggedIn: false, username: "" });
  ElMessage({
    message: "退出成功",
    type: "success",
  });
};
// 检查登录状态
const checkLoginStatus = () => {
  const role = localStorage.getItem("role");
  if (role) {
    store.commit("SET_LOGIN", {
      isLoggedIn: true,
      username: localStorage.getItem("adminName"),
    });
  }
};
// 在组件挂载时调用
onMounted(() => {
  checkLoginStatus();
});
</script>

<style lang="scss" scoped>
.page-box {
  width: 100%;
  height: 100vh;
  padding: 50px 0;
  //   background: url(https://opma.justonetech.com/static/img/login/loginBg.png);
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
  :deep(.el-radio) {
    margin: 0;
    padding-right: 20px;
  }
}

.form-item:last-child {
  margin-right: 0; /* 最后一个不需要右边距 */
}

.sign-box {
  width: 60%;
  height: 550px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 5px 20px 50px #000000;
  background: linear-gradient(to bottom, #2a6bb5, #2b60a2, #99bce5);
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
    background: #255da7;
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
    background: #4479ce;
  }
  .signup {
    height: 450px;
    background: #eee;
    border-radius: 60% / 10%;
    transform: translateY(-210px);
    transition: 0.8s ease-in-out;
    label {
      color: #2f5da5;
      transform: scale(0.8);
      margin-bottom: 20px;
    }
    :deep(.el-form-item__label) {
      width: 80px;
    }
    :deep(.el-input) {
      width: 90%;
    }
  }
  .signin {
    position: relative;
    width: 100%;
    height: 590px;
    & > label {
      margin-bottom: 60px;
    }
    .form-item {
      margin: 35px auto;
      width: 60%;
    }
    :deep(.el-form-item__label) {
      color: #fff !important;
    }

    :deep(.el-input),
    button {
      height: 3rem;
    }
    button {
      font-size: 1.2rem;
      text-align: center;
      letter-spacing: 0.5rem;
      margin-top: 45px;
    }
  }

  #chk:checked ~ .signup {
    transform: translateY(-580px);
  }
  #chk:checked ~ .signup label {
    transform: scale(1);
  }
  #chk:checked ~ .signin label {
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
