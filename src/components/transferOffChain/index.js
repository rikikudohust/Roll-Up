import { Button, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import Web3 from "web3";
import BEP20_ABI from "../web3/BEP20_ABI.json";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { TwoWheelerOutlined } from "@material-ui/icons";

export default function TransferOffChain() {
  const [transfer, setTransfer] = useState(null);
  const [amount,setAmount]=useState(null);
  const [pkF1,setPkFrom1]=useState(null);
    const [pkF2,setPkFrom2]=useState(null);
    const [pkT1,setPkTo1]=useState(null);
  const [pkT2,setPkTo2]=useState(null);
  const [tokenType, setTokenType] = useState(null);
  const web3Reader = new Web3(window.ethereum);
  const address = useSelector((state) => state.address.address);

  const contract = new web3Reader.eth.Contract(
    BEP20_ABI,
    "0xBe750d4701cA96976042ce51486Ebe0197604549"
  );

  async function _transfer() {
    // await contract.methods
    //   .deposit([pk1,pk2], amount, tokenType)
    //   .send({ from: address,gas: 9999999,value: amount});
    //transfer
  }

  function handleAmountChange(ev) {
    setAmount(BigNumber(ev.target.value).toFixed());
  }
  function handlePKF1Change(ev) {
    setPkFrom1(BigNumber(ev.target.value).toFixed());
  }
  function handlePKF2Change(ev) {
    setPkFrom2(BigNumber(ev.target.value).toFixed());
  }
    
  function handlePKT1Change(ev) {
    setPkTo1(BigNumber(ev.target.value).toFixed());
  }
  function handlePKT2Change(ev) {
    setPkTo2(BigNumber(ev.target.value).toFixed());
  }

  function handleTokenTypeChange(ev) {
    setTokenType(BigNumber(ev.target.value).toFixed());
  }

  return (
    <div style={{ margin:'20px' }}>
      <div> {transfer} </div>
      <div style={{ margin: '20px' }} >{"Pubkey From 1: "}<TextField style={{ width: '500px' }} onChange={handlePKF1Change}/></div>
    <div style={{ margin: '20px' }}>{"Pubkey From 2: "}<TextField style={{ width: '500px' }} onChange={handlePKF2Change} /></div>
          <div style={{ margin: '20px' }} >{"Pubkey To 1: "}<TextField style={{ width: '500px' }} onChange={handlePKT1Change}/></div>
      <div style={{ margin: '20px' }}>{"Pubkey To 2: "}<TextField style={{ width: '500px' }} onChange={handlePKT2Change} /></div>
      <div style={{ margin: '20px' }}> {"Token type: "}<TextField onChange={handleTokenTypeChange} /></div>
      <div style={{ margin: '20px' }}> {"Amount: "}<TextField onChange={handleAmountChange} /></div>
      <Button style={{ backgroundColor:'pink', marginLeft:'150px'}} onClick={_transfer}> Transfer </Button>{" "}
    </div>
  );
}
