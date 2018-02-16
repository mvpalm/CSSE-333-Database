import { ADD_TO_CURRENT_RECEIPT, EDIT_CURRENT_RECEIPT, DELETE_RECEIPT_ITEM, SUBMIT_RECEIPT } from '../actions/types';

export default (state = { receiptItems: [] }, action = {}) => {
    switch (action.type) {

        case ADD_TO_CURRENT_RECEIPT:
            const itemIndex = state.receiptItems.findIndex((item) => item.itemID === action.payload.itemID);
            let items = state.receiptItems.slice();
            if (itemIndex > -1) {
                items[itemIndex].qty += Number(1);
            } else {
                let item = {
                    itemID: action.payload.itemID,
                    itemName: action.payload.itemName,
                    qty: Number(1),
                    price: Number(action.payload.price),
                    inStock: action.payload.inStock
                }
                items.push(item);
            }
            state.receiptItems = items
            return { ...state, receiptItems: items };

        case EDIT_CURRENT_RECEIPT:
            let list2 = {
                ...state,
                receiptItems: state.receiptItems.map((content) => {
                    return (
                        content.itemID === action.payload.itemID ? { ...content, qty: Number(action.payload.qty) } : content
                    )
                })
            }
            return list2;

        case DELETE_RECEIPT_ITEM:
            let updatedList = state.receiptItems.reduce((acc, value, index) => {
                if (action.payload.indexOf(value.itemID) < 0) {
                    acc.push(value);
                }
                return acc
            }, [])

            console.log(updatedList);
            return { ...state, receiptItems: updatedList }

        case SUBMIT_RECEIPT:
            return { ...state, receiptItems: [] }

        default: return state;
    }
}