import { Button, Grid, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import {
	StyledBox,
	StyledContainer,
	StyledDivider,
	StyledPageTitle,
} from "../../../../themes/GlobalStyles";
import Autocomplete from "@mui/material/Autocomplete";
import { CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
	useSearchClientQuery,
	useSearchProjectQuery,
} from "../Project/projectApi";
// icons
import FeedIcon from "@mui/icons-material/Feed";
import {
	useGenerateReportMutation,
	useGetAccManagerQuery,
	useGetPointsQuery,
} from "./pointsApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../../../app/api";

const PointsStatement = () => {
	const dispatch = useDispatch();

	const initialState = {
		from_date: null,
		to_date: null,
		client_name: "",
		opening_balance: "",
		points_purchased: "",
		project_name: "",
		manager_name: "",
		email: "",
		contact_number: "",
	};

	const [selectedItem, setSelectedItem] = useState(initialState);
	// Autocomplete state for client search
	const [search, setSearch] = useState("");
	// Select item from client list
	const [value, setValue] = useState(null);

	// Autocomplete state for project search
	const [projectSearch, setProjectSearch] = useState("");
	const [projectValue, setProjectValue] = useState(null);

	const { data: clients, isLoading: clientLoading } = useSearchClientQuery({
		search: "",
	});
	const { data: projects, isLoading: projectLoading } = useSearchProjectQuery({
		search: "",
	});
	const { data: manager } = useGetAccManagerQuery(value?.id, {
		skip: value?.id === undefined,
	});

	const [generateReport, { data }] = useGenerateReportMutation();

	if (data) console.log(data);

	const args = (a, b, c) => {
		if (a && b && c) return true;
		return true;
	};

	const {
		data: points,
		isError: isPointsError,
		error: pointError,
	} = useGetPointsQuery(
		{
			id: projectValue?.id,
			from_date: selectedItem.from_date,
			to_date: selectedItem.to_date,
		},
		{
			skip: args(projectValue?.id, selectedItem.from_date, selectedItem.to_date),
		}
	);

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

	useEffect(() => {
		console.log(pointError);
		pointError && setErrors(pointError.data.error[0]);
	}, [pointError]);

	useEffect(() => {
		if (manager) {
			setSelectedItem((prev) => ({
				...prev,
				contact_number: manager?.contact_number,
				email: manager?.email,
				manager_name: manager?.manager_name,
			}));
		}
	}, [manager]);

	useEffect(() => {
		if (points) {
			setSelectedItem((prev) => ({
				...prev,
				opening_balance: points?.opening_balance,
				points_purchased: points?.points_purchased,
			}));
		}
	}, [points]);

	console.log(errors);

	// Form change events handler function
	const handleChange = (e) => {
		setSelectedItem((item) => ({ ...item, [e.target.name]: e.target.value }));
	};

	// handling change event in table `date` input fields
	const handleDateChange = (val, name) => {
		setSelectedItem((item) => ({ ...item, [name]: val.toISOString() }));
	};

	const handleGenerateReport = async () => {
		try {
			// Api to generate points report, alter `fileName` prop if needed
			await generateReport({
				...selectedItem,
				client_id: value.id,
				project_id: projectValue.id,
				fileName: "pointsReport",
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<StyledContainer>
				<StyledBox>
					{/* Title */}
					<Stack direction={"row"} alignItems="center" justifyContent={"space-between"}>
						<StyledPageTitle variant="h6">Points Statement</StyledPageTitle>
						<Button
							variant="contained"
							color="info"
							startIcon={<FeedIcon />}
							onClick={handleGenerateReport}
						>
							Generate Report
						</Button>
					</Stack>
					<StyledDivider />
					<Grid container spacing={3} my={3}>
						<Grid item sm={12} md={4}>
							{clients && (
								<Autocomplete
									value={value}
									onChange={(event, newValue) => {
										setValue(newValue);
									}}
									getOptionLabel={(option) => option.name}
									inputValue={search}
									onInputChange={(event, newInputValue) => {
										setSearch(newInputValue);
									}}
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
										/>
									)}
								/>
							)}
						</Grid>
						<Grid item sm={12} md={4}>
							{projects && (
								<Autocomplete
									value={projectValue}
									onChange={(event, newValue) => {
										setProjectValue(newValue);
									}}
									loading={projectLoading}
									getOptionLabel={(option) => option.project_name}
									inputValue={projectSearch}
									onInputChange={(event, newInputValue) => {
										setProjectSearch(newInputValue);
									}}
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
										/>
									)}
								/>
							)}
						</Grid>
						<Grid item sm={12} md={4}>
							<DatePicker
								fullWidth
								name="from_date"
								label="From Date"
								value={selectedItem?.from_date}
								onChange={(newValue) => {
									console.log(newValue._d);
									handleDateChange(newValue._d, "from_date");
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										error={renderError("from_date")}
										helperText={renderError("from_date")}
									/>
								)}
							/>
						</Grid>
						<Grid item sm={12} md={4}>
							<DatePicker
								fullWidth
								name="to_date"
								label="To Date"
								value={selectedItem?.to_date}
								onChange={(newValue) => {
									console.log(newValue._d);
									handleDateChange(newValue._d, "to_date");
								}}
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										error={renderError("to_date")}
										helperText={renderError("to_date")}
									/>
								)}
							/>
						</Grid>
						<Grid item sm={12} md={4}>
							<TextField
								disabled
								name="opening_balance"
								label="Open Balance"
								fullWidth
								onChange={(e) => handleChange(e)}
								value={selectedItem?.opening_balance}
							/>
						</Grid>
						<Grid item sm={12} md={4}>
							<TextField
								disabled
								name="points_purchased"
								label="Points Purchased"
								fullWidth
								onChange={(e) => handleChange(e)}
								value={selectedItem?.points_purchased}
							/>
						</Grid>

						<Grid item sm={12} md={4}>
							<TextField
								disabled
								name="manager_name"
								label="Account Manager"
								fullWidth
								onChange={(e) => handleChange(e)}
								value={selectedItem?.manager_name}
							/>
						</Grid>
						<Grid item sm={12} md={4}>
							<TextField
								disabled
								name="email"
								label="Email"
								fullWidth
								onChange={(e) => handleChange(e)}
								value={selectedItem?.email}
							/>
						</Grid>
						<Grid item sm={12} md={4}>
							<TextField
								disabled
								name="contact_number"
								label="Contact Number"
								fullWidth
								onChange={(e) => handleChange(e)}
								value={selectedItem?.contact_number}
							/>
						</Grid>
					</Grid>
				</StyledBox>
			</StyledContainer>
		</>
	);
};

export default PointsStatement;

// useEffect(() => {
// 	if (value) {
// 		async function getManager() {
// 			try {
// 				const res = await dispatch(api.endpoints.getAccManager.initiate(value.id));

// 				if (res?.data) {
// 					console.log(res);
// 					setSelectedItem((prev) => ({
// 						...prev,
// 						contact_number: res?.data.contact_number,
// 						email: res?.data.email,
// 						manager_name: res?.data.manager_name,
// 					}));
// 				}
// 			} catch (err) {
// 				console.log(err);
// 			}
// 		}

// 		getManager();
// 	}
// }, [value, dispatch]);
