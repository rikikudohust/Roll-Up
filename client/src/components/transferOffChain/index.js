import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { useState } from "react";
import React from "react";
import Web3 from "web3";
import BEP20_ABI from "../web3/BEP20_ABI.json";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import axios from "axios"
import { ContactPhoneSharp } from "@material-ui/icons";

const steps = ['Send', 'Sign Message'];

export default function Send() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(null);
  const [toAddress, setToAddress] = useState(null);
  const [tokenType, setTokenType] = useState(null);
  const [prvkey, setPrvkey] = useState(null);

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

  function handleAmountChange(ev) {
    setAmount((ev.target.value));
  }
  function handleToAddressChange(ev) {
    setToAddress(ev.target.value);
  }
  function handleTokenTypeChange(ev) {
    setTokenType((ev.target.value));
  }

  function handlePrvkeyChange(ev) {
    setPrvkey((ev.target.value));
  }

  async function _transfer() {
    var _transferData = {
      "fromAddress": address,
      "toAddress": toAddress.toLowerCase(),
      "amount": amount,
      "tokenType": tokenType,
      "prvkey": prvkey
    }
    console.log(_transferData)
    await axios.post('http://localhost:7000/transactions/test/', _transferData).then(res => {
      console.log(res.data)
    })
  }


  return (
    <Box>
      <Button style={{ backgroundColor: 'green', marginLeft: '5px' }} onClick={handleClickOpen}>
        Send
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send Asset</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="To Address"
            label="To Address"
            fullWidth
            variant="standard"
            onChange={handleToAddressChange}
          />

          <TextField
            autoFocus
            margin="dense"
            id="prvkey"
            label="prvkey"
            fullWidth
            variant="standard"
            onChange={handlePrvkeyChange}
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
          <Button onClick={_transfer}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
