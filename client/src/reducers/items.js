import { BULK_ADD, SHOW_ADD_ITEM_FORM, UPDATE_ITEM, SHOW_UPDATE_INVENTORY, UPDATE_INVENTORY, SUBMIT_RECEIPT, GET_ALL_MOST_BOUGHT_ITEMS } from '../actions/types';

export default (state = { all: [], MostBought: [] }, action = {}) => {
    switch (action.type) {

        case SHOW_ADD_ITEM_FORM:
            return {
                ...state,
                showModal: !action.payload ? false : action.payload
            }
        case SHOW_UPDATE_INVENTORY:
            return {
                ...state,
                showInventoryModal: !action.payload ? false : action.payload
            }
        case UPDATE_INVENTORY:
            return {
                ...state, all: state.all.map((element, i) => {
                    if (i !== action.payload.index) {
                        return element // if not element ignore
                    }
                    return {//otherwise, edit qty.
                        ...element, qty: action.payload.newQty
                    }

                })
            }

        case SUBMIT_RECEIPT:
            let items = state.all.slice();
            for (var i = 0; i < items.length; i++) {
                for (var j = 0; j < action.payload.length; j++) {
                    if (action.payload[j].itemID === items[i].id) {
                        items[i].qty -= action.payload[j].qty
                    }
                }
            }
            return { ...state, all: items }

        case UPDATE_ITEM:
            const index = state.all.findIndex((item) => item.id === action.payload.id);
            if (index > -1) {
                return {
                    ...state, all: state.all.map((item, i) => {
                        if (index !== i) {
                            return item;
                        }
                        return { ...item, ...action.payload }
                    })
                }
            }
            return state;

        case BULK_ADD:
            let list = { ...state, all: [...state.all, ...action.payload] }
            return list

        case GET_ALL_MOST_BOUGHT_ITEMS:
            console.log("payload: ", action.payload);
            return { ...state, MostBought: action.payload }

        default: return state;
    }
}