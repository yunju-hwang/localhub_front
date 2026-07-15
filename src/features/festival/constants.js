export const BUSAN_DISTRICTS = [
  '중구',
  '서구',
  '동구',
  '영도구',
  '부산진구',
  '동래구',
  '남구',
  '북구',
  '해운대구',
  '사하구',
  '금정구',
  '강서구',
  '연제구',
  '수영구',
  '사상구',
  '기장군',
]

export function extractDistrict(addr1) {
  if (!addr1) return '기타'
  return BUSAN_DISTRICTS.find((district) => addr1.includes(district)) || '기타'
}
