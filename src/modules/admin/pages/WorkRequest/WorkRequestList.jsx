import React, { useRef, useState } from "react";
import moment from "moment";
// Mui
import Paper from "@mui/material/Paper";
import { StyledTableContainer } from "../../../../themes/GlobalStyles";
import { GridActionsCellItem } from "@mui/x-data-grid";
// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// Custom components
import FormModal from "./FormModal";
import DeleteModal from "./DeleteModal";
import DataTable from "../../../../components/DataTable";
// Api
import { useGetWorkRequestQuery } from "./workRequestApi";

export default function WorkRequestList({ filterText, projectText }) {
	const initialTableValues = {
		loading: false,
		rows: [],
		rowCount: 10,
		page: 0,
		pageSize: 10,
		search: {},
		filterText: "",
	};

	// Table filter State
	const [tableValues, setTableValues] = useState(initialTableValues);

	const columns = [
		{
			field: "client_name",
			headerName: "Client",
			valueGetter: (params) => params?.row?.client?.name,
			width: 150,
			flex: 1,
		},
		{
			field: "project_name",
			headerName: "Project",
			valueGetter: (params) => params?.row?.project?.project_name,
			width: 150,
			flex: 2,
		},
		{
			field: "title",
			headerName: "Title",
			width: 110,
			flex: 2,
		},
		{
			field: "hours",
			headerName: "Hours",
			width: 110,
			flex: 2,
		},
		{
			field: "request_points",
			headerName: "Points",
			width: 110,
			flex: 2,
		},
		{
			field: "close_date",
			headerName: "Closing Date",
			valueGetter: (params) => moment(params?.row?.close_date).format("Do MMM YYYY"),
			width: 110,
			flex: 2,
		},
		{
			field: "Action",
			headerName: "Action",
			width: 110,
			flex: 1,
			renderCell: (params) => [
				<GridActionsCellItem
					icon={<EditIcon />}
					label="Edit"
					onClick={() => handleFormModalRef(params.row)}
				/>,
				<GridActionsCellItem
					icon={<DeleteIcon />}
					label="Delete"
					onClick={() => handleDeleteModalRef(params.row)}
				/>,
			],
		},
	];

	const deleteModalRef = useRef();
	const handleDeleteModalRef = (item) => {
		deleteModalRef.current.openModal(item);
	};

	const formModalRef = useRef();
	const handleFormModalRef = (item) => {
		formModalRef.current.openModal(item);
	};

	// Work Request List Api
	const {
		isLoading,
		data: workData,
		isFetching,
	} = useGetWorkRequestQuery({
		client_name: filterText,
		project_name: projectText,
		page: tableValues.page + 1,
		perPage: tableValues.pageSize,
	});

	return (
		<>
			<StyledTableContainer component={Paper}>
				{isLoading && <p> Loading...</p>}
				{workData && (
					<DataTable
						getRowId={(row) => row.id}
						loading={isLoading || isFetching}
						columns={columns}
						rows={workData?.list}
						rowCount={workData?.total}
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

			{/* Modals */}
			<DeleteModal ref={deleteModalRef} />
			<FormModal ref={formModalRef} />
		</>
	);
}
