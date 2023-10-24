import React from "react";
import { useSelector } from "react-redux";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const AdditionalFeatureDetails = () => {
  const details = useSelector((state) => state.newCollection.additionalFeatureDetails);
  
  function createData(property, value) {
    return {property, value};
  }
  const rows = [
    createData("Presale Minting", details.presaleEnabled ? 'Enabled' : "Not Enabled"),
    createData("Presale Limit", details.presaleEnabled ? details.presaleLimit : "Not Available"),
    createData("Presale Price", details.presaleEnabled ? details.presalePrice : "Not Available"),
    createData("Presale mints per transaction", details.presaleEnabled ? details.presaleMintPerTx : "Not Available"),
    createData("Presale mints per wallet", details.presaleEnabled ? details.presaleMintPerWallet : "Not Available"),
    createData("Airdrops", details.airdropEnabled ? 'Enabled' : "Not Enabled"),
    createData("Changebale mint pricing", details.changeableMintPricingEnabled ? 'Enabled' : "Not Enabled"),
    createData("Changeable sale timing", details.changeableSaleTimingEnabled ? 'Enabled' : "Not Enabled"),
    createData("NFT Reveal", details.nftRevealEnabled ? 'Enabled' : "Not Enabled"),
    createData("Unrevealed metadata CID", details.nftRevealEnabled ? details.urevealedMetadata : "Not Available"),
    createData("Premints", details.premintEnabled ? 'Enabled' : "Not Enabled"),
    createData("Changeable Base URI", details.changeBaseUriEnabled ? 'Enabled' : "Not Enabled"),
  ];
  return (
    <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.property}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.property}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
