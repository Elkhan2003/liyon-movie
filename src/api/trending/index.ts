import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api_unimedx } from '..';

const useCreateTodoMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<TODO.CreateTodoRes, Error, TODO.CreateTodoReq>({
		mutationFn: async (data) => {
			const response = await api_unimedx.post('/todo', data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['/todo'] });
		}
	});
};

const useGetTodosQuery = (params?: TODO.GetTodosReq) => {
	return useQuery<TODO.GetTodosRes, Error>({
		queryKey: [`/todo`, params],
		queryFn: async () => {
			const response = await api_unimedx.get('/todo', { params });
			return response.data;
		}
	});
};

const useGetTodoByIdQuery = (
	id: TODO.GetTodoByIdReq,
	{ enabled = true }: { enabled?: boolean } = {}
) => {
	return useQuery<TODO.GetTodoByIdRes, Error>({
		queryKey: [`/todo/${id}`],
		queryFn: async () => {
			const response = await api_unimedx.get(`/todo/${id}`);
			return response.data;
		},
		enabled
	});
};

const useUpdateTodoMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<TODO.UpdateTodoRes, Error, TODO.UpdateTodoReq>({
		mutationFn: async ({ id, data }) => {
			const response = await api_unimedx.patch(`/todo/${id}`, data);
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [`/todo/${variables.id}`]
			});
			queryClient.invalidateQueries({ queryKey: ['/todo'] });
		}
	});
};

const useDeleteTodoMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<TODO.DeleteTodoRes, Error, TODO.DeleteTodoReq>({
		mutationFn: async (id) => {
			const response = await api_unimedx.delete(`/todo/${id}`);
			return response.data;
		},
		onSuccess: (_, id) => {
			queryClient.removeQueries({ queryKey: [`/todo/${id}`] });
			queryClient.invalidateQueries({ queryKey: ['/todo'] });
		}
	});
};

export {
	useGetTodosQuery,
	useGetTodoByIdQuery,
	useCreateTodoMutation,
	useUpdateTodoMutation,
	useDeleteTodoMutation
};
