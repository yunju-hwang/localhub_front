<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTourismStore } from '@/features/tourism/store'
import CategoryTabs from '@/features/tourism/components/CategoryTabs.vue'
import SpotGrid from '@/features/tourism/components/SpotGrid.vue'

const router = useRouter()
const tourism = useTourismStore()

const activeKey = ref('attraction')
const searchTerm = ref('')

onMounted(() => tourism.fetchAll())

function selectCategory(key) {
  activeKey.value = key
  tourism.fetchCategory(key)
}

const featuredSpots = computed(() => tourism.itemsOf(activeKey.value).slice(0, 4))

function goToFullList() {
  router.push({ name: 'TourismList', params: { category: activeKey.value } })
}

function handleSearch() {
  if (!searchTerm.value.trim()) return
  router.push({ name: 'TourismList', params: { category: activeKey.value } })
}

// 프로모션 섹션 이미지는 실제 축제/문화시설 데이터에서 가져온다.
const promoImages = computed(() => {
  const festival = tourism.itemsOf('festival').find((item) => item.image)
  const culture = tourism.itemsOf('culture').find((item) => item.image)
  return [festival, culture].filter(Boolean)
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero__overlay">
        <h1>Explore the Dynamic Busan</h1>
        <form class="hero__search" @submit.prevent="handleSearch">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="오늘은 어디로 떠나고 싶으신가요?"
          />
        </form>
      </div>
    </section>

    <section class="section section--tabs">
      <CategoryTabs
        :categories="tourism.categories"
        :active-key="activeKey"
        :count-of="tourism.totalOf"
        @select="selectCategory"
      />
    </section>

    <section class="section section--featured">
      <div class="section__header">
        <div>
          <h2>꼭 가봐야 할 명소</h2>
          <p>부산의 영혼을 느낄 수 있는 대표적인 여행지들을 만나보세요.</p>
        </div>
        <button type="button" class="link-button" @click="goToFullList">전체 보기 ›</button>
      </div>

      <p v-if="tourism.errorOf(activeKey)" class="section__status">
        데이터를 불러오지 못했습니다: {{ tourism.errorOf(activeKey) }}
      </p>
      <p v-else-if="tourism.isLoading(activeKey)" class="section__status">불러오는 중...</p>
      <SpotGrid v-else :spots="featuredSpots" :category="activeKey" />
    </section>

    <section class="promo">
      <div class="promo__inner">
        <div class="promo__text">
          <span class="promo__badge">Discovery Busan</span>
          <h2>Experience the Magic of Busan</h2>
          <p>
            Discover breathtaking ocean views, vibrant cultural villages, and a culinary paradise
            that never sleeps. Your ultimate journey begins here in Korea's most dynamic coastal
            city.
          </p>
          <div class="promo__social">
            <div class="promo__avatars">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>12,000+ travelers visited this month</span>
          </div>
        </div>
        <div class="promo__images">
          <img
            v-for="img in promoImages"
            :key="img.id"
            :src="img.image"
            :alt="img.title"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.home {
  display: flex;
  flex-direction: column;
}

.hero {
  position: relative;
  height: 420px;
  background: linear-gradient(135deg, #0f2942 0%, #2a5f8f 45%, #e8a856 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__overlay {
  width: 100%;
  max-width: 640px;
  padding: 0 24px;
  text-align: center;
  color: $color-white;

  h1 {
    font-size: 42px;
    margin: 0 0 28px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
}

.hero__search {
  input {
    width: 100%;
    padding: 18px 24px;
    border: none;
    border-radius: $radius-full;
    font-size: 15px;
    background: rgba(255, 255, 255, 0.95);
    text-align: center;
    outline: none;
  }
}

.section {
  @include container;
  padding-top: 40px;
  padding-bottom: 8px;
}

.section--tabs {
  padding-top: 32px;
}

.section--featured {
  padding-bottom: 56px;
}

.section__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;

  h2 {
    margin: 0 0 6px;
    font-size: 22px;
  }

  p {
    margin: 0;
    color: $color-text-muted;
    font-size: 14px;
  }
}

.section__status {
  color: $color-text-muted;
}

.link-button {
  background: none;
  border: none;
  color: $color-navy;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.promo {
  background: $color-promo-bg;
  padding: 72px 24px;
}

.promo__inner {
  max-width: $max-width;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 48px;
}

.promo__text {
  flex: 1;
  min-width: 280px;
}

.promo__badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.6);
  color: $color-navy;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: $radius-full;
  margin-bottom: 16px;
}

.promo__text h2 {
  font-size: 34px;
  margin: 0 0 16px;
  color: $color-navy;
}

.promo__text p {
  color: #33415c;
  line-height: 1.6;
  margin: 0 0 24px;
}

.promo__social {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #33415c;
}

.promo__avatars {
  display: flex;

  span {
    width: 32px;
    height: 32px;
    border-radius: $radius-full;
    background: $color-navy-light;
    border: 2px solid $color-promo-bg;
    margin-left: -10px;

    &:first-child {
      margin-left: 0;
    }
  }
}

.promo__images {
  flex: 1;
  min-width: 280px;
  display: flex;
  gap: 16px;

  img {
    flex: 1;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: $radius-lg;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);

    &:nth-child(2) {
      margin-top: 32px;
    }
  }
}

@media (max-width: 800px) {
  .promo__inner {
    flex-direction: column;
  }

  .hero__overlay h1 {
    font-size: 30px;
  }
}
</style>
