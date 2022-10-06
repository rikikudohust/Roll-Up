import * as actionType from "../constants/constance";
import { ERR_TOP_CENTER } from "../../utils/snackbar-utils";

export const addressAction =
  (accountAddress, enqueueSnackbar) => async (dispatch) => {
    try {
      dispatch({ type: actionType.GET_ADDRESS_REQUEST });
      dispatch({
        type: actionType.GET_ADDRESS_SUCCESS,
        payload: accountAddress,
      });
    } 
    catch (error) {
      dispatch({
        type: actionType.GET_ADDRESS_FALSE,
        payload:
          error.response &&
          enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER),
      });
    }
  };

export const resetAccountState = (accountAddress,enqueueSnackbar) => async (dispatch) => {
  try {
    dispatch({ type: actionType.GET_ADDRESS_REQUEST });
    dispatch({
      type: actionType.DELETE_ADDRESS,
      payload: null
    });
  } catch (error) {
    dispatch({
      type: actionType.RESET_ACCOUNT_FALSE,
      payload:
        error.response &&
        enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER),
    });
  }
};
