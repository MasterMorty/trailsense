<template>
  <button class="z-10 h-fit fixed right-4 top-4 px-3 py-1.5 bg-white rounded-lg text-sm" @click="fetchSegments">Search in area</button>
  <Map ref="mapRef"/>
</template>

<script setup>
import {ref} from 'vue';
import Map from './map.vue';

const mapRef = ref(null);

async function fetchSegments() {
  if (mapRef.value) {
    const bounds = mapRef.value.getCurrentBounds().join(",");
    if (bounds) {
      const segments = await $fetch("/api/trails", {
        method: "GET",
        params: {
          bounds: bounds
        }
      })


      mapRef.value.updateSegments(segments);
    }
  }
}
</script>
