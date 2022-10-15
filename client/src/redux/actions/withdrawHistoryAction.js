import axios from 'axios';
import * as actionType from '../constants/constance'

export const withdrawHistoryAction = () => async (dispatch) => {
  const data = await axios.get("https://backend.trava.finance/nft/api/v1/getNFTWithdrawn?page=0&size=100&address=0xD2B418ba23f2F3592D5821D1543432619953cc7A")
  // console.log("🚀 ~ file: addressAction.js ~ line 22 ~ withdrawHistory ~ data", data)
  try {
    dispatch({type: actionType.GET_WITHDRAW_REQUEST})
    dispatch({
      type: actionType.GET_WITHDRAW_SUCCESS,
      payload: data.data.data.list
  })
  } catch (error) {
    dispatch({
      type: actionType.GET_WITHDRAW_FALSE,
      payload: error.response 
  })
  }
}