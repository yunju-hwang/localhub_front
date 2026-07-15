<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useFestivalStore } from '../store'

const festival = useFestivalStore()

const activeDistrict = ref('all')
const selectedEvent = ref(null)
const selectedDate = ref(null)

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

onMounted(() => {
  festival.init()
})

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const STATUS_LABEL = { upcoming: '예정', ongoing: '진행중', ended: '종료' }

const filteredEvents = computed(() => festival.eventsFor(activeDistrict.value))

function pad(n) {
  return String(n).padStart(2, '0')
}

function toDateStr(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

function formatDateLabel(dateStr) {
  return dateStr.replaceAll('-', '.')
}

function formatDateRange(event) {
  return event.startDate === event.endDate
    ? formatDateLabel(event.startDate)
    : `${formatDateLabel(event.startDate)} - ${formatDateLabel(event.endDate)}`
}

const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

function eventStatus(event) {
  if (todayStr < event.startDate) return 'upcoming'
  if (todayStr > event.endDate) return 'ended'
  return 'ongoing'
}

function parseDateParts(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return { y, m: m - 1, d }
}

function datesInRange(start, end) {
  const { y: sy, m: sm, d: sd } = parseDateParts(start)
  const { y: ey, m: em, d: ed } = parseDateParts(end)
  const cur = new Date(sy, sm, sd)
  const last = new Date(ey, em, ed)
  const dates = []
  let guard = 0
  while (cur <= last && guard < 120) {
    dates.push(toDateStr(cur.getFullYear(), cur.getMonth(), cur.getDate()))
    cur.setDate(cur.getDate() + 1)
    guard++
  }
  return dates
}

const eventsByDate = computed(() => {
  const map = new Map()
  for (const event of filteredEvents.value) {
    for (const dateStr of datesInRange(event.startDate, event.endDate)) {
      if (!map.has(dateStr)) map.set(dateStr, [])
      map.get(dateStr).push(event)
    }
  }
  return map
})

const monthLabel = computed(() => `${viewYear.value}년 ${viewMonth.value + 1}월`)

const calendarCells = computed(() => {
  const firstWeekday = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = toDateStr(viewYear.value, viewMonth.value, day)
    cells.push({
      day,
      dateStr,
      weekday: (firstWeekday + day - 1) % 7,
      hasEvents: eventsByDate.value.has(dateStr),
    })
  }
  return cells
})

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  } else {
    viewMonth.value -= 1
  }
  selectedDate.value = null
  selectedEvent.value = null
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
  } else {
    viewMonth.value += 1
  }
  selectedDate.value = null
  selectedEvent.value = null
}

function selectDate(cell) {
  if (!cell) return
  selectedDate.value = selectedDate.value === cell.dateStr ? null : cell.dateStr
  selectedEvent.value = null
}

function selectDistrict(district) {
  activeDistrict.value = district
  selectedDate.value = null
  selectedEvent.value = null
}

const monthStart = computed(() => toDateStr(viewYear.value, viewMonth.value, 1))
const monthEnd = computed(() => {
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  return toDateStr(viewYear.value, viewMonth.value, daysInMonth)
})

const sidebarEvents = computed(() => {
  if (selectedDate.value) {
    return eventsByDate.value.get(selectedDate.value) || []
  }
  return filteredEvents.value
    .filter((event) => event.startDate <= monthEnd.value && event.endDate >= monthStart.value)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 6)
})

function openDetail(event) {
  selectedEvent.value = event
}

function closeDetail() {
  selectedEvent.value = null
}
</script>

