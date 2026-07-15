export const POST_CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'spot', label: '여행지 추천' },
  { key: 'food', label: '맛집 탐방' },
  { key: 'stay', label: '숙소 리뷰' },
  { key: 'transport', label: '교통 팁' },
  { key: 'festival', label: '축제 & 행사' },
]

export function categoryLabel(key) {
  return POST_CATEGORIES.find((c) => c.key === key)?.label || key
}

const CATEGORY_BADGE_COLORS = {
  spot: { bg: '#dbeafe', color: '#1e40af' },
  food: { bg: '#ffedd5', color: '#9a3412' },
  stay: { bg: '#f3f4f6', color: '#374151' },
  transport: { bg: '#f3f4f6', color: '#374151' },
  festival: { bg: '#ede9fe', color: '#5b21b6' },
}

export function categoryBadgeColor(key) {
  return CATEGORY_BADGE_COLORS[key] || CATEGORY_BADGE_COLORS.stay
}
