<script setup>
import { computed, onMounted, ref, watch } from 'vue'
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
const searchInput = ref(route.query.q || '')

const allSpots = computed(() => tourism.itemsOf(activeKey.value))
const filteredSpots = computed(() => {
  const q = searchInput.value.trim().toLowerCase()
  if (!q) return allSpots.value
  return allSpots.value.filter(
    (spot) => spot.title.toLowerCase().includes(q) || spot.address.toLowerCase().includes(q),
  )
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredSpots.value.length / PAGE_SIZE)))
const pagedSpots = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredSpots.value.slice(start, start + PAGE_SIZE)
})

function load(category) {
  tourism.fetchCategory(category)
}

onMounted(() => load(activeKey.value))
watch(activeKey, (key) => load(key))

function selectCategory(key) {
  router.push({
    name: 'TourismList',
    params: { category: key },
    query: searchInput.value ? { q: searchInput.value } : {},
  })
}

function goToPage(page) {
  router.push({ name: 'TourismList', params: { category: activeKey.value }, query: { ...route.query, page } })
}

// 검색어가 바뀌면 페이지는 1로 리셋하고, URL에도 반영해서 새로고침/공유해도 유지되게 한다.
watch(searchInput, (q) => {
  router.replace({
    name: 'TourismList',
    params: { category: activeKey.value },
    query: q ? { q } : {},
  })
})

watch(
  () => route.query.q,
  (q) => {
    if ((q || '') !== searchInput.value) searchInput.value = q || ''
  },
)
</script>

<template>
  <div class="tourism-list">
    <CategoryTabs
      :categories="tourism.categories"
      :active-key="activeKey"
      :count-of="tourism.totalOf"
      @select="selectCategory"
    />

    <div class="tourism-list__search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" stroke-linecap="round" />
      </svg>
      <input v-model="searchInput" type="text" placeholder="장소명이나 주소로 검색..." />
    </div>

    <p v-if="tourism.errorOf(activeKey)" class="tourism-list__error">
      데이터를 불러오지 못했습니다: {{ tourism.errorOf(activeKey) }}
    </p>
    <p v-else-if="tourism.isLoading(activeKey)" class="tourism-list__status">불러오는 중...</p>
    <template v-else-if="!filteredSpots.length">
      <p class="tourism-list__status">'{{ searchInput }}'에 대한 검색 결과가 없습니다.</p>
    </template>
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

.tourism-list__search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  background: $color-white;
  max-width: 420px;

  svg {
    width: 18px;
    height: 18px;
    color: $color-text-muted;
    flex: 0 0 auto;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
  }
}
</style>
