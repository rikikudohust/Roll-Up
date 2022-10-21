import { Link as RouterLink } from "react-router-dom";
import WalletButton from "../walletButton";
import { Box } from "@material-ui/core";

export default function Headers() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
      }}
    >
      <Box>
        <WalletButton />
      </Box>
      {/* <div>
        <RouterLink to="/deposit">Deposit to L2</RouterLink>
      </div>
      <div>
        <RouterLink to="/transfer">Transfer</RouterLink>
      </div>
      <div>
        <RouterLink to="/withdraw">Withdraw</RouterLink>
      </div> */}
    </Box>
  );
}
