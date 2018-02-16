import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';

import setAuthorizationToken from './utils/setAuthorizationToken'
import jwtDecode from 'jwt-decode';

import App from './components/App';
import Greetings from './components/indexPage/greeting';
import SignupPage from './components/signup/SignupPage';
import LoginPage from './components/signin/LoginPage';
import HomePage from './components/HomePage/HomeTest';
import InitForm from './components/HomePage/InitForm';
import AddItemsPage from './components/companyItems/AddItemsPage';
import CreateReceiptPage from './components/createReceipt/CreateReceiptPage';
import ViewRecieptsPage from './components/viewReceipts/ViewReceiptsPage';
import InventoryPage from './components/inventory/InventoryPage';
import CustomerPage from './components/customer/CustomerPage';
import rootReducer from './rootReducer';
import { setCurrentUser } from './actions/authActions';
import Authenticate from './components/common/Authenticate';


const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension
    ? window.devToolsExtension()
    : f => f));

if( localStorage.jwtToken){
    setAuthorizationToken(localStorage.jwtToken);
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}
  
  
render((
    <Provider store={store}>
        <Router>
            <App>
                <Switch>
                    <Route exact path="/" component={Greetings}/>
                    <Route path="/signup" component={SignupPage}/>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/home" component={Authenticate(HomePage)}/>
                    <Route path="/editCompany" component={Authenticate(InitForm)}/>
                    <Route path="/addItem" component={Authenticate(AddItemsPage)}/>
                    <Route path="/createReceipt" component={Authenticate(CreateReceiptPage)}/>
                    <Route path="/viewRecieptsPage" component={Authenticate(ViewRecieptsPage)}/>
                    <Route path="/inventory" component={Authenticate(InventoryPage)}/>
                    <Route path="/customer" component={Authenticate(CustomerPage)}/>
                </Switch>
            </App>
        </Router>
    </Provider>
), document.getElementById('app'));

