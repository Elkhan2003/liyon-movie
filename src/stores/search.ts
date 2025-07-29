export const useSearchStore = defineStore('search', () => {
	const isOpen = ref<boolean>(false);
	const searchQuery = ref<string>('');
	const searchResults = ref<any[]>([]);

	const toggleSearchModal = () => {
		isOpen.value = !isOpen.value;
	};

	const setSearchQuery = (query: string) => {
		searchQuery.value = query;
	};

	const setSearchResults = (results: any[]) => {
		searchResults.value = results;
	};

	return {
		isOpen,
		searchQuery,
		searchResults,
		toggleSearchModal,
		setSearchQuery,
		setSearchResults
	};
});
