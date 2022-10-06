import { Link as RouterLink } from "react-router-dom";
import WalletButton from "../walletButton";

export default function Headers() {
  return (
    <div>
      <div>
        <WalletButton />
      </div>
      <div>
        <RouterLink to="/deposit">Deposit to L2</RouterLink>
      </div>
      <div>
        <RouterLink to="/transfer">Transfer</RouterLink>
      </div>
    </div>
  );
}
