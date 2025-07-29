// ! Define your state, actions, and getters here
export const useCounterStore = defineStore('counter', {
	state: () => ({
		count: 0
	}),
	actions: {
		increment() {
			this.count++;
		},
		decrement() {
			this.count--;
		}
	}
});

// export const useCounterStore = defineStore('counter', () => {
//   // State
//   const count = ref(0);

//   // Actions
//   const increment = () => {
//     count.value++;
//   };

//   const decrement = () => {
//     count.value--;
//   };

//   // Getters
//   const doubleCount = computed(() => count.value * 2);

//   return {
//     count,
//     increment,
//     decrement,
//     doubleCount
//   };
// });
