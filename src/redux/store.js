import { createStore } from "redux";
import { combineReducers,applyMiddleware } from "redux";
import { addressReducer, resetAddressStateReducer } from "./reducers/addressReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk"; 
import { WithdrawHistoryReducer } from "./reducers/withdrawHistoryReducer";


const reducer = combineReducers({
    address : addressReducer,
    withdrawHistory: WithdrawHistoryReducer,
    resetAddressState: resetAddressStateReducer,
})
const middleware = [thunk];

export const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
)
