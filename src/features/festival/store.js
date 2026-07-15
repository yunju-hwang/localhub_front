import { defineStore } from 'pinia'
import { getFestivalEvents } from './api'

export const useFestivalStore = defineStore('festival', {
  state: () => ({
    events: [],
    loading: false,
    error: null,
    initialized: false,
  }),
  getters: {
    districts: (state) => {
      const set = new Set(state.events.map((e) => e.district))
      return Array.from(set).sort((a, b) => a.localeCompare(b, 'ko'))
    },
    eventsFor: (state) => (district) => {
      if (!district || district === 'all') return state.events
      return state.events.filter((e) => e.district === district)
    },
  },
  actions: {
    async init() {
      if (this.initialized) return
      this.loading = true
      this.error = null
      try {
        this.events = await getFestivalEvents()
        this.initialized = true
      } catch (err) {
        this.error = err.message || '축제 데이터를 불러오지 못했습니다.'
      } finally {
        this.loading = false
      }
    },
  },
})
