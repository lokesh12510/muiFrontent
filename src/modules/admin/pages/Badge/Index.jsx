import React, { useState } from "react";
import { StyledBox, StyledContainer } from "../../../../themes/GlobalStyles";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import BadgeList from "./BadgeList";
import { useRef } from "react";
import FormModal from "./FormModal";
import PageHeader from "../../../../components/PageHeader";
import Breadcrumb from "../../../../components/Breadcrumb";

const Badge = () => {
	// `ref` to toggle add or edit modal in `formModal` component
	const formModalRef = useRef();
	const handleFormModalRef = (item) => {
		// `openModal` is defined in `FormModal` component
		formModalRef.current.openModal(item);
	};

	const [title, setTitle] = useState("");

	const handleTitle = (name) => {
		setTitle(name);
	};

	const headerActions = [
		{
			label: "Add",
			color: "info",
			variant: "outlined",
			icon: <AddCircleIcon />,
			handleClick: handleFormModalRef,
		},
	];

	return (
		<>
			<StyledContainer>
				<Breadcrumb title={title} />
				<StyledBox>
					<PageHeader title="Points" actionBtn={headerActions} />
					<BadgeList handleTitle={handleTitle} />
				</StyledBox>
			</StyledContainer>
			{/* Form Modal*/}
			<FormModal ref={formModalRef} />
		</>
	);
};

export default Badge;
