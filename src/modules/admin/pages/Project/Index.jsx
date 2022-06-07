import React, { useState, useRef } from "react";
// Custom Styles
import {
	StyledBox,
	StyledBtn,
	StyledContainer,
	StyledInput,
	StyledAutocomplete,
	StyledSearchContainer,
} from "../../../../themes/GlobalStyles";
// icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
// Custom Components
import ProjectList from "./ProjectList";
import FormModal from "./FormModal";
// api
import { useSearchClientQuery } from "./projectApi";
import PageHeader from "../../../../components/PageHeader";

const Project = () => {
	const [filterText, setFilterText] = useState("");

	// Autocomplete state for client search
	const [search, setSearch] = useState("");
	// Select item from client list
	const [value, setValue] = React.useState(null);

	// `ref` to toggle add or edit modal in `formModal` component
	const formModalRef = useRef();
	const handleFormModalRef = (item) => {
		// `openModal` is defined in `FormModal` component,
		// it will be triggered using `formModalRef`
		formModalRef.current.openModal(item);
	};

	// project Api
	const handleSearch = () => {
		setFilterText(search);
		// dispatch(api.util.invalidateTags(['Project']))
	};
	// project Api
	const handleClear = () => {
		setValue(null);
		setSearch("");
		setFilterText("");
	};

	// api for get clients list
	const { data: clients } = useSearchClientQuery({ search: filterText });

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
				<StyledBox>
					<PageHeader title="Project" actionBtn={headerActions} />
					{/* Search Bar */}
					{clients && (
						<>
							<StyledSearchContainer alignItems={"center"} direction="row" spacing={2} mb={2}>
								<StyledAutocomplete
									value={value}
									onChange={(event, newValue) => {
										setValue(newValue);
									}}
									disableClearable
									getOptionLabel={(option) => option.name}
									inputValue={search}
									onInputChange={(event, newInputValue) => {
										console.log(newInputValue);
										setSearch(newInputValue);
									}}
									id="clients"
									fullWidth
									options={clients}
									sx={{ maxWidth: { xs: "100%", md: "500px" } }}
									renderInput={(params) => <StyledInput {...params} label="Search Client" />}
								/>
								<StyledBtn color="info" variant="contained" onClick={handleSearch}>
									Search
								</StyledBtn>
								<StyledBtn color="secondary" variant="outlined" onClick={handleClear}>
									Clear
								</StyledBtn>
							</StyledSearchContainer>
						</>
					)}

					{/* Project List Table */}
					<ProjectList filterText={filterText} />
				</StyledBox>
			</StyledContainer>
			{/* Form Modal*/}
			<FormModal ref={formModalRef} />
		</>
	);
};

export default Project;
