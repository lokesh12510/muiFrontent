import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useDispatch } from "react-redux";

// Mui
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CircularProgress } from "@mui/material";

// Custom styles
import { StyledBtn, StyledDialog } from "../../../../themes/GlobalStyles";

// Api
import { useSearchClientQuery, useStoreProjectMutation } from "./projectApi";
import { api } from "../../../../app/api";
import { useEffect } from "react";

const FormModal = (props, ref) => {
	// id will be null when adding new entry
	// and it will get id when edit button is clicked through ref
	const [id, setId] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	// Form modal toggle state
	const [modalState, setModalState] = useState(false);

	// This hook is use to trigger this modal from parent comp with `ref` prop
	useImperativeHandle(ref, () => ({
		// We need to use `openModal` func name in parent
		openModal: (item) => {
			// checking `id` is included or not in `item` prop
			if (item.id) {
				setId(item.id);
				setIsEditing(true);
			}
			setModalState(true);
		},
	}));

	useEffect(() => {
		if (!isEditing) {
			setSelectedItem(initialState);
			setErrors("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalState]);

	// When edit button is clicked, the selected object will be set to `selectedItem`
	// When adding new item, the form data will be set using input field name prop
	const initialState = {
		project_name: "",
		client_name: null,
	};
	const [selectedItem, setSelectedItem] = useState(initialState);

	const dispatch = useDispatch();

	// To add or edit `project` Api
	const [storeProject, { isLoading }] = useStoreProjectMutation();

	const { data: clients } = useSearchClientQuery({ search: "" });

	const [errors, setErrors] = useState("");

	// Form Errors
	const hasErrorFor = (fieldName) => {
		return !!errors[fieldName];
	};
	const renderError = (fieldName) => {
		let status = hasErrorFor(fieldName);
		if (status) {
			return errors[fieldName][0];
		}
	};

	// Form change events handler function
	const handleChange = (e) => {
		setSelectedItem((item) => ({ ...item, [e.target.name]: e.target.value }));
	};
	const handleSelectChange = (name, val) => {
		setSelectedItem((item) => ({ ...item, [name]: val }));
	};

	// Form submit handler with `FormData` object for `storeProject` api
	const handleSubmit = async () => {
		let data = {};

		if (isEditing) {
			Object.entries(selectedItem).forEach((key) => {
				data[key[0]] = key[1];
			});
			data["updatedAt"] = new Date().toISOString();
		}

		data["project_name"] = selectedItem?.project_name;
		data["client_name"] = selectedItem?.client_name?.id || "";

		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			formData.append(key, data[key]);
		});

		try {
			const res = await storeProject(formData);
			if (res?.error) {
				setErrors(res?.error.data.error[0]);
			}

			if (res?.data) setModalState(false);
		} catch (err) {
			console.log(err);
		}
	};

	// service call to get item from selected `id` and set to `selectedItem` state
	React.useEffect(() => {
		if (isEditing) {
			async function showProject() {
				try {
					const res = await dispatch(api.endpoints.showProjectById.initiate(id));
					if (res?.data) {
						let data = res.data;
						setSelectedItem({ ...data, client_name: data.client });
					}
				} catch (err) {
					console.log(err);
				}
			}
			// `useEffect` will only return clear function,So we need to use this format of calling function
			showProject();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// Checking modalState
	if (!modalState) {
		return null;
	}

	return (
		<StyledDialog
			open={modalState}
			onClose={() => setModalState(false)}
			minWidth="md"
			fullWidth
		>
			{isEditing && <DialogTitle>Edit Project</DialogTitle>}
			{!isEditing && <DialogTitle>Add Project</DialogTitle>}

			<Divider />

			<DialogContent style={{ paddingBlock: 30 }}>
				<Stack spacing={3}>
					<TextField
						name="project_name"
						label="Project Name"
						onChange={handleChange}
						error={renderError("project_name")}
						helperText={renderError("project_name")}
						value={selectedItem?.project_name}
					/>
					{clients && (
						<Autocomplete
							value={selectedItem?.client_name}
							onChange={(event, newValue) => {
								handleSelectChange("client_name", newValue);
							}}
							disableClearable
							getOptionLabel={(option) => option.name}
							id="clients"
							options={clients}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Client Name"
									error={renderError("client_name")}
									helperText={renderError("client_name")}
								/>
							)}
						/>
					)}
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button onClick={() => setModalState(false)} variant="outlined">
					Cancel
				</Button>
				<StyledBtn
					onClick={handleSubmit}
					variant="contained"
					color="info"
					startIcon={isLoading && <CircularProgress size={24} />}
				>
					{isEditing ? "Update" : "Add"}
				</StyledBtn>
			</DialogActions>
		</StyledDialog>
	);
};

// Wrapping with `forwardRef` is important, when receiving `ref` as a prop
export default forwardRef(FormModal);
