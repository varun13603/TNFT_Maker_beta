import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Button,Box,Typography, TextField, InputAdornment } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementStep,
  updateMintingDetails,
  decrementStep,
} from "../../redux/newCollectionSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import trx from "../../assets/images/trx.jpg";
export const StepTwo = () => {
  const mintingDetails = useSelector(
    (state) => state.newCollection.mintingDetails
  );
  const dispatch = useDispatch();
  const baseCost = useSelector((state) => state.newCollection.totalCost);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...mintingDetails,
      mintStartTime: dayjs.unix(mintingDetails.mintStartTime),
      mintPrice: mintingDetails.mintPrice ? window.tronWeb.fromSun(mintingDetails.mintPrice) : "",
    },
  });
  const onSubmit = (data) => {
    const startDate = dayjs(data.mintStartTime).unix();
    const requestData = {
      ...data,
      mintStartTime: startDate,
      mintPrice: window.tronWeb.toSun(data.mintPrice),
    };
    dispatch(updateMintingDetails(requestData));

    dispatch(incrementStep());
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Mints per transaction</span>
            <Controller
              name="mintPerTx"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.mintPerTx}
                  className="txt"
                  fullWidth
                  placeholder="Max number of NFT's to be minted in a single transaction."
                  type="number"
                  {...field}
                />
              )}
            />
            {errors.mintPerTx && (
              <p className="err">{errors.mintPerTx.message}</p>
            )}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Mint Price</span>
            <Controller
              name="mintPrice"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.mintPrice}
                  className="txt"
                  type="number"
                  fullWidth
                  placeholder="Price per NFT"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">TRX</InputAdornment>
                    ),
                  }}
                  {...field}
                />
              )}
            />
            {errors.mintPrice && (
              <p className="err">{errors.mintPrice.message}</p>
            )}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Mints per wallet</span>
            <Controller
              name="mintPerWallet"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  className="txt"
                  error={errors.mintPerWallet}
                  fullWidth
                  placeholder="Max number of NFTs allowed for 1 wallet"
                  type="number"
                  {...field}
                />
              )}
            />
            {errors.mintPerWallet && (
              <p className="err">{errors.mintPerWallet.message}</p>
            )}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Mint Start Time</span>
            <br />
            <Controller
              name="mintStartTime"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    error={errors.mintStartTime}
                    renderInput={(props) => <TextField {...props} />}
                    fullWidth
                    sx={{ width: "100%" }}
                    {...field}
                  />
                </LocalizationProvider>
              )}
            />
            {errors.mintStartTime && (
              <p className="err">{errors.mintStartTime.message}</p>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => dispatch(decrementStep())}
              sx={{ marginRight: "8px" }}
              variant="contained"
            >
              Previous
            </Button>
            <Button
              endIcon={<ArrowForwardIcon />}
              type="submit"
              variant="contained"
            >
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
