import React, { useRef, useState } from "react";
// Mui
import Paper from "@mui/material/Paper";
import { StyledTableContainer } from "../../../../themes/GlobalStyles";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
// Icons
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// Custom components
import FormModal from "./FormModal";
import DeleteModal from "./DeleteModal";
import DataTable from "../../../../components/DataTable";
// Api
import { useProjectListQuery } from "./projectApi";
import { adminUrls } from "../../urls";

export default function ProjectList({ filterText }) {
	const navigate = useNavigate();

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

	// DataGrid columns
	const columns = [
		{
			field: "project_code",
			headerName: "Code",
			width: 150,
			flex: 1,
		},
		{
			field: "project_name",
			headerName: "Project",
			width: 150,
			flex: 2,
		},
		{
			field: "client_name",
			headerName: "Client",
			valueGetter: (params) => params?.row?.client?.name,
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
					icon={<EmojiEventsIcon />}
					label="badge"
					onClick={() => navigate(`${adminUrls.badge}/${params.id}`)}
				/>,
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

	// Delete Modal Trigger ref
	const deleteModalRef = useRef();
	const handleDeleteModalRef = (item) => {
		deleteModalRef.current.openModal(item);
	};

	// Form Modal Trigger ref
	const formModalRef = useRef();
	const handleFormModalRef = (item) => {
		formModalRef.current.openModal(item);
	};

	// project Api
	const {
		isLoading,
		data: projectData,
		isFetching,
	} = useProjectListQuery({
		client_name: filterText,
		page: tableValues.page + 1,
		perPage: tableValues.pageSize,
	});

	return (
		<>
			<StyledTableContainer component={Paper}>
				{isLoading && <p> Loading...</p>}
				{projectData && (
					<DataTable
						getRowId={(row) => row.id}
						loading={isLoading || isFetching}
						columns={columns}
						rows={projectData?.list}
						rowCount={projectData?.total}
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
