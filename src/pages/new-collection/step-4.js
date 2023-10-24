import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Button, TextField, InputAdornment, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep, updateRoyaltyDetails, decrementStep } from "../../redux/newCollectionSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import trx from "../../assets/images/trx.jpg";
export const StepFour = () => {
  const royaltyDetails = useSelector((state) => state.newCollection.royaltyDetails);
  const dispatch = useDispatch();
  const baseCost = useSelector((state) => state.newCollection.totalCost);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: royaltyDetails,
  });
  const onSubmit = (data) => {
    dispatch(updateRoyaltyDetails(data));
    dispatch(incrementStep())
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Royalty Percentage</span>
            <Controller
              name="royaltyBips"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.royaltyBips}
                  className="txt"
                  fullWidth
                  type="number"
                  placeholder="Royalty % to be charged for each NFT sale."
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  {...field}
                />
              )}
            />
            {errors.royaltyBips && (
              <p className="err">{errors.royaltyBips.message}</p>
            )}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Address to receive royalties</span>
            <Controller
              name="royaltyReceiver"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                }
              }}
              render={({ field }) => (
                <TextField
                  error={errors.royaltyReceiver}
                  className="txt"
                  fullWidth
                  placeholder="Wallet address to receive royalties"
                  {...field}
                />
              )}
            />
            {errors.royaltyReceiver && <p className="err">{errors.royaltyReceiver.message}</p>}
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
