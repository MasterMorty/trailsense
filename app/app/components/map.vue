<template>
  <MglMap
      :map-style="style"
      :center="center"
      :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>

<script setup lang="ts">
import style from '~/assets/map/style.json'

const center = {lat: -1.559482, lng: 47.21322}
const zoom = 8
</script>
