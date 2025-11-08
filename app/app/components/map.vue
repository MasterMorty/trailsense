<template>
  <MglMap
      :map-style="style"
      :center="center"
      :zoom="zoom"
  >
    <MglLineLayer />
    <MglNavigationControl />
  </MglMap>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const PMTILES_URL = 'https://maps.daugt.com/world.pmtiles'

const style = ref({
  version: 8,
  sources: {
    example_source: {
      type: 'vector',
      url: `pmtiles://${PMTILES_URL}`,
      attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  },
  layers: [
    {
      id: 'buildings',
      source: 'example_source',
      'source-layer': 'landuse',
      type: 'fill',
      paint: { 'fill-color': 'steelblue' }
    },
    {
      id: 'roads',
      source: 'example_source',
      'source-layer': 'roads',
      type: 'line',
      paint: { 'line-color': 'black' }
    },
    {
      id: 'mask',
      source: 'example_source',
      'source-layer': 'mask',
      type: 'fill',
      paint: { 'fill-color': 'white' }
    }
  ]
})

const center = [-1.559482, 47.21322]
const zoom = 8
</script>
