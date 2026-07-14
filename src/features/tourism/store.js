import { defineStore } from 'pinia'
import { getTourismData } from '@/api/tourism'
import { CATEGORIES } from './constants'

export const useTourismStore = defineStore('tourism', {
  state: () => ({
    dataByCategory: {},
    loadingByCategory: {},
    errorByCategory: {},
  }),
  getters: {
    categories: () => CATEGORIES,
    itemsOf: (state) => (category) => state.dataByCategory[category]?.items || [],
    totalOf: (state) => (category) => state.dataByCategory[category]?.total ?? null,
    isLoading: (state) => (category) => !!state.loadingByCategory[category],
    errorOf: (state) => (category) => state.errorByCategory[category] || null,
  },
  actions: {
    async fetchCategory(category) {
      if (this.dataByCategory[category] || this.loadingByCategory[category]) return
      this.loadingByCategory[category] = true
      this.errorByCategory[category] = null
      try {
        this.dataByCategory[category] = await getTourismData(category)
      } catch (err) {
        this.errorByCategory[category] = err.message
      } finally {
        this.loadingByCategory[category] = false
      }
    },
    async fetchAll() {
      await Promise.all(CATEGORIES.map((c) => this.fetchCategory(c.key)))
    },
  },
})
