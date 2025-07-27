import { useQuery } from '@tanstack/vue-query';
import { api_tmdb } from '..';

const useGetSearchQuery = (params: Ref<SEARCH.GetSearchReq>) => {
	return useQuery<SEARCH.GetSearchRes, Error>({
		queryKey: computed(() => [
			`/search/multi?query=${params.value.search}&page=${params.value.page}`
		]),
		queryFn: async () => {
			const response = await api_tmdb.get(
				`/search/multi?query=${params.value.search}&page=${params.value.page}`
			);
			return response.data;
		}
	});
};

export { useGetSearchQuery };
