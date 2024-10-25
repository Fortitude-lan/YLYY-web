<template>
  <div>
    <header class="header">
      <div class="logo">LOGO</div>
      <div>
        <div
          v-if="isLoggedIn"
          :style="{ display: 'flex', alignItems: 'center' }"
        >
          <el-dropdown placement="top-start">
            <div>
              <el-avatar
                :icon="FaUserAstronaut"
                :size="35"
                :style="{ background: '#1e62b9' }"
              />
              <span :style="{ marginLeft: '10px' }">{{ username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link :to="{ path: '/back' }">后台管理</router-link>
                </el-dropdown-item>
                <el-dropdown-item @click="handleLogout">
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-button
          v-if="!isLoggedIn"
          class="login-btn"
          plain
          @click="dialogVisible = true"
          >登录/注册</el-button
        >
      </div>
    </header>
    <nav class="menu">
      <ul class="menu-list">
        <li
          v-for="(route, index) in frontendMenuList"
          :key="index"
          :class="isActive(route.path) ? 'menu-item curRoute' : 'menu-item'"
        >
          <router-link :to="route.path"
            ><span>
              <component :is="route.icon" />{{ route.name }}</span
            ></router-link
          >
        </li>
      </ul>
    </nav>
    <el-carousel height="60vh">
      <el-carousel-item v-for="(image, index) in carouselImages" :key="index">
        <img
          :src="`/springbootYL/${image}`"
          style="width: 100%; height: 100%; object-fit: cover"
        />
      </el-carousel-item>
    </el-carousel>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/front' }"
        >当前位置：</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: route.path }">{{
        route.name
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title=""
    width="700"
    :style="{ background: 'transparent' }"
  >
    <template #default>
      <div class="sign-box">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div class="signin">
          <el-form
            ref="formSigninRef"
            :model="signinValidateForm"
            class="form-layout"
          >
            <label for="chk" aria-hidden="true">登录</label>
            <el-form-item label="账  号" class="form-item">
              <el-input
                v-model="signinValidateForm.username"
                placeholder="账号"
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

            <el-button
              type="primary"
              @click.prevent="handleSignUp(formSignupRef)"
              >注册</el-button
            >
          </el-form>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { getFrontendRoutes } from "@/router/index";
import { loginService, fetchCarouselImages } from "@/services/headerServices";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { FaUserAstronaut } from "vue3-icons/fa";
import { CiStar } from "vue3-icons/ci";

//轮播图
const carouselImages = ref([]);
// 异步获取数据
const fetchData = async () => {
  try {
    carouselImages.value = await fetchCarouselImages(); // 获取轮播图数据
  } catch (error) {
    console.error("Error fetching:", error);
  }
};

// 控制对话框显示状态
const dialogVisible = ref(false);
//登录验证
const isLoggedIn = ref(false);
const username = ref("");

// 获取前端路由
const route = useRoute();
const isActive = (path) => {
  return route.path === path; // 判断当前路由是否与链接路径相同
};
// 获取前端路由
const frontendRoutes = getFrontendRoutes();
const frontendMenuList = [
  { path: "/front", name: "首页", icon: CiStar }, // 补充第一个路由
  ...frontendRoutes.flatMap((child) => ({
    path: `/front/${child.path}`, // 使用绝对路径
    name: child.name,
    icon: child.icon,
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
// 登录处理
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
        dialogVisible.value = false;
        isLoggedIn.value = true;
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
  isLoggedIn.value = false;
  ElMessage({
    message: "退出成功",
    type: "success",
  });
};
// 检查登录状态
const checkLoginStatus = () => {
  const role = localStorage.getItem("role");
  if (role) {
    isLoggedIn.value = true;
    username.value = localStorage.getItem("username"); // 假设用户名存储在 localStorage 中
  } else {
    isLoggedIn.value = false;
  }
};
// 在组件挂载时调用
onMounted(() => {
  fetchData();
  checkLoginStatus();
});
</script>

<style lang="scss" scoped>
// 当前路由
.curRoute {
  border-color: #00254a #00254a #006fc3 #006fc3;
  background: url(http://codegen.caihongy.cn/20221027/8c0f3f3d4c0b4e38bd59dee72577a66b.png)
    repeat-x;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  // background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #000000;
}

.menu {
  flex-grow: 1;
}

.menu-list {
  display: flex;
  justify-content: center; /* 使菜单居中 */
  align-items: center;
  list-style: none;
  height: 40px;
  background: url(https://codegen.caihongy.cn/20221027/4058b35f34564533adc258a0075041ed.png)
    repeat-x;
}

.menu-item {
  cursor: pointer;
  padding: 0 15px;
  line-height: 40px;
  border-color: #00254a #00254a #006fc3 #006fc3;
  a {
    color: #fff;
    text-decoration: none;
  }
  span {
    display: flex;
    align-items: center;
  }
  &:hover {
    border-color: #00254a #00254a #006fc3 #006fc3;
    background: url(http://codegen.caihongy.cn/20221027/8c0f3f3d4c0b4e38bd59dee72577a66b.png)
      repeat-x;
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
    label {
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

.breadcrumb {
  margin: 20px 0 30px 20px;
}
</style>
