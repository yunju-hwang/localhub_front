<script setup>
import { ref } from 'vue'
import { useChatbotStore } from '../store'

const chatbot = useChatbotStore()
const draft = ref('')

function handleSend() {
  chatbot.send(draft.value)
  draft.value = ''
}
</script>

<template>
  <div class="chat-widget">
    <transition name="fade">
      <div v-if="chatbot.isOpen" class="chat-window">
        <div class="chat-window__header">
          <span>부산 여행 챗봇</span>
          <button type="button" aria-label="닫기" @click="chatbot.toggle()">×</button>
        </div>
        <div class="chat-window__body">
          <p
            v-for="(msg, i) in chatbot.messages"
            :key="i"
            class="chat-message"
            :class="`chat-message--${msg.role}`"
          >
            {{ msg.text }}
          </p>
          <p v-if="chatbot.isSending" class="chat-message chat-message--bot">...</p>
        </div>
        <form class="chat-window__input" @submit.prevent="handleSend">
          <input v-model="draft" type="text" placeholder="메시지를 입력하세요" />
          <button type="submit" :disabled="chatbot.isSending">전송</button>
        </form>
      </div>
    </transition>

    <button class="chat-fab" type="button" aria-label="챗봇 열기" @click="chatbot.toggle()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path
          d="M4 12a8 8 0 1 1 3.3 6.4L4 20l1.2-3.5A7.96 7.96 0 0 1 4 12Z"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.chat-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.chat-fab {
  width: 56px;
  height: 56px;
  border-radius: $radius-full;
  border: none;
  background: $color-navy;
  color: $color-white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  svg {
    width: 26px;
    height: 26px;
  }
}

.chat-window {
  width: 320px;
  height: 420px;
  background: $color-white;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-window__header {
  background: $color-navy;
  color: $color-white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;

  button {
    background: none;
    border: none;
    color: $color-white;
    font-size: 18px;
    line-height: 1;
  }
}

.chat-window__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-message {
  margin: 0;
  padding: 8px 12px;
  border-radius: $radius-md;
  font-size: 13px;
  max-width: 85%;
  line-height: 1.4;
}

.chat-message--bot {
  align-self: flex-start;
  background: $color-bg-soft;
}

.chat-message--user {
  align-self: flex-end;
  background: $color-navy;
  color: $color-white;
}

.chat-window__input {
  display: flex;
  border-top: 1px solid $color-border;

  input {
    flex: 1;
    border: none;
    padding: 10px 12px;
    font-size: 13px;
    outline: none;
  }

  button {
    border: none;
    background: $color-navy;
    color: $color-white;
    padding: 0 16px;
    font-size: 13px;

    &:disabled {
      opacity: 0.6;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
