import React, { useState, useRef } from "react";
// Mui
import { Button, CircularProgress, Stack } from "@mui/material";
// Custom Styles
import {
	StyledBox,
	StyledBtn,
	StyledContainer,
	StyledDivider,
	StyledInput,
	StyledAutocomplete,
	StyledPageTitle,
	StyledSearchContainer,
} from "../../../../themes/GlobalStyles";
// icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
// Custom Components
import WorkRequestList from "./WorkRequestList";
import FormModal from "./FormModal";
// api
import {
	useSearchClientQuery,
	useSearchProjectQuery,
} from "../Project/projectApi";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";

const WorkRequest = () => {
	// if re-directed from client page get the client details to filter
	const location = useLocation();

	const params = useParams();

	console.log(params);

	// Autocomplete state for client search
	const [filterText, setFilterText] = useState("");
	const [value, setValue] = React.useState(null);
	const [search, setSearch] = useState("");

	// Autocomplete state for project search
	const [projectText, setProjectText] = useState("");
	const [projectSearch, setProjectSearch] = useState("");
	const [projectValue, setProjectValue] = useState(null);

	// `ref` to toggle add or edit modal in `formModal` component
	const formModalRef = useRef();
	const handleFormModalRef = (item) => {
		// `openModal` is defined in `FormModal` component,
		// it will be triggered using `formModalRef`
		formModalRef.current.openModal(item);
	};

	useEffect(() => {
		if (location?.state?.client) {
			setFilterText(location?.state?.client?.name);
			setValue(location?.state?.client);
		}
		setFilterText("");
		setValue(null);
	}, [location]);

	const handleSearch = () => {
		setFilterText(search);
		setProjectText(projectSearch);
		// dispatch(api.util.invalidateTags(['Project']))
	};

	const handleClear = () => {
		setValue(null);
		setProjectValue(null);
		setSearch("");
		setProjectSearch("");
		setFilterText("");
		setProjectText("");
		// dispatch(api.util.invalidateTags(['Project']))
	};

	const { data: clients, isLoading: clientLoading } = useSearchClientQuery({
		search: "",
	});
	const { data: projects, isLoading: projectLoading } = useSearchProjectQuery({
		search: "",
	});

	return (
		<>
			<StyledContainer>
				<StyledBox>
					{/* Title */}
					<Stack direction={"row"} alignItems="center" justifyContent={"space-between"}>
						<StyledPageTitle variant="h6">Work Request</StyledPageTitle>
						<Button
							variant="outlined"
							color="info"
							startIcon={<AddCircleIcon />}
							onClick={handleFormModalRef}
						>
							Add
						</Button>
					</Stack>
					<StyledDivider />
					{/* Search Bar */}

					<StyledSearchContainer alignItems={"center"} direction="row" spacing={2} mb={2}>
						<StyledAutocomplete
							value={value}
							onChange={(event, newValue) => {
								setValue(newValue);
							}}
							loading={clientLoading}
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
							sx={{ maxWidth: { xs: "100%", md: "300px" } }}
							renderInput={(params) => (
								<StyledInput
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
								/>
							)}
						/>

						<StyledAutocomplete
							value={projectValue}
							onChange={(event, newValue) => {
								setProjectValue(newValue);
							}}
							loading={projectLoading}
							disableClearable
							getOptionLabel={(option) => option.project_name}
							inputValue={projectSearch}
							onInputChange={(event, newInputValue) => {
								console.log(newInputValue);
								setProjectSearch(newInputValue);
							}}
							id="projects"
							fullWidth
							options={projects}
							sx={{ maxWidth: { xs: "100%", md: "300px" } }}
							renderInput={(params) => (
								<StyledInput
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
								/>
							)}
						/>

						<StyledBtn color="info" variant="contained" onClick={handleSearch}>
							Search
						</StyledBtn>
						<StyledBtn color="secondary" variant="outlined" onClick={handleClear}>
							Clear
						</StyledBtn>
					</StyledSearchContainer>

					{/* Project List Table */}
					<WorkRequestList filterText={filterText} projectText={projectText} />
				</StyledBox>
			</StyledContainer>
			{/* Form Modal*/}
			<FormModal ref={formModalRef} />
		</>
	);
};

export default WorkRequest;
