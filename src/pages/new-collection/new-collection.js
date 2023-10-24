/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { Divider, Paper, Typography, Box } from "@mui/material";
import { StepOne } from "./step-1";
import { useSelector, useDispatch } from "react-redux";
import { StepTwo } from "./step-2";
import { StepThree } from "./step-3";
import { StepFour } from "./step-4";
import { StepFive } from "./step-5";
import { StepSix } from "./step-6";
import { DeploymentReview } from "../../components/deploy-review/deploy-review";
import {
  resetStep,
  setTotalCost,
  updateAddedFeaturesDetails,
  updateBasicDetails,
  updateContentDetails,
  updateMintingDetails,
  updateOwnershipDetails,
  updateRoyaltyDetails,
} from "../../redux/newCollectionSlice";
import { env } from "../../env";
export const NewCollectionPage = () => {
  const currentStep = useSelector((state) => state.newCollection.currentStep);
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(updateBasicDetails({}));
      dispatch(updateMintingDetails({}));
      dispatch(updateOwnershipDetails({}));
      dispatch(updateRoyaltyDetails({}));
      dispatch(updateAddedFeaturesDetails({}));
      dispatch(
        updateContentDetails({
          contentCID: "",
          contentExtension: "select",
          metadataCID: "",
        })
      );
      dispatch(resetStep());
      dispatch(setTotalCost(0));
    };
  }, []);

  useEffect(() => {
    dispatch(setTotalCost(env.BASE_COST));
  }, []);
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
        <Container>
          <Row>
            <Paper variant="outlined" className="new-nft-cont">
              <Typography variant="h6" className="header">
                {`New NFT Collection | ${steps[currentStep]}`}
              </Typography>
              <Divider className="divider1" />
              {currentStep === 1 && <StepOne />}
              {currentStep === 2 && <StepTwo />}
              {currentStep === 3 && <StepThree />}
              {currentStep === 4 && <StepFour />}
              {currentStep === 5 && <StepFive />}
              {currentStep === 6 && <StepSix />}
              {currentStep === 7 && <DeploymentReview />}
            </Paper>
          </Row>
        </Container>
      )}
    </Fragment>
  );
};

const steps = [
  "",
  "Basic Details",
  "Minting Details",
  "Ownership Details",
  "Royalties",
  "Additional Features",
  "Upload Content",
  "Upload Metadata",
  "Deployment Review",
];
