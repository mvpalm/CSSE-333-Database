import { CREATE_NEW_CUSTOMER, GET_CUSTOMERS, DELETE_CUSTOMER } from '../actions/types';

export default (state = [], action = {}) => {
    switch (action.type) {
        case CREATE_NEW_CUSTOMER:
            return [...state, ...action.payload]

        case GET_CUSTOMERS:
            return action.payload

        case DELETE_CUSTOMER:
            const index = state.findIndex((customer) => customer.id === action.payload)
            if (index > -1) {
                return [...state.slice(0, index), ...state.slice(index + 1)];
            }
            return state;
        default: return state;
    }
}