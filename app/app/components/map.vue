<template>
  <MglMap
      :map-style="style"
      :center="center"
      :zoom="zoom"
      @map:load="onMapLoad"
  >
    <!-- <MglNavigationControl /> -->
  </MglMap>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import type { Map } from 'maplibre-gl'
import style from '~/assets/map/style.json'

const center = { lat: 47.2689, lng: 11.3936 }
const zoom = 8

const mapInstance = ref<Map | null>(null)
let resizeObserver: ResizeObserver | null = null
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

const onMapLoad = (event: { map: Map }) => {
  mapInstance.value = event.map
  
  const mapContainer = event.map.getContainer()
  resizeObserver = new ResizeObserver(() => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    resizeTimeout = setTimeout(() => {
      if (mapInstance.value) {
        mapInstance.value.resize()
      }
    }, 2)
  })
  
  resizeObserver.observe(mapContainer)
}

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})
</script>
