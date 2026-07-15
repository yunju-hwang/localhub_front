<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useCommunityStore } from '../store'
import { categoryLabel } from '../constants'
import { formatRelativeTime } from '@/utils/date'
import { formatCompactNumber } from '@/utils/format'
import PasswordPrompt from '@/components/common/PasswordPrompt.vue'
import CommentSection from '../components/CommentSection.vue'

const route = useRoute()
const router = useRouter()
const community = useCommunityStore()

const post = computed(() => community.currentPost)

const pendingAction = ref(null) // 'edit' | 'delete' | null
const passwordError = ref('')
const verifying = ref(false)

watch(
  () => route.params.id,
  (id) => community.fetchPost(id),
  { immediate: true },
)

function requestEdit() {
  if (community.isUnlocked(post.value.id)) {
    router.push({ name: 'PostEdit', params: { id: post.value.id } })
    return
  }
  passwordError.value = ''
  pendingAction.value = 'edit'
}

function requestDelete() {
  passwordError.value = ''
  pendingAction.value = 'delete'
}

function cancelPasswordPrompt() {
  pendingAction.value = null
  passwordError.value = ''
}

async function submitPassword(password) {
  verifying.value = true
  const ok = await community.verifyPassword(post.value.id, password)
  verifying.value = false

  if (!ok) {
    passwordError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  if (pendingAction.value === 'edit') {
    pendingAction.value = null
    router.push({ name: 'PostEdit', params: { id: post.value.id } })
  } else if (pendingAction.value === 'delete') {
    await community.deletePost(post.value.id)
    pendingAction.value = null
    router.push({ name: 'CommunityList' })
  }
}

function toggleLike() {
  community.likePost(post.value.id)
}
</script>

<template>
  <div class="post-detail">
    <RouterLink :to="{ name: 'CommunityList' }" class="post-detail__back">‹ 커뮤니티 목록으로</RouterLink>

    <template v-if="post">
      <span class="post-detail__category">{{ categoryLabel(post.category) }}</span>
      <h1>{{ post.title }}</h1>
      <div class="post-detail__meta">
        <span class="post-detail__author">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
          </svg>
          {{ post.author }}
        </span>
        <span>{{ formatRelativeTime(post.created_at) }}</span>
        <span>👁 {{ formatCompactNumber(post.views) }}</span>
      </div>

      <img v-if="post.image" :src="post.image" :alt="post.title" class="post-detail__image" />

      <p class="post-detail__content">{{ post.content }}</p>

      <div class="post-detail__actions">
        <button
          type="button"
          class="post-detail__like"
          :class="{ 'post-detail__like--active': post.is_liked }"
          @click="toggleLike"
        >
          {{ post.is_liked ? '♥' : '♡' }} 좋아요 {{ formatCompactNumber(post.likes) }}
        </button>
        <div class="post-detail__manage">
          <button type="button" class="post-detail__edit" @click="requestEdit">수정</button>
          <button type="button" class="post-detail__delete" @click="requestDelete">삭제</button>
        </div>
      </div>

      <CommentSection :post-id="post.id" />
    </template>
    <p v-else>게시글을 찾을 수 없습니다.</p>

    <PasswordPrompt
      v-if="pendingAction"
      :title="pendingAction === 'delete' ? '삭제하려면 비밀번호를 입력하세요' : '수정하려면 비밀번호를 입력하세요'"
      :error="passwordError"
      :submitting="verifying"
      @submit="submitPassword"
      @cancel="cancelPasswordPrompt"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.post-detail {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.post-detail__back {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
  color: $color-text-muted;
}

.post-detail__category {
  display: inline-block;
  background: $color-bg-soft;
  color: $color-navy;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: $radius-full;
  margin-bottom: 12px;
}

.post-detail h1 {
  margin: 0 0 16px;
  font-size: 28px;
}

.post-detail__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: $color-text-muted;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid $color-border;
}

.post-detail__author {
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
  }
}

.post-detail__image {
  width: 100%;
  border-radius: $radius-md;
  margin-bottom: 24px;
}

.post-detail__content {
  font-size: 15px;
  line-height: 1.8;
  color: $color-text;
  white-space: pre-wrap;
}

.post-detail__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid $color-border;
}

.post-detail__like {
  border: 1px solid $color-border;
  border-radius: $radius-full;
  padding: 8px 18px;
  background: $color-white;
  font-size: 14px;
}

.post-detail__like--active {
  border-color: #e11d48;
  color: #e11d48;
}

.post-detail__manage {
  display: flex;
  gap: 10px;
}

.post-detail__edit,
.post-detail__delete {
  padding: 8px 16px;
  border-radius: $radius-sm;
  font-size: 13px;
  border: 1px solid $color-border;
  background: $color-white;
  color: $color-text;
}

.post-detail__delete {
  color: #e11d48;
  border-color: #fecdd3;
}
</style>
