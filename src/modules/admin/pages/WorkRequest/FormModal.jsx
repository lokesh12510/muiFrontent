import React, {
	useState,
	useImperativeHandle,
	forwardRef,
	useEffect,
} from "react";
import { useDispatch } from "react-redux";

// Mui
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CircularProgress, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Custom styles
import { StyledBtn, StyledDialog } from "../../../../themes/GlobalStyles";

// Api
import {
	useSearchClientQuery,
	useSearchProjectQuery,
} from "../Project/projectApi";
import { useStoreWorkRequestMutation } from "./workRequestApi";
import { api } from "../../../../app/api";

const FormModal = (props, ref) => {
	// id will be null when adding new entry
	// and it will get id when edit button is clicked through ref
	const [id, setId] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	// Form modal toggle state
	const [modalState, setModalState] = useState(false);
	const initialState = {
		title: "",
		hours: "",
		request_points: "",
		client_id: null,
		close_date: null,
		project_id: null,
		client_summary: "",
	};
	const [selectedItem, setSelectedItem] = useState(initialState);

	// This hook is use to trigger this modal from parent comp with `ref` prop
	useImperativeHandle(
		ref,
		() => ({
			// We need to use `openModal` func name in parent
			openModal: (item) => {
				// checking `id` is included or not in `item` prop
				if (item.id) {
					setId(item.id);
					setIsEditing(true);
				}
				setModalState(true);
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[modalState]
	);

	useEffect(() => {
		if (!isEditing) {
			setSelectedItem(initialState);
			setErrors("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modalState]);

	// When edit button is clicked, the selected object will be set to `selectedItem`
	// When adding new item, the form data will be set using input field name prop

	const dispatch = useDispatch();

	// To add or edit `project` Api
	const [storeWorkRequest, { isLoading }] = useStoreWorkRequestMutation();

	const { data: clients, isLoading: clientLoading } = useSearchClientQuery({
		search: "",
	});
	const { data: projects, isLoading: projectLoading } = useSearchProjectQuery({
		search: "",
	});

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
	// handling change event in table `date` input fields
	const handleDateChange = (name, val) => {
		setSelectedItem((item) => ({ ...item, [name]: val.toISOString() }));
	};

	// Form submit handler with `FormData` object for `storeProject` api
	const handleSubmit = async (values) => {
		let data = {};

		if (isEditing) {
			Object.entries(selectedItem).forEach((key) => {
				data[key[0]] = key[1];
			});
			data["updatedAt"] = new Date().toISOString();
		}

		data["request_points"] = selectedItem.hours * 3;
		data["client_id"] = selectedItem.client_id?.id || "";
		data["project_id"] = selectedItem.project_id?.id || "";
		data["hours"] = selectedItem.hours;
		data["close_date"] = selectedItem.close_date;
		data["title"] = selectedItem.title;

		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			formData.append(key, data[key]);
		});

		try {
			const res = await storeWorkRequest(formData);
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
			async function showItem() {
				try {
					const res = await dispatch(api.endpoints.showWorkById.initiate(id));
					if (res?.data) {
						let data = res.data;
						setSelectedItem({ ...data, client_id: data.client, project_id: data.project });
					}
				} catch (err) {
					console.log(err);
				}
			}
			// `useEffect` will only return clear function,So we need to use this format of calling function
			showItem();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// Checking modalState
	if (!modalState) return null;

	return (
		<StyledDialog
			open={modalState}
			onClose={() => setModalState(false)}
			maxWidth="md"
			fullWidth
		>
			{isEditing && <DialogTitle>Edit Work Request</DialogTitle>}
			{!isEditing && <DialogTitle>Add Work Request</DialogTitle>}

			<Divider />

			<DialogContent style={{ paddingBlock: 30 }}>
				<Grid container spacing={3}>
					<Grid item sm={12} md={4}>
						<TextField
							name="title"
							label="Title"
							fullWidth
							onChange={handleChange}
							error={renderError("title")}
							helperText={renderError("title")}
							value={selectedItem?.title}
						/>
					</Grid>
					<Grid item sm={12} md={4}>
						{clients && (
							<Autocomplete
								value={selectedItem?.client_id}
								onChange={(event, newValue) => {
									handleSelectChange("client_id", newValue);
								}}
								getOptionLabel={(option) => option.name}
								id="clients"
								options={clients}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Search Client"
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<React.Fragment>
													{clientLoading ? <CircularProgress color="inherit" size={20} /> : null}
													{params.InputProps.endAdornment}
												</React.Fragment>
											),
										}}
										error={renderError("client_id")}
										helperText={renderError("client_id")}
									/>
								)}
							/>
						)}
					</Grid>
					<Grid item sm={12} md={4}>
						{projects && (
							<Autocomplete
								value={selectedItem?.project_id}
								onChange={(event, newValue) => {
									console.log(newValue);
									handleSelectChange("project_id", newValue);
								}}
								loading={projectLoading}
								getOptionLabel={(option) => option.project_name}
								id="projects"
								fullWidth
								options={projects}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Search Projects"
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<React.Fragment>
													{projectLoading ? <CircularProgress color="inherit" size={20} /> : null}
													{params.InputProps.endAdornment}
												</React.Fragment>
											),
										}}
										error={renderError("project_id")}
										helperText={renderError("project_id")}
									/>
								)}
							/>
						)}
					</Grid>
					<Grid item sm={12} md={4}>
						<DatePicker
							fullWidth
							name="close_date"
							label="Close Date"
							value={selectedItem?.close_date}
							onChange={(newValue) => {
								handleDateChange("close_date", newValue._d);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									fullWidth
									error={renderError("close_date")}
									helperText={renderError("close_date")}
								/>
							)}
						/>
					</Grid>
					<Grid item sm={12} md={4}>
						<TextField
							type={"number"}
							name="hours"
							label="Hours"
							fullWidth
							onChange={handleChange}
							value={selectedItem?.hours}
							error={renderError("hours")}
							helperText={renderError("hours")}
						/>
					</Grid>
					<Grid item sm={12} md={4}>
						<TextField
							name="request_points"
							label="Points"
							fullWidth
							disabled
							onChange={handleChange}
							value={selectedItem?.hours * 3}
							error={renderError("request_points")}
							helperText={renderError("request_points")}
						/>
					</Grid>

					<Grid item sm={12}>
						<TextField
							variant="outlined"
							label="Client Summary"
							multiline
							fullWidth
							name="client_summary"
							onChange={handleChange}
							value={selectedItem?.client_summary}
							error={renderError("client_summary")}
							helperText={renderError("client_summary")}
						/>
					</Grid>
				</Grid>
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
					Submit
				</StyledBtn>
			</DialogActions>
		</StyledDialog>
	);
};

// Wrapping with `forwardRef` is important, when receiving `ref` as a prop
export default forwardRef(FormModal);
