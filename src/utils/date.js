// 백엔드가 UTC 시각을 타임존 표시(Z) 없이 내려주는데, 그대로 new Date()에 넣으면
// 브라우저가 로컬 시간으로 오해해서 시차만큼(한국은 9시간) 어긋난다. 명시적으로 UTC로 표시해준다.
function toUtcDate(dateInput) {
  if (typeof dateInput === 'string' && !/Z|[+-]\d{2}:?\d{2}$/.test(dateInput)) {
    return new Date(`${dateInput}Z`)
  }
  return new Date(dateInput)
}

export function formatRelativeTime(dateInput) {
  const date = toUtcDate(dateInput)
  const diffMs = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return '방금 전'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}분 전`
  if (diffMs < day) return `${Math.floor(diffMs / hour)}시간 전`
  if (diffMs < day * 7) return `${Math.floor(diffMs / day)}일 전`

  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
