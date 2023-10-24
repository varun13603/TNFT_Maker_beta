import React from "react";
import { Button } from "@mui/material";
import { Modal } from "react-bootstrap";
import { GridLoader } from "react-spinners";
import success from "../../assets/images/success.gif";
import errorGif from "../../assets/images/close.gif";
import { useNavigate } from "react-router-dom";

export default function CompileModal(props) {

  const navigate = useNavigate();
  const handleClose = () => {
    props.handleClose();
    if(props.txSuccess){
      navigate("/");
    }
  };
  
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
          <Modal.Title>Compilation Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!props.txSuccess && !props.txError && (
            <>
              <GridLoader color="black" />
              <p>Waiting for compilation result</p>
            </>
          )}
          {props.txSuccess && (
            <>
              <img src={success} alt="success icon" />
              <h2>Compilation successful!</h2>
            </>
          )}
          {props.txError && props.errObj && (
            <>
              <img src={errorGif} alt="error icon" />
              <h2>Compilation failed!</h2>
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
                View Fee Transaction on Tronscan
              </a>
            </span>
          )}
        </Modal.Body>
        {(props.txSuccess || props.txError) && (
          <Modal.Footer>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
            {props.txSuccess && <Button sx={{width:"150px"}} onClick={handleClose} variant="contained">Deploy</Button>}
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
}
