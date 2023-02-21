import axios from 'axios';
import * as actionType from '../constants/constance'

export const withdrawHistoryAction = () => async (dispatch) => {
  const data = await axios.get(" http://localhost:7000/transactions/")
  // console.log("🚀 ~ file: addressAction.js ~ line 22 ~ withdrawHistory ~ data", data)
  try {
    dispatch({type: actionType.GET_VALIDATED_TRANSACTION})
    dispatch({
      type: actionType.GET_VALIDATED_TRANSACTION_SUCCESS,
      payload: data.data.data.list
  })
  } catch (error) {
    dispatch({
      type: actionType.GET_VALIDATED_TRANSACTION_FALSE,
      payload: error.response 
  })
  }
}