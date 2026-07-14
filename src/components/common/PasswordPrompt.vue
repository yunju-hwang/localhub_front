<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '비밀번호 확인' },
  description: { type: String, default: '게시글 작성 시 입력한 비밀번호를 입력하세요.' },
  error: { type: String, default: '' },
  submitting: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const password = ref('')

function handleSubmit() {
  if (!password.value) return
  emit('submit', password.value)
}
</script>

<template>
  <div class="overlay" @click.self="emit('cancel')">
    <form class="modal" @submit.prevent="handleSubmit">
      <h2>{{ title }}</h2>
      <p class="modal__desc">{{ description }}</p>
      <input
        v-model="password"
        type="password"
        class="modal__input"
        placeholder="비밀번호"
        autofocus
      />
      <p v-if="error" class="modal__error">{{ error }}</p>
      <div class="modal__actions">
        <button type="button" class="modal__cancel" @click="emit('cancel')">취소</button>
        <button type="submit" class="modal__submit" :disabled="submitting">확인</button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: $color-white;
  border-radius: $radius-md;
  padding: 28px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    margin: 0;
    font-size: 17px;
  }
}

.modal__desc {
  margin: 0;
  font-size: 13px;
  color: $color-text-muted;
}

.modal__input {
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: $color-navy;
  }
}

.modal__error {
  margin: 0;
  font-size: 13px;
  color: #e11d48;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.modal__cancel,
.modal__submit {
  padding: 8px 18px;
  border-radius: $radius-sm;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid $color-border;
}

.modal__cancel {
  background: $color-white;
  color: $color-text;
}

.modal__submit {
  background: $color-navy;
  border-color: $color-navy;
  color: $color-white;

  &:disabled {
    opacity: 0.6;
  }
}
</style>
