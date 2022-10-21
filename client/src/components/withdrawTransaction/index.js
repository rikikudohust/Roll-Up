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
const web3Reader = new Web3(window.ethereum);



const table = async (data, address) => {
  console.log("data", data.txInfo)
  const contract = new web3Reader.eth.Contract(
    BEP20_ABI,
    "0x15aE9788ae049787C19145400305CDE1AcE3c52a"
  );
  async function handleButton(item) {
    console.log(item);
    await contract.methods
      .withdraw(item.txInfo, item.position, item.proof, item.recipient, item.A, item.B, item.C)
      .send({ from: address});
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Recipient</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Token Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                {item.recipient}
              </TableCell>
              <TableCell align="left">{item.txInfo[6]}</TableCell>
              <TableCell align="left">{item.txInfo[7]}</TableCell>
              <TableCell align="left">
                <Button
                  style={{ backgroundColor: 'green', marginLeft: '5px' }}
                  onClick={() => handleButton(item)}
                >
                  Execute
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function WithdrawTransaction(activeInput) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [transactions, setTransations] = useState(null);
  const [active, setActice] = useState(0);

  const address = useSelector((state) => state.address.address);



  async function pendingTransaction() {
    // const test =   [{id: 1, balance: 20}, {id: 2, balance: 20}, {id: 3, balance: 20}]
    setLoading(true);
    const dataRaw = await axios.get(`http://localhost:7000/withdraw/users/${address}`);
    setData(dataRaw.data)
    console.log("dataRaw", dataRaw.data)
    const newData = data.length != 0 ? (await table(data, address)) : () => {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="left">Token Type</TableCell>
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
