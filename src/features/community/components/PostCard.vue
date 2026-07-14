<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatRelativeTime } from '@/utils/date'
import { formatCompactNumber } from '@/utils/format'

const props = defineProps({
  post: { type: Object, required: true },
})

const timeLabel = computed(() => formatRelativeTime(props.post.createdAt))
</script>

<template>
  <RouterLink :to="{ name: 'PostDetail', params: { id: post.id } }" class="post-card">
    <div class="post-card__image-wrap">
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        loading="lazy"
        class="post-card__image"
      />
      <div v-else class="post-card__image post-card__image--empty">이미지 없음</div>
    </div>
    <div class="post-card__body">
      <h3 class="post-card__title">{{ post.title }}</h3>
      <div class="post-card__meta">
        <span class="post-card__author">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
          </svg>
          {{ post.author }}
        </span>
        <span class="post-card__stats">
          <span>♡ {{ formatCompactNumber(post.likes) }}</span>
          <span>💬 {{ formatCompactNumber(post.comments) }}</span>
        </span>
      </div>
      <div class="post-card__footer">
        <span>{{ timeLabel }}</span>
        <span>👁 {{ formatCompactNumber(post.views) }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.post-card {
  display: flex;
  flex-direction: column;
  background: $color-white;
  border-radius: $radius-md;
  overflow: hidden;
  border: 1px solid $color-border;
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  }
}

.post-card__image-wrap {
  aspect-ratio: 16 / 10;
  background: $color-bg-soft;
}

.post-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card__image--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-muted;
  font-size: 13px;
}

.post-card__body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card__title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

.post-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: $color-text-muted;
}

.post-card__author {
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
  }
}

.post-card__stats {
  display: flex;
  gap: 10px;
}

.post-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: $color-text-muted;
  padding-top: 10px;
  border-top: 1px solid $color-border;
}
</style>
