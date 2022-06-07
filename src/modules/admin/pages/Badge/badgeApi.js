import { api } from "../../../../app/api";

export const BadgeApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getBadgeList: builder.query({
			query: (body) => {
				console.log(body);
				return {
					url: `badge/${body.project_id}`,
					method: "POST",
					body,
				};
			},
			providesTags: ["Badge"],
		}),
		storeBadge: builder.mutation({
			query: (body) => {
				console.log(body);

				let urlID = body.project_id ? body.project_id : body.id;

				return {
					url: `badge/store/${urlID}`,
					method: "POST",
					body,
				};
			},
			invalidatesTags: ["Badge"],
		}),
		deleteBadge: builder.mutation({
			query: (id) => {
				return {
					url: `badge/delete/${id}`,
					method: "GET",
				};
			},
			invalidatesTags: ["Badge"],
		}),
	}),
});

export const {
	useGetBadgeListQuery,
	useStoreBadgeMutation,
	useDeleteBadgeMutation,
} = BadgeApi;
