import { defineStore } from 'pinia'
import { hashText } from '@/utils/crypto'

const STORAGE_KEY = 'busan-community-posts'
const hours = (n) => Date.now() - n * 60 * 60 * 1000
const days = (n) => Date.now() - n * 24 * 60 * 60 * 1000

// 데모 게시글 공통 비밀번호: 1234 (SHA-256 해시)
const DEMO_PASSWORD_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'

const SEED_POSTS = [
  {
    id: 'seed-1',
    title: '감천문화마을에서 인생샷 남기는 명당 5곳',
    category: 'spot',
    author: '부산러버99',
    content: '감천문화마을에서 사진 찍기 좋은 포토스팟 5곳을 소개합니다. 어린왕자 전시관 앞, 골목길 벽화, 전망대 등을 추천해요.',
    image: 'https://tong.visitkorea.or.kr/cms/resource/91/3365491_image2_1.jpg',
    likes: 124,
    comments: 18,
    views: 1200,
    createdAt: hours(2),
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: 'seed-2',
    title: '로컬들만 아는 해운대 돼지국밥 찐맛집 공개',
    category: 'food',
    author: '국밥장인',
    content: '관광객들은 잘 모르는 현지인 단골 돼지국밥집을 소개합니다. 진한 국물과 푸짐한 양이 특징이에요.',
    image: 'http://tong.visitkorea.or.kr/cms/resource/30/3476830_image2_1.jpg',
    likes: 256,
    comments: 42,
    views: 3400,
    createdAt: hours(5),
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: 'seed-3',
    title: '해운대 블루라인파크 예약 팁 & 명당 자리 추천',
    category: 'transport',
    author: '여행마스터',
    content: '해운대 블루라인파크 스카이캡슐 예약은 최소 2주 전에 하는 걸 추천해요. 바다 전망이 가장 좋은 자리도 알려드립니다.',
    image: 'http://tong.visitkorea.or.kr/cms/resource/99/3546099_image2_1.jpg',
    likes: 89,
    comments: 12,
    views: 950,
    createdAt: days(1),
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: 'seed-4',
    title: '밤바다와 사찰의 조화, 해동용궁사 야경 투어 후기',
    category: 'spot',
    author: 'NightBusan',
    content: '해동용궁사의 야경은 낮과는 또 다른 매력이 있어요. 야간 개방 시간과 추천 동선을 정리했습니다.',
    image: 'https://tong.visitkorea.or.kr/cms/resource/35/3499335_image2_1.jpg',
    likes: 156,
    comments: 24,
    views: 1800,
    createdAt: days(2),
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: 'seed-5',
    title: '광안리 정면 뷰! 갓성비 에어비앤비 내돈내산 추천',
    category: 'stay',
    author: '호캉스족',
    content: '광안리 바다가 정면으로 보이는 가성비 숙소를 직접 다녀와서 후기 남깁니다. 가격 대비 만족도가 높았어요.',
    image: 'https://tong.visitkorea.or.kr/cms/resource/69/4077869_image2_1.jpg',
    likes: 312,
    comments: 56,
    views: 5200,
    createdAt: days(3),
    passwordHash: DEMO_PASSWORD_HASH,
  },
  {
    id: 'seed-6',
    title: '국제시장 5천원으로 즐기는 먹방 코스 베스트',
    category: 'food',
    author: 'StreetFoodie',
    content: '국제시장에서 저렴하게 즐길 수 있는 길거리 음식 코스를 소개합니다. 5천원으로 배부르게 먹는 방법!',
    image: 'https://tong.visitkorea.or.kr/cms/resource/49/3498549_image2_1.jpg',
    likes: 198,
    comments: 22,
    views: 2100,
    createdAt: days(4),
    passwordHash: DEMO_PASSWORD_HASH,
  },
]

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export const useCommunityStore = defineStore('community', {
  state: () => ({
    posts: [],
    initialized: false,
    // 비밀번호 확인에 성공한 게시글 id 목록 (세션 동안만 유지, 새로고침 시 초기화)
    unlockedPostIds: [],
  }),
  getters: {
    getById: (state) => (id) => state.posts.find((p) => p.id === id),
    isUnlocked: (state) => (id) => state.unlockedPostIds.includes(id),
    filtered: (state) => (category, keyword) => {
      let result = state.posts
      if (category && category !== 'all') {
        result = result.filter((p) => p.category === category)
      }
      if (keyword?.trim()) {
        const q = keyword.trim().toLowerCase()
        result = result.filter((p) => p.title.toLowerCase().includes(q))
      }
      return [...result].sort((a, b) => b.createdAt - a.createdAt)
    },
  },
  actions: {
    init() {
      if (this.initialized) return
      const stored = loadFromStorage()
      if (stored && stored.length) {
        this.posts = stored
      } else {
        this.posts = SEED_POSTS
        saveToStorage(this.posts)
      }
      this.initialized = true
    },
    async createPost(payload) {
      const post = {
        id: `post-${Date.now()}`,
        title: payload.title,
        category: payload.category,
        content: payload.content,
        image: payload.image || null,
        author: payload.author || '익명',
        likes: 0,
        comments: 0,
        views: 0,
        createdAt: Date.now(),
        passwordHash: await hashText(payload.password),
      }
      this.posts.unshift(post)
      saveToStorage(this.posts)
      return post
    },
    async verifyPassword(id, password) {
      const post = this.getById(id)
      if (!post) return false
      const hash = await hashText(password)
      const ok = hash === post.passwordHash
      if (ok && !this.unlockedPostIds.includes(id)) {
        this.unlockedPostIds.push(id)
      }
      return ok
    },
    updatePost(id, payload) {
      const post = this.getById(id)
      if (!post) return
      Object.assign(post, {
        title: payload.title,
        category: payload.category,
        content: payload.content,
        image: payload.image || null,
      })
      saveToStorage(this.posts)
    },
    deletePost(id) {
      this.posts = this.posts.filter((p) => p.id !== id)
      this.unlockedPostIds = this.unlockedPostIds.filter((pid) => pid !== id)
      saveToStorage(this.posts)
    },
    incrementViews(id) {
      const post = this.getById(id)
      if (!post) return
      post.views += 1
      saveToStorage(this.posts)
    },
  },
})
