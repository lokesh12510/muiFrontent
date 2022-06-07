import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useDispatch } from "react-redux";

// Mui
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";

// icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

// Custom styles
import {
	StyledBtn,
	StyledDialog,
	StyledInput,
} from "../../../../themes/GlobalStyles";

// Api
// import { useStoreProjectMutation } from "./projectApi";
import { api } from "../../../../app/api";
import { CircularProgress, Radio, Typography } from "@mui/material";
import DataTable from "../../../../components/DataTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useStoreManagerMutation } from "./clientApi";

const ManageModal = (props, ref) => {
	// id will be null when adding new entry
	// and it will get id when edit button is clicked through ref
	const [id, setId] = useState(null);

	// Form modal toggle state
	const [modalState, setModalState] = useState(false);

	// This hook is use to trigger this modal from parent comp with `ref` prop
	useImperativeHandle(ref, () => ({
		// We need to use `openModal` func name in parent
		openModal: (item) => {
			// checking `id` is included or not in `item` prop
			if (item.id) {
				console.log(item.id);
				setId(item.id);
			}
			setModalState(true);
		},
	}));

	const [managerList, setManagerList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [storeManager] = useStoreManagerMutation();

	const dispatch = useDispatch();

	const [selectedManager, setSelectedManager] = useState(null);

	// service call to get item from selected `id` and set to `setManager` state
	React.useEffect(() => {
		if (id) {
			setIsLoading(true);
			async function showProject() {
				try {
					const res = await dispatch(api.endpoints.showManager.initiate(id));
					setManagerList(res?.data?.list);
					res?.data?.list.map((item) => item.default_flag && setSelectedManager(item.id));

					if (res?.data?.list.length === 0) handleAddRow();

					setIsLoading(false);
				} catch (err) {
					console.log(err);
				}
			}
			showProject();
		}
		// `useEffect` will only return clear function,So we need to use this format of calling function
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// handling change event in table `text` input fields
	const handleChange = (e, id) => {
		console.log(e.target.name, e.target.value, id);
		setManagerList((r) =>
			r.map((item) => {
				if (item.id === id) {
					return { ...item, [e.target.name]: e.target.value };
				} else {
					return item;
				}
			})
		);
	};

	// handling change event in table `text` input fields
	const handleRadioChange = (id) => {
		setManagerList((r) =>
			r.map((item) => {
				if (item.id === id) {
					return { ...item, default_flag: !item.default_flag };
				} else {
					return { ...item, default_flag: null };
				}
			})
		);
	};

	// add new row to `managerList`
	const handleAddRow = () => {
		const initialData = {
			client_id: id,
			contact_number: "",
			default_flag: null,
			email: "",
			id: new Date().toISOString().split(".")[1],
			manager_name: "",
		};
		setManagerList((r) => [...r, initialData]);
	};

	const handleDelete = (id) => {
		setManagerList((r) => r.filter((item) => item.id !== id));
	};

	// Form submit handler with `FormData` object for `storeProject` api
	const handleSubmit = async () => {
		const formData = new FormData();

		formData.append("addmanager", JSON.stringify(managerList));

		try {
			const res = await storeManager(formData);
			if (res?.data) setModalState(false);
		} catch (err) {
			console.log(err);
		}
	};

	console.log(selectedManager);

	// Checking modalState
	if (!modalState) return null;
	const columns = [
		{
			field: "manager_name",
			headerName: "Name",
			width: 150,
			flex: 2,
			renderCell: (params) => {
				return (
					<StyledInput
						name={params.field}
						value={params.value}
						onChange={(e) => handleChange(e, params.id)}
					/>
				);
			},
		},
		{
			field: "email",
			headerName: "Email",
			width: 150,
			flex: 2,
			renderCell: (params) => {
				return (
					<StyledInput
						name={params.field}
						value={params.value}
						onChange={(e) => handleChange(e, params.id)}
					/>
				);
			},
		},
		{
			field: "contact_number",
			headerName: "Contact",
			width: 110,
			flex: 2,
			renderCell: (params) => {
				return (
					<StyledInput
						name={params.field}
						value={params.value}
						onChange={(e) => handleChange(e, params.id)}
					/>
				);
			},
		},
		{
			field: "default_flag",
			headerName: "Primary",
			width: 110,
			flex: 1,
			renderCell: (params) => {
				return (
					<Radio
						name={params.field}
						value={params.id}
						onChange={(e) => {
							setSelectedManager(params.id);
							handleRadioChange(params.id);
						}}
						checked={selectedManager === params.id}
						inputProps={{ "aria-label": "primary" }}
					/>
				);
			},
		},
		{
			field: "Action",
			headerName: "Action",
			width: 110,
			flex: 1,
			renderCell: (params) => {
				let rowCount = params.api.getRowsCount();
				let index = params.api.getRowIndex(params.id);
				return [
					rowCount > 1 && (
						<GridActionsCellItem
							icon={<RemoveCircleIcon size="large" />}
							label="delete"
							onClick={() => handleDelete(params.id)}
						/>
					),
					index === rowCount - 1 && (
						<GridActionsCellItem
							icon={<AddCircleIcon size="large" />}
							label="add"
							onClick={handleAddRow}
						/>
					),
				];
			},
		},
	];

	return (
		<StyledDialog
			open={modalState}
			onClose={() => setModalState(false)}
			maxWidth="md"
			fullWidth
		>
			<DialogTitle>Add Manager</DialogTitle>

			<Divider />

			<DialogContent style={{ paddingBlock: 30 }}>
				<DataTable
					getRowId={(row) => row?.id}
					loading={isLoading}
					columns={columns}
					rows={managerList}
					rowCount={managerList?.length}
					hideFooterPagination={true}
					components={{
						Footer: () => (
							<>
								<Typography my={2} color="error" ml={1}>
									* Note : Atleast Single Manager need to be primary!
								</Typography>
								<Typography my={2} color="error" ml={1}>
									* Note : Same name and email id's are not allowed!
								</Typography>
							</>
						),
					}}
				/>
			</DialogContent>

			<DialogActions>
				<Button onClick={() => setModalState(false)} variant="outlined">
					Cancel
				</Button>
				<StyledBtn
					onClick={handleSubmit}
					variant="contained"
					disabled={selectedManager === null && true}
					color="info"
					startIcon={isLoading && <CircularProgress size={24} />}
				>
					Submit
				</StyledBtn>
			</DialogActions>
		</StyledDialog>
	);
};

// Wrapping with `forwardRef` is important, when receiving `ref` as a prop
export default forwardRef(ManageModal);
