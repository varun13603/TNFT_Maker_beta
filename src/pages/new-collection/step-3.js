import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep, updateOwnershipDetails, decrementStep } from "../../redux/newCollectionSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import trx from "../../assets/images/trx.jpg";
export const StepThree = () => {
  const ownershipDetails = useSelector((state) => state.newCollection.ownershipDetails);
  const dispatch = useDispatch();
  const baseCost = useSelector((state) => state.newCollection.totalCost);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: ownershipDetails,
  });
  const onSubmit = (data) => {
    dispatch(updateOwnershipDetails(data));
    dispatch(incrementStep())
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Contract Owner</span>
            <Controller
              name="contractOwner"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.contractOwner}
                  className="txt"
                  fullWidth
                  placeholder="Wallet address for contract owner"
                  {...field}
                />
              )}
            />
            {errors.contractOwner && (
              <p className="err">{errors.contractOwner.message}</p>
            )}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Address to receive primary sale amount</span>
            <Controller
              name="primarySaleFundsReceiver"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                }
              }}
              render={({ field }) => (
                <TextField
                  error={errors.primarySaleFundsReceiver}
                  className="txt"
                  placeholder="Wallet address to receive minting funds"
                  fullWidth
                  {...field}
                />
              )}
            />
            {errors.primarySaleFundsReceiver && <p className="err">{errors.primarySaleFundsReceiver.message}</p>}
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} sm={12}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => dispatch(decrementStep())} sx={{marginRight:'8px'}} variant="contained">
              Previous
            </Button>
            <Button endIcon={<ArrowForwardIcon />} type="submit" variant="contained">
              Next
            </Button>
          </Col>
          <Col lg={6} md={12} sm={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography sx={{ fontWeight: 700 }} variant="h6">
                DEPLOYMENT FEE:&nbsp;&nbsp;&nbsp;&nbsp;{baseCost} TRX &nbsp;
                <img style={{width: '20px'}} src={trx} alt="trx logo" />{" "}
              </Typography>
            </Box>
          </Col>
        </Row>
      </Container>
    </form>
  );
};
