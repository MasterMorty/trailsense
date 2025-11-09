<script setup lang="ts">
defineProps({
  level: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100,
  },
});
</script>

<template>
    <div class="flex items-center gap-px">
        <span class="text-xs text-black/80 mr-1">{{ Math.floor(level) }}%</span>
        <div class="w-8 h-4 bg-transparent rounded-[4.5px] border-[1.5px] p-px flex items-center">
          <div
            class="h-full bg-green-500/90 rounded-[2.5px] transition-all ease-in-out"
            :style="{ width: `${level}%` }"
          ></div>
        </div>
        <div class="w-[2.5px] h-1.5 bg-[#E6E7EB] rounded-r-full"></div>
    </div>
</template>