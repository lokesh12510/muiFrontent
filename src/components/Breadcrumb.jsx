import { Breadcrumbs, Link as LinkText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import palette from "../themes/palette";

const Breadcrumb = ({ title }) => {
	return (
		<Box mb={3}>
			<Breadcrumbs aria-label="breadcrumb">
				<LinkText component={Link} to="/" underline="hover" color="inherit">
					Home
				</LinkText>

				<Typography style={{ color: palette.info.main }} textTransform={"capitalize"}>
					{title}
				</Typography>
			</Breadcrumbs>
		</Box>
	);
};

export default Breadcrumb;
