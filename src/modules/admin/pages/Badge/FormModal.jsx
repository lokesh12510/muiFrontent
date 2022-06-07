import React, {
	useState,
	useImperativeHandle,
	forwardRef,
	useEffect,
} from "react";

// Mui
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Custom styles
import { StyledBtn, StyledDialog } from "../../../../themes/GlobalStyles";

// Api
import { useStoreBadgeMutation } from "./badgeApi";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

const FormModal = (props, ref) => {
	// to get id from path
	const params = useParams();

	const [isEditing, setIsEditing] = useState(false);

	// Form modal toggle state
	const [modalState, setModalState] = useState(false);

	const initialState = {
		paid_date: null,
		points: "",
	};
	// When edit button is clicked, the selected object will be set to `selectedItem`
	// When adding new item, the form data will be set using input field name prop
	const [selectedItem, setSelectedItem] = useState(initialState);

	// This hook is use to trigger this modal from parent comp with `ref` prop
	useImperativeHandle(ref, () => ({
		// We need to use `openModal` func name in parent
		openModal: (item) => {
			// checking `id` is included or not in `item` prop
			if (item.id) {
				setSelectedItem(item);
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

	// To add or edit `project` Api
	const [storeBadge, { isLoading }] = useStoreBadgeMutation();

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

	// handling change event in table `date` input fields
	const handleDateChange = (name, val) => {
		setSelectedItem((item) => ({ ...item, [name]: val.toISOString() }));
	};

	// Form submit handler with `FormData` object for `storeProject` api
	const handleSubmit = async () => {
		console.log(selectedItem);

		const formData = {
			paid_date: selectedItem.paid_date,
			points: selectedItem.points,
			[isEditing ? "id" : "project_id"]: isEditing ? selectedItem.id : params.id,
		};

		try {
			const res = await storeBadge(formData);
			if (res?.error) {
				setErrors(res?.error.data.error[0]);
			}
			if (res?.data) setModalState(false);
		} catch (err) {
			console.log(err);
		}
	};

	// Checking modalState
	if (!modalState) return null;

	return (
		<StyledDialog
			open={modalState}
			onClose={() => setModalState(false)}
			minWidth="md"
			fullWidth
		>
			{isEditing && <DialogTitle>Edit Badge</DialogTitle>}
			{!isEditing && <DialogTitle>Add Badge</DialogTitle>}

			<Divider />

			<DialogContent style={{ paddingBlock: 30 }}>
				<Stack spacing={3}>
					<DatePicker
						name="paid_date"
						label="Paid Date"
						value={selectedItem?.paid_date}
						onChange={(newValue) => {
							handleDateChange("paid_date", newValue._d);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								error={renderError("paid_date")}
								helperText={renderError("paid_date")}
							/>
						)}
					/>
					<TextField
						name="points"
						label="Points"
						onChange={handleChange}
						value={selectedItem?.points}
						error={renderError("points")}
						helperText={renderError("points")}
					/>
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
					Submit
				</StyledBtn>
			</DialogActions>
		</StyledDialog>
	);
};

// Wrapping with `forwardRef` is important, when receiving `ref` as a prop
export default forwardRef(FormModal);
