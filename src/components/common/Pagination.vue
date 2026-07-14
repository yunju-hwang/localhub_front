<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['change'])

const pages = computed(() => {
  const windowSize = 5
  const start = Math.max(1, props.currentPage - Math.floor(windowSize / 2))
  const end = Math.min(props.totalPages, start + windowSize - 1)
  const adjustedStart = Math.max(1, end - windowSize + 1)
  const list = []
  for (let i = adjustedStart; i <= end; i++) list.push(i)
  return list
})

function go(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('change', page)
}
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination">
    <button type="button" class="pagination__nav" :disabled="currentPage === 1" @click="go(currentPage - 1)">
      ‹
    </button>
    <button
      v-for="page in pages"
      :key="page"
      type="button"
      class="pagination__page"
      :class="{ 'pagination__page--active': page === currentPage }"
      @click="go(page)"
    >
      {{ page }}
    </button>
    <button
      type="button"
      class="pagination__nav"
      :disabled="currentPage === totalPages"
      @click="go(currentPage + 1)"
    >
      ›
    </button>
  </nav>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.pagination__page,
.pagination__nav {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  background: $color-white;
  color: $color-text;
  font-size: 14px;

  &:disabled {
    opacity: 0.4;
  }
}

.pagination__page--active {
  background: $color-navy;
  border-color: $color-navy;
  color: $color-white;
}
</style>
