<script setup>
import { ref } from "vue";
import { motion } from "motion-v";
import Switcher from "./switcher/Switcher.vue";

const activeView = ref(0);
</script>

<template>
  <aside
    class="flex flex-col absolute top-0 left-0 bottom-0 z-20 w-(--side-nav-width)"
  >
    <!-- Primary Navigation Menu -->
    <div class="h-full flex flex-col justify-between">
      <div>
        <div
          class="pl-2 pr-4 py-4 m-0 w-(--side-nav-width) space-y-0.5 mt-14 h-full"
        >
          <div
            class="relative grid grid-cols-3 bg-[#F4F4F4] p-1 px-1.5 rounded-[12px] text-sm"
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
              @click="activeView = index"
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

          <Switcher v-model="activeView">
            <template #0="{ isActive }">
              <div class="w-full h-full">
                <p class="text-black">All trails content here</p>
              </div>
            </template>

            <template #1="{ isActive }">
              <div>
                <p class="text-black">Most popular trails content here</p>
              </div>
            </template>

            <template #2="{ isActive }">
              <div>
                <p class="text-black">Least popular trails content here</p>
              </div>
            </template>
          </Switcher>
        </div>
      </div>
    </div>
  </aside>
</template>
