<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommunityStore } from '../store'
import { POST_CATEGORIES } from '../constants'
import PostCard from '../components/PostCard.vue'
import Pagination from '@/components/common/Pagination.vue'

const PAGE_SIZE = 6

const route = useRoute()
const router = useRouter()
const community = useCommunityStore()

const searchInput = ref('')
const activeCategory = ref('all')

onMounted(() => {
  community.init()
  searchInput.value = route.query.q || ''
})

const currentPage = computed(() => Number(route.query.page) || 1)

const filteredPosts = computed(() => community.filtered(activeCategory.value, searchInput.value))
const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / PAGE_SIZE)))
const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredPosts.value.slice(start, start + PAGE_SIZE)
})

watch([activeCategory, searchInput], () => {
  router.replace({ name: 'CommunityList', query: {} })
})

function selectCategory(key) {
  activeCategory.value = key
}

function goToPage(page) {
  router.push({ name: 'CommunityList', query: { page } })
}

function goToWrite() {
  router.push({ name: 'PostWrite' })
}
</script>

<template>
  <div class="community">
    <section class="hero">
      <div class="hero__overlay">
        <h1>Busan Community</h1>
        <p>부산 여행의 팁과 숨겨진 명소를 이웃들과 함께 나눠보세요.</p>
      </div>
    </section>

    <div class="toolbar">
      <div class="toolbar__search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" stroke-linecap="round" />
        </svg>
        <input v-model="searchInput" type="text" placeholder="게시글 검색..." />
      </div>
      <button type="button" class="toolbar__write" @click="goToWrite">✎ 글쓰기</button>
    </div>

    <nav class="filters">
      <button
        v-for="cat in POST_CATEGORIES"
        :key="cat.key"
        type="button"
        class="filters__pill"
        :class="{ 'filters__pill--active': cat.key === activeCategory }"
        @click="selectCategory(cat.key)"
      >
        {{ cat.label }}
      </button>
    </nav>

    <p v-if="!pagedPosts.length" class="community__empty">게시글이 없습니다.</p>
    <div v-else class="post-grid">
      <PostCard v-for="post in pagedPosts" :key="post.id" :post="post" />
    </div>

    <Pagination :current-page="currentPage" :total-pages="totalPages" @change="goToPage" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.community {
  @include container;
  padding-top: 32px;
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hero {
  margin: 0 -24px;
  height: 260px;
  background:
    linear-gradient(180deg, rgba(10, 20, 35, 0.55) 0%, rgba(10, 20, 35, 0.75) 100%),
    url('https://tong.visitkorea.or.kr/cms/resource/77/3368477_image2_1.jpg') center / cover
      no-repeat;
  display: flex;
  align-items: flex-end;
  padding: 0 24px 32px;
}

.hero__overlay {
  color: $color-white;
  max-width: $max-width;
  margin: 0 auto;
  width: 100%;

  h1 {
    margin: 0 0 8px;
    font-size: 34px;
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
}

.toolbar {
  display: flex;
  gap: 16px;
}

.toolbar__search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background: $color-white;

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

.toolbar__write {
  padding: 0 22px;
  border: none;
  border-radius: $radius-md;
  background: $color-navy;
  color: $color-white;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters__pill {
  padding: 8px 18px;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  background: $color-white;
  color: $color-text-muted;
  font-size: 13px;
  font-weight: 500;
}

.filters__pill--active {
  background: $color-navy;
  border-color: $color-navy;
  color: $color-white;
}

.community__empty {
  text-align: center;
  color: $color-text-muted;
  padding: 48px 0;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 960px) {
  .post-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .post-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
  }
}
</style>
