<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <div class="app-footer__brand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M3 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Busan Tour</span>
      </div>
      <p class="app-footer__partner">
        Information provided in partnership with the Korea Tourism Organization (한국관광공사)
      </p>
      <nav class="app-footer__links">
        <a href="https://www.data.go.kr/data/15101578/openapi.do" target="_blank" rel="noopener">
          출처: 한국관광공사 (TourAPI 4.0)
        </a>
        <a href="https://www.kogl.or.kr/info/licenseTypeView.do?licenseType=3" target="_blank" rel="noopener">
          License Information
        </a>
        <RouterLink to="/privacy">Privacy Policy</RouterLink>
        <RouterLink to="/terms">Terms of Service</RouterLink>
        <RouterLink to="/contact">Contact Us</RouterLink>
      </nav>
      <p class="app-footer__copyright">© {{ year }} Busan Metropolitan City. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.app-footer {
  border-top: 1px solid $color-border;
  background: $color-white;
  padding: 40px 24px 32px;
}

.app-footer__inner {
  max-width: $max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
}

.app-footer__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;

  svg {
    width: 20px;
    height: 20px;
    color: $color-navy;
  }
}

.app-footer__partner {
  margin: 0;
  font-size: 13px;
  color: $color-text-muted;
}

.app-footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  font-size: 13px;
  color: $color-text-muted;

  a:hover {
    color: $color-navy;
  }
}

.app-footer__copyright {
  margin: 8px 0 0;
  font-size: 12px;
  color: $color-text-muted;
}
</style>
