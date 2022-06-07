import { Button, Stack } from "@mui/material";
import React from "react";
import { StyledDivider, StyledPageTitle } from "../themes/GlobalStyles";

const PageHeader = ({ title = "title", actionBtn = [] }) => {
	return (
		<>
			<Stack direction={"row"} alignItems="center" justifyContent={"space-between"}>
				<StyledPageTitle variant="h6">{title}</StyledPageTitle>
				{actionBtn.length > 0 &&
					actionBtn.map((item, index) => {
						return (
							<Button
								key={index}
								variant={item.variant || "outlined"}
								color={item.color || "info"}
								startIcon={item.icon && item.icon}
								onClick={item.handleClick}
							>
								{item.label}
							</Button>
						);
					})}
			</Stack>
			<StyledDivider />
		</>
	);
};

export default PageHeader;
