import { combineReducers } from 'redux';
import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';
import items from './reducers/items';
import viewReceipts from './reducers/viewReceipts';
import currentReceipt from './reducers/currentReceipt';
import customer from './reducers/customer';
import { LOGOUT } from './actions/types';

const appReducer = combineReducers({ // combine to one state obj.
    flashMessages,
    auth,
    currentReceipt,
    items,
    viewReceipts,
    customer
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = undefined;
    }
    return appReducer(state, action);
}
export default rootReducer;