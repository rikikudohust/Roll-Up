import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@material-ui/core";
import { useState } from "react";
import Web3 from "web3";
import BEP20_ABI from "../web3/BEP20_ABI.json";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import axios from "axios"

export default function Deposit() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(null);
  const [pk1, setPk1] = useState(null);
  const [pk2, setPk2] = useState(null);
  const [tokenType, setTokenType] = useState(null);
  const web3Reader = new Web3(window.ethereum);
  const address = useSelector((state) => state.address.address);

  const contract = new web3Reader.eth.Contract(
    BEP20_ABI,
    "0x15aE9788ae049787C19145400305CDE1AcE3c52a"
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function _deposit() {
    await contract.methods
      .deposit([pk1, pk2], amount, tokenType)
      .send({ from: address, gas: 9999999, value: amount });

    var currentAddr = await web3Reader.eth.getCoinbase()
    var info = {
      "fromX": pk1,
      "fromY": pk2,
      "l1Address": currentAddr.toLowerCase(),
      "amount": amount,
      "tokenType": tokenType
    }
    await axios.post(" http://localhost:7000/deposit/", info).then(res => {
      console.log(res.data)
    })
  }

  function handleAmountChange(ev) {
    setAmount(BigNumber(ev.target.value).toFixed());
  }
  function handlePK1Change(ev) {
    setPk1(BigNumber(ev.target.value).toFixed());
  }
  function handlePK2Change(ev) {
    setPk2(BigNumber(ev.target.value).toFixed());
  }

  function handleTokenTypeChange(ev) {
    setTokenType(BigNumber(ev.target.value).toFixed());
  }

  return (
    <Box>
      <Button style={{ backgroundColor: 'green', marginLeft: '5px' }} onClick={handleClickOpen}>
        Deposit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Deposit Asset</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="pubkeyX"
            label="Public Key X"
            fullWidth
            variant="standard"
            onChange={handlePK1Change}
          />

          <TextField
            autoFocus
            margin="dense"
            id="pubkeyY"
            label="Public Key Y"
            fullWidth
            variant="standard"
            onChange={handlePK2Change}
          />

          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount"
            fullWidth
            variant="standard"
            onChange={handleAmountChange}
          />

          <TextField
            autoFocus
            margin="dense"
            id="tokenType"
            label="Token Type"
            fullWidth
            variant="standard"
            onChange={handleTokenTypeChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={_deposit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}