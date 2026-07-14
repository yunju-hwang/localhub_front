import { defineStore } from 'pinia'
import { sendChatMessage } from '@/api/chatbot'

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    isOpen: false,
    messages: [{ role: 'bot', text: '안녕하세요! 부산 여행에 대해 무엇이든 물어보세요.' }],
    isSending: false,
  }),
  actions: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    async send(text) {
      if (!text.trim()) return
      this.messages.push({ role: 'user', text })
      this.isSending = true
      try {
        const reply = await sendChatMessage(
          text,
          this.messages.map((m) => ({ role: m.role, text: m.text })),
        )
        this.messages.push({ role: 'bot', text: reply.message })
      } catch {
        this.messages.push({ role: 'bot', text: '죄송해요, 지금은 답변할 수 없어요. 잠시 후 다시 시도해주세요.' })
      } finally {
        this.isSending = false
      }
    },
  },
})
