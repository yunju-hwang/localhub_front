import http from '@/api/http'
import { extractDistrict } from './constants'

function parseApiDate(value) {
  if (!value || value.length < 8) return null
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
}

function normalizeItem(raw) {
  const startDate = parseApiDate(raw.eventstartdate)
  const endDate = parseApiDate(raw.eventenddate) || startDate
  if (!startDate) return null

  return {
    id: raw.contentid,
    title: raw.title,
    addr1: raw.addr1 || '주소 정보 없음',
    district: extractDistrict(raw.addr1),
    tel: raw.tel || null,
    image: raw.image || null,
    eventplace: raw.eventplace || null,
    startDate,
    endDate,
  }
}

let cache = null

export async function getFestivalEvents() {
  if (cache) return cache

  const items = await http.get('/festivals/').then((res) => res.data)
  cache = items.map(normalizeItem).filter(Boolean)
  return cache
}
