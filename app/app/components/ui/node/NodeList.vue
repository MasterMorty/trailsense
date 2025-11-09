<script setup lang="ts">
import { computed } from "vue";
import type { Node } from "~~/shared/db/schema";

const props = withDefaults(defineProps<{
  nodes: Node[];
  sortBy?: "all" | "most-popular" | "least-popular";
  navigateForward: (step: number) => void;
}>(), {
  sortBy: "all",
});

const emit = defineEmits(['select-node']);

const nodeClicked = (node: Node) => {
  props.navigateForward(1);
  emit('select-node', node);
};


const sortedNodes = computed(() => {
  if (!props.nodes || props.nodes.length === 0) {
    return [];
  }

  const nodesCopy = [...props.nodes];

  switch (props.sortBy) {
    case "most-popular":
      return nodesCopy.sort((a, b) => {
        const aActivations = (a as any).activationsToday || 0;
        const bActivations = (b as any).activationsToday || 0;
        return bActivations - aActivations;
      });
    
    case "least-popular":
      return nodesCopy.sort((a, b) => {
        const aActivations = (a as any).activationsToday || 0;
        const bActivations = (b as any).activationsToday || 0;
        return aActivations - bActivations;
      });
    
    case "all":
    default:
      return nodesCopy;
  }
});
</script>

<template>
  <ul class="space-y-2">
    <li
      v-for="node in sortedNodes"
      @click="nodeClicked(node)"
      :key="node.id"
      class="flex flex-col gap-1 p-3 bg-white rounded-2xl cursor-pointer drop-shadow-[0_0px_10px_rgba(0,0,0,0.10)] hover:drop-shadow-[0_0_1px_rgba(0,0,0,0)] hover:bg-[#F4F4F4] transition-all duration-300"
    >
    <div class="w-full flex justify-between items-center gap-1">
        <span class="font-semibold text-gray-800">Trailname</span>
        <span class="text-sm text-gray-800">{{ (node as any).activationsToday || 0 }} current activations</span>
    </div>
    <div class="w-full flex justify-between items-center">
        <ui-status class="w-fit" :status="node.status" />
        <ui-battery :level="node.battery * 100" />
    </div>
    </li>
  </ul>
</template>