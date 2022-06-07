import React, { useState, useRef } from "react";
// Mui
import Paper from "@mui/material/Paper";
import { GridActionsCellItem } from "@mui/x-data-grid";
// Router
import { useNavigate } from "react-router-dom";
// Custom Styles
import { StyledTableContainer } from "../../../../themes/GlobalStyles";
// Api
import { useGetClientListQuery } from "./clientApi";
import { adminUrls } from "../../urls";
// Custom Components
import DataTable from "../../../../components/DataTable";
import ManageModal from "./ManageModal";
// icons
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export default function ClientList({ filterText }) {
	const mangeModalRef = useRef();
	const handleMangeModalRef = (item) => {
		mangeModalRef.current.openModal(item);
	};

	const initialTableValues = {
		loading: false,
		rows: [],
		rowCount: 10,
		page: 0,
		pageSize: 10,
		search: {},
		filterText: "",
	};

	const [tableValues, setTableValues] = useState(initialTableValues);

	const navigate = useNavigate();

	const columns = [
		{
			field: "name",
			headerName: "Client Name",
			width: 150,
			flex: 1,
		},
		{
			field: "Account Name",
			headerName: "Account Name",
			width: 200,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => [
				<GridActionsCellItem
					icon={<PersonAddAltIcon />}
					label="account"
					onClick={() => handleMangeModalRef(params.row)}
				/>,
			],
		},
		{
			field: "Work Request",
			headerName: "Work Request",
			width: 200,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => {
				return [
					<GridActionsCellItem
						icon={<RemoveRedEyeIcon />}
						label="points"
						onClick={() =>
							navigate(`${adminUrls.workRequest}`, {
								state: { client: { id: params?.row?.id, name: params?.row?.name } },
							})
						}
					/>,
				];
			},
		},
	];

	// project Api
	const {
		isLoading,
		data: clientData,
		isFetching,
	} = useGetClientListQuery({
		client_name: filterText,
		page: tableValues.page + 1,
		perPage: tableValues.pageSize,
	});

	clientData && console.log(clientData?.list);

	return (
		<>
			<StyledTableContainer component={Paper}>
				{isLoading && <p> Loading...</p>}
				{clientData && (
					<DataTable
						getRowId={(row) => {
							console.log(row.name);
							return row.name;
						}}
						loading={isLoading || isFetching}
						columns={columns}
						rows={clientData?.list}
						rowCount={clientData?.total}
						page={tableValues.page}
						pageSize={tableValues.pageSize}
						onPageChange={(page) => {
							setTableValues((prev) => ({ ...prev, page: page }));
						}}
						onPageSizeChange={(pageSize) => {
							setTableValues((prev) => ({ ...prev, pageSize: pageSize }));
						}}
					/>
				)}
			</StyledTableContainer>

			<ManageModal ref={mangeModalRef} />
		</>
	);
}
