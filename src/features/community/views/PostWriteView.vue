<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommunityStore } from '../store'
import { POST_CATEGORIES } from '../constants'

const route = useRoute()
const router = useRouter()
const community = useCommunityStore()

const isEdit = computed(() => !!route.params.id)
const formError = ref('')

const form = reactive({
  title: '',
  category: 'spot',
  content: '',
  image: '',
  password: '',
  passwordConfirm: '',
})

onMounted(() => {
  community.init()
  if (isEdit.value) {
    // 비밀번호 확인 없이 주소로 바로 들어온 경우 상세 페이지로 돌려보낸다.
    if (!community.isUnlocked(route.params.id)) {
      router.replace({ name: 'PostDetail', params: { id: route.params.id } })
      return
    }
    const post = community.getById(route.params.id)
    if (post) {
      form.title = post.title
      form.category = post.category
      form.content = post.content
      form.image = post.image || ''
    }
  }
})

async function handleSubmit() {
  formError.value = ''
  if (!form.title.trim() || !form.content.trim()) return

  if (isEdit.value) {
    community.updatePost(route.params.id, form)
    router.push({ name: 'PostDetail', params: { id: route.params.id } })
    return
  }

  if (!form.password) {
    formError.value = '비밀번호를 입력하세요.'
    return
  }
  if (form.password !== form.passwordConfirm) {
    formError.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  const post = await community.createPost(form)
  router.push({ name: 'PostDetail', params: { id: post.id } })
}

function handleCancel() {
  router.back()
}
</script>

<template>
  <div class="post-write">
    <h1>{{ isEdit ? '게시글 수정' : '새 게시글 작성' }}</h1>

    <form class="post-write__form" @submit.prevent="handleSubmit">
      <label class="field">
        <span class="field__label">카테고리</span>
        <select v-model="form.category" class="field__select">
          <option v-for="cat in POST_CATEGORIES.filter((c) => c.key !== 'all')" :key="cat.key" :value="cat.key">
            {{ cat.label }}
          </option>
        </select>
      </label>

      <label class="field">
        <span class="field__label">제목</span>
        <input v-model="form.title" type="text" class="field__input" placeholder="제목을 입력하세요" required />
      </label>

      <label class="field">
        <span class="field__label">이미지 URL (선택)</span>
        <input v-model="form.image" type="text" class="field__input" placeholder="https://..." />
      </label>

      <label class="field">
        <span class="field__label">내용</span>
        <textarea
          v-model="form.content"
          class="field__textarea"
          rows="10"
          placeholder="내용을 입력하세요"
          required
        ></textarea>
      </label>

      <template v-if="!isEdit">
        <label class="field">
          <span class="field__label">비밀번호</span>
          <input
            v-model="form.password"
            type="password"
            class="field__input"
            placeholder="수정·삭제 시 필요한 비밀번호"
            required
          />
        </label>

        <label class="field">
          <span class="field__label">비밀번호 확인</span>
          <input
            v-model="form.passwordConfirm"
            type="password"
            class="field__input"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </label>
      </template>

      <p v-if="formError" class="post-write__error">{{ formError }}</p>

      <div class="post-write__actions">
        <button type="button" class="post-write__cancel" @click="handleCancel">취소</button>
        <button type="submit" class="post-write__submit">{{ isEdit ? '수정 완료' : '등록하기' }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.post-write {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 64px;

  h1 {
    font-size: 24px;
    margin: 0 0 24px;
  }
}

.post-write__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field__label {
  font-size: 13px;
  font-weight: 600;
  color: $color-text-muted;
}

.field__input,
.field__select,
.field__textarea {
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: $color-navy;
  }
}

.field__textarea {
  resize: vertical;
  line-height: 1.6;
}

.post-write__error {
  margin: 0;
  font-size: 13px;
  color: #e11d48;
}

.post-write__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.post-write__cancel,
.post-write__submit {
  padding: 10px 24px;
  border-radius: $radius-sm;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid $color-border;
}

.post-write__cancel {
  background: $color-white;
  color: $color-text;
}

.post-write__submit {
  background: $color-navy;
  border-color: $color-navy;
  color: $color-white;
}
</style>
