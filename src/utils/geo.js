const EARTH_RADIUS_M = 6371000
const WALK_SPEED_M_PER_MIN = 67 // 도보 평균 시속 4km/h 기준

export function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_M * c
}

export function estimateWalkMinutes(distanceMeters) {
  return Math.max(1, Math.round(distanceMeters / WALK_SPEED_M_PER_MIN))
}
