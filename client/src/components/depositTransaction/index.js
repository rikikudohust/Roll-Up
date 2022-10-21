import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Step, StepLabel, Stepper, Typography, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
  } from "@material-ui/core";
  import { useEffect, useState } from "react";
  import React from "react";
  import Web3 from "web3";
  import BEP20_ABI from "../web3/BEP20_ABI.json";
  import BigNumber from "bignumber.js";
  import { useSelector } from "react-redux";
  import axios from "axios"
  
  
  
  const table = async (data) => {
    console.log("data", data)
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="simple table">
          <TableHead>
            <TableRow>
            <TableCell>L1 Address</TableCell>
                  <TableCell align="left">Public Key X</TableCell>
                  <TableCell align="left">Public Key Y</TableCell>
                  <TableCell align="left">Amount</TableCell>
                  <TableCell align="left">Token Type</TableCell>
                  <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  {item.l1Address}
                </TableCell>
                <TableCell align="left">{item.fromX}</TableCell>
                <TableCell align="left">{item.fromY}</TableCell>
                <TableCell align="left">{item.amount}</TableCell>
                <TableCell align="left">{item.tokenType}</TableCell>
                <TableCell align="left"><Typography color="secondary">Processing</Typography></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  
  export default function DepositTransaction(activeInput) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [transactions, setTransations] = useState(null);
    const [active, setActice] = useState(0);
  
    const address = useSelector((state) => state.address.address);
  
  
  
    async function pendingTransaction() {
      // const test =   [{id: 1, balance: 20}, {id: 2, balance: 20}, {id: 3, balance: 20}]
      setLoading(true);
      const dataRaw = await axios.get(` http://localhost:7000/deposit/pending/users/${address}`);
      setData(dataRaw.data)
      console.log("dataRaw", dataRaw.data)
      const newData = data.length != 0 ? (await table(data)) : () => {
        return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>L1 Address</TableCell>
                  <TableCell align="left">Public Key X</TableCell>
                  <TableCell align="left">Public Key Y</TableCell>
                  <TableCell align="left">From Index</TableCell>
                  <TableCell align="left">Amount</TableCell>
                  <TableCell align="left">Token Type</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
  
      setTransations(newData);
      setActice(activeInput)
      setLoading(false);
    }
  
    useEffect(async () => {
      await pendingTransaction()
      console.log(loading)
    }, [active])
  
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
   