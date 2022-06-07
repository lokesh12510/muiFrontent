import { api } from "../../../../app/api";
import { BASE_URL } from "../../../../constants/config";
import { saveAs } from "file-saver";

export const PointsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAccManager: builder.query({
			query: (id) => {
				return {
					url: `pointstatement/getaccountmanager/${id}`,
					method: "POST",
				};
			},
		}),
		getPoints: builder.query({
			query: ({ id, from_date, to_date }) => {
				console.log(id, from_date, to_date);
				return {
					url: `pointstatement/getcalculatedpoints/${id}`,
					method: "POST",
					body: {
						from_date: from_date,
						to_date: to_date,
					},
				};
			},
		}),
		generateReport: builder.mutation({
			query: ({ fileName, ...body }) => {
				return {
					url: "pointstatement/generatereport/",
					method: "POST",
					body,
				};
			},
			async onQueryStarted(
				{ fileName = "generateReport" },
				{ dispatch, queryFulfilled, getState }
			) {
				console.log(fileName);
				let token = getState().auth.token;
				try {
					// Resolving the private API call
					await queryFulfilled;
					// Just a random public API call
					const response = await fetch(`${BASE_URL}pointstatement/getpointstatement`, {
						method: "GET",
						headers: new Headers({
							Accept: "application/json",
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
							responseType: "blob",
						}),
					});
					const pdf = await response.blob();
					if (pdf) {
						const pdfBlob = new Blob([pdf], { type: "application/pdf" });
						saveAs(pdfBlob, `${fileName}.pdf`);
					}
				} catch (e) {
					console.error(e);
					return e;
				}
			},
		}),
		getStatement: builder.query({
			query: () => {
				return {
					url: "pointstatement/getpointstatement",
					method: "GET",
					responseType: "blob",
				};
			},
		}),
	}),
});

export const {
	useGetAccManagerQuery,
	useGetPointsQuery,
	useGenerateReportMutation,
	useGetStatementQuery,
} = PointsApi;
