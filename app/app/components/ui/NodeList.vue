<script setup lang="ts">
import type { Node } from "~~/shared/db/schema";

defineProps({
  nodes: {
    type: Array as () => Array<Node>,
    required: true,
  },
});
</script>

<template>
  <ul class="space-y-2">
    <li
      v-for="node in nodes"
      :key="node.id"
      class="flex flex-col gap-1 p-3 bg-white rounded-2xl cursor-pointer drop-shadow-[0_0px_10px_rgba(0,0,0,0.10)] hover:drop-shadow-[0_0_1px_rgba(0,0,0,0)] hover:bg-[#F4F4F4] transition-all duration-300"
    >
    <div class="w-full flex justify-between items-center gap-1">
        <span class="font-semibold text-gray-800">Trailname</span>
        <span class="text-sm text-gray-800">{{ node.activationsToday || 0 }} current activations</span>
    </div>
    <div class="w-full flex justify-between items-center">
        <ui-status class="w-fit" :status="node.status" />
        <ui-battery :level="80" />
    </div>
    </li>
  </ul>
</template>