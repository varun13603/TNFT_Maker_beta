import React from "react";
import { useSelector } from "react-redux";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const OwnershipDetails = () => {
  const details = useSelector((state) => state.newCollection.ownershipDetails);
  
  function createData(property, value) {
    return {property, value};
  }
  const rows = [
    createData("Contract Owner", details.contractOwner),
    createData("Primary sale funds receiver", details.primarySaleFundsReceiver),
  ];
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
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
