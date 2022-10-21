import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@material-ui/core";
import { useState } from "react";
import Web3 from "web3";
import BEP20_ABI from "../web3/BEP20_ABI.json";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import axios from "axios"

export default function Withdraw() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [tokenType, setTokenType] = useState(null);
  const [prvkey, setPrvkey] = useState(null);
  const web3Reader = new Web3(window.ethereum);
  const address = useSelector((state) => state.address.address);

  const contract = new web3Reader.eth.Contract(
    BEP20_ABI,
    "0x15aE9788ae049787C19145400305CDE1AcE3c52a"
  );

  async function _withdraw() {
    const _withdrawData = {
      "fromAddress": address,
      "recipient": recipient.toLowerCase(),
      "prvkey": prvkey,
      "amount": amount,
      "tokenType": tokenType
    }
    await axios.post(" http://localhost:7000/withdraw/test",_withdrawData).then(res => {
      console.log(res.data)
    })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleAmountChange(ev) {
    setAmount((ev.target.value));
  }
  function handleRecipientChange(ev) {
    setRecipient((ev.target.value));
  }
  function handleTokenTypeChange(ev) {
    setTokenType((ev.target.value));
  }

  function handlePrvkeyChange(ev) {
    setPrvkey((ev.target.value));
  }

  return (
    <Box>
      <Button style={{ backgroundColor: 'red', marginLeft: '5px' }} onClick={handleClickOpen}>
        Withdraw
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Deposit Asset</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="Recipient"
            label="Recipient Address"
            fullWidth
            variant="standard"
            onChange={handleRecipientChange}
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
          <Button onClick={_withdraw}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
