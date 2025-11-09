<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const color = computed(() => {
    switch (props.status) {
        case 'healthy':
        return 'bg-emerald-300/50 text-green-950 ring-emerald-400';
        case 'battery_low':
        return 'bg-amber-300/50 text-amber-700 ring-amber-400/90';
        case 'offline':
        return 'bg-red-100 text-red-700 ring-red-400';
        default:
        return 'bg-gray-100 text-gray-600';
    }
});
</script>

<template>
    <span :class="color" class="text-xs rounded-md px-2 py-0.5 ring-1 pointer-events-none">
        {{ props.status }}
    </span>
</template>