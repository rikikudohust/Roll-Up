import { Button, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import Web3 from "web3";
import BEP20_ABI from "../web3/BEP20_ABI.json";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { TwoWheelerOutlined } from "@material-ui/icons";

export default function Deposit() {
  const [deposit, setDeposit] = useState(null);
  const [amount,setAmount]=useState(null);
  const [pk1,setPk1]=useState(null);
  const [pk2,setPk2]=useState(null);
  const [tokenType, setTokenType] = useState(null);
  const web3Reader = new Web3(window.ethereum);
  const address = useSelector((state) => state.address.address);

  const contract = new web3Reader.eth.Contract(
    BEP20_ABI,
    "0xBe750d4701cA96976042ce51486Ebe0197604549"
  );

  async function _deposit() {
    await contract.methods
      .deposit([pk1,pk2], amount, tokenType)
      .send({ from: address,gas: 9999999,value: amount});
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
    <div style={{ margin:'20px' }}>
      <div> {deposit} </div>
      <div style={{ margin: '20px' }} >{"Pubkey 1: "}<TextField style={{ width: '500px' }} onChange={handlePK1Change}/></div>
      <div style={{ margin: '20px' }}>{"Pubkey 2: "}<TextField style={{ width: '500px' }} onChange={handlePK2Change} /></div>
      <div style={{ margin: '20px' }}> {"Token type: "}<TextField onChange={handleTokenTypeChange} /></div>
      <div style={{ margin: '20px' }}> {"Amount: "}<TextField onChange={handleAmountChange} /></div>
      <Button style={{ backgroundColor:'pink', marginLeft:'150px'}} onClick={_deposit}> Deposit </Button>{" "}
    </div>
  );
}
