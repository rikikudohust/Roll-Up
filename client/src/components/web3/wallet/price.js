import BEP20_ABI from "../BEP20_ABI.json"
import Web3 from "web3";
import BigNumber from "bignumber.js";


export default async function contract(){
  // let Contract = require('web3-eth-contract');
  const BASE = Math.pow(10, 18);
  const mainnetWeb3Reader = new Web3("https://bsc-dataseed1.binance.org:443");
  const contract = new mainnetWeb3Reader.eth.Contract(BEP20_ABI, "0x0391bE54E72F7e001f6BBc331777710b4f2999Ef") 
  const accountAddress = "0xA758CAb3cD7a13d5c9808B83735307071E8bA9a2"
  const balance = await contract.methods.balanceOf(accountAddress).call()
  const result = BigNumber(balance).dividedBy(BASE).toNumber()
  console.log("🚀 ~ file: price.js ~ line 8 ~ contract ~ balance", result)
  return (
    <div>hello</div>
  )
}