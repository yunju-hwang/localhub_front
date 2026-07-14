<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTourismStore } from '../store'
import CategoryTabs from '../components/CategoryTabs.vue'
import SpotGrid from '../components/SpotGrid.vue'
import Pagination from '@/components/common/Pagination.vue'

const PAGE_SIZE = 8

const route = useRoute()
const router = useRouter()
const tourism = useTourismStore()

const activeKey = computed(() => route.params.category)
const currentPage = computed(() => Number(route.query.page) || 1)

const allSpots = computed(() => tourism.itemsOf(activeKey.value))
const totalPages = computed(() => Math.max(1, Math.ceil(allSpots.value.length / PAGE_SIZE)))
const pagedSpots = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return allSpots.value.slice(start, start + PAGE_SIZE)
})

function load(category) {
  tourism.fetchCategory(category)
}

onMounted(() => load(activeKey.value))
watch(activeKey, (key) => load(key))

function selectCategory(key) {
  router.push({ name: 'TourismList', params: { category: key } })
}

function goToPage(page) {
  router.push({ name: 'TourismList', params: { category: activeKey.value }, query: { page } })
}
</script>

<template>
  <div class="tourism-list">
    <CategoryTabs
      :categories="tourism.categories"
      :active-key="activeKey"
      :count-of="tourism.totalOf"
      @select="selectCategory"
    />

    <p v-if="tourism.errorOf(activeKey)" class="tourism-list__error">
      데이터를 불러오지 못했습니다: {{ tourism.errorOf(activeKey) }}
    </p>
    <p v-else-if="tourism.isLoading(activeKey)" class="tourism-list__status">불러오는 중...</p>
    <template v-else>
      <SpotGrid :spots="pagedSpots" :category="activeKey" />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="goToPage"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.tourism-list {
  @include container;
  padding-top: 32px;
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tourism-list__status,
.tourism-list__error {
  color: $color-text-muted;
}
</style>
