import { resetAccountState } from "../../../redux/actions/addressAction";
import { INFO_TOP_CENTER } from "../../../utils/snackbar-utils";
import { setCurrentConnectedWallet, setWeb3Sender } from "../../connectWalletButton";

let currentConnectedWallet = JSON.parse(
  window.localStorage.getItem("currentConnectedWallet")
);
function getCurrentConnectedWallet() {
  return currentConnectedWallet;
}

const WALLET_IDS = {
  METAMASK: 1,
  WALLET_CONNECT: 2,
};

let metaMaskClockId;

export function clearMetaMaskEventListeners() {
  window.ethereum.removeAllListeners("accountsChanged");
  window.ethereum.removeAllListeners("chainChanged");
  clearInterval(metaMaskClockId);
}

export default function disconnectCurrentWallet(dp, eq) {
  
  const currentConnectedWallet = getCurrentConnectedWallet();
  console.log("🚀 ~ file: disconnect.js ~ line 28 ~ disconnectCurrentWallet ~ currentConnectedWallet", currentConnectedWallet)
  
  if (currentConnectedWallet === WALLET_IDS.METAMASK) {
    clearMetaMaskEventListeners();
  }
  dp(resetAccountState(eq));
  setWeb3Sender(null);
  setCurrentConnectedWallet(null);
  eq("Disconnected", INFO_TOP_CENTER);
}
