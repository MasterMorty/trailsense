<template>
    <button class="z-10 w-32 h-fit fixed" @click="fetchSegments">Search in area</button>
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
      console.log("bounds", bounds)
      // const data = $fetch("/api/strava/segments", {
      //   method: "GET",
      //   params: {
      //     bounds: bounds,
      //     activity_type: "hiking"
      //   }
      // })
    }
  }
}
</script>