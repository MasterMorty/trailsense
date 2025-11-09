<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { motion } from "motion-v";

const props = defineProps({
  modelValue: {
    type: [Date, null] as unknown as () => Date | null,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const today = new Date();
const currentDate = ref(props.modelValue || today);
const selectedDate = ref<Date | null>(props.modelValue || today);

// Emit the default today value if no modelValue is provided
if (!props.modelValue) {
  emit("update:modelValue", today);
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedDate.value = newValue;
      currentDate.value = newValue;
    }
  }
);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const displayMonth = computed(() => {
  return `${
    months[currentDate.value.getMonth()]
  } ${currentDate.value.getFullYear()}`;
});

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();

  const lastDay = new Date(year, month + 1, 0);
  const daysInCurrentMonth = lastDay.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - i),
    });
  }

  for (let day = 1; day <= daysInCurrentMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
    });
  }

  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
    });
  }

  return days;
});

const isSelected = (date: Date) => {
  if (!selectedDate.value) return false;
  return (
    date.getDate() === selectedDate.value.getDate() &&
    date.getMonth() === selectedDate.value.getMonth() &&
    date.getFullYear() === selectedDate.value.getFullYear()
  );
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const selectDate = (date: Date) => {
  selectedDate.value = date;
  emit("update:modelValue", date);
  isOpen.value = false;
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const togglePicker = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (e: Event) => {
  if (!(e.target as HTMLElement).closest(".date-picker")) {
    isOpen.value = false;
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("click", closeDropdown);
}
</script>

<template>
  <div class="relative date-picker">
    <button
      @click.stop="togglePicker"
      class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-[#F4F4F4] text-sm"
    >
      <svg
        class="size-5 text-black/90"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span class="text-black/70">
        Pick a date
      </span>
    </button>

    <!-- Date Picker Dialog -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute top-full mt-2 w-80 bg-white rounded-2xl shadow-lg overflow-hidden z-50 border border-white/10 p-2"
      >
        <!-- Month Navigation -->
        <div class="flex items-center justify-between mb-6">
          <button
            @click.stop="previousMonth"
            class="p-3 flex items-center justify-center rounded-lg hover:bg-[#F4F4F4] transition-colors"
          >
            <svg
              class="size-4 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <span class="text-black font-medium text-sm">
            {{ displayMonth }}
          </span>

          <button
            @click.stop="nextMonth"
            class="p-3 flex items-center justify-center rounded-lg hover:bg-[#F4F4F4] transition-colors"
          >
            <svg
              class="size-4 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <!-- Days of Week -->
        <div class="flex justify-around mb-2">
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="text-center text-gray-400 text-xs font-medium py-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="flex justify-around flex-wrap gap-1">
          <button
            v-for="(dayObj, index) in daysInMonth"
            :key="index"
            @click.stop="selectDate(dayObj.date)"
            class="relative size-10 text-sm flex items-center justify-center rounded-xl transition-all"
            :class="{
              'text-gray-300': !dayObj.isCurrentMonth,
              'text-black hover:bg-[#F4F4F4]':
            dayObj.isCurrentMonth && !isSelected(dayObj.date),
              'bg-[#F4F4F4] text-black':
            isToday(dayObj.date) && !isSelected(dayObj.date),
            }"
          >
            <span class="relative z-10" v-if="!isSelected(dayObj.date)">
              {{ dayObj.day }}
            </span>

            <!-- Selected Date Highlight -->
            <div
              v-if="isSelected(dayObj.date)"
              class="absolute inset-0 bg-[#6EE7B7] rounded-xl"
            />
            <span
              v-if="isSelected(dayObj.date)"
              class="relative z-10 text-white"
            >
              {{ dayObj.day }}
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active {
  animation: dropdown-in 0.2s ease-out;
}

.dropdown-leave-active {
  animation: dropdown-out 0.15s ease-in;
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdown-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}
</style>
