import React, { useState } from "react";
import {
	StyledAutocomplete,
	StyledBox,
	StyledBtn,
	StyledContainer,
	StyledInput,
	StyledSearchContainer,
} from "../../../../themes/GlobalStyles";

import ClientList from "./ClientList";
import { useSearchClientQuery } from "../Project/projectApi";
import PageHeader from "../../../../components/PageHeader";

const Client = () => {
	const [filterText, setFilterText] = useState("");

	// Autocomplete state for client search
	const [search, setSearch] = useState("");
	// Select item from client list
	const [value, setValue] = useState(null);
	// project Api
	const handleSearch = () => {
		setFilterText(search);
	};
	// project Api
	const handleClear = () => {
		setValue(null);
		setSearch("");
		setFilterText("");
	};

	const { data: clients } = useSearchClientQuery({ search: filterText });
	return (
		<StyledContainer>
			<StyledBox>
				{/* Title */}
				<PageHeader title="Client List" />

				{/* Search Bar */}
				<StyledSearchContainer alignItems={"center"} direction="row" spacing={2} mb={2}>
					{/* Search Bar */}
					{clients && (
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
					)}
				</StyledSearchContainer>
				<ClientList filterText={filterText} />
			</StyledBox>
		</StyledContainer>
	);
};

export default Client;