<template>
  <div class="festival-calendar">
    <section class="hero">
      <div class="hero__overlay">
        <h1>부산 축제 캘린더</h1>
        <p>부산에서 열리는 다채로운 축제와 행사 정보를 확인하세요.</p>
      </div>
    </section>

    <div class="festival-calendar__content">
      <nav class="filters">
        <button
          type="button"
          class="filters__pill"
          :class="{ 'filters__pill--active': activeDistrict === 'all' }"
          @click="selectDistrict('all')"
        >
          전체
        </button>
        <button
          v-for="district in festival.districts"
          :key="district"
          type="button"
          class="filters__pill"
          :class="{ 'filters__pill--active': activeDistrict === district }"
          @click="selectDistrict(district)"
        >
          {{ district }}
        </button>
      </nav>

      <p v-if="festival.error" class="status status--error">{{ festival.error }}</p>
      <p v-else-if="festival.loading" class="status">불러오는 중...</p>

      <div v-else class="layout">
        <section class="calendar-card">
          <div class="calendar-card__header">
            <h2>{{ monthLabel }}</h2>
            <div class="calendar-card__nav">
              <button type="button" aria-label="이전 달" @click="prevMonth">‹</button>
              <button type="button" aria-label="다음 달" @click="nextMonth">›</button>
            </div>
          </div>

          <div class="weekdays">
            <span
              v-for="(day, i) in WEEKDAYS"
              :key="day"
              :class="{ 'weekdays__sun': i === 0, 'weekdays__sat': i === 6 }"
            >
              {{ day }}
            </span>
          </div>

          <div class="days">
            <div
              v-for="(cell, i) in calendarCells"
              :key="i"
              class="day"
              :class="{ 'day--empty': !cell }"
              @click="selectDate(cell)"
            >
              <template v-if="cell">
                <span
                  class="day__number"
                  :class="{
                    'day__number--sun': cell.weekday === 0,
                    'day__number--sat': cell.weekday === 6,
                    'day__number--selected': cell.dateStr === selectedDate,
                  }"
                >
                  {{ cell.day }}
                </span>
                <span v-if="cell.hasEvents" class="day__dot"></span>
              </template>
            </div>
          </div>
        </section>

        <aside class="sidebar">
          <template v-if="selectedEvent">
            <button type="button" class="sidebar__back" @click="closeDetail">‹ 목록으로</button>
            <div class="event-detail">
              <img
                v-if="selectedEvent.image"
                :src="selectedEvent.image"
                :alt="selectedEvent.title"
                class="event-detail__image"
              />
              <div class="event-detail__badges">
                <span class="event-detail__district">{{ selectedEvent.district }}</span>
                <span class="badge" :class="`badge--${eventStatus(selectedEvent)}`">
                  {{ STATUS_LABEL[eventStatus(selectedEvent)] }}
                </span>
              </div>
              <h3>{{ selectedEvent.title }}</h3>
              <p class="event-detail__meta">🗓 {{ formatDateRange(selectedEvent) }}</p>
              <p class="event-detail__meta">📍 {{ selectedEvent.eventplace || selectedEvent.addr1 }}</p>
              <p v-if="selectedEvent.tel" class="event-detail__meta">☎ {{ selectedEvent.tel }}</p>
            </div>
          </template>

          <template v-else>
            <div class="sidebar__header">
              <h2>{{ selectedDate ? `${formatDateLabel(selectedDate)} 축제` : '이달의 주요 축제' }}</h2>
              <RouterLink to="/tourism/festival" class="sidebar__all">전체보기</RouterLink>
            </div>

            <p v-if="!sidebarEvents.length" class="sidebar__empty">
              {{ selectedDate ? '이 날짜에 등록된 축제가 없습니다.' : '이번 달에 등록된 축제가 없습니다.' }}
            </p>

            <ul v-else class="event-list">
              <li
                v-for="event in sidebarEvents"
                :key="event.id"
                class="event-card"
                @click="openDetail(event)"
              >
                <span class="badge badge--corner" :class="`badge--${eventStatus(event)}`">
                  {{ STATUS_LABEL[eventStatus(event)] }}
                </span>
                <span class="event-card__district">{{ event.district }}</span>
                <h3>{{ event.title }}</h3>
                <p class="event-card__meta">🗓 {{ formatDateRange(event) }}</p>
                <p class="event-card__meta">📍 {{ event.eventplace || event.addr1 }}</p>
              </li>
            </ul>
          </template>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.festival-calendar {
  display: flex;
  flex-direction: column;
  padding-bottom: 64px;
}

