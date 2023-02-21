import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Step, StepLabel, Stepper, Typography, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, colors
} from "@material-ui/core";
import { useEffect, useState } from "react";
import React from "react";
import Web3 from "web3";
import BEP20_ABI from "../web3/BEP20_ABI.json";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import axios from "axios"



const table = async (data) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Block</TableCell>
            <TableCell align="left">Hash</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">From Index</TableCell>
            <TableCell align="left">To Index</TableCell>
            <TableCell align="left">amount</TableCell>
            <TableCell align="left">Token Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.hash}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                {item.block}
              </TableCell>
              <TableCell align="left">{item.hash}</TableCell>
              <TableCell align="left"><Typography color="primary">Validated</Typography> </TableCell>
              <TableCell align="left">{item.fromIndex}</TableCell>
              <TableCell align="left">{item.toIndex}</TableCell>
              <TableCell align="left">{item.amount}</TableCell>
              <TableCell align="left">{item.tokenType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function ValidatedTransaction() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [transactions, setTransations] = useState(null);

  const address = useSelector((state) => state.address.address);



  async function validatedTransaction() {
    // const test =   [{id: 1, balance: 20}, {id: 2, balance: 20}, {id: 3, balance: 20}]
    setLoading(true);
    const dataRaw = await axios.get(` http://localhost:7000/transactions/users/address/${address}`);
    setData(dataRaw.data)
    const newData = data.length != 0 ? (await table(data)) : () => {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Block</TableCell>
                <TableCell align="left">Hash</TableCell>
                <TableCell align="left">From Index</TableCell>
                <TableCell align="left">To Index</TableCell>
                <TableCell align="left">amount</TableCell>
                <TableCell align="left">Token Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            </TableBody>
          </Table>
        </TableContainer>
      )
    }

    setTransations(newData)
    setLoading(false);
  }

  useEffect(async () => {
    await validatedTransaction()
  }, [address, data])

  return (

    <Box
      sx={{
        bgcolor: 'info.main',
        // display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'flex-start'
      }}
    >
      {!loading ? transactions : <CircularProgress />}
    </Box>
  )
}
