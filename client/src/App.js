import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import Headers from "./components/header";
import { store } from "./redux/store";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Box, Button, ButtonGroup, CircularProgress } from "@material-ui/core";
import Deposit from "./components/deposit";
import TransferOffChain from "./components/transferOffChain";
import Withdraw from "./components/withdraw";
import ValidatedTransaction from "./components/validatedTransaction";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios'
import Information from "./components/information";
import PendingTransaction from './components/pendingTransaction'
import WithdrawTransaction from "./components/withdrawTransaction";
import DepositTransaction from "./components/depositTransaction";

export default function App() {
  const [active, setActice] = useState(0);

  function handleActive(number) {
    setActice(number);
  }
  return (
    <Provider store={store}>
      <Router>
        <SnackbarProvider>
          <Headers />
          <Box
            sx={{
              bgcolor: 'primary.dark',
              boxShadow: 1,
              borderRadius: 2,
              p: 2,
              minWidth: 300,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <h3>Total Supply</h3>
              <Information/>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}
            >
              <Deposit />
              <TransferOffChain />
              <Withdraw />
            </Box>

          </Box>
          <Box>
            <h1>TRANSACTION HISTORY</h1>
          </Box>
          <Box>
            <ButtonGroup>
              <Button onClick={() => handleActive(0)}>History</Button>
              <Button onClick={() => handleActive(1)}>Transaction Pending</Button>
              <Button onClick={() => handleActive(2)}>Withdraw </Button>
              <Button onClick={() => handleActive(3)}>Deposit Pending</Button>
            </ButtonGroup>
          </Box>
          {active == 0 ? <ValidatedTransaction /> : active == 1 ? <PendingTransaction active={active}/> : active == 2 ? <WithdrawTransaction active={active}/>:<DepositTransaction active={active}/>}
        </SnackbarProvider>
      </Router>
    </Provider>
  );
}
