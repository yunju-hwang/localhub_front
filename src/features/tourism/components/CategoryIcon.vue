<script setup>
defineProps({
  category: { type: String, required: true },
})
</script>

<template>
  <svg
    v-if="category === 'attraction'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
  >
    <path d="M3 11.5 12 4l9 7.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5 10v9h14v-9" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 19v-5h4v5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="category === 'culture'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
  >
    <path d="M3 21h18" stroke-linecap="round" />
    <path d="M4 21V10l8-6 8 6v11" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 21v-6h6v6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="category === 'festival'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
  >
    <path d="M4 21v-7a4 4 0 0 1 8 0v7" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 21v-4a4 4 0 0 1 8 0v4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8 10V4M8 4l2 2M8 4 6 6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="category === 'course'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
  >
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M8 7c3 1 2 6 5 7s5-1 5 3" stroke-linecap="round" />
  </svg>
  <svg
    v-else-if="category === 'leisure'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
  >
    <circle cx="15" cy="5" r="1.6" fill="currentColor" stroke="none" />
    <path
      d="m9 21 2.5-5 2-2-3-3 2-4 3 3 3-1"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M5 21 9 16" stroke-linecap="round" />
  </svg>
  <svg
    v-else-if="category === 'lodging'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
  >
    <path d="M3 19v-9" stroke-linecap="round" />
    <path d="M3 19h18" stroke-linecap="round" />
    <path d="M21 19v-5a2 2 0 0 0-2-2h-8v7" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="7" cy="11" r="1.6" />
    <path d="M3 11h8v-2a2 2 0 0 0-2-2H5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <svg
    v-else-if="category === 'shopping'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
  >
    <path d="M6 8h12l-1 12H7L6 8Z" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke-linecap="round" />
  </svg>
</template>

<style scoped>
svg {
  width: 22px;
  height: 22px;
}
</style>
