<template>
  <slot v-if="status === 'authenticated'"/>
</template>

<script setup lang="ts">
const {status, signIn} = useAuth()

watchEffect(() => {
  if (status.value === 'unauthenticated') {
    signIn('strava')
  }
})
</script>
