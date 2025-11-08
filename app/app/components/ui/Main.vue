<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { useStorage } from "@vueuse/core";
import Nav from "./Nav.vue";
import AppLogo from "./AppLogo.vue";

const mainRef = ref<HTMLElement | null>(null);
const sidebarState = useStorage("sidebar", "expanded");

const isSidebarToggled = computed(() => sidebarState.value === "collapsed");

const toggleSidebar = () => {
  const sidebar = mainRef.value;
  if (!sidebar) return;
  const isExpanded = sidebar.getAttribute("data-sidebar") === "expanded";
  sidebar.setAttribute("data-sidebar", isExpanded ? "collapsed" : "expanded");
  sidebarState.value = isExpanded ? "collapsed" : "expanded";
};

provide("toggleSidebar", toggleSidebar);
</script>

<template>
  <main
    id="main"
    ref="mainRef"
    class="fixed top-2 bottom-2 left-2 right-2"
    :data-sidebar="sidebarState || 'expanded'"
  >
    <Nav />
    <div
      class="absolute top-0 right-0 bottom-0 sidebar-pos overflow-auto z-30 transition-[left] duration-300 rounded-lg border border-black/30 bg-white"
    >
      <slot />
    </div>
    <div
      class="absolute z-40 flex items-center justify-between py-4 pl-2 pr-4 m-0 sidebar-width min-w-8 transition-[width] duration-300"
    >
      <div
        class="flex items-center gap-3 transition-width duration-300"
        :class="[
          isSidebarToggled ? 'invisible' : '',
          isSidebarToggled ? 'max-w-2 opacity-0' : 'max-w-96 opacity-100',
        ]"
      >
        <AppLogo class="size-6" />
        <h1 class="text-xl font-bold">TrailSense</h1>
      </div>
      <button @click="toggleSidebar" class="p-2 rounded-md bg-white">
        <svg
          width="26"
          height="19"
          viewBox="0 0 26 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.75 0.75V17.75M22.0833 0.75H3.41667C1.94391 0.75 0.749999 1.59568 0.749999 2.63889V15.8611C0.749999 16.9043 1.94391 17.75 3.41667 17.75H22.0833C23.5561 17.75 24.75 16.9043 24.75 15.8611V2.63889C24.75 1.59568 23.5561 0.75 22.0833 0.75Z"
            stroke="black"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </main>
</template>

<style>
:root {
  --side-nav-width: 410px;
  --side-nav-width-collapsed: 0px;
}

[data-sidebar="expanded"] .sidebar-width {
  width: var(--side-nav-width);
}
[data-sidebar="collapsed"] .sidebar-width {
  width: var(--side-nav-width-collapsed);
}

[data-sidebar="expanded"] .sidebar-pos {
  left: var(--side-nav-width);
}
[data-sidebar="collapsed"] .sidebar-pos {
  left: var(--side-nav-width-collapsed);
}
</style>
