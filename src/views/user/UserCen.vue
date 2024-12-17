<template>
  <div class="profile-container">
    <div class="profile-content">
      <div class="profile-image-section">
        <img
          :src="`${baseUrl}${infoValidateForm.zhaopian}`"
          alt="Profile Picture"
          class="profile-image"
        />
        <h1 class="profile-name">{{ userInfo.zhanghao }}</h1>
        <p class="profile-title">{{ userInfo.xingming }}</p>
      </div>
      <div class="profile-info-section">
        <el-form ref="formRef" :model="infoValidateForm" class="form-layout">
          <div class="tt">
            <h2 class="section-title">个人信息</h2>
            <el-button @click.prevent="onSubmit(formRef)" class="edit-button"
              >修改</el-button
            >
          </div>
          <div>
            <el-form-item label="账号" class="form-item" required>
              <el-input
                v-model="infoValidateForm.zhanghao"
                placeholder="账号"
                required
                disabled
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
          <div>
            <el-form-item label="姓名" class="form-item">
              <el-input
                v-model="infoValidateForm.xingming"
                placeholder="姓名"
                required
              />
            </el-form-item>
            <el-form-item label="性别">
              <el-select
                v-model="infoValidateForm.xingbie"
                placeholder="选择性别"
                required
              >
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="电话" class="form-item">
              <el-input
                v-model="infoValidateForm.lianxidianhua"
                placeholder="电话"
                required
              />
            </el-form-item>
            <el-form-item label="年龄" class="form-item">
              <el-input
                v-model="infoValidateForm.nianling"
                placeholder="年龄"
                required
              ></el-input>
            </el-form-item>
            <el-form-item label="就诊卡号" class="form-item">
              <el-input
                v-model="infoValidateForm.jiuzhenkahao"
                placeholder="就诊卡号"
                required
                disabled
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="就诊余额" class="form-item">
              <el-input
                v-model="infoValidateForm.jine"
                placeholder="就诊余额"
                required
                disabled
              />
              <span class="chongzhi" @click="czFormVisible = true"
                ><RiExchangeCnyFill size="20" color="red" />用户充值</span
              >
            </el-form-item>
          </div>
          <div>
            <el-form-item label="症状描述" class="form-item">
              <el-input
                v-model="infoValidateForm.zhengzhuangmiaoshu"
                placeholder="症状"
                required
              ></el-input>
            </el-form-item>
            <el-form-item label="上传照片" class="form-item">
              <el-upload
                class="upload-demo"
                drag
                :action="`${baseUrl}/file/upload`"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleUpdateImage"
              >
                <img
                  :style="{
                    border: '1px dashed #999',
                    cursor: 'pointer',
                    color: '#999',
                    borderRadius: '6px',
                    textAlign: 'center',
                    background: '#f9f9f9',
                    width: '200px',
                    fontSize: '32px',
                    lineHeight: '100px',
                    height: 'auto',
                  }"
                  v-if="infoValidateForm.zhaopian"
                  :src="`${baseUrl}${infoValidateForm.zhaopian}`"
                  class="avatar"
                />

                <i class="el-icon-upload"></i>
                <div class="el-upload__text">点击上传</div>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 弹窗 add -->
    <el-dialog v-model="czFormVisible" title="充值" width="500">
      <el-form ref="czformRef" :model="czform">
        <el-form-item label="充值余额" >
          <el-input v-model="czform.jine" autocomplete="off" type="number" />
        </el-form-item>
      </el-form>
      <!-- 付款方式 -->
      <el-form-item label="" >
        <div class="image-options">
          <span
            v-for="(image, index) in images"
            :key="index"
            class="image-label"
          >
            <input
              type="radio"
              name="selectedImage"
              :value="image"
              v-model="czform.selectedImage"
            />
            <img :src="image" :alt="'图片' + (index + 1)" />
          </span>
        </div>
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="czFormVisible = false">取消</el-button>
          <el-button type="danger" @click="onChargeSubmit(czformRef)">
            充值
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { getSession, fetchUpdateUserInfo } from "@/services/headerServices";
import { fetchCharge } from "@/services/backUserServices";
import { baseUrl } from "@/utils/util";
import moment from "moment";

import { PiEyeBold, PiEyeClosed } from "vue3-icons/pi";
import { RiExchangeCnyFill } from "vue3-icons/ri";
import jianshe from "@/assets/img/charge/jianshe.png";
import jiaotong from "@/assets/img/charge/jiaotong.png";
import nongye from "@/assets/img/charge/nongye.png";
import zhongguo from "@/assets/img/charge/zhongguo.png";
import weixin from "@/assets/img/charge/weixin.png";
import zhifubao from "@/assets/img/charge/zhifubao.png";
// 图片数组
const images = [jianshe, jiaotong, nongye, zhongguo, weixin, zhifubao];
// 响应式数据
const userInfo = ref({});

