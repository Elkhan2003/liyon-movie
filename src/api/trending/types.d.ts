namespace TODO {
	type CreateTodoRes = ITodoData;
	type CreateTodoReq = Omit<ITodoData, 'id'> & {
		password?: string;
	};

	type GetTodosRes = {
		meta: {
			total_items: number;
			total_pages: number;
			current_page: number;
			per_page: number;
			remaining_count: number;
		};
		items: ITodoData[];
	};
	type GetTodosReq = {
		page?: number;
		limit?: number;
	};

	type GetTodoByIdRes = ITodoData;
	type GetTodoByIdReq = number;

	type UpdateTodoRes = ITodoData;
	type UpdateTodoReq = {
		id: number;
		data: Partial<Omit<ITodoData, 'id'>> & {
			password?: string;
		};
	};

	type DeleteTodoRes = void;
	type DeleteTodoReq = number;
}
