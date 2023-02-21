import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, CircularProgress, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import Web3 from "web3";
import BEP20_ABI from "../web3/BEP20_ABI.json";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import axios from "axios"

export default function Information() {

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState();

  const address = useSelector((state) => state.address.address);

  async function handleBalance() {
    setLoading(true)
    const data = await axios.get( `http://localhost:7000/users/address/${address}`)
    setBalance(data.data.balance);
    setLoading(false);
  }

  useEffect(async () => {
    await handleBalance();
    console.log("balance", balance);
  },[address])
  return (
    <>
    {!loading?<h1 color="red">{balance} ETH</h1>:<CircularProgress/>} 
    </>
  )
}