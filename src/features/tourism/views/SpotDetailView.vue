<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTourismStore } from '../store'
import { CATEGORIES } from '../constants'

const route = useRoute()
const tourism = useTourismStore()

const category = computed(() => route.params.category)
const categoryLabel = computed(
  () => CATEGORIES.find((c) => c.key === category.value)?.label || category.value,
)
const spot = computed(() =>
  tourism.itemsOf(category.value).find((item) => item.id === route.params.id),
)

onMounted(() => tourism.fetchCategory(category.value))
</script>

<template>
  <div class="spot-detail">
    <RouterLink :to="{ name: 'TourismList', params: { category } }" class="spot-detail__back">
      ‹ {{ categoryLabel }} 목록으로
    </RouterLink>

    <template v-if="spot">
      <img v-if="spot.image" :src="spot.image" :alt="spot.title" class="spot-detail__image" />
      <h1>{{ spot.title }}</h1>
      <p class="spot-detail__address">{{ spot.address }}</p>
      <p v-if="spot.tel">전화: {{ spot.tel }}</p>
    </template>
    <p v-else-if="tourism.isLoading(category)">정보를 불러오는 중입니다.</p>
    <p v-else-if="tourism.errorOf(category)">
      데이터를 불러오지 못했습니다: {{ tourism.errorOf(category) }}
    </p>
    <p v-else>해당 정보를 찾을 수 없습니다.</p>
  </div>
</template>

<style scoped>
.spot-detail {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.spot-detail__back {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
  color: #6b7280;
}

.spot-detail__address {
  color: #6b7280;
}

.spot-detail__image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 16px;
}
</style>
