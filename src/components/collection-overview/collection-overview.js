/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper } from "@mui/material";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useState } from "react";
import { useSelector } from "react-redux";
import { HexAddress } from "../../utils/hex-util";
import { useEffect } from "react";
import mint from "../../assets/images/mint.svg";
import royalty from "../../assets/images/royalty.svg";

export const CollectionOverview = () => {
  const [contractBalace, setContractBalance] = useState(0);
  const [contract, setContract] = useState({});
  const [totalSupply, setTotalSupply] = useState(0);
  const [mintPrice, setMintPrice] =useState(0);
  const [royaltyInfo, setRoyaltyInfo] = useState();
  const collection = useSelector(
    (state) => state.collection.selectedCollection
  );
  const getBalance = async () => {
    let bal = await window.tronWeb.trx.getBalance(
      HexAddress.toBase58(collection.data.collectionAddress)
    );
    bal = window.tronWeb.fromSun(bal);
    setContractBalance(bal);
  };

  const getContract = async () => {
    const obj = await window.tronWeb
      .contract()
      .at(HexAddress.toBase58(collection.data.collectionAddress));
    setContract(obj);
    const price = Number(window.tronWeb.fromSun(await obj.PRICE().call()));
    const supply = Number(await obj.totalSupply().call());
    setMintPrice(price);
    setTotalSupply(window.tronWeb.toDecimal(supply));
    const royal = await obj.royaltyInfo(1,100).call();
    setRoyaltyInfo(royal);
  };

  useEffect(() => {
    getBalance();
    getContract();
  }, []);

  const handleWithdraw = async () => {
    await contract.withdrawAll().send();
  }
  return (
    <Container>
      <Row>
        <Col>
          <div className="col-overview">
            <Paper className="funds-paper" elevation={3}>
              <div className="funds">
                <AttachMoneyIcon className="funds-icon" />
              </div>
              <div style={{ width: "100%" }}>
                <p className="funds-bal">
                  <span> {Math.round(contractBalace).toFixed(4)} TRX </span>
                </p>
                <span className="funds-meta">
                  CURRENT CONTRACT BALANCE
                </span>
              </div>
              <div className="funds-btn">
                <Button onClick={handleWithdraw} startIcon={<AttachMoneyIcon />} variant="contained">
                  Withdraw
                </Button>
              </div>
            </Paper>
            <Paper className="funds-paper" elevation={3}>
              <div className="funds">
                <TimelineIcon className="funds-icon" />
              </div>
              <div style={{ width: "100%" }}>
                <p className="funds-bal">
                  <span> {totalSupply} /</span> 10000
                </p>
                <span className="funds-meta">TOTAL MINTED</span>
              </div>
            </Paper>
            <Paper className="funds-paper" elevation={3}>
              <div className="funds">
                <img src={mint} width={100} alt="mint icon" className="funds-icon" />
              </div>
              <div style={{ width: "100%" }}>
                <p className="funds-bal">
                  <span> {mintPrice} TRX</span> 
                </p>
                <span className="funds-meta">MINT PRICE</span>
              </div>
            </Paper>
            <Paper className="funds-paper" elevation={3}>
              <div className="funds">
                <img src={royalty} width={100} alt="mint icon" className="funds-icon" />
              </div>
              <div style={{ width: "100%" }}>
                <p className="funds-bal">
                  <span> {royaltyInfo ? window.tronWeb.toDecimal(royaltyInfo[1]): 0} %</span> 
                </p>
                <span className="funds-meta">ROYALTY PAYOUT TO {royaltyInfo ? HexAddress.toBase58(royaltyInfo[0]) : ""}</span>
              </div>
            </Paper>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
