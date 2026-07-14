<script setup>
import CategoryIcon from './CategoryIcon.vue'

defineProps({
  categories: { type: Array, required: true },
  activeKey: { type: String, required: true },
  countOf: { type: Function, required: true },
})

const emit = defineEmits(['select'])
</script>

<template>
  <nav class="tabs">
    <button
      v-for="cat in categories"
      :key="cat.key"
      class="tab"
      :class="{ 'tab--active': cat.key === activeKey }"
      type="button"
      @click="emit('select', cat.key)"
    >
      <span class="tab__icon">
        <CategoryIcon :category="cat.key" />
      </span>
      <span class="tab__label">
        {{ cat.label }}
        <span v-if="countOf(cat.key) !== null" class="tab__count">({{ countOf(cat.key) }})</span>
      </span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.tabs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 2px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 22px;
  min-width: 96px;
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  color: $color-text-muted;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.tab__icon {
  display: flex;
}

.tab__label {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.tab__count {
  font-weight: 400;
  opacity: 0.85;
}

.tab--active {
  background: $color-navy;
  border-color: $color-navy;
  color: $color-white;
}
</style>
