import { api } from "../../../../app/api";

export const ClientApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getClientList: builder.query({
			query: (body) => {
				return {
					url: "clientList",
					method: "POST",
					body,
				};
			},
			providesTags: ["Client"],
		}),
		showManager: builder.query({
			query: (id) => {
				return {
					url: `clientlist/showManagers/${id}`,
					method: "POST",
				};
			},
			providesTags: ["Manager"],
		}),
		storeManager: builder.mutation({
			query: (body) => {
				return {
					url: "clientlist/storeManagers",
					method: "POST",
					body,
				};
			},
			invalidatesTags: ["Manager"],
		}),
	}),
});

export const {
	useGetClientListQuery,
	useShowManagerQuery,
	useStoreManagerMutation,
} = ClientApi;
