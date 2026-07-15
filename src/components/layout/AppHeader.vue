<script setup>
import { RouterLink } from 'vue-router'
import logo from '@/assets/logo.png'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="app-header__brand">
        <img :src="logo" alt="Busan Tour" class="app-header__logo" />
        <span>Busan Tour</span>
      </RouterLink>
      <nav class="app-header__nav">
        <RouterLink to="/festivals">축제 캘린더</RouterLink>
        <RouterLink to="/community">커뮤니티</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: $color-white;
  border-bottom: 1px solid $color-border;
}

.app-header__inner {
  height: $header-height;
  max-width: $max-width;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 17px;
  color: $color-text;
}

.app-header__logo {
  height: 44px;
  width: 44px;
  object-fit: contain;
}

.app-header__nav {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: $color-text;

  a {
    &:hover {
      color: $color-navy;
    }
  }
}
</style>
