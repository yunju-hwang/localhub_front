export function formatRelativeTime(dateInput) {
  const date = new Date(dateInput)
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
