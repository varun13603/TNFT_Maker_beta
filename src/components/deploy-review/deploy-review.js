/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { DeployReviewTabs } from "./tabs";
import { useDispatch, useSelector } from "react-redux";
import { decrementStep } from "../../redux/newCollectionSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CompileModal from "../compile-modal/compile-modal";
import { db } from "../../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { updateBalance } from "../../redux/accountSlice";
import trx from "../../assets/images/trx.jpg";
import { env } from "../../env";

export const DeploymentReview = () => {
  const [showTxModal, setShowTxModal] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txEvent, setTxEvent] = useState(undefined);
  const [txErrObj, setTxErrObj] = useState(undefined);
  const [address, setAddress] = useState("");
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);
  const newCollection = useSelector((state) => state.newCollection);
   const dispatch = useDispatch()
   const baseCost = useSelector((state) => state.newCollection.totalCost);
   const getBalance = async () => {
    try {
      const x = await window.tronWeb.trx.getBalance(address);
      dispatch(updateBalance(window.tronWeb.fromSun(x)));

    } catch (err) {
      console.log(err);
    }
  };

  const getWalletAddress = async () => {
    try {
      if (window.tronLink) {
        if (window.tronLink.tronWeb) {
          const x = await window.tronLink.request({
            method: "tron_requestAccounts",
          });
          if (x.code === 200) {
            setAddress(window.tronWeb.defaultAddress.base58);
            getBalance();
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getWalletAddress();
  }, []);

  const closeTxModal = () => {
    setShowTxModal(false);
    setTxSuccess(false);
    setTxErrObj(undefined);
    setTxError(false);
    setTxEvent(undefined);
  };

  const executeDeploy = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      try {
        setShowTxModal(true);
        const receipt = await window.tronWeb.trx.sendTransaction(
          env.TREASURY_WALLET,
          window.tronWeb.toSun(baseCost)
        );
        let collectioObj;
        if(newCollection.additionalFeauresDetails !== undefined){
          collectioObj = newCollection;
        }else{
          collectioObj = {...newCollection, additionalFeaturesDetails:{
            presaleEnabled:false,
            presaleLimit: "",
            presalePrice: "",
            presaleMintPerTx:"",
            presaleMintPerWallet: "",
            airdropEnabled: false,
            changeableMintPricingEnabled: false,
            changeableSaleTimingEnabled: false,
            nftRevealEnabled: false,
            urevealedMetadata: "",
            premintEnabled: false,
            changeBaseUriEnabled: false
          } }
        }
          await addDoc(collection(db, "contracts"), {
            walletAddress: address,
            collection: collectioObj,
            isDeployed: false,
            txID: receipt.txid,
            created: Timestamp.now(),
            collectionAddress: "Not Deployed",
          });
        setTxSuccess(true);
        setTxEvent(receipt);
        getBalance();
      } catch (err) {
        console.log(err);
        if (err === "Confirmation declined by user") {
          setTxError(true);
          setTxErrObj({
            output: {
              contractResult: [
                window.tronWeb.toHex("Confirmation declined by user"),
              ],
            },
          });
        }else {
          setTxError(true);
          setTxErrObj({
            output: {
              contractResult: [
                window.tronWeb.toHex(
                  "Compilation Failed! If the amount is deducted from the wallet contact support with transaction id"
                ),
              ],
            },
          });
        } 
      }
    }
    // setShowTxModal(true);
    // setTimeout(()=> {
    //   setTxEvent({transaction:'bjkchvsksjvskjxsvxsuxgisxk'});
    //   setTxSuccess(true);
    // }, 5000)
  };
  return (
    <Container>
      <Row>
        <Col className="deploy-review" lg={12} sm={12} md={12}>
          <DeployReviewTabs />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            sx={{ marginRight: "8px" }}
            startIcon={<ArrowBackIcon />}
            onClick={() => dispatch(decrementStep())}
            variant="contained"
          >
            Previous
          </Button>
          <Button
            endIcon={<ArrowForwardIcon />}
            variant="contained"
            onClick={executeDeploy}
          >
            Compile Contract
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
      <CompileModal
        showTxModal={showTxModal}
        txSuccess={txSuccess}
        txError={txError}
        errObj={txErrObj}
        txEvent={txEvent}
        handleClose={closeTxModal}
      />
    </Container>
  );
};
