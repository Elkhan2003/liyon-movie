type ITodoData = {
	id: number;
	title: string;
};

type IMovies = {
	page: number;
	total_pages: number;
	total_results: number;
	results: Array<{
		adult: boolean;
		backdrop_path: string;
		id: number;
		title: string;
		original_title: string;
		overview: string;
		poster_path: string;
		media_type: string;
		original_language: string;
		genre_ids: Array<number>;
		popularity: number;
		release_date: string;
		video: boolean;
		vote_average: number;
		vote_count: number;
	}>;
};
