<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  title: { type: String, default: '' },
})

const mapContainer = ref(null)
const error = ref('')

let mapInstance = null
let markerInstance = null
let sdkPromise = null

function loadKakaoSdk() {
  if (window.kakao?.maps) return Promise.resolve(window.kakao)
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_KAKAO_MAP_KEY
    if (!key) {
      reject(new Error('카카오맵 API 키가 설정되지 않았습니다.'))
      return
    }
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    script.onerror = () => reject(new Error('카카오맵 스크립트를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })
  return sdkPromise
}

async function renderMap() {
  const kakao = await loadKakaoSdk()
  const center = new kakao.maps.LatLng(props.lat, props.lng)

  if (!mapInstance) {
    mapInstance = new kakao.maps.Map(mapContainer.value, { center, level: 4 })
  } else {
    mapInstance.setCenter(center)
  }

  if (markerInstance) markerInstance.setMap(null)
  markerInstance = new kakao.maps.Marker({ position: center, map: mapInstance })

  if (props.title) {
    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${props.title}</div>`,
    })
    infowindow.open(mapInstance, markerInstance)
  }
}

onMounted(async () => {
  try {
    await renderMap()
  } catch (err) {
    error.value = err.message
  }
})

watch(
  () => [props.lat, props.lng],
  async () => {
    if (!mapInstance) return
    try {
      await renderMap()
    } catch (err) {
      error.value = err.message
    }
  },
)
</script>

<template>
  <div class="kakao-map">
    <p v-if="error" class="kakao-map__error">{{ error }}</p>
    <div v-show="!error" ref="mapContainer" class="kakao-map__canvas"></div>
  </div>
</template>

<style scoped>
.kakao-map__canvas {
  width: 100%;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
}

.kakao-map__error {
  padding: 16px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  background: #f7f8fa;
  border-radius: 12px;
}
</style>
