import ConnectWalletButton from "../connectWalletButton";
import { useSelector } from "react-redux";
import ConnectedWallet from "../connectedWallet";

export default function WalletButton() {
  const address = useSelector((state) => state.address.address);
  console.log("🚀 ~ file: index.js ~ line 6 ~ WalletButton ~ address", address);
  return(
    address ? <ConnectedWallet /> : < ConnectWalletButton />
    // <ConnectWalletButton />
  )
}
