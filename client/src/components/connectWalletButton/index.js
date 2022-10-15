import { Box, Button, Typography, makeStyles } from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import { Fragment } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { ERR_TOP_CENTER, SUCCESS_TOP_CENTER, INFO_TOP_CENTER } from "../../utils/snackbar-utils";
import Web3 from "web3";
import { addressAction, resetAccountState } from "../../redux/actions/addressAction";

import { withdrawHistoryAction } from "../../redux/actions/withdrawHistoryAction";
import { addMetaMaskEventListeners } from "../web3/wallet/metamask";
import contract from "../web3/wallet/price";
const useStyles = makeStyles((theme) => ({
  button: {
    border: "1.5px solid #FFFFFF",
    background: "linear-gradient(100.42deg, #2C85EE 16.07%, #4FB5FF 79.2%)",
    color: "white",
    borderRadius: "8px",
    textTransform: "capitalize",
    padding: "2px 10px",
    minWidth: "163px",
    transition: "background 500ms linear",
    "&:hover": {
      background: "linear-gradient(100.42deg, #2C85EE 16.07%, #4FB5FF 79.2%)",
      border: "0",
      padding: "3.5px 11.5px",
    },
  },
  fiberIcon: {
    fontSize: 10,
    verticalAlign: "middle",
    marginRight: 2,
    color: "#C4C4C4",
  },
}));
let web3Sender;
const WALLET_IDS = {
  METAMASK: 1,
  WALLET_CONNECT: 2,
};
export function setWeb3Sender(provider) {
  if (!provider) {
    web3Sender = null;
  } else {
    web3Sender = new Web3(provider);
  }
}

let currentConnectedWallet = JSON.parse(window.localStorage.getItem("currentConnectedWallet"));
function getCurrentConnectedWallet() {
  return currentConnectedWallet;
}

export function setCurrentConnectedWallet(walletID) {
  currentConnectedWallet = walletID;
  window.localStorage.setItem("currentConnectedWallet", walletID);
}
setCurrentConnectedWallet(WALLET_IDS.METAMASK);

export default function ConnectWalletButton(){
  const classes = useStyles();
  const dp = useDispatch();
  const { enqueueSnackbar: eq } = useSnackbar();
  async function hdConnectMetaMask(){
    const provider = await detectEthereumProvider();
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
      eq("Do you have multiple wallets installed?", INFO_TOP_CENTER);
    }
    addMetaMaskEventListeners(dp, eq);
    setWeb3Sender(provider);
    // const chainId = window.ethereum.networkVersion;
    // console.log("🚀 ~ file: index.js ~ line 42 ~ hdConnectMetaMask ~ chainId", chainId)
    
    const accountAddress = (await window.ethereum.request({ method: "eth_requestAccounts" }))[0];
    console.log(accountAddress)
    dp(addressAction(accountAddress, eq)).then(() => eq("Connect success!", SUCCESS_TOP_CENTER));
    // dp(resetAccountState(accountAddress, eq))
    dp(withdrawHistoryAction())
    contract()
  }
 return(
   <Fragment>
     <Button className={classes.button} onClick={hdConnectMetaMask}>
          <Box pl={1.5}>
            <Typography align="left" style={{ fontSize: 10 }}>
              <FiberManualRecord className={classes.fiberIcon} /> Not Connected
            </Typography>
            <span style={{ fontSize: 15, lineHeight: 0 }}>Connect Wallet</span>
          </Box>
     </Button>
   </Fragment>
 )
}