<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { getComments, createComment, deleteComment } from '@/api/community'
import { formatRelativeTime } from '@/utils/date'
import { useCommunityStore } from '../store'
import PasswordPrompt from '@/components/common/PasswordPrompt.vue'

const props = defineProps({
  postId: { type: [String, Number], required: true },
})

const community = useCommunityStore()

const comments = ref([])
const loading = ref(false)
const loadError = ref('')

const form = reactive({ content: '', password: '' })
const submitting = ref(false)
const formError = ref('')

const pendingDeleteId = ref(null)
const deleteError = ref('')
const deleting = ref(false)

async function loadComments() {
  loading.value = true
  loadError.value = ''
  try {
    comments.value = await getComments(props.postId)
  } catch {
    loadError.value = '댓글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(loadComments)
watch(() => props.postId, loadComments)

async function submitComment() {
  formError.value = ''
  if (!form.content.trim()) return
  if (!form.password) {
    formError.value = '비밀번호를 입력하세요.'
    return
  }

  submitting.value = true
  try {
    await createComment(props.postId, { content: form.content, password: form.password })
    form.content = ''
    form.password = ''
    await loadComments()
    await community.fetchPost(props.postId)
  } catch {
    formError.value = '댓글 등록 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    submitting.value = false
  }
}

function requestDelete(commentId) {
  deleteError.value = ''
  pendingDeleteId.value = commentId
}

function cancelDelete() {
  pendingDeleteId.value = null
  deleteError.value = ''
}

async function confirmDelete(password) {
  deleting.value = true
  try {
    await deleteComment(props.postId, pendingDeleteId.value, password)
    pendingDeleteId.value = null
    await loadComments()
    await community.fetchPost(props.postId)
  } catch (err) {
    deleteError.value =
      err?.response?.status === 403
        ? '비밀번호가 일치하지 않습니다.'
        : '삭제 중 문제가 발생했습니다.'
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <section class="comments">
    <h2 class="comments__title">댓글 {{ comments.length }}</h2>

    <form class="comment-form" @submit.prevent="submitComment">
      <textarea
        v-model="form.content"
        class="comment-form__textarea"
        rows="3"
        placeholder="익명으로 댓글을 남겨보세요."
      ></textarea>
      <div class="comment-form__row">
        <input
          v-model="form.password"
          type="password"
          class="comment-form__password"
          placeholder="삭제 시 필요한 비밀번호"
        />
        <button type="submit" class="comment-form__submit" :disabled="submitting">
          {{ submitting ? '등록 중...' : '댓글 등록' }}
        </button>
      </div>
      <p v-if="formError" class="comment-form__error">{{ formError }}</p>
    </form>

    <p v-if="loadError" class="comments__status comments__status--error">{{ loadError }}</p>
    <p v-else-if="loading" class="comments__status">불러오는 중...</p>
    <p v-else-if="!comments.length" class="comments__status">아직 댓글이 없습니다.</p>

    <ul v-else class="comment-list">
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-item__meta">
          <span class="comment-item__author">{{ comment.author }}</span>
          <span>{{ formatRelativeTime(comment.created_at) }}</span>
        </div>
        <p class="comment-item__content">{{ comment.content }}</p>
        <button type="button" class="comment-item__delete" @click="requestDelete(comment.id)">
          삭제
        </button>
      </li>
    </ul>

    <PasswordPrompt
      v-if="pendingDeleteId"
      title="댓글을 삭제하려면 비밀번호를 입력하세요"
      :error="deleteError"
      :submitting="deleting"
      @submit="confirmDelete"
      @cancel="cancelDelete"
    />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.comments {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid $color-border;
}

.comments__title {
  margin: 0 0 16px;
  font-size: 16px;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.comment-form__textarea {
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: $color-navy;
  }
}

.comment-form__row {
  display: flex;
  gap: 10px;
}

.comment-form__password {
  flex: 1;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  padding: 10px 14px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: $color-navy;
  }
}

.comment-form__submit {
  padding: 10px 20px;
  border-radius: $radius-sm;
  border: 1px solid $color-navy;
  background: $color-navy;
  color: $color-white;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
  }
}

.comment-form__error {
  margin: 0;
  font-size: 13px;
  color: #e11d48;
}

.comments__status {
  color: $color-text-muted;
  font-size: 13px;
  padding: 16px 0;
}

.comments__status--error {
  color: #e11d48;
}

.comment-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  position: relative;
  padding: 14px 16px;
  background: $color-bg-soft;
  border-radius: $radius-sm;
}

.comment-item__meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: $color-text-muted;
  margin-bottom: 6px;
}

.comment-item__author {
  font-weight: 600;
  color: $color-text;
}

.comment-item__content {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  padding-right: 40px;
}

.comment-item__delete {
  position: absolute;
  top: 12px;
  right: 14px;
  border: none;
  background: none;
  font-size: 12px;
  color: $color-text-muted;

  &:hover {
    color: #e11d48;
  }
}
</style>
