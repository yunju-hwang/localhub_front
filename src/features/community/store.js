import { defineStore } from 'pinia'
import * as communityApi from '@/api/community'

export const useCommunityStore = defineStore('community', {
  state: () => ({
    posts: [],
    total: 0,
    page: 1,
    limit: 6,
    loading: false,
    currentPost: null,
    // 비밀번호 확인에 성공한 게시글 id와 비밀번호 (세션 동안만 유지, 새로고침 시 초기화)
    unlockedPostIds: [],
    passwords: {},
  }),
  getters: {
    isUnlocked: (state) => (id) => state.unlockedPostIds.includes(Number(id)),
  },
  actions: {
    async fetchPosts({ search = '', category = 'all', page = 1, limit = 6 } = {}) {
      this.loading = true
      try {
        const params = { page, limit }
        if (search) params.search = search
        if (category && category !== 'all') params.category = category
        const res = await communityApi.getPosts(params)
        this.posts = res.items
        this.total = res.total
        this.page = res.page
        this.limit = res.limit
      } finally {
        this.loading = false
      }
    },
    async fetchPost(id) {
      this.currentPost = await communityApi.getPost(id)
      return this.currentPost
    },
    async createPost(payload) {
      return communityApi.createPost({
        title: payload.title,
        content: payload.content,
        password: payload.password,
        category: payload.category,
        image: payload.image || null,
      })
    },
    async updatePost(id, payload) {
      const post = await communityApi.updatePost(id, {
        title: payload.title,
        content: payload.content,
        category: payload.category,
        image: payload.image || null,
        password: this.passwords[Number(id)],
      })
      this.currentPost = post
      return post
    },
    async deletePost(id) {
      await communityApi.deletePost(id, this.passwords[Number(id)])
      const numId = Number(id)
      this.unlockedPostIds = this.unlockedPostIds.filter((pid) => pid !== numId)
      delete this.passwords[numId]
    },
    async verifyPassword(id, password) {
      const ok = await communityApi.verifyPassword(id, password)
      if (ok) {
        const numId = Number(id)
        if (!this.unlockedPostIds.includes(numId)) {
          this.unlockedPostIds.push(numId)
        }
        this.passwords[numId] = password
      }
      return ok
    },
    async likePost(id) {
      const post = await communityApi.likePost(id)
      if (this.currentPost && this.currentPost.id === post.id) {
        this.currentPost = post
      }
      return post
    },
  },
})
