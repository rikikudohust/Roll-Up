import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import Headers from "./components/header";
import { store } from "./redux/store";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Deposit from "./components/deposit";
import TransferOffChain from "./components/transferOffChain";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <SnackbarProvider>
          <Headers />
          <Switch>
            <Route exact path="/deposit">
              <Deposit />
            </Route>
            <Route exact path="/transfer">
              <TransferOffChain />
            </Route>
          </Switch>
        </SnackbarProvider>
      </Router>
    </Provider>
  );
}
