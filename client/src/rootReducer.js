import { combineReducers } from 'redux';
import items from './reducers/items';

const appReducer = combineReducers({ // combine to one state obj.
    items
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
}
export default rootReducer;