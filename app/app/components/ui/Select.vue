<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue";
import { motion } from "motion-v";

interface FilterValue {
  include: boolean;
  data: string[];
}

const props = defineProps({
  modelValue: {
    type: Object as () => FilterValue | undefined,
    default: undefined,
  },
  options: {
    type: Array as () => { label: string }[],
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const buttonRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const menuPosition = ref<"bottom" | "top">("bottom");
const activeMode = ref(0);

const selectedFilter = computed({
  get: () => props.modelValue || { include: true, data: [] },
  set: (value) => emit("update:modelValue", value),
});

const syncActiveMode = () => {
  activeMode.value = selectedFilter.value.include ? 0 : 1;
};

onMounted(() => {
  syncActiveMode();
});

const toggleOption = (optionId: string) => {
  const currentData = Array.isArray(selectedFilter.value?.data) 
    ? [...selectedFilter.value.data] 
    : [];
  const index = currentData.indexOf(optionId);

  if (index > -1) {
    currentData.splice(index, 1);
  } else {
    currentData.push(optionId);
  }

  selectedFilter.value = {
    include: activeMode.value === 0,
    data: currentData,
  };
};

const setIncludeMode = (isInclude: boolean) => {
  activeMode.value = isInclude ? 0 : 1;
  selectedFilter.value = {
    include: isInclude,
    data: Array.isArray(selectedFilter.value?.data) ? selectedFilter.value.data : [],
  };
};

const clearFilter = () => {
  selectedFilter.value = {
    include: true,
    data: [],
  };
  activeMode.value = 0;
};

const isSelected = (optionId: string) => {
  return selectedFilter.value?.data?.includes(optionId) ?? false;
};

const filterDisplayText = computed(() => {
  const data = selectedFilter.value?.data ?? [];
  const dataLength = data.length;
  const isInclude = selectedFilter.value?.include ?? true;

  if (dataLength === 0) {
    return "Filter";
  } else if (dataLength === 1) {
    const item = data[0];
    const label = item ? item.charAt(0).toUpperCase() + item.slice(1) : "";
    return isInclude ? label : `Not ${label}`;
  } else {
    return isInclude ? "Multiple" : "Exclude Multiple";
  }
});

const calculatePosition = () => {
  if (!buttonRef.value || !dropdownRef.value) return;

  const buttonRect = buttonRef.value.getBoundingClientRect();
  const dropdownHeight = dropdownRef.value.offsetHeight;
  const viewportHeight = window.innerHeight;

  const spaceBelow = viewportHeight - buttonRect.bottom;
  const spaceAbove = buttonRect.top;

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    menuPosition.value = "top";
  } else {
    menuPosition.value = "bottom";
  }
};

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    await nextTick();
    calculatePosition();
  }
};

const closeDropdown = (e: Event) => {
  if (!(e.target as HTMLElement).closest(".filter-select")) {
    isOpen.value = false;
  }
};

const handleScroll = () => {
  if (isOpen.value) {
    calculatePosition();
  }
};

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("click", closeDropdown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", closeDropdown);
    window.removeEventListener("scroll", handleScroll, true);
    window.removeEventListener("resize", handleScroll);
  }
});
</script>

<template>
  <div class="relative inline-block filter-select">
    <button
      ref="buttonRef"
      class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-sm hover:bg-[#F4F4F4] transition-color duration-300"
      @click.stop="toggleDropdown"
    >
      <span class="text-gray-500">
        {{ filterDisplayText }}
      </span>
      <!-- Chevron -->
      <motion.svg
        class="size-3 focus:outline-none"
        :animate="{ rotate: isOpen ? 180 : 0 }"
        :transition="{
          type: 'spring',
          visualDuration: 0.3,
          bounce: 0.3,
        }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </motion.svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      :name="menuPosition === 'top' ? 'dropdown-up' : 'dropdown-down'"
      @enter="calculatePosition"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute right-0 w-56 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-white/10"
        :class="{
          'bottom-full mb-1': menuPosition === 'top',
          'top-full mt-1': menuPosition === 'bottom',
        }"
      >
      <div class="p-2">
        <div
          class="pl-1.5 text-md font-semibold flex justify-between items-center"
        >
          <span> Filter </span>
          <span
            @click.stop="clearFilter"
            class="text-red-400 cursor-pointer text-xs font-medium px-2 py-1 rounded-sm hover:bg-red-200"
          >
            clear
          </span>
        </div>

        <div
            class="relative grid grid-cols-2 bg-[#F4F4F4] p-1 px-1.5 rounded-[12px] text-sm my-2"
          >
            <button
              v-for="(option, index) in [
                'Include',
                'Exclude',
              ]"
              :key="option"
              @click="setIncludeMode(index === 0)"
              class="relative z-10 text-black text-center py-1.5 rounded-md transition-colors"
            >
              <span class="relative z-10">
                {{ option }}
              </span>

              <motion.div
                v-if="activeMode === index"
                class="underline1 bg-white absolute inset-0 -left-0.5 -right-0.5 rounded-lg z-0"
                layout-id="underline1"
                :transition="{
                  type: 'spring',
                  visualDuration: 0.2,
                  bounce: 0.2,
                }"
              ></motion.div>
            </button>
          </div>

        <button
          v-for="(option, index) in options"
          :key="index"
          @click.stop="toggleOption(option.label)"
          class="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#F4F4F4] rounded-md"
        >
          <div class="flex items-center gap-3">
            <span class="text-sm">{{ option.label }}</span>
          </div>

          <svg
            v-if="isSelected(option.label)"
            class="w-5 h-5 text-[#0A84FF]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </div>
    </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-down-enter-active {
  animation: dropdown-down-in 0.2s ease-out;
}

.dropdown-down-leave-active {
  animation: dropdown-down-out 0.15s ease-in;
}

@keyframes dropdown-down-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdown-down-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}

.dropdown-up-enter-active {
  animation: dropdown-up-in 0.2s ease-out;
}

.dropdown-up-leave-active {
  animation: dropdown-up-out 0.15s ease-in;
}

@keyframes dropdown-up-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdown-up-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
}
</style>
