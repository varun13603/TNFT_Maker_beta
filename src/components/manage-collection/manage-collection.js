/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import ActionModal from "./action-modal";
import { HexAddress } from "../../utils/hex-util";
import dayjs from "dayjs";
import { updateBalance } from "../../redux/accountSlice";
const DatePicker = styled(DateTimePicker)(({ theme }) => ({
  marginBottom: "16px",
}));
export const ManageCollection = () => {
  const selectedCollection = useSelector(
    (state) => state.collection.selectedCollection
  );
  const address = useSelector((state) => state.account.address);
  const [enabledFeatures, setEnabledFeatures] = useState(undefined);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState(false);
  const [txEvent, setTxEvent] = useState(undefined);
  const [txErrObj, setTxErrObj] = useState(undefined);
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [transferOwnerAddress, setTransferOwerAddress] = useState("");
  const [contract, setContract] = useState({});
  const [royalty, setRoyalty] = useState({ address: "", bips: 0 });
  const [metadata, setMetadata] = useState("");
  const [mintPrice, setMintPrice] = useState(0);
  const [mintStart, setMintStart] = useState(0);
  const [premint, setPreMint] = useState(0);
  const [airdrop, setAirdrop] = useState("");
  const [presaleMintPrice, setPresaleMintPrice] = useState(0);
  const [presaleMintStart, setPresaleMintStart] = useState(0);
  const [addToWL, setAddToWL] = useState("");
  const [removeFromWL, setRemoveFromWL] = useState("");

  const dispatch = useDispatch();

  const getContract = async () => {
    const obj = await window.tronWeb
      .contract()
      .at(HexAddress.toBase58(selectedCollection.data.collectionAddress));
    setContract(obj);
  };

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
    if (selectedCollection.data.collection.additionalFeatureDetails) {
      setEnabledFeatures(
        selectedCollection.data.collection.additionalFeatureDetails
      );
    }
    if (selectedCollection.data.collectionAddress) {
      getContract();
    }
  }, [selectedCollection]);

  const closeTxModal = () => {
    setShowTxModal(false);
    setTxSuccess(false);
    setTxErrObj(undefined);
    setTxError(false);
    setTxEvent(undefined);
  };

  const handleTransferOwnership = async () => {
    if (transferOwnerAddress === "") {
      setSnackMessage("Enter the address to transfer the owership!");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract
          .transferOwnership(transferOwnerAddress)
          .send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxSuccess(true);
                setTxEvent({ txid: tx.id });
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        console.log(err);
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
        getBalance();
      }
    }
  };

  const handleRoyaltyAction = async () => {
    if (royalty.address === "") {
      setSnackMessage("Enter the address to transfer the royalties!");
      setShowSnack(true);
    } else if (Number(royalty.bips) <= 0) {
      setSnackMessage("Enter the royalty %");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract
          .setRoyaltyInfo(royalty.address, Number(royalty.bips) * 100)
          .send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxSuccess(true);
                setTxEvent({ txid: tx.id });
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        console.log(err);
        console.log(err);
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };

  const handleRenounceOwnership = async () => {
    setShowTxModal(true);
    try {
      const tx = await contract.renounceOwnership().send();
      const interval = setInterval(() => {
        window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
          try {
            if (txInfo.receipt.result === "SUCCESS") {
              setTxSuccess(true);
              setTxEvent({ txid: tx.id });
              clearInterval(interval);
              getBalance();
            } else {
              setTxError(true);
              setTxEvent({ txid: tx.id });
              setTxErrObj({
                output: {
                  contractResult: [txInfo.contractResult[0]],
                },
              });
              clearInterval(interval);
              getBalance();
            }
          } catch {}
        });
      }, 10000);
    } catch (err) {
      getBalance();
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
            contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
          },
        });
      }
    }
  };

  const handleReveal = async () => {
    setShowTxModal(true);
    try {
      const tx = await contract.revealCollection().send();
      const interval = setInterval(() => {
        window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
          try {
            if (txInfo.receipt.result === "SUCCESS") {
              setTxSuccess(true);
              setTxEvent({ txid: tx.id });
              clearInterval(interval);
              getBalance();
            } else {
              setTxError(true);
              setTxEvent({ txid: tx.id });
              setTxErrObj({
                output: {
                  contractResult: [txInfo.contractResult[0]],
                },
              });
              clearInterval(interval);
              getBalance();
            }
          } catch {}
        });
      }, 10000);
    } catch (err) {
      getBalance();
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
            contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
          },
        });
      }
    }
  };

  const handleSetSalePrice = async () => {
    if (mintPrice <= 0) {
      setSnackMessage("Enter the new sale price.");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract
          .setSalePrice(window.tronWeb.toSun(mintPrice))
          .send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxSuccess(true);
                setTxEvent({ txid: tx.id });
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };

  const handlePresaleMintPrice = async () => {
    if (presaleMintPrice <= 0) {
      setSnackMessage("Enter the new presale price.");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract
          .setPresalePrice(window.tronWeb.toSun(presaleMintPrice))
          .send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              console.log(txInfo);
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxSuccess(true);
                setTxEvent({ txid: tx.id });
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };
  const handleSetMetadata = async () => {
    if (metadata === "") {
      setSnackMessage("Enter the new metadata CID");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract
          .setBaseURI(`https://ipfs.io/ipfs/${metadata}/`)
          .send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxSuccess(true);
                setTxEvent({ txid: tx.id });
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };

  const handleMintStart = async () => {
    if (mintStart <= 0) {
      setSnackMessage("Enter the new sale start time.");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract.setSaleTime(mintStart).send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxSuccess(true);
                setTxEvent({ txid: tx.id });
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };

  const handlePresaleMintStart = async () => {
    if (presaleMintStart <= 0) {
      setSnackMessage("Enter the new sale start time.");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract.setPresaleTime(presaleMintStart).send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxSuccess(true);
                setTxEvent({ txid: tx.id });
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };

  const handlePreMint = async () => {
    if (premint <= 0) {
      setSnackMessage("Enter the number of tokens to premint.");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract.reserveTokens(premint).send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              console.log(txInfo);
              if (txInfo.receipt.result === "SUCCESS") {
                
                setTxSuccess(true);
                setTxEvent({ txid: tx.id });
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                if(txInfo.contractResult[0]!== ''){
                  setTxErrObj({
                    output: {
                      contractResult: [txInfo.contractResult[0]],
                    },
                  });
                }else{
                  setTxErrObj({
                    output: {
                      contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
                    },
                  });
                }
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };

  const handleAirdrop = async () => {
    if (airdrop === "") {
      setSnackMessage("Enter the wallet addresses to airdrop nnfts.");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract.airdropNFT(airdrop.split(",")).send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxEvent({ txid: tx.id });
                setTxSuccess(true);
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };

  const handleAddToWL = async () => {
    if (addToWL === "") {
      setSnackMessage("Enter the wallet addresses to add to the whitelist.");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract.addToWhiteList(addToWL.split(",")).send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxEvent({ txid: tx.id });
                setTxSuccess(true);
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };

  const handleRemoveFromWL = async () => {
    if (airdrop === "") {
      setSnackMessage("Enter the wallet addresses to airdrop nnfts.");
      setShowSnack(true);
    } else {
      setShowTxModal(true);
      try {
        const tx = await contract.removeFromWhiteList(removeFromWL.split(",")).send();
        const interval = setInterval(() => {
          window.tronWeb.trx.getTransactionInfo(tx).then(async (txInfo) => {
            try {
              if (txInfo.receipt.result === "SUCCESS") {
                console.log(txInfo);
                setTxEvent({ txid: tx.id });
                setTxSuccess(true);
                clearInterval(interval);
                getBalance();
              } else {
                setTxError(true);
                setTxEvent({ txid: tx.id });
                setTxErrObj({
                  output: {
                    contractResult: [txInfo.contractResult[0]],
                  },
                });
                clearInterval(interval);
                getBalance();
              }
            } catch {}
          });
        }, 10000);
      } catch (err) {
        getBalance();
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
              contractResult: [window.tronWeb.toHex("UNKNOWN ERROR OCCURED")],
            },
          });
        }
      }
    }
  };
  return (
    <Container>
      <Row>
        <Col lg={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography sx={{ mb: 2, fontWeight: 700 }}>
              Transfer Ownership
            </Typography>
            <TextField
              value={transferOwnerAddress}
              onChange={(event) => setTransferOwerAddress(event.target.value)}
              label="New Owner Address"
              sx={{ mb: 2 }}
            />
            <Button onClick={handleTransferOwnership} variant="contained">
              Confirm
            </Button>
          </Paper>
        </Col>

        {enabledFeatures && enabledFeatures.changeBaseUriEnabled && (
          <Col lg={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>
                Change Metadata
              </Typography>
              <TextField
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                label="New Metadata CID"
                sx={{ mb: 2 }}
              />
              <Button onClick={handleSetMetadata} variant="contained">
                Confirm
              </Button>
            </Paper>
          </Col>
        )}
        {enabledFeatures && enabledFeatures.changeableMintPricingEnabled && (
          <Col lg={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>
                Change Mint Price
              </Typography>
              <TextField
                value={mintPrice === 0 ? "" : mintPrice}
                label="New Mint Price"
                sx={{ mb: 2 }}
                onChange={(e) => setMintPrice(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">TRX</InputAdornment>
                  ),
                }}
              />
              <Button onClick={handleSetSalePrice} variant="contained">
                Confirm
              </Button>
            </Paper>
          </Col>
        )}
        {enabledFeatures && enabledFeatures.changeableSaleTimingEnabled && (
          <Col lg={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>
                Change Mint Start Time
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  renderInput={(props) => <TextField {...props} />}
                  fullWidth
                  className="date-picker"
                  value={dayjs.unix(mintStart)}
                  onChange={(event) => setMintStart(dayjs(event).unix())}
                />
              </LocalizationProvider>
              <Button onClick={handleMintStart} variant="contained">
                Confirm
              </Button>
            </Paper>
          </Col>
        )}

        {enabledFeatures &&
          enabledFeatures.changeableMintPricingEnabled &&
          enabledFeatures.presaleEnabled && (
            <Col lg={4}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography sx={{ mb: 2, fontWeight: 700 }}>
                  Change Presale Mint Price
                </Typography>
                <TextField
                  label="New Presale Mint Price"
                  value={presaleMintPrice === 0 ? "" : presaleMintPrice}
                  sx={{ mb: 2 }}
                  onChange={(e) => setPresaleMintPrice(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">TRX</InputAdornment>
                    ),
                  }}
                />
                <Button onClick={handlePresaleMintPrice} variant="contained">
                  Confirm
                </Button>
              </Paper>
            </Col>
          )}
        {enabledFeatures &&
          enabledFeatures.changeableSaleTimingEnabled &&
          enabledFeatures.presaleEnabled && (
            <Col lg={4}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography sx={{ mb: 2, fontWeight: 700 }}>
                  Change Presale Mint Start Time
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    renderInput={(props) => <TextField {...props} />}
                    fullWidth
                    className="date-picker"
                    value={dayjs.unix(presaleMintStart)}
                    onChange={(event) =>
                      setPresaleMintStart(dayjs(event).unix())
                    }
                  />
                </LocalizationProvider>
                <Button onClick={handlePresaleMintStart} variant="contained">
                  Confirm
                </Button>
              </Paper>
            </Col>
          )}
        {enabledFeatures && enabledFeatures.premintEnabled && (
          <Col lg={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>
                Premint Tokens
              </Typography>
              <TextField
                label="Tokens to premint"
                type="number"
                sx={{ mb: 2 }}
                value={premint === 0 ? "" : premint}
                onChange={(e) => setPreMint(e.target.value)}
              />
              <Button onClick={handlePreMint} variant="contained">
                Confirm
              </Button>
            </Paper>
          </Col>
        )}
        {enabledFeatures && enabledFeatures.airdropEnabled && (
          <Col lg={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>
                Airdrop NFT
              </Typography>
              <TextField
                value={airdrop}
                onChange={(e) => setAirdrop(e.target.value)}
                label="Address"
                placeholder="Address (e.g. addr1,addr2)"
                sx={{ mb: 2 }}
              />
              <Button onClick={handleAirdrop} variant="contained">
                Confirm
              </Button>
            </Paper>
          </Col>
        )}

        {enabledFeatures && enabledFeatures.presaleEnabled && (
          <Col lg={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>
                Add to whitelist
              </Typography>
              <TextField
                value={addToWL}
                onChange={(e) => setAddToWL(e.target.value)}
                label="Address"
                placeholder="Address (e.g. addr1,addr2)"
                sx={{ mb: 2 }}
              />
              <Button onClick={handleAddToWL} variant="contained">
                Confirm
              </Button>
            </Paper>
          </Col>
        )}

        {enabledFeatures && enabledFeatures.presaleEnabled && (
          <Col lg={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>
                Remove from whitelist
              </Typography>
              <TextField
                value={removeFromWL}
                onChange={(e) => setRemoveFromWL(e.target.value)}
                label="Address"
                placeholder="Address (e.g. addr1,addr2)"
                sx={{ mb: 2 }}
              />
              <Button onClick={handleRemoveFromWL} variant="contained">Confirm</Button>
            </Paper>
          </Col>
        )}

        <Col lg={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography sx={{ mb: 2, fontWeight: 700 }}>
              Renounce Ownership
            </Typography>
            <Button onClick={handleRenounceOwnership} variant="contained">
              Confirm
            </Button>
          </Paper>
        </Col>
        {enabledFeatures && enabledFeatures.nftRevealEnabled && (
          <Col lg={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography sx={{ mb: 2, fontWeight: 700 }}>
                Reveal NFTs
              </Typography>
              <Button onClick={handleReveal} variant="contained">Confirm</Button>
            </Paper>
          </Col>
        )}
        <Col lg={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography sx={{ mb: 2, fontWeight: 700 }}>
              Set Royalty Info
            </Typography>
            <TextField
              value={royalty.address}
              onChange={(e) =>
                setRoyalty({ ...royalty, address: e.target.value })
              }
              label="Receiver Address"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Royalty %"
              value={royalty.bips === 0 ? "" : royalty.bips}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              onChange={(e) => setRoyalty({ ...royalty, bips: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button onClick={handleRoyaltyAction} variant="contained">
              Confirm
            </Button>
          </Paper>
        </Col>
      </Row>
      <ActionModal
        showTxModal={showTxModal}
        txSuccess={txSuccess}
        txError={txError}
        errObj={txErrObj}
        txEvent={txEvent}
        handleClose={closeTxModal}
      />
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        onClose={() => {
          setShowSnack(false);
        }}
      >
        <Alert severity="error">{snackMessage}</Alert>
      </Snackbar>
    </Container>
  );
};
