import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementStep,
  updateBasicDetails,
} from "../../redux/newCollectionSlice";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import trx from "../../assets/images/trx.jpg";
export const StepOne = () => {
  const basicDetails = useSelector((state) => state.newCollection.basicDetails);
  const dispatch = useDispatch();
  const baseCost = useSelector((state) => state.newCollection.totalCost);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: basicDetails,
  });
  const onSubmit = (data) => {
    dispatch(updateBasicDetails(data));
    dispatch(incrementStep());
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Collection Name</span>
            <Controller
              name="collectionName"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.collectionName}
                  className="txt"
                  fullWidth
                  placeholder="Collection Name (e.g. Bored Ape Yacht Club)"
                  {...field}
                />
              )}
            />
            {errors.collectionName && (
              <p className="err">{errors.collectionName.message}</p>
            )}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Collection Symbol</span>
            <Controller
              name="symbol"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
                maxLength: {
                  value: 7,
                  message: "Exceeds maximum length of 7.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.symbol}
                  className="txt"
                  fullWidth
                  placeholder="Collection Symbol (e.g. BAYC)"
                  {...field}
                />
              )}
            />
            {errors.symbol && <p className="err">{errors.symbol.message}</p>}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Collection Size</span>
            <Controller
              name="size"
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
                  error={errors.size}
                  fullWidth
                  placeholder="Total number of NFT's in collection."
                  {...field}
                />
              )}
            />
            {errors.size && <p className="err">{errors.size.message}</p>}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Collection Website</span>
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <TextField className="txt" placeholder="Collectio Website URL (e.g. https://yourcollectionwebsite.com)"
                fullWidth {...field} />
              )}
            />
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Collection Description</span>
            <Controller
              name="description"
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
                  error={errors.description}
                  multiline
                  rows={4}
                  placeholder="Collection Description"
                  fullWidth
                  {...field}
                />
              )}
            />
            {errors.description && (
              <p className="err">{errors.description.message}</p>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} sm={12}>
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
