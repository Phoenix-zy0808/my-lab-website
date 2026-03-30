<script setup lang="ts">
defineOptions({ name: 'NotFoundPage' })
</script>

<template>
  <div class="bg-gray-50 flex min-h-screen items-center justify-center">
    <div class="px-4 text-center">
      <h1 class="text-6xl text-primary font-bold mb-4">
        404
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        页面未找到
      </p>
      <RouterLink to="/" btn>
        返回首页
      </RouterLink>
    </div>
  </div>
</template>
