export const POST_CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'spot', label: '여행지 추천' },
  { key: 'food', label: '맛집 탐방' },
  { key: 'stay', label: '숙소 리뷰' },
  { key: 'transport', label: '교통 팁' },
]

export function categoryLabel(key) {
  return POST_CATEGORIES.find((c) => c.key === key)?.label || key
}