.festival-calendar__content {
  @include container;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero {
  height: 260px;
  background:
    linear-gradient(180deg, rgba(10, 20, 35, 0.55) 0%, rgba(10, 20, 35, 0.75) 100%),
    url('https://tong.visitkorea.or.kr/cms/resource/92/4077792_image2_1.jpg') center / cover
      no-repeat;
  display: flex;
  align-items: flex-end;
  padding: 0 24px 32px;
}

.hero__overlay {
  color: $color-white;
  max-width: $max-width;
  margin: 0 auto;
  width: 100%;

  h1 {
    margin: 0 0 8px;
    font-size: 34px;
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
}

.notice {
  background: $color-bg-soft;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: 12px 16px;
  font-size: 13px;
  color: $color-text-muted;
  line-height: 1.6;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters__pill {
  padding: 8px 18px;
  border: 1px solid $color-border;
  border-radius: $radius-full;
  background: $color-white;
  color: $color-text-muted;
  font-size: 13px;
  font-weight: 500;
}

.filters__pill--active {
  background: $color-navy;
  border-color: $color-navy;
  color: $color-white;
}

.status {
  text-align: center;
  color: $color-text-muted;
  padding: 48px 0;
}

.status--error {
  color: #e11d48;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.calendar-card {
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 28px;
}

.calendar-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
  }
}

.calendar-card__nav {
  display: flex;
  gap: 8px;

  button {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    color: $color-navy;
    font-size: 18px;
    border-radius: $radius-sm;

    &:hover {
      background: $color-bg-soft;
    }
  }
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding-bottom: 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid $color-border;

  span {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: $color-text-muted;
    letter-spacing: 0.03em;
  }
}

.weekdays__sun {
  color: #e11d48 !important;
}

.weekdays__sat {
  color: $color-navy !important;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 56px;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  padding-top: 8px;
  cursor: pointer;
  border-radius: $radius-sm;

  &:hover:not(.day--empty) {
    background: $color-bg-soft;
  }
}

.day--empty {
  cursor: default;
}

.day__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: $radius-full;
  font-size: 14px;
  color: $color-text;
}

.day__number--sun {
  color: #e11d48;
}

.day__number--sat {
  color: $color-navy;
}

.day__number--selected {
  background: $color-navy;
  color: $color-white;
}

.day__dot {
  width: 5px;
  height: 5px;
  border-radius: $radius-full;
  background: $color-navy;
}

.sidebar {
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 24px;
  min-height: 200px;
}

.sidebar__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
  }
}

.sidebar__all {
  font-size: 13px;
  color: $color-text-muted;

  &:hover {
    color: $color-navy;
  }
}

.sidebar__empty {
  color: $color-text-muted;
  font-size: 13px;
  padding: 24px 0;
  text-align: center;
}

.event-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event-card {
  position: relative;
  padding: 14px 16px 14px 18px;
  background: $color-bg-soft;
  border-radius: $radius-sm;
  border-left: 3px solid $color-navy;
  cursor: pointer;

  &:hover {
    @include card-shadow;
  }

  h3 {
    margin: 4px 0 8px;
    font-size: 14px;
    line-height: 1.4;
  }
}

.badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: $radius-full;
}

.badge--corner {
  position: absolute;
  top: 12px;
  right: 12px;
}

.badge--ongoing {
  background: $color-navy;
  color: $color-white;
}

.badge--upcoming {
  background: #fef3c7;
  color: #92400e;
}

.badge--ended {
  background: $color-border;
  color: $color-text-muted;
}

.event-card__district {
  display: inline-block;
  background: $color-white;
  color: $color-navy;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: $radius-full;
}

.event-card__meta {
  margin: 2px 0;
  font-size: 12px;
  color: $color-text-muted;
}

.sidebar__back {
  border: none;
  background: none;
  color: $color-text-muted;
  font-size: 13px;
  margin-bottom: 14px;

  &:hover {
    color: $color-navy;
  }
}

.event-detail__image {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: $radius-sm;
  margin-bottom: 12px;
}

.event-detail__badges {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.event-detail__district {
  display: inline-block;
  background: $color-bg-soft;
  color: $color-navy;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: $radius-full;
}

.event-detail h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.event-detail__meta {
  margin: 0 0 6px;
  font-size: 13px;
  color: $color-text-muted;
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
