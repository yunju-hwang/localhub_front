<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="static-page">
    <h1>{{ title }}</h1>
    <p>준비 중인 페이지입니다.</p>
  </div>
</template>

<style scoped>
.static-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 64px 24px;
  text-align: center;
}
</style>
