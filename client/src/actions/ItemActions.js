import axios from 'axios';
import { BULK_ADD, SHOW_ADD_ITEM_FORM, UPDATE_ITEM, SHOW_UPDATE_INVENTORY, UPDATE_INVENTORY } from './types';


export function populateList(id) {
    return (dispatch) => {
        return axios.get(`/api/item/getItems?ID=${id}`).then((res) => {
            console.log("Response:", res);
            dispatch({
                type: BULK_ADD,
                payload: res.data
            })
        })
    }
}

export function showAddItemForm(data) {
    return {
        type: SHOW_ADD_ITEM_FORM,
        payload: data
    }
}
export function updateItem(data) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_ITEM,
            payload: data
        });
        return axios.post('/api/item/updateItem', data)
    }
}
export function showUpdateInventory(data) {
    return {
        type: SHOW_UPDATE_INVENTORY,
        payload: data
    }
}

export function addItem(data) {
    return (dispatch) => {
        return axios.post('/api/item/add', data).then(res => {
            dispatch({
                type: BULK_ADD,
                payload: [res.data]
            })
        })
    }
}

export function updateInventory(data) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_INVENTORY,
            payload: data
        });
        return axios.post('/api/item/updateInventory', data);
    }
}

