<template>
  <div>
    <HeaderComponent />
    <!-- 页头 -->
    <main class="app-main">
      <router-view />
      <!-- 子路由渲染区域 -->
    </main>
    <FooterComponent />
    <!-- 页脚 -->
  </div>
</template>

<script>
import HeaderComponent from "@/components/layout/Header.vue";
import FooterComponent from "@/components/layout/Footer.vue";

export default {
  components: {
    HeaderComponent,
    FooterComponent,
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  // margin: 0 30px;
}
</style>
