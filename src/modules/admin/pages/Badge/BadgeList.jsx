import * as React from "react";
import Paper from "@mui/material/Paper";
import { StyledTableContainer } from "../../../../themes/GlobalStyles";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useRef } from "react";
import DeleteModal from "./DeleteModal";
import { useGetBadgeListQuery } from "./badgeApi";
import { useParams } from "react-router-dom";
import DataTable from "../../../../components/DataTable";
import { useState } from "react";
import FormModal from "./FormModal";
// icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BadgeList({ handleTitle }) {
	const [page, setPage] = React.useState(0);

	const params = useParams();

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

	const columns = [
		{
			field: "paid_date",
			headerName: "Paid Date",
			width: 150,
			flex: 2,
		},
		{
			field: "points",
			headerName: "Points",
			width: 150,
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

	// project Api
	const {
		isLoading,
		data: badgeData,
		isFetching,
	} = useGetBadgeListQuery({
		project_id: params.id,
		page: page + 1,
		perPage: tableValues.pageSize,
	});

	React.useEffect(() => {
		badgeData?.title && handleTitle(badgeData?.title);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [badgeData?.title]);

	return (
		<>
			<StyledTableContainer component={Paper}>
				{isLoading && <p> Loading...</p>}
				{badgeData && (
					<DataTable
						getRowId={(row) => row.id}
						loading={isLoading || isFetching}
						columns={columns}
						rows={badgeData?.list}
						rowCount={badgeData?.total}
						page={page}
						pageSize={tableValues.pageSize}
						onPageChange={(p) => {
							setPage(() => p);
						}}
						onPageSizeChange={(pageSize) => {
							setTableValues((prev) => ({ ...prev, pageSize: pageSize }));
						}}
					/>
				)}
			</StyledTableContainer>

			<DeleteModal ref={deleteModalRef} />
			<FormModal ref={formModalRef} />
		</>
	);
}
