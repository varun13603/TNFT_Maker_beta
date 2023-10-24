import React, { Fragment } from "react";
import Container from "react-bootstrap/Container";
import {  AppBar, Toolbar, CssBaseline} from "@mui/material";
import {ConnectWallet} from "../../components/conect-wallet/connect-wallet";
import { useNavigate } from "react-router-dom";

export const AppBarComponent = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <CssBaseline />
      <AppBar className="appbar-main" component="nav" color="secondary" >
        <Toolbar>
            <Container className="toolbar-container">
                <h3 onClick={() => navigate('/')}>NFT Generator</h3>
                <span className="spacer"></span>
                <ConnectWallet />
            </Container>
        </Toolbar>
    </AppBar>
    </Fragment>
  );
};
