import React from "react";
import { AppBarComponent } from "./appbar/appbar";
import { theme } from "./../theme.js";
import { CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
export const Layout = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBarComponent />
      <main className="layout-body">
        <Toolbar /> {props.children}
      </main>
    </ThemeProvider>
  );
};
