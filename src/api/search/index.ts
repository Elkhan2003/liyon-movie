import { useQuery } from '@tanstack/vue-query';
import { api_tmdb } from '..';

const useGetSearchQuery = (params: Ref<SEARCH.GetSearchReq>) => {
	const url = `/search/multi?query=${params.value.search}&page=${params.value.page}`;

	return useQuery<SEARCH.GetSearchRes, Error>({
		queryKey: computed(() => [url]),
		queryFn: async () => {
			const response = await api_tmdb.get(url);
			return response.data;
		}
	});
};

export { useGetSearchQuery };
