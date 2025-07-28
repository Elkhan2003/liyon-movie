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
