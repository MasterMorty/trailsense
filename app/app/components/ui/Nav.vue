<script setup>
import { inject, ref } from "vue";
import { useStorage } from "@vueuse/core";

const sidebarState = useStorage("sidebar", "expanded");

const toggleSidebar = inject("toggleSidebar");
const isSidebarToggled = ref(sidebarState.value === "collapsed");

const toggleSidebarWrapper = () => {
  toggleSidebar();
  isSidebarToggled.value = !isSidebarToggled.value;
};
</script>

<template>
  <aside
    class="flex flex-col absolute top-0 left-0 bottom-0 z-20 w-(--side-nav-width)"
  >
    <!-- Primary Navigation Menu -->
    <div class="h-full flex flex-col justify-between">
      <div>
        <div class="pl-2 pr-4 py-4 m-0 w-(--side-nav-width) space-y-0.5">
          <!-- Dynamic Nav Links -->
          <button v-for="i in 3" :key="i">
            {{ `Nav Item ${i}` }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
