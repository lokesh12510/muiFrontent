import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogContentText, Divider } from "@mui/material";
import { useImperativeHandle } from "react";
import { useState } from "react";
import { forwardRef } from "react";
import { StyledBtn, StyledDialog } from "../../../../themes/GlobalStyles";
import { useDeleteBadgeMutation } from "./badgeApi";

const DeleteModal = (props, ref) => {
	const [selectedItem, setSelectedItem] = useState(null);

	// Form modal toggle state
	const [modalState, setModalState] = useState(false);

	const [deleteBadge] = useDeleteBadgeMutation();

	// This hook is use to trigger this modal from parent comp with `ref` prop
	useImperativeHandle(ref, () => ({
		// We need to use `openModal` func name in parent
		openModal: (item) => {
			setSelectedItem(item);
			setModalState(true);
		},
	}));
	// Checking modalState
	if (!modalState) return null;

	// Function to handle delete event
	const handleDelete = async () => {
		try {
			const res = await deleteBadge(selectedItem.id);
			res?.data && setModalState(false);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<StyledDialog
			open={modalState}
			onClose={() => setModalState(false)}
			maxWidth="xs"
			fullWidth
		>
			<DialogTitle>Delete Project</DialogTitle>
			<Divider />
			<DialogContent>
				<DialogContentText align="center">
					Are you sure want to delete point?
				</DialogContentText>
			</DialogContent>
			<DialogActions style={{ justifyContent: "center" }}>
				<Button onClick={() => setModalState(false)} variant="outlined">
					Cancel
				</Button>
				<StyledBtn onClick={handleDelete} variant="contained" color="error">
					Delete
				</StyledBtn>
			</DialogActions>
		</StyledDialog>
	);
};

export default forwardRef(DeleteModal);
