/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateBalance } from "../../redux/accountSlice";
import TxModal from "../tx-modal/tx-modal";
import contract from "../../contract/contract.json";
import {
  doc,
  updateDoc,
  query,
  collection as fbColl,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { setAllCollection, setMyCollection, setSelectedCollection } from "../../redux/collections";

export const DeployContract = () => {
  const [showTxModal, setShowTxModal] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txEvent, setTxEvent] = useState(undefined);
  const [txErrObj, setTxErrObj] = useState(undefined);
  const address = useSelector((state) => state.account.address);
  const collection = useSelector(
    (state) => state.collection.selectedCollection
  );
  const dispatch = useDispatch();

  const getBalance = async () => {
    try {
      const x = await window.tronWeb.trx.getBalance(address);
      console.log("Balance", window.tronWeb.fromSun(x));
      dispatch(updateBalance(window.tronWeb.fromSun(x)));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (address !== "") {
      getBalance();
    }
  }, [address]);
  const closeTxModal = () => {
    setShowTxModal(false);
    setTxSuccess(false);
    setTxErrObj(undefined);
    setTxError(false);
    setTxEvent(undefined);
  };

  const handleDeployment = async () => {
    setShowTxModal(true);
    try {
      const abi = contract.abi;
      const bytecode = contract.bytecode;
      console.log(
        JSON.stringify(getDeploymentParams(collection.data.collection))
      );
      const transaction =
        await window.tronWeb.transactionBuilder.createSmartContract(
          {
            abi: abi,
            bytecode: bytecode,
            feeLimit: 1e10,
            parameters: getDeploymentParams(collection.data.collection),
          },
          window.tronWeb.defaultAddress.hex
        );
      console.log("transaction:", transaction);
      // let contractObj = await window.tronWeb.contract().new({
      //     abi: abi,
      //     bytecode: bytecode,
      //     userFeePercentage: 1,
      //     parameters: getDeploymentParams(collection.data.collection)

      // })
      const signedTransaction = await window.tronWeb.trx.sign(transaction);
      console.log("signed transaction:", signedTransaction);
      const contractObj = await window.tronWeb.trx.sendRawTransaction(
        signedTransaction
      );
      console.log(contractObj);
      if (contractObj.code) {
        setTxError(true);
        setTxErrObj({
          output: {
            contractResult: [contractObj.message],
          },
        });
      } else {
        const int = setInterval(() => {
          window.tronWeb.trx
            .getTransactionInfo(contractObj.txid)
            .then(async (info) => {
              console.log(info);
              try {
                if (info.receipt.result === "SUCCESS") {
                  setTxSuccess(true);
                  setTxEvent({ txid: contractObj.txid });
                  clearInterval(int);
                  const contractDocRef = doc(db, "contracts", collection.id);
                  try {
                    await updateDoc(contractDocRef, {
                      isDeployed: true,
                      deployTransaction: JSON.parse(JSON.stringify(info)),
                      collectionAddress: info.contract_address,
                    });
                    const q = query(
                      fbColl(db, "contracts"),
                      orderBy("created", "desc")
                    );
                    
                    onSnapshot(q, (querySnapshot) => {
                      const colls = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                      }));
                      const myColls = colls.filter(x => x.data.walletAddress === address);
                      const thisColl = colls.find(x => x.id === collection.id);
                      dispatch(setMyCollection(myColls));
                      dispatch(setSelectedCollection(thisColl));
                      dispatch(setAllCollection(colls));
                    });
                  } catch (err) {
                    alert(err);
                  }
                } else {
                  setTxError(true);
                  setTxEvent({ txid: contractObj.txid });
                  setTxErrObj({
                    output: {
                      contractResult: [info.receipt.result],
                    },
                  });
                  clearInterval(int);
                }
              } catch {}
            });
        }, 10000);

        // if (info.receipt.result === "SUCCESS") {
        //   setTxSuccess(true);
        //   setTxEvent(contractObj);
        // }
      }
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
      } else {
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
  };
  return (
    <Container>
      <Row>
        <Col>
          <Button onClick={handleDeployment} variant="contained">
            Deploy Contract
          </Button>
        </Col>
      </Row>
      <TxModal
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

function getDeploymentParams(collection) {
  const name = collection.basicDetails.collectionName;
  const symbol = collection.basicDetails.symbol;

  const inputString = [
    getMetadataUrl(collection.additionalFeatureDetails.urevealedMetadata),
    getMetadataUrl(collection.contentDetails.metadataCID),
  ];
  const inputAddress = [
    collection.ownershipDetails.contractOwner,
    collection.ownershipDetails.primarySaleFundsReceiver,
    collection.royaltyDetails.royaltyReceiver,
  ];
  const inputUint256 = [
    Number(collection.basicDetails.size),
    Number(collection.mintingDetails.mintPerTx),
    Number(collection.mintingDetails.mintPrice),
    Number(collection.mintingDetails.mintPerWallet),
    Number(collection.mintingDetails.mintStartTime),
    Number(collection.royaltyDetails.royaltyBips)*100,
    Number(collection.additionalFeatureDetails.presaleLimit),
    Number(collection.additionalFeatureDetails.presalePrice),
    Number(collection.additionalFeatureDetails.presaleMintPerTx),
    Number(collection.additionalFeatureDetails.presaleMintPerWallet),
  ];

  const inputBool = [
    collection.additionalFeatureDetails.presaleEnabled,
    collection.additionalFeatureDetails.airdropEnabled,
    collection.additionalFeatureDetails.changeableMintPricingEnabled,
    collection.additionalFeatureDetails.changeableSaleTimingEnabled,
    collection.additionalFeatureDetails.nftRevealEnabled,
    collection.additionalFeatureDetails.premintEnabled,
    collection.additionalFeatureDetails.changeBaseUriEnabled,
  ]

  return [name, symbol, inputString, inputAddress, inputUint256, inputBool];
}

function getMetadataUrl(cid) {
  return `https://ipfs.io/ipfs/${cid}/`;
}
