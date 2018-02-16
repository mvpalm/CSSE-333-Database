import { VIEW_RECEIPTS, RECEIPT_DETAILS_MODAL } from '../actions/types';
let initialState = {
    Receipts: []
}
export default (state = initialState, action = {}) => {
    switch (action.type) {
        case VIEW_RECEIPTS:
            return { ...state, Receipts: [...action.payload] }
        case RECEIPT_DETAILS_MODAL:
            return {
                ...state,
                showModal: !action.payload ? false : action.payload
            }
        default: return state;
    }
}
