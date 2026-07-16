import http from './http'

const CATEGORY_FILE_MAP = {
  attraction: '부산_관광지.json',
  culture: '부산_문화시설.json',
  festival: '부산_축제공연행사.json',
  course: '부산_여행코스.json',
  leisure: '부산_레포츠.json',
  lodging: '부산_숙박.json',
  shopping: '부산_쇼핑.json',
}

function normalizeItem(raw) {
  const images = [raw.firstimage, raw.firstimage2].filter(Boolean)
  return {
    id: raw.contentid,
    title: raw.title,
    address: raw.addr1 || '주소 정보 없음',
    lat: raw.mapy ? parseFloat(raw.mapy) : null,
    lng: raw.mapx ? parseFloat(raw.mapx) : null,
    image: images[0] || null,
    images,
    tel: raw.tel || null,
  }
}

const cache = new Map()

export async function getTourismData(category) {
  if (cache.has(category)) {
    return cache.get(category)
  }

  const fileName = CATEGORY_FILE_MAP[category]
  if (!fileName) {
    throw new Error(`알 수 없는 카테고리: ${category}`)
  }

  const res = await fetch(`/data/busan/${encodeURIComponent(fileName)}`)
  if (!res.ok) {
    throw new Error(`데이터 파일을 찾을 수 없습니다: ${fileName}`)
  }
  const json = await res.json()

  const result = {
    total: json.total,
    items: json.items.map(normalizeItem),
  }
  cache.set(category, result)
  return result
}

export function getTourismDetail(contentId, contentTypeId) {
  return http
    .get('/tourism/detail', { params: { content_id: contentId, content_type_id: contentTypeId } })
    .then((res) => res.data)
}
