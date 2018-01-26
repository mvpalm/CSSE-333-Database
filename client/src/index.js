import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './rootReducer';

import AddItemsPage from './components/Items/AddItemsPage';


const store = createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension
    ? window.devToolsExtension()
    : f => f));
  
render((
    <Provider store={store}>
        <Router>
                <Switch>
                    <Route exact path="/" component={AddItemsPage}/>
                </Switch>
        </Router>
    </Provider>
), document.getElementById('app'));