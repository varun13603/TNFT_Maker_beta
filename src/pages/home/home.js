import React, { Fragment } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ProfileHeader } from "../../components/profile-header/profile-header";
import { DashboardTabs } from "../../components/dash-tabs/dash-tabs";

export const HomePage = () => {
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);

  return (
    <Fragment>
      {!isLoggedIn && (
        <Box
          className="home-page"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Box>
            <h1> Press «Connect wallet» button</h1>
            <h1> to login with your Crypto wallet</h1>
          </Box>
        </Box>
      )}
      {isLoggedIn && (
        <Fragment>
          <ProfileHeader />
          <DashboardTabs />
        </Fragment>
      )}
    </Fragment>
  );
};
