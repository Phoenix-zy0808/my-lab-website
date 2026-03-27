<script setup lang="ts">
// 全局样式和布局
</script>

<template>
  <div min-h-screen flex flex-col bg-white>
    <Header />
    <main flex-1>
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>

<style>
/* 全局样式 */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
}

/* 隐藏滚动条但保留功能（可选） */
/*
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #578b9e;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3d6f82;
}
*/
</style>
