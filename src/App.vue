<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ChatWidget from '@/features/chatbot/components/ChatWidget.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-shell__main">
      <RouterView />
    </main>
    <AppFooter />
    <ChatWidget />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell__main {
  flex: 1;
}
</style>
