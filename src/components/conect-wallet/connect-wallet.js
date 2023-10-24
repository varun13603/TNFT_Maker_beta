/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box } from "@mui/system";
import { ProfileIcon } from "../profile-icon/profile-icon";
import trx from "../../assets/images/trx.jpg";
import LensIcon from "@mui/icons-material/Lens";
import {useSelector, useDispatch} from "react-redux";
import { updateAddress, updateBalance , updateLoginStatus} from "../../redux/accountSlice";
export const ConnectWallet = () => {
  const address = useSelector((state) => state.account.address);
  const balance = useSelector((state)=> state.account.balance);
  const dispatch = useDispatch();
  const linkTronLink = async () => {
    if (window.tronLink) {
      if (window.tronLink.tronWeb) {
        const x = await window.tronLink.request({
          method: "tron_requestAccounts",
        });
        if (x.code === 200) {
          dispatch(updateLoginStatus(true));
          dispatch(updateAddress(window.tronWeb.defaultAddress.base58));
        }
      } else if (!window.tronLink.ready) {
        const x = await window.tronLink.request({
          method: "tron_requestAccounts",
        });
        if (x.code === 200) {
          dispatch(updateLoginStatus(true));
          dispatch(updateAddress(window.tronWeb.defaultAddress.base58));
        }
      } else {
        alert("Please Unlock/Install TronnLink wallet.");
      }
    } else {
      alert("Please install TronLink wallet!");
    }
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
    if (address !== "") {
      getBalance();
    }
  }, [address]);
  return (
    <Fragment>
      {address === "" || address === undefined ? (
        <Button
          onClick={linkTronLink}
          startIcon={<WalletIcon />}
          variant="contained"
        >
          Connect Wallet
        </Button>
      ) : (
        <Box display="flex" alignItems="center" flexDirection="row">
          <ProfileIcon account={address} size={45} />
          <Box display="flex" alignItems="center" flexDirection="row">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-end"
            >
              <span className="wallet-bal" variant="caption">
                {`${balance} TRX`}
              </span>
              <span>
                <Typography className="wallet-addr" variant="caption">
                  {shortAddress(address)}
                </Typography>
                <LensIcon className="dot-icon" />
              </span>
            </Box>
            <img
              className="trx-wallet-logo"
              width={25}
              height={25}
              src={trx}
              alt="trx logo"
            />
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

const shortAddress = (addr) => {
  const start = addr.substr(0, 4);
  const end = addr.substr(addr.length - 5, addr.length - 1);

  return `${start}...${end}`.toUpperCase();
};
