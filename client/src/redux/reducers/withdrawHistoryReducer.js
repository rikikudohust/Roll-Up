import * as actionsTypes from "../constants/constance"

export const WithdrawHistoryReducer = (state = { data: []}, action) => {
  switch (action.type) {
    case actionsTypes.GET_WITHDRAW_REQUEST:
      return{
        data : null
      }
    case actionsTypes.GET_WITHDRAW_SUCCESS:
      return{
        data : action.payload
      }
    case actionsTypes.GET_WITHDRAW_FALSE:
      return{
        error : action.payload
      }
  
    default:
      return state;
  }
}