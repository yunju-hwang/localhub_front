<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="app-header__brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Busan Tour</span>
      </RouterLink>
      <nav class="app-header__nav">
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

  svg {
    width: 22px;
    height: 22px;
    color: $color-navy;
  }
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
