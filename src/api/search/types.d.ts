namespace SEARCH {
	type GetSearchRes = IMovies;
	type GetSearchReq = {
		search: string;
		page: number;
	};
}
