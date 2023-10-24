import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Modal } from "react-bootstrap";
import { GridLoader } from "react-spinners";
import success from "../../assets/images/success.gif";
import errorGif from "../../assets/images/close.gif";
import { useNavigate } from "react-router-dom";

export default function ActionModal(props) {

  const navigate = useNavigate();
  const handleClose = () => {
    props.handleClose();
    
  };
  const handleDashboard = () => {
    props.handleClose();
    if(props.txSuccess){
      navigate("/");
    }
  };

  useEffect(() => {
    console.log(props.txEvent);
    console.log("errObj", props.errObj)
  },[props])
  
  return (
    <div>
      <Modal
        show={props.showTxModal}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Action Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!props.txSuccess && !props.txError && (
            <>
              <GridLoader color="black" />
              <p>Waiting for action result</p>
            </>
          )}
          {props.txSuccess && (
            <>
              <img src={success} alt="success icon" />
              <h2>Action successful!</h2>
            </>
          )}
          {props.txError && props.errObj && (
            <>
              <img src={errorGif} alt="error icon" />
              <h2>Action failed!</h2>
                <span>{window.tronWeb.toAscii(props.errObj.output.contractResult[0]).toString()}</span>
            </>
          )}
          {props.txEvent && (
            <span>
              <a
                href={`https://tronscan.org/#/transaction/${props.txEvent.txid}`}
                target="_blank"
                rel="noreferrer"
              >
                View on Tronscan
              </a>
            </span>
          )}
        </Modal.Body>
        {(props.txSuccess || props.txError) && (
          <Modal.Footer>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
            {props.txSuccess && <Button onClick={handleDashboard} variant="contained">Dashboard</Button>}
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
}
