<template>
  <div class="fixed">
    <div v-if="status === 'authenticated'">
      Hi there, {{ data?.user?.name }}!
    </div>
    <div v-else-if="status === 'unauthenticated'">
      <button class="btn" @click="signIn('strava')">Login with Strava</button>
    </div>
  </div>

  <Map/>
</template>
<script setup lang="ts">
import Map from "~/components/map.vue";

const {status, data, signIn, signOut} = useAuth()
</script>