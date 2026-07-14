<script setup>
import SpotCard from './SpotCard.vue'

defineProps({
  spots: { type: Array, required: true },
  category: { type: String, required: true },
})
</script>

<template>
  <div class="spot-grid">
    <SpotCard v-for="spot in spots" :key="spot.id" :spot="spot" :category="category" />
  </div>
</template>

<style scoped>
.spot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 960px) {
  .spot-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .spot-grid {
    grid-template-columns: 1fr;
  }
}
</style>
