import axios from 'axios';
import { CREATE_NEW_CUSTOMER, GET_CUSTOMERS, DELETE_CUSTOMER } from './types';

export function createCustomer(data) {
    return (dispatch) => {
        return axios.post('/api/customers/add', data).then((res) => {
            dispatch({
                type: CREATE_NEW_CUSTOMER,
                payload: [res.data]
            })
        })

    }
}
export function deleteCustomer(id) {
    return (dispatch) => {
        return axios.delete(`/api/customers?id=${id}`).then(() => {
            dispatch({
                type: DELETE_CUSTOMER,
                payload: id
            })
        })

    }
}

export function getCustomerList(companyID) {
    return (dispatch) =>{
        return axios.get(`/api/customers?id=${companyID}`).then((res)=>{
            dispatch({
                type: GET_CUSTOMERS,
                payload: res.data
            })
        })
    }
}