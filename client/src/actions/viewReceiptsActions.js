import axios from 'axios';
import { VIEW_RECEIPTS, RECEIPT_DETAILS_MODAL, GET_ALL_MOST_BOUGHT_ITEMS } from './types';


export function viewReceipts(id) {
    return (dispatch) => {
        return axios.get(`/api/receipt/getReceipts?ID=${id}`).then((res) => {
            dispatch({
                type: VIEW_RECEIPTS,
                payload: res.data
            })
        })
    }
}

export function showItemDetail(data) {
    return {
        type: RECEIPT_DETAILS_MODAL,
        payload: data
    }
}

export function getMostPopularItems(data) {
    console.log("data: ", data);
    return (dispatch) => {
        return axios.post("api/receipt/getmostPopular", data).then((res) => {
            dispatch({
                type: GET_ALL_MOST_BOUGHT_ITEMS,
                payload: res.data.result
            })
        });
    }
}