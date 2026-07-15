<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTourismStore } from '../store'
import { CATEGORIES } from '../constants'
import { getTourismDetail } from '@/api/tourism'
import { haversineDistance, estimateWalkMinutes } from '@/utils/geo'
import KakaoMap from '@/components/common/KakaoMap.vue'

const route = useRoute()
const tourism = useTourismStore()

const category = computed(() => route.params.category)
const categoryMeta = computed(() => CATEGORIES.find((c) => c.key === category.value))
const categoryLabel = computed(() => categoryMeta.value?.label || category.value)

const spot = computed(() =>
  tourism.itemsOf(category.value).find((item) => item.id === route.params.id),
)

onMounted(() => tourism.fetchAll())

const detail = ref(null)
const detailLoading = ref(false)

async function loadDetail() {
  if (!spot.value || !categoryMeta.value) return
  detailLoading.value = true
  detail.value = null
  try {
    detail.value = await getTourismDetail(spot.value.id, categoryMeta.value.contentTypeId)
  } catch {
    detail.value = null
  } finally {
    detailLoading.value = false
  }
}

watch(
  spot,
  (value) => {
    if (value) loadDetail()
  },
  { immediate: true },
)

const nearbySpots = computed(() => {
  if (!spot.value?.lat || !spot.value?.lng) return []

  const candidates = []
  for (const cat of CATEGORIES) {
    for (const item of tourism.itemsOf(cat.key)) {
      if (!item.lat || !item.lng) continue
      if (item.id === spot.value.id && cat.key === category.value) continue
      candidates.push({ ...item, categoryKey: cat.key })
    }
  }

  return candidates
    .map((item) => ({
      ...item,
      distance: haversineDistance(spot.value.lat, spot.value.lng, item.lat, item.lng),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4)
})
</script>

<template>
  <div class="spot-detail">
    <RouterLink :to="{ name: 'TourismList', params: { category } }" class="spot-detail__back">
      ‹ {{ categoryLabel }} 목록으로
    </RouterLink>

    <template v-if="spot">
      <img v-if="spot.image" :src="spot.image" :alt="spot.title" class="spot-detail__image" />
      <h1>{{ spot.title }}</h1>
      <p class="spot-detail__address">📍 {{ spot.address }}</p>

      <div class="detail-grid">
        <section class="panel">
          <h2 class="panel__title">ⓘ 소개</h2>
          <p v-if="detailLoading" class="panel__status">불러오는 중...</p>
          <p v-else-if="detail?.overview" class="panel__overview">{{ detail.overview }}</p>
          <p v-else class="panel__status">등록된 소개 정보가 없습니다.</p>
        </section>

        <div class="detail-grid__side">
          <section class="panel">
            <h2 class="panel__title">위치 안내</h2>
            <KakaoMap v-if="spot.lat && spot.lng" :lat="spot.lat" :lng="spot.lng" :title="spot.title" />
          </section>

          <section
            v-if="detail && (detail.hours || detail.contact || detail.homepage || spot.tel)"
            class="panel"
          >
            <h2 class="panel__title">운영정보</h2>
            <p v-if="detail.hours" class="panel__row">🕐 {{ detail.hours }}</p>
            <p v-if="detail.rest_date" class="panel__row">🚫 {{ detail.rest_date }}</p>
            <p v-if="detail.contact || spot.tel" class="panel__row">☎ {{ detail.contact || spot.tel }}</p>
            <a
              v-if="detail.homepage"
              :href="detail.homepage"
              target="_blank"
              rel="noopener"
              class="panel__link"
            >
              🌐 공식 웹사이트 방문
            </a>
          </section>
        </div>
      </div>

      <section v-if="nearbySpots.length" class="nearby">
        <h2 class="nearby__title">주변 가볼만한 곳</h2>
        <div class="nearby__grid">
          <RouterLink
            v-for="item in nearbySpots"
            :key="`${item.categoryKey}-${item.id}`"
            :to="{ name: 'TourismDetail', params: { category: item.categoryKey, id: item.id } }"
            class="nearby-card"
          >
            <img v-if="item.image" :src="item.image" :alt="item.title" class="nearby-card__image" />
            <div v-else class="nearby-card__image nearby-card__image--empty"></div>
            <p class="nearby-card__title">{{ item.title }}</p>
            <p class="nearby-card__meta">도보 {{ estimateWalkMinutes(item.distance) }}분</p>
          </RouterLink>
        </div>
      </section>
    </template>
    <p v-else-if="tourism.isLoading(category)">정보를 불러오는 중입니다.</p>
    <p v-else-if="tourism.errorOf(category)">
      데이터를 불러오지 못했습니다: {{ tourism.errorOf(category) }}
    </p>
    <p v-else>해당 정보를 찾을 수 없습니다.</p>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.spot-detail {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.spot-detail__back {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
  color: $color-text-muted;
}

.spot-detail__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: $radius-lg;
  margin-bottom: 20px;
}

h1 {
  margin: 0 0 8px;
  font-size: 26px;
}

.spot-detail__address {
  color: $color-text-muted;
  font-size: 14px;
  margin: 0 0 28px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}

.detail-grid__side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel {
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 24px;
}

.panel__title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 700;
  color: $color-navy;
}

.panel__overview {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: $color-text;
  white-space: pre-wrap;
}

.panel__status {
  margin: 0;
  font-size: 13px;
  color: $color-text-muted;
}

.panel__row {
  margin: 0 0 10px;
  font-size: 13px;
  color: $color-text-muted;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.panel__link {
  display: inline-block;
  margin-top: 4px;
  font-size: 13px;
  color: $color-navy;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
}

.nearby {
  margin-top: 32px;
}

.nearby__title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
}

.nearby__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.nearby-card {
  display: block;
  color: $color-text;
}

.nearby-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: $radius-md;
  margin-bottom: 8px;
  background: $color-bg-soft;
}

.nearby-card__title {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 600;
  @include truncate;
}

.nearby-card__meta {
  margin: 0;
  font-size: 12px;
  color: $color-text-muted;
}

@media (max-width: 860px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .nearby__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
