<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  spot: { type: Object, required: true },
  category: { type: String, required: true },
})

const liked = ref(false)

function toggleLike() {
  liked.value = !liked.value
}
</script>

<template>
  <RouterLink
    :to="{ name: 'TourismDetail', params: { category, id: spot.id } }"
    class="spot-card"
  >
    <div class="spot-card__image-wrap">
      <img
        v-if="spot.image"
        :src="spot.image"
        :alt="spot.title"
        loading="lazy"
        class="spot-card__image"
      />
      <div v-else class="spot-card__image spot-card__image--empty">이미지 없음</div>
      <button
        class="spot-card__like"
        :class="{ 'spot-card__like--active': liked }"
        type="button"
        :aria-pressed="liked"
        aria-label="찜하기"
        @click.stop.prevent="toggleLike"
      >
        <svg viewBox="0 0 24 24" :fill="liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8">
          <path
            d="M12 20.5s-7.5-4.6-10-9.3C.5 8 2 4.5 5.3 4.5c2 0 3.4 1 4.7 2.7C11.3 5.5 12.7 4.5 14.7 4.5c3.3 0 4.8 3.5 3.3 6.7-2.5 4.7-10 9.3-10 9.3Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div class="spot-card__body">
      <h3 class="spot-card__title">{{ spot.title }}</h3>
      <p class="spot-card__address">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path
            d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"
            stroke-linejoin="round"
          />
          <circle cx="12" cy="9.5" r="2.2" />
        </svg>
        <span>{{ spot.address }}</span>
      </p>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.spot-card {
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

.spot-card__image-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  background: $color-bg-soft;
}

.spot-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spot-card__image--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-muted;
  font-size: 13px;
}

.spot-card__like {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: $radius-full;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text;

  svg {
    width: 18px;
    height: 18px;
  }

  &--active {
    color: #e11d48;
  }
}

.spot-card__body {
  padding: 14px 16px 16px;
}

.spot-card__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  @include truncate;
}

.spot-card__address {
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 13px;
  color: $color-text-muted;

  svg {
    width: 15px;
    height: 15px;
    flex: 0 0 auto;
    margin-top: 1px;
  }

  span {
    @include truncate;
  }
}
</style>
