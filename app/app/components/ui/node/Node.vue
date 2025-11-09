<script setup lang="ts">
import type { Node } from "~~/shared/db/schema";
import { motion } from "motion-v";
import { useFetch } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    node: Node;
    navigateBack: () => void;
  }>(),
  {}
);

const emit = defineEmits(["update:content", "exit", "exitAnimation"]);

const activeView = ref(0);
const selectedDate = ref<Date>(new Date());

const period = computed(() => {
  const periods = ["day", "week", "month"];
  return periods[activeView.value];
});

const apiDate = computed(() => {
  if (!selectedDate.value) return new Date().toISOString().split("T")[0];
  return selectedDate.value.toISOString().split("T")[0];
});

const { data: activityData, execute: fetchActivity } = useFetch(
  computed(
    () =>
      `/api/nodes/${props.node.id}/activities?period=${period.value}&date=${apiDate.value}`
  )
).json();

watch([selectedDate, activeView], () => {
  fetchActivity();
});

const dailyAverage = computed(() => {
  if (!activityData.value?.data) return 0;

  const totalActivations = activityData.value.data.reduce(
    (sum: number, bucket: any) => sum + (bucket.activations || 0),
    0
  );

  return Math.round(totalActivations / activityData.value.data.length);
});

const temperatureAverage = computed(() => {
  if (!activityData.value?.data) return 0;

  const totalActivations = activityData.value.data.reduce(
    (sum: number, bucket: any) => sum + (bucket.temperature || 0),
    0
  );

  return Math.round(totalActivations / activityData.value.data.length);
});

const setActiveView = (index: number) => {
  activeView.value = index;
};

