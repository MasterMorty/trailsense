<script setup lang="ts">
import { ref, computed } from "vue";
import { motion } from "motion-v";
import { useFetch } from "@vueuse/core";
import type { Node } from "~~/shared/db/schema";

const activeView = ref(0);
const selectedNode = ref<Node | null>(null);
const showFilter = ref(true);

const { data } = useFetch("/api/nodes").json();

const selectedFilter = ref<{ include: boolean; data: string[] }>({
  include: true,
  data: [],
});

const filterOptions = [
  { key: "healthy", label: "Healthy", path: "status" },
  { key: "battery_low", label: "Battery low", path: "status" },
  { key: "offline", label: "Offline", path: "status" },
];

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
};

const filteredData = computed(() => {
  if (
    !selectedFilter.value ||
    !Array.isArray(selectedFilter.value.data) ||
    selectedFilter.value.data.length === 0
  ) {
    return data.value;
  }

  const { include, data: selectedKeys } = selectedFilter.value;

  return data.value?.filter((node: any) => {
    const isMatch = selectedKeys.some((key) => {
      const filterOption = filterOptions.find((opt) => opt.label === key);
      if (!filterOption) return false;

      const nodeValue = getNestedValue(node, filterOption.path);

      return nodeValue === filterOption.key;
    });
    return include ? isMatch : !isMatch;
  });
});

const sortBy = computed(() => {
  switch (activeView.value) {
    case 0:
      return "all";
    case 1:
      return "most-popular";
    case 2:
      return "least-popular";
    default:
      return "all";
  }
});

const setActiveView = (index: number) => {
  activeView.value = index;
  selectedFilter.value = { include: true, data: [] };
};

const selectNode = (node: Node) => {
  selectedNode.value = node;
  showFilter.value = false;
};
</script>

<template>
  <aside
    class="flex flex-col absolute top-0 left-0 bottom-0 z-20 w-(--side-nav-width)"
  >
    <div class="h-full flex flex-col justify-between">
      <div>
        <div class="py-4 m-0 w-(--side-nav-width) space-y-0.5 mt-14 h-full">
          <div
            class="relative grid grid-cols-3 bg-[#F4F4F4] p-1 px-1.5 rounded-[12px] text-sm mx-4"
          >
            <div class="absolute z-0 inset-0 top-3 bottom-3 grid grid-cols-3">
              <div class="" />
              <div class="border-x border-black/20" />
              <div class="" />
            </div>
            <button
              v-for="(option, index) in [
                'All',
                'Most Popular',
                'Least Popular',
              ]"
              @click="setActiveView(index)"
              class="relative z-10 text-black text-center py-1.5 rounded-md transition-colors"
            >
              <span class="relative z-10">
                {{ option }}
              </span>

              <motion.div
                v-if="activeView === index"
                class="underline bg-white absolute inset-0 -left-0.5 -right-0.5 rounded-lg z-0"
                layout-id="underline"
                :transition="{
                  type: 'spring',
                  visualDuration: 0.2,
                  bounce: 0.2,
                }"
              ></motion.div>
            </button>
          </div>

          <motion.div
            class="relative z-20 w-full flex justify-between items-center px-5 mb-3 mt-6"
            :animate="{
              maxHeight: !showFilter ? '0px' : '32px',
              opacity: !showFilter ? '0' : '1',
            }"
            :transition="{
              visualDuration: 0.4,
            }"
          >
            <span class="text-black/70 text-xs">
              {{ data?.length || 0 }} active Sensors
            </span>
            <ui-select v-model="selectedFilter" :options="filterOptions" />
          </motion.div>

          <ui-switcher v-model="activeView" class="relative z-0">
            <template #0="{ isActive }">
              <ui-switcher>
                <template #0="{ isActive, navigateForward }">
                  <div class="mx-4">
                    <ui-node-list
                      :nodes="filteredData || []"
                      :sort-by="sortBy"
                      :navigate-forward="navigateForward"
                      @select-node="(node) => selectNode(node)"
                    />
                  </div>
                </template>
                <template #1="{ isActive, navigateBack }">
                  <div class="mx-4">
                    <ui-node
                      v-if="selectedNode"
                      :node="selectedNode"
                      :navigateBack="navigateBack"
                      @exit="selectedNode = null"
                      @exit-animation="showFilter = true"
                    />
                  </div>
                </template>
              </ui-switcher>
            </template>

            <template #1="{ isActive, navigateForward }">
              <div class="mx-4">
                <ui-node-list
                  :nodes="filteredData || []"
                  :sort-by="sortBy"
                  :navigate-forward="navigateForward"
                />
              </div>
            </template>

            <template #2="{ isActive, navigateForward }">
              <div class="mx-4">
                <ui-node-list
                  :nodes="filteredData || []"
                  :sort-by="sortBy"
                  :navigate-forward="navigateForward"
                />
              </div>
            </template>
          </ui-switcher>
        </div>
      </div>
    </div>
  </aside>
</template>
