/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {  Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Collection } from "./collection";
import { db } from "../../firebase";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { updateBalance } from "../../redux/accountSlice";
import { setAllCollection, setMyCollection } from "../../redux/collections";
import { Typography , Button} from "@mui/material";
import { useNavigate } from "react-router-dom";
export const NFTCollections = () => {
  const address = useSelector((state) => state.account.address);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nftCollections, setNFTCollections] = useState([]);
  const [myCollections, setMyColls] = useState([]);
  useEffect(() => {
    if (address !== "") {
      const q = query(collection(db, "contracts"), orderBy("created", "desc"));
      onSnapshot(q, (querySnapshot) => {
        const colls = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setNFTCollections(colls);
        dispatch(setAllCollection(colls));
      });
    }
  }, [address]);

  useEffect(() => {
    const myCol = nftCollections.filter(
      (x) => x.data.walletAddress === address
    );
    setMyColls(myCol);
    dispatch(setMyCollection(myCol));

  }, [nftCollections]);

  const getBalance = async () => {
    try {
      const x = await window.tronWeb.trx.getBalance(address);
      dispatch(updateBalance(window.tronWeb.fromSun(x)));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);
  return (
    <Container>
      <Row>
        {myCollections &&
          myCollections.map((collectionItem) => {
            return (
              <Col key={collectionItem.id} lg={4} md={6} sm={12}>
                <Collection collection={collectionItem} />
              </Col>
            );
          })}
          {
            myCollections.length === 0 && (
              <Col lg={12} md={12} sm={12}>
                <Typography>You do not have any NFT Collections.</Typography>
                <Button sx={{mt:3}} onClick={()=> navigate("/new-collection")} variant="contained">Create Collection</Button>
              </Col>
            )
          }
      </Row>
    </Container>
  );
};
