import { defineStore } from 'pinia'
import { sendChatMessage } from '@/api/chatbot'

const STORAGE_KEY = 'busan-chatbot-messages'
const DEFAULT_MESSAGES = [{ role: 'bot', text: '안녕하세요! 부산 여행에 대해 무엇이든 물어보세요.' }]

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_MESSAGES
  } catch {
    return DEFAULT_MESSAGES
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    isOpen: false,
    messages: loadMessages(),
    isSending: false,
  }),
  actions: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    async send(text) {
      if (!text.trim()) return
      this.messages.push({ role: 'user', text })
      saveMessages(this.messages)
      this.isSending = true
      try {
        const reply = await sendChatMessage(
          text,
          this.messages.map((m) => ({ role: m.role, text: m.text })),
        )
        this.messages.push({ role: 'bot', text: reply.reply })
      } catch (err) {
        console.error('챗봇 요청 실패:', err)
        this.messages.push({ role: 'bot', text: '죄송해요, 지금은 답변할 수 없어요. 잠시 후 다시 시도해주세요.' })
      } finally {
        this.isSending = false
        saveMessages(this.messages)
      }
    },
  },
})
