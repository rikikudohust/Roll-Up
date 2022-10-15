import { Button, TextField } from "@material-ui/core";
import { useState } from "react";
import Web3 from "web3";
import BEP20_ABI from "../web3/BEP20_ABI.json";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import axios from "axios"

export default function TransferOffChain() {
  const [amount,setAmount]=useState(null);
  const [toAddress,setToAddress]=useState(null);
  const [tokenType, setTokenType] = useState(null);
  const web3Reader = new Web3(window.ethereum);
  const address = useSelector((state) => state.address.address);

  const contract = new web3Reader.eth.Contract(
    BEP20_ABI,
    "0xBe750d4701cA96976042ce51486Ebe0197604549"
  );

  async function _transfer() {
    var accountData = await axios.get("accountData",{ "toAddress": toAddress,"amount": amount, "tokenType": tokenType})
    var signedData=await web3Reader.eth.sign(await web3Reader.utils.sha3(accountData),address)
    await axios.post("/rollup/transaction/",signedData).then(res => {
      console.log(res.data)
    })
  }

  function handleAmountChange(ev) {
    setAmount(BigNumber(ev.target.value).toFixed());
  }
  function handleToAddressChange(ev) {
    setToAddress(BigNumber(ev.target.value).toFixed());
  }
  function handleTokenTypeChange(ev) {
    setTokenType(BigNumber(ev.target.value).toFixed());
  }

  return (
    <div style={{ margin:'20px' }}>
      <div style={{ margin: '20px' }} >{"To Address: "}<TextField style={{ width: '500px' }} onChange={handleToAddressChange}/></div>
      <div style={{ margin: '20px' }}> {"Token type: "}<TextField onChange={handleTokenTypeChange} /></div>
      <div style={{ margin: '20px' }}> {"Amount: "}<TextField onChange={handleAmountChange} /></div>
      <Button style={{ backgroundColor:'pink', marginLeft:'150px'}} onClick={_transfer}> Transfer </Button>{" "}
    </div>
  );
}
