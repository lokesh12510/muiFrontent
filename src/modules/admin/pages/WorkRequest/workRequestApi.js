import { api } from "../../../../app/api";

export const WorkRequestApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getWorkRequest: builder.query({
			query: (body) => {
				return {
					url: "workrequest",
					method: "POST",
					body,
				};
			},
			providesTags: ["Work"],
		}),

		storeWorkRequest: builder.mutation({
			query: (body) => {
				console.log(body);
				return {
					url: "workrequest/store",
					method: "POST",
					body,
				};
			},
			invalidatesTags: (result, error, id) => ["Work"],
		}),

		deleteWorkRequest: builder.mutation({
			query: (id) => {
				return {
					url: `/workrequest/delete/${id}`,
					method: "POST",
				};
			},
			invalidatesTags: (result, error, id) => ["Work"],
		}),

		showWorkById: builder.query({
			query: (id) => {
				return {
					url: `/workrequest/show/${id}`,
					method: "POST",
				};
			},
		}),
	}),
});

export const {
	useGetWorkRequestQuery,
	useStoreWorkRequestMutation,
	useShowWorkByIdQuery,
	useDeleteWorkRequestMutation,
} = WorkRequestApi;
