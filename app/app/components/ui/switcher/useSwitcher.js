import { inject } from 'vue';

/**
 * Composable to use slide switcher navigation in child components
 * @returns {Object} Navigation methods and current state
 */
export function useSwitcher() {
  const switcher = inject('switcher', null);
  
  if (!switcher) {
    console.warn('useSwitcher must be used within a Switcher component');
    return {
      navigateForward: () => {},
      navigateBack: () => {},
      navigateToBreadcrumb: () => {},
      reset: () => {},
      currentPath: [],
      currentIndex: { value: 0 }
    };
  }
  
  return switcher;
}
