import { addressAction, updateAccInfo } from "../../../redux/actions/addressAction";
import disconnectCurrentWallet from "./disconnect";

export function addMetaMaskEventListeners(dp, eq) {
  window.ethereum.on('accountsChanged', async(address) => {
    if(address.length === 0){
      disconnectCurrentWallet(dp, eq);
    } else {
      const accountAddress = (await window.ethereum.request({ method: "eth_requestAccounts" }))[0];
      dp(addressAction(accountAddress, eq));
    }
  })
}
