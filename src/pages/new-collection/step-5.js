import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  Button,
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementStep,
  updateAddedFeaturesDetails,
  decrementStep,
  setTotalCost,
} from "../../redux/newCollectionSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import trx from "../../assets/images/trx.jpg";
import { env } from "../../env";

export const StepFive = () => {
  const featureDetails = useSelector(
    (state) => state.newCollection.additionalFeatureDetails
  );
  const dispatch = useDispatch();
  const baseCost = useSelector((state) => state.newCollection.totalCost);
  
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...featureDetails,
      presaleStartTime: dayjs.unix(featureDetails.presaleStartTime),
      presalePrice: window.tronWeb.fromSun(featureDetails.presalePrice),
    },
  });
  
  const onSubmit = (data) => {
    const date = dayjs(data.presaleStartTime).unix();
    dispatch(
      updateAddedFeaturesDetails({
        ...data,
        presaleStartTime: date,
        presalePrice: window.tronWeb.toSun(data.presalePrice),
      })
    );
    dispatch(incrementStep());
  };

  const watchPresale = watch("presaleEnabled");
  const watchNFTReveal = watch("nftRevealEnabled");
  const handleFeatureAdd = (value) => {
    console.log(Boolean(value))
    if(Boolean(value)){
      dispatch(setTotalCost(baseCost+env.COST_PER_ADDITIONAL_FEATURE))
    }else{
      dispatch(setTotalCost(baseCost-env.COST_PER_ADDITIONAL_FEATURE))
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Row>
        <Col lg={12} md={12} sm={12}>
          <Typography sx={{mb: 5, fontWeight: 700}}>NOTE: Adding additional features will cost 50 TRX each.</Typography>
        </Col>
          <Col lg={12} md={12} sm={12}>
            <Controller
              name="presaleEnabled"
              control={control}
              onChange={(e) => console.log(e)}
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    
                    control={<Checkbox {...field} onChange={(event) => {
                      field.onChange(event);
                      handleFeatureAdd(event.target.checked)
                    }} checked={field.value}  />}
                    label="Enable Presale Minting"
                    sx={{ marginBottom: `16px` }}
                  />
                </FormGroup>
              )}
            />
          </Col>
          {watchPresale && (
            <Fragment>
              <Col lg={6} md={12} sm={12}>
                <span className="label">Presale mint limit</span>
                <Controller
                  name="presaleLimit"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This is a required field.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      error={errors.presaleLimit}
                      className="txt"
                      fullWidth
                      type="number"
                      {...field}
                    />
                  )}
                />
                {errors.presaleLimit && (
                  <p className="err">{errors.presaleLimit.message}</p>
                )}
              </Col>
              <Col lg={6} md={12} sm={12}>
                <span className="label">Presale mint price</span>
                <Controller
                  name="presalePrice"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This is a required field.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      error={errors.presalePrice}
                      className="txt"
                      fullWidth
                      type="number"
                      {...field}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">TRX</InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                {errors.presalePrice && (
                  <p className="err">{errors.presalePrice.message}</p>
                )}
              </Col>
              <Col lg={6} md={12} sm={12}>
                <span className="label">Presale mint per transaction</span>
                <Controller
                  name="presaleMintPerTx"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This is a required field.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      error={errors.presaleMintPerTx}
                      className="txt"
                      fullWidth
                      type="number"
                      {...field}
                    />
                  )}
                />
                {errors.presaleMintPerTx && (
                  <p className="err">{errors.presaleMintPerTx.message}</p>
                )}
              </Col>
              <Col lg={6} md={12} sm={12}>
                <span className="label">Presale mint per wallet</span>
                <Controller
                  name="presaleMintPerWallet"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This is a required field.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      error={errors.presaleMintPerWallet}
                      className="txt"
                      fullWidth
                      type="number"
                      {...field}
                    />
                  )}
                />
                {errors.presaleMintPerWallet && (
                  <p className="err">{errors.presaleMintPerWallet.message}</p>
                )}
              </Col>
              <Col lg={6} md={12} sm={12}>
                <span className="label">Presale mint start time</span>
                <br />
                <Controller
                  name="presaleStartTime"
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
                        error={errors.presaleStartTime}
                        renderInput={(props) => <TextField {...props} />}
                        fullWidth
                        sx={{ width: "100%", mb: 2 }}
                        {...field}
                      />
                    </LocalizationProvider>
                  )}
                />
                {errors.presaleMintPerWallet && (
                  <p className="err">{errors.presaleMintPerWallet.message}</p>
                )}
              </Col>
            </Fragment>
          )}
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Controller
              name="airdropEnabled"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...field} onChange={(event) => {
                      field.onChange(event);
                      handleFeatureAdd(event.target.checked)
                    }}  checked={field.value} />}
                    label="Enable Airdrops"
                    sx={{ marginBottom: `16px` }}
                  />
                </FormGroup>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Controller
              name="changeableMintPricingEnabled"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...field} onChange={(event) => {
                      field.onChange(event);
                      handleFeatureAdd(event.target.checked)
                    }}  checked={field.value} />}
                    label="Enable ability to change minting prices"
                    sx={{ marginBottom: `16px` }}
                  />
                </FormGroup>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Controller
              name="changeableSaleTimingEnabled"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...field} onChange={(event) => {
                      field.onChange(event);
                      handleFeatureAdd(event.target.checked)
                    }}  checked={field.value} />}
                    label="Enable ability to change minting start timings"
                    sx={{ marginBottom: `16px` }}
                  />
                </FormGroup>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Controller
              name="nftRevealEnabled"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...field} onChange={(event) => {
                      field.onChange(event);
                      handleFeatureAdd(event.target.checked)
                    }}  checked={field.value} />}
                    label="Enable NFT Reveal"
                    sx={{ marginBottom: `16px` }}
                  />
                </FormGroup>
              )}
            />
          </Col>
          {watchNFTReveal && (
            <Fragment>
              <Col lg={6} md={12} sm={12}>
                <span className="label">CID of the unrevealed metadata</span>
                <Controller
                  name="urevealedMetadata"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "This is a required field.",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      error={errors.urevealedMetadata}
                      className="txt"
                      fullWidth
                      {...field}
                    />
                  )}
                />
                {errors.urevealedMetadata && (
                  <p className="err">{errors.urevealedMetadata.message}</p>
                )}
              </Col>
            </Fragment>
          )}
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Controller
              name="premintEnabled"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...field} onChange={(event) => {
                      field.onChange(event);
                      handleFeatureAdd(event.target.checked)
                    }}  checked={field.value} />}
                    label="Enable ability to premint tokens before minting start"
                    sx={{ marginBottom: `16px` }}
                  />
                </FormGroup>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Controller
              name="changeBaseUriEnabled"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox  {...field} onChange={(event) => {
                      field.onChange(event);
                      handleFeatureAdd(event.target.checked)
                    }}  checked={field.value} />}
                    label="Enable ability to change the collection base uri"
                    sx={{ marginBottom: `16px` }}
                  />
                </FormGroup>
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <Button
              onClick={() => dispatch(decrementStep())}
              sx={{ marginRight: "8px" }}
              variant="contained"
              startIcon={<ArrowBackIcon />}
            >
              Previous
            </Button>
            <Button
              type="submit"
              endIcon={<ArrowForwardIcon />}
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
