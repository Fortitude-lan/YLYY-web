<template>
  <div class="pageM">
    <!-- title -->
    <div
      :style="{
        width: '100%',
        textAlign: 'center',
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
        客服
      </h1>
      <div class="dialog">
        <div class="chat-content" id="chat-content">
          <div v-bind:key="item.id" v-for="item in chatList">
            <div v-if="item.ask" class="right-content">
              <el-alert
                class="text-content"
                :title="item.ask"
                :closable="false"
                type="warning"
              ></el-alert>
            </div>
            <div v-else class="left-content">
              <el-alert
                class="text-content"
                :title="item.reply"
                :closable="false"
                type="success"
              ></el-alert>
            </div>
            <div class="clear-float"></div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-input
            v-model="form.ask"
            placeholder="请输入内容"
            style="width: calc(100% - 80px); float: left"
          >
          </el-input>
          <el-button type="primary" @click="addChat">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { fetchChat, fetchAddChat } from "@/services/headerServices";
// 反应式数据
const form = reactive({
  ask: "", // 用于用户输入的问题
});
const chatList = ref([]); // 聊天记录列表
// 获取聊天记录的异步函数
const getChatList = async () => {
  try {
    const res = await fetchChat();
    chatList.value = res || [];
    const div = document.getElementById("chat-content")[0];
    setTimeout(() => {
      if (div) div.scrollTop = div.scrollHeight;
    }, 0);
  } catch (error) {
    console.error("Error fetching chat list:", error);
  }
};
// 发送聊天内容的函数
const addChat = async () => {
  if (!form.ask) return; // 如果没有输入内容则不发送

  try {
    const response = await fetchAddChat(form.ask);

    if (response === 1) {
      form.ask = ""; // 清空输入框
      await getChatList(); // 重新加载聊天记录
    }
  } catch (error) {
    console.error("Error sending chat message:", error);
  }
};
let intervalId = ref(null);

// 页面加载时获取聊天记录
onMounted(async () => {
  intervalId.value = setInterval(async () => {
    await getChatList(); // 加载聊天记录
  }, 3000);
});
import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value); // 清除定时器
    intervalId.value = null;
  }
});
</script>

<style lang="scss" scoped>
.pageM {
  padding: 0 5%;
}
.dialog {
  width: 80%;
  margin: 20px auto;
}
.chat-content {
  padding-bottom: 20px;
  margin-bottom: 20px;
  max-height: 300px;
  height: 300px;
  overflow-y: scroll;
  border: 1px solid #eeeeee;
  background: url(https://tse1-mm.cn.bing.net/th/id/OIP-C.RMOXDWyWU2xO6lhOOMFrUgHaDp?rs=1&pid=ImgDetMain)
    no-repeat;
  background-size: cover;

  .left-content {
    float: left;
    margin-bottom: 10px;
    padding: 10px;
    max-width: 80%;
  }

  .right-content {
    float: right;
    margin-bottom: 10px;
    padding: 10px;
    max-width: 80%;
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
.clear-float {
  clear: both;
}
</style>
