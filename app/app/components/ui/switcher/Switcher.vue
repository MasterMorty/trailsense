<script setup>
import { ref, computed, provide, inject, watch } from "vue";
import { motion } from "motion-v";

const props = defineProps({
  animationDuration: {
    type: Number,
    default: 0.3
  },
  modelValue: {
    type: Number,
    default: undefined
  }
});

const emit = defineEmits(['update:modelValue']);

const currentPath = ref([0]);

const currentIndex = computed({
  get: () => {
    if (props.modelValue !== undefined) {
      return props.modelValue;
    }
    return currentPath.value[currentPath.value.length - 1];
  },
  set: (value) => {
    if (props.modelValue !== undefined) {
      emit('update:modelValue', value);
    } else {
      currentPath.value.push(value);
    }
  }
});

watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    currentPath.value = [newValue];
  }
});

const navigateForward = (targetIndex) => {
  if (typeof targetIndex !== 'number') {
    console.warn('navigateForward requires a numeric index');
    return;
  }
  
  if (props.modelValue !== undefined) {
    emit('update:modelValue', targetIndex);
  } else {
    currentPath.value.push(targetIndex);
  }
};

const navigateBack = () => {
  if (currentPath.value.length > 1) {
    const newPath = [...currentPath.value];
    newPath.pop();
    const newIndex = newPath[newPath.length - 1];
    
    if (props.modelValue !== undefined) {
      emit('update:modelValue', newIndex);
    } else {
      currentPath.value.pop();
    }
  }
};

const reset = () => {
  if (props.modelValue !== undefined) {
    emit('update:modelValue', 0);
  } else {
    currentPath.value = [0];
  }
};

provide('switcher', {
  navigateForward,
  navigateBack,
  reset,
  currentPath: currentPath.value,
  currentIndex
});

const getSlideOffset = (slideIndex) => {
  const currentIdx = currentIndex.value;
  const offset = (slideIndex - currentIdx) * 100;
  return `${offset}%`;
};

const getInitialSlideOffset = (slideIndex) => {
  const offset = (slideIndex - 0) * 100;
  return `${offset}%`;
};
</script>

<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Slides Container -->
    <div class="relative w-full h-full overflow-hidden">
      <template v-for="(_, slideIndex) in $slots" :key="`slide-${slideIndex}`">
        <motion.div
          v-if="$slots[slideIndex]"
          class="absolute top-0 left-0 w-full h-full"
          :style="{ zIndex: 1000 - slideIndex }"
          :initial="{ 
            x: getInitialSlideOffset(slideIndex),
            opacity: Math.abs(slideIndex - 0) > 1 ? 0 : 1
          }"
          :animate="{ 
            x: getSlideOffset(slideIndex),
            opacity: Math.abs(slideIndex - currentIndex) > 1 ? 0 : 1
          }"
          :transition="{ 
            duration: animationDuration, 
            ease: 'easeInOut' 
          }"
        >
          <slot 
            :name="slideIndex.toString()" 
            :navigate-forward="navigateForward"
            :navigate-back="navigateBack"
            :current-path="currentPath"
            :is-active="slideIndex === currentIndex"
          />
        </motion.div>
      </template>
    </div>
  </div>
</template>