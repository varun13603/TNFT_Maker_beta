/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import React from "react";
import trx from "../../assets/images/trx.jpg";
import LaunchIcon from "@mui/icons-material/Launch";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedCollection } from "../../redux/collections";
import { useState } from "react";
import { getImageAddress } from "../collection-header/collection-header";
import { useEffect } from "react";
import { HexAddress } from "../../utils/hex-util";
export const Collection = (props) => {
  const { collection, isDeployed, collectionAddress } =
    props.collection.data;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if(collection){
        setUrl(props.collection.data.collection.contentDetails.collectionImage ? props.collection.data.collection.contentDetails.collectionImage : getImageAddress(props.collection) );
    }
  }, [collection])
  const openCollection = (id) => {
    dispatch(setSelectedCollection(props.collection));
    console.log(id)
    navigate(`/collection/${id}`);
  };

  return (
    <Paper className="nft-collection">
      <div>
        <img
          className="col-img"
          style={{ display: imgLoaded ? "block" : "none" }}
          onLoad={() => setImgLoaded(true)}
          src={url}
          alt="collection Img"
        />
        {!imgLoaded && (
          <Box sx={{
            display: "flex",
            flexDirection: "row",
            alignItems:"center",
            justifyContent: "center",
            backgroundColor: "whitesmoke"
          }} className="col-img">
            <CircularProgress />
          </Box>
        )}
        <p onClick={() => openCollection(props.collection.id)} className="col-name">
          {collection.basicDetails.collectionName}
        </p>
        <p className="items">{collection.basicDetails.size} Items</p>
        <Divider className="divider" />
        <div className="col-actions">
          {isDeployed && (
            <IconButton onClick={() => window.open(`https://tronscan.org/#/contract/${HexAddress.toBase58(collectionAddress)}`)}>
              <img className="exp-btn" src={trx} alt="ns" />
            </IconButton>
          )}
          <IconButton onClick={() => openCollection(props.collection.id)}>
            <LaunchIcon />
          </IconButton>
        </div>
      </div>
      {/* <Button variant='contained' >Create Collection</Button> */}
    </Paper>
  );
};
