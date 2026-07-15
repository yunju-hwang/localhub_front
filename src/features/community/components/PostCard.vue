<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatRelativeTime } from '@/utils/date'
import { formatCompactNumber } from '@/utils/format'
import { categoryLabel, categoryBadgeColor } from '../constants'

const props = defineProps({
  post: { type: Object, required: true },
})

const timeLabel = computed(() => formatRelativeTime(props.post.created_at))
const badge = computed(() => categoryBadgeColor(props.post.category))
const avatarInitial = computed(() => (props.post.author || '익명').charAt(0))
</script>

<template>
  <RouterLink :to="{ name: 'PostDetail', params: { id: post.id } }" class="post-card">
    <span class="post-card__badge" :style="{ background: badge.bg, color: badge.color }">
      {{ categoryLabel(post.category) }}
    </span>

    <h3 class="post-card__title">{{ post.title }}</h3>
    <p class="post-card__excerpt">{{ post.content }}</p>

    <div class="post-card__footer">
      <div class="post-card__author">
        <span class="post-card__avatar">{{ avatarInitial }}</span>
        <span class="post-card__author-name">{{ post.author }}</span>
        <span>•</span>
        <span>{{ timeLabel }}</span>
      </div>
      <div class="post-card__stats">
        <span>👁 {{ formatCompactNumber(post.views) }}</span>
        <span>♡ {{ formatCompactNumber(post.likes) }}</span>
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
  gap: 12px;
  background: $color-white;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  padding: 20px 22px;
  color: $color-text;
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  }
}

.post-card__badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: $radius-full;
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
}

.post-card__excerpt {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: $color-text-muted;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid $color-border;
  font-size: 12px;
  color: $color-text-muted;
}

.post-card__author {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.post-card__author-name {
  @include truncate;
  max-width: 90px;
}

.post-card__avatar {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: $color-bg-soft;
  color: $color-navy;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.post-card__stats {
  display: flex;
  gap: 10px;
  flex: 0 0 auto;
  white-space: nowrap;
}
</style>
