import { ADD_TO_CURRENT_RECEIPT, EDIT_CURRENT_RECEIPT, DELETE_RECEIPT_ITEM, SUBMIT_RECEIPT, ADD_TO_LIST_OF_RECEIPTS } from './types';
import axios from 'axios';

export function addToReceipt (data) {
  return (dispatch) => {
    dispatch({
	    type: ADD_TO_CURRENT_RECEIPT,
		  payload: data
	  })
	}
}

export function updateReceipt(data) {
  return (dispatch) => {
    dispatch({
            type: EDIT_CURRENT_RECEIPT,
            payload: data
        })
    }
}

export function deleteReceiptItem(data) {
    console.log("Delete receipt action with data: ", data);
    return (dispatch) => {
        dispatch({
            type: DELETE_RECEIPT_ITEM,
            payload: data
        })
    }
}

export function submitReceipt(data) {
    return (dispatch) => {
        return axios.post('/api/receipt/add', data).then(res => {
            dispatch({
                type: SUBMIT_RECEIPT,
                payload: res.data.Body
            })
        })
    }
}

