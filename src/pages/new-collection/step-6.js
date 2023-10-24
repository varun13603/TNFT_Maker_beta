import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementStep,
  updateContentDetails,
  decrementStep,
} from "../../redux/newCollectionSlice";
import trx from "../../assets/images/trx.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const code = `{
    "name": "name #1"
    "description": "description #1",
    "attributes": [...],
    "image": "ipfs://_YOUR_CONTENT_FOLDER_CID_/1.png",
    // anything else you want to add
}`;
export const StepSix = () => {
  const contentDetails = useSelector(
    (state) => state.newCollection.contentDetails
  );
  const dispatch = useDispatch();
  const baseCost = useSelector((state) => state.newCollection.totalCost);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: contentDetails,
  });
  const onSubmit = (data) => {
    dispatch(updateContentDetails(data));
    dispatch(incrementStep());
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <p>
              To make your project completely decentralized, we recommend using
              IPFS file storage. For most cases, it's free, and uploading takes
              a minimum of time. Below are two optimal ways to upload files to
              IPFS.
            </p>
            <p>
              After uploading, you will have access to the special identifier
              (CID) for the folder with your content. This folder should contain
              your images labeled 1.png, 2.png... where each image matches its
              token id.
            </p>
            <span>
              Choose one of the tools. Click to find out more details.
            </span>
          </Col>
          <Col lg={6} md={12} sm={12}>
            <Paper
              onClick={() => window.open("https://pinata.cloud", "_blank")}
              variant="outlined"
              className="pinata"
            >
              <div className="flex">
                <img
                  src="https://app.umbre.xyz/static/media/pinata-logo.41ed770ecfc1b2beba36.png"
                  alt="pinata"
                />
                <div>
                  <Typography variant="h6">Pinata</Typography>
                  <Typography variant="caption">
                    Pinata is a prremium IPFS service provider that gives you
                    decentralized hosting.
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    First 100 files or 1GB is free.
                  </Typography>
                </div>
              </div>
            </Paper>
          </Col>
          <Col lg={6} md={12} sm={12}>
            <Paper
              onClick={() => window.open("https://nft.storage", "_blank")}
              variant="outlined"
              className="pinata"
            >
              <div className="flex">
                <img
                  src="https://app.umbre.xyz/static/media/nftstorage-logo.3617d6eec07e267fee36.png"
                  alt="pinata"
                />
                <div>
                  <Typography variant="h6">NFT.Storage</Typography>
                  <Typography variant="caption">
                    NFT.Storage is a no-frills open source tool to upload your
                    NFTs directly to IPFS.
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    NFT.Storage is free to use
                  </Typography>
                </div>
              </div>
            </Paper>
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Content folder CID</span>
            <Controller
              name="contentCID"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.contentCID}
                  className="txt"
                  fullWidth
                  placeholder="IPFS CID for NFT artwork folder"
                  {...field}
                />
              )}
            />
            {errors.contentCID && (
              <p className="err">{errors.contentCID.message}</p>
            )}
          </Col>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Content file extension</span>
            <br/>
            <Controller
              name="contentExtension"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <Select fullWidth placeholder="Select extension of the artworks file" {...field}>
                  <MenuItem value="select">Select extension of the artworks file</MenuItem>
                  <MenuItem value={"PNG"}>PNG</MenuItem>
                  <MenuItem value={"JPG"}>JPG</MenuItem>
                  <MenuItem value={"GIF"}>GIF</MenuItem>
                </Select>
              )}
            />
            {errors.contentExtension && (
              <p className="err">{errors.contentExtension.message}</p>
            )}
          </Col>
        </Row>
        <Col lg={12} md={12} sm={12}>
          <br />
          <p>
            It's good practice to add metadata to your collection. This metadata
            can be used by marketplaces to display the features of each item in
            your collection. Below is an example of how the metadata file for
            each item in the collection should look like.
          </p>
          <p>
            Upload your folder with metadata to IPFS like you did with content
            and provide folder CID. Each file should match a token number - for
            example 1.png's metadata should have a matching 1.json file here.
          </p>

          <br />

          <SyntaxHighlighter language="javascript" style={docco}>
            {code}
          </SyntaxHighlighter>
        </Col>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Metadata folder CID</span>
            <Controller
              name="metadataCID"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.metadataCID}
                  className="txt"
                  placeholder="IPFS CID for NFT metadata folder"
                  fullWidth
                  {...field}
                />
              )}
            />
            {errors.metadataCID && (
              <p className="err">{errors.metadataCID.message}</p>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={6} md={12} sm={12}>
            <span className="label">Collection Image</span>
            <Controller
              name="collectionImage"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "This is a required field.",
                },
              }}
              render={({ field }) => (
                <TextField
                  error={errors.collectionImage}
                  className="txt"
                  placeholder="URL of the collection diaplay image."
                  fullWidth
                  {...field}
                />
              )}
            />
            {errors.collectionImage && (
              <p className="err">{errors.collectionImage.message}</p>
            )}
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
                <img style={{ width: "20px" }} src={trx} alt="trx logo" />{" "}
              </Typography>
            </Box>
          </Col>
        </Row>
      </Container>
    </form>
  );
};
