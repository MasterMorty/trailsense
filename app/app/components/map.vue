<template>
  <div ref="mapContainer" style="width: 100%; height: 100%; min-height: 500px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

import type { Map } from 'maplibre-gl'

import 'maplibre-gl/dist/maplibre-gl.css'
import mapStyle from '~/assets/map/style.json'

const center = { lat: 47.2689, lng: 11.3936 }
const zoom = 8

const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = ref<Map | null>(null)

let resizeObserver: ResizeObserver | null = null
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  if (process.client && mapContainer.value) {
    try {
      const maplibreModule = await import('maplibre-gl')
      const maplibregl = maplibreModule.default

      const map = new maplibregl.Map({
        container: mapContainer.value,
        // @ts-ignore
        style: mapStyle,
        center: [center.lng, center.lat],
        zoom: zoom
      })

      mapInstance.value = map

      map.on('load', () => {
        const mapEl = map.getContainer()
        resizeObserver = new ResizeObserver(() => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout)
          }
          resizeTimeout = setTimeout(() => {
            map.resize()
          }, 2)
        })

        resizeObserver.observe(mapEl)
      })

    } catch (e) {
      console.error('Failed to load MapLibre', e)
    }
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }

  if (mapInstance.value) {
    mapInstance.value.remove()
  }
})

function getCurrentBounds(): number[] | null {
  if (mapInstance.value) {
    const mapBounds = mapInstance.value.getBounds();
    const sw = mapBounds.getSouthWest();
    const ne = mapBounds.getNorthEast();

    return [sw.lat, sw.lng, ne.lat, ne.lng];
  }
  return null;
}

defineExpose({
  getCurrentBounds
});
</script>