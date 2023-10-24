import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import styled from "@emotion/styled";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Button, CircularProgress } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { Box } from "@mui/system";
import { HexAddress } from "../../utils/hex-util";

const Name = styled.span`
  font-size: 28px;
  font-weight: 700;
`;
export const CollectionHeader = () => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const collection = useSelector(
    (state) => state.collection.selectedCollection
  );

  return (
    <Container className="collection-header">
      <Row>
        <Col>
          {collection &&  (
            <img
              src={collection.data.collection.contentDetails.collectionImage ? collection.data.collection.contentDetails.collectionImage : getImageAddress(collection)}
              onLoad={() => setImgLoaded(true)}
              alt="collection"
              className="col-avatar"
              style={{display: imgLoaded? "block" : "none"}}
            />
          )}
          {!imgLoaded && (
            <Box sx={{backgroundColor:"gray"}} justifyContent="center" className="col-avatar" display="flex" alignItems="center">
              <CircularProgress />
            </Box>
          )}
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={12} sm={12}>
          {collection && (
            <Name>{`${collection.data.collection.basicDetails.collectionName} (${collection.data.collection.basicDetails.symbol})`}</Name>
          )}
          <p className="meta">
            {collection.data.collection.basicDetails.size} Items |{" "}
            {collection.data.isDeployed
              ? shortAddress(HexAddress.toBase58(collection.data.collectionAddress))
              : collection.data.collectionAddress}
            {collection.data.isDeployed && (
              <IconButton>
                <ContentCopyIcon className="copy-icon" />
              </IconButton>
            )}
          </p>
          <p className="description">
            {collection.data.collection.basicDetails.description}
          </p>
        </Col>
        <Col lg={6} md={12} sm={12}>
          <div className="menu-container">
            {collection && collection.data.isDeployed && (
              <Button
                className="prof-head-btn"
                variant="contained"
                endIcon={<LaunchIcon />}
                onClick={() =>
                  window.open(
                    `https://tronscan.org/#/contract/${HexAddress.toBase58(collection.data.collectionAddress)}`,
                    "_blank"
                  )
                }
              >
                {" "}
                View on Tronscan
              </Button>
            )}
            {collection && (
              <Button
                className="prof-head-btn"
                variant="contained"
                endIcon={<LaunchIcon />}
                onClick={() =>
                  window.open(
                    collection.data.collection.basicDetails.website,
                    "_blank"
                  )
                }
              >
                {" "}
                Visit Website
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const shortAddress = (addr) => {
  const start = addr.substr(0, 4);
  const end = addr.substr(addr.length - 5, addr.length - 1);

  return `${start}...${end}`.toUpperCase();
};

export const getImageAddress = (collection) => {
  const artworkCID = collection.data.collection.contentDetails.contentCID;
  const ext = collection.data.collection.contentDetails.contentExtension;
  return `https://ipfs.io/ipfs/${artworkCID}/1.${ext}`;
};