const formRef = ref();
const infoValidateForm = reactive({
  id: "",
  addtime: "",
  zhanghao: "",
  mima: "",
  xingming: "",
  xingbie: "",
  lianxidianhua: "",
  nianling: 0,
  jine: 0,
  zhengzhuangmiaoshu: "",
  zhaopian: null,
  jiuzhenkahao: "",
});
const czformRef = ref();
const czFormVisible = ref(false);
const czform = reactive({
  jine: "",
});

// 控制密码显示/隐藏的状态
const isPasswordVisible = ref(false);
// 切换密码可见性
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// 异步获取数据
const fetchData = async () => {
  try {
    userInfo.value = await getSession();
    console.log(userInfo);
    // 回显数据到表单
    infoValidateForm.id = userInfo.value.id || "";
    infoValidateForm.addtime = userInfo.value.addtime || "";
    infoValidateForm.zhanghao = userInfo.value.zhanghao || "";
    infoValidateForm.mima = userInfo.value.mima || "";
    infoValidateForm.xingming = userInfo.value.xingming || "";
    infoValidateForm.xingbie = userInfo.value.xingbie || "";
    infoValidateForm.lianxidianhua = userInfo.value.lianxidianhua || "";
    infoValidateForm.jiuzhenkahao = userInfo.value.jiuzhenkahao || "";
    infoValidateForm.nianling = Number(userInfo.value.nianling) || 0;
    infoValidateForm.jine = Number(userInfo.value.jine) || 0;
    infoValidateForm.zhaopian = userInfo.value.zhaopian || null;

    infoValidateForm.zhengzhuangmiaoshu =
      userInfo.value.zhengzhuangmiaoshu || "";
  } catch (error) {
    console.error("Error fetching:", error);
  }
};

//修改
const onSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(infoValidateForm);

      // // 发送请求
      const res = await fetchUpdateUserInfo(infoValidateForm);
      if (res === 0) {
        ElMessage({
          message: "更新成功",
          type: "success",
        });
        userInfo.value = await getSession();
      }
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 上传图片成功后回调
const handleUpdateImage = (response) => {
  // 假设后端返回图片的URL
  const imageUrl = `upload/${response.file}`; // 修改为实际的返回路径字段
  console.log(imageUrl);

  infoValidateForm.zhaopian = imageUrl; // 更新表单中的图片路径

  // 提示用户上传成功
  ElMessage({
    message: "图片上传成功",
    type: "success",
  });
};

//充值
const onChargeSubmit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      const params = {
        chongzhishijian: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
        jine: czform.jine,
        jiuzhenkahao: infoValidateForm.jiuzhenkahao,
        xingming: infoValidateForm.xingming,
        zhanghao: infoValidateForm.zhanghao,
      };
      // console.log(params)
      const msg = await fetchCharge(params, {
        ...infoValidateForm,
        jine: Number(czform.jine) + infoValidateForm.jine,
      });
      if (msg == 0) {
        ElMessage({
          message: "充值成功",
          type: "success",
        });
        //
        czFormVisible.value = false;
        //更新
        await fetchData();
      } else {
        ElMessage({
          message: "充值失败",
          type: "error",
        });
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
// 在组件挂载时调用 fetchData
onMounted(fetchData);
</script>

<style lang="scss" scoped>
.form-layout {
  .tt {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
  }
}

.profile-container {
  margin: 0 auto;
  border-radius: 1rem;
  max-width: 1200px;
  width: 80%;
  padding: 2rem;
  transition: all 0.3s ease;
  animation: fade-in 0.5s ease-out;
  :deep(.el-form-item__label) {
    min-width: 80px;
  }
}
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 20px 20px 0;
  color: #4c51bf;
}

.profile-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.profile-image-section {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-image {
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  border: 4px solid #4c51bf;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.profile-image:hover {
  transform: scale(1.05);
}

.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4c51bf;
  margin-top: 1rem;
}

.profile-title {
  color: #718096;
  margin-top: 0.5rem;
}

.edit-button {
  background-color: #4c51bf;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #434190;
}

.profile-info-section {
  flex-grow: 1;
}

.profile-description {
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.skill-chip {
  background-color: #e2e8f0;
  color: #4c51bf;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #4a5568;
}

.contact-item svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: #4c51bf;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.chongzhi {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  cursor: pointer;
  &:hover {
    color: #bb85df;
    font-weight: 600;
  }
}
.image-options {
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.image-label {
  display: flex;
  width: 120px;
  align-items: center;
  img {
    width: 100%;
  }
}
</style>
