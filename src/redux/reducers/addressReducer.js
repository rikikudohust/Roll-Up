import * as actionsTypes from "../constants/constance"

export const addressReducer = (state = { address: null}, action) => {
  switch (action.type) {
    case actionsTypes.GET_ADDRESS_REQUEST:
      return{
        loading : true,
        address : null
      }
    case actionsTypes.GET_ADDRESS_SUCCESS:
      return{
        loading : false,
        address : action.payload
      }
    case actionsTypes.GET_ADDRESS_FALSE:
      return{
        loading : false,
        error : action.payload
      }
  
    default:
      return state;
  }
}
const address = (window.ethereum.request({ method: "eth_requestAccounts" }))[0];
export const resetAddressStateReducer= (state = {address : address} , action) => {
  switch (action.type) {
    case actionsTypes.GET_ADDRESS_REQUEST:
      return{
        loading : true,
        address : action.payload
      }
    case actionsTypes.DELETE_ADDRESS:
      return{
        loading : false,
        address : null
      }
    // case actionsTypes.RESET_ACCOUNT_FALSE:
    //   return{
    //     loading : false,
    //     error : action.payload
    //   }
  
    default:
      return state;
  }
}