const formatDate = (date: Date | null) => {
  if (!date) return "Pick a date";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatBucketLabel = (bucket: any, viewIndex: number) => {
  const start = new Date(bucket.start);

  if (viewIndex === 0) {
    return start.getHours().toString().padStart(2, '0');
  } else if (viewIndex === 1) {
    return start.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return start.getDate().toString();
  }
};

const exit = () => {
  props.navigateBack();
  emit("exitAnimation");
  setTimeout(() => {
    emit("exit");
  }, 300);
};
</script>

<template>
  <div>
    <!-- Top -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <!-- Back -->
        <button
          @click="exit"
          class="p-2 bg-white hover:bg-[#F4F4F4] rounded-md transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div>
          <h2 class="font-bold text-black/90 leading-4">Node Details</h2>
          <p class="text-xs text-black/60">Arduino ID: {{ node.id }}</p>
        </div>
      </div>
      <ui-status :status="node.status" />
    </div>

    <!-- Battery -->
    <div class="grid grid-cols-2 gap-4 mx-2 mt-10">
      <div
        class="drop-shadow-[0_0px_10px_rgba(0,0,0,0.10)] p-4 bg-white rounded-2xl flex justify-center"
      >
        <div>
          <h3 class="font-semibold text-black/80 mb-3">Battery State</h3>
          <ui-battery
            class="scale-150 translate-x-6"
            :level="node.battery * 100"
          />
        </div>
      </div>
      <div
        class="drop-shadow-[0_0px_10px_rgba(0,0,0,0.10)] p-4 bg-white rounded-2xl flex justify-center"
      >
        <div>
          <h3 class="font-semibold text-black/80 mb-2">Active Since</h3>
          <p class="text-md text-black/60">
            {{ node.activeSince || "21. July 2025" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Date Picker -->
    <div
      class="mt-6 p-2 bg-white rounded-2xl drop-shadow-[0_0px_10px_rgba(0,0,0,0.10)]"
    >
      <!-- TabGroub -->
      <div
        class="relative grid grid-cols-3 bg-[#F4F4F4] p-1 px-1.5 rounded-[12px] text-sm"
      >
        <div class="absolute z-0 inset-0 top-3 bottom-3 grid grid-cols-3">
          <div class="" />
          <div class="border-x border-black/20" />
          <div class="" />
        </div>
        <button
          v-for="(option, index) in ['Day', 'Week', 'Month']"
          @click="setActiveView(index)"
          class="relative z-10 text-black text-center py-1.5 rounded-md transition-colors"
        >
          <span class="relative z-10">
            {{ option }}
          </span>

          <motion.div
            v-if="activeView === index"
            class="date-underline bg-white absolute inset-0 -left-0.5 -right-0.5 rounded-lg z-0"
            layout-id="date-underline"
            :transition="{
              type: 'spring',
              visualDuration: 0.2,
              bounce: 0.2,
            }"
          ></motion.div>
        </button>
      </div>

      <!-- Date Picker Content -->
      <div class="w-full flex items-center justify-between mt-4">
        <UiDatePicker v-model="selectedDate" />
        <div class="pr-2 text-right text-sm">
          {{ formatDate(selectedDate) }}
        </div>
      </div>
      <!-- Activity Data View -->
      <div class="p-4 mt-4 bg-[#F4F4F4] rounded-[12px]">
        <h3 class="font-semibold text-black/80 mb-1">
          {{ activeView === 0 ? "Day" : activeView === 1 ? "Week" : "Month" }}
          Activations
        </h3>

        <div v-if="activityData">
          <!-- Summary Stats -->
          <p class="text-xs text-black/60 mb-1">Average {{ dailyAverage }}</p>

          <!-- Data Buckets -->
          <div class="mt-4 relative">
            <!-- Chart Container -->
            <div class="h-28 relative flex items-end justify-between gap-1 px-4 border-b border-gray-200">
              <div
                v-for="(bucket, index) in activityData.data"
                :key="index"
                class="flex-1 bg-gray-300 hover:bg-[#6EE7B7] rounded-t transition-all cursor-pointer relative group"
                :style="{ 
                  height: `${Math.max((bucket.activations / (activityData.totals?.activations || 1)) * 300, 2)}%`,
                  minHeight: '0px'
                }"
              >
                <!-- Tooltip on hover -->
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-xs py-1 px-2 rounded-md whitespace-nowrap z-10 drop-shadow-[0_0px_10px_rgba(0,0,0,0.10)]">
                  <div class="font-semibold">{{ formatBucketLabel(bucket, activeView) }}</div>
                  <div>Activations: {{ bucket.activations }}</div>
                </div>
              </div>
            </div>
            
            <!-- Time Labels -->
            <div class="flex justify-between px-4 mt-2 text-xs text-gray-500">
              <span
                v-for="(bucket, index) in activityData.data"
                :key="index"
                v-show="activeView === 0 ? index % 3 === 0 : activeView === 1 ? true : index % 3 === 0"
                class="text-center"
                :style="{ 
                  width: activeView === 1 ? `${100 / 7}%` : activeView === 0 ? `${100 / 8}%` : `${100 / 10}%`
                }"
              >
                {{ formatBucketLabel(bucket, activeView) }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="text-black/60">Loading activity data...</div>
      </div>

      <!-- Temperature Data View -->
      <div class="p-4 mt-4 bg-[#F4F4F4] rounded-[12px]">
        <h3 class="font-semibold text-black/80 mb-1">
          {{ activeView === 0 ? "Daily" : activeView === 1 ? "Weekly" : "Monthly" }}
          Temperature
        </h3>

        <div v-if="activityData">
          <!-- Summary Stats -->
          <p class="text-xs text-black/60 mb-1">Average today: <span class="text-[10px]">{{ temperatureAverage }} °C</span></p>

          <!-- Data Buckets -->
          <div class="mt-4 relative">
            <!-- Chart Container -->
            <div class="h-20 relative px-4 pb-8">
              <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <!-- Line path -->
                <polyline
                  :points="activityData.data.map((bucket: any, index: number) => {
                    const x = (index / (activityData.data.length - 1)) * 100;
                    const minTemp = Math.min(...activityData.data.map((b: any) => b.temperature || 0));
                    const maxTemp = Math.max(...activityData.data.map((b: any) => b.temperature || 0));
                    const range = maxTemp - minTemp || 1;
                    const y = 100 - ((bucket.temperature - minTemp) / range) * 80 - 10;
                    return `${x},${y}`;
                  }).join(' ')"
                  fill="none"
                  stroke="#F59E0B"
                  stroke-width="2"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </div>
            
            <!-- Time Labels -->
            <div class="flex justify-between px-4 mt-2 text-xs text-gray-500">
              <span
                v-for="(bucket, index) in activityData.data"
                :key="index"
                v-show="activeView === 0 ? index % 3 === 0 : activeView === 1 ? true : index % 3 === 0"
                class="text-center"
                :style="{ 
                  width: activeView === 1 ? `${100 / 7}%` : activeView === 0 ? `${100 / 8}%` : `${100 / 10}%`
                }"
              >
                {{ formatBucketLabel(bucket, activeView) }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="text-black/60">Loading temperature data...</div>
      </div>
    </div>
  </div>
</template>
