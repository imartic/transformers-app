import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import createHistory from 'history/createHashHistory';

import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import errorMiddleware from './middleware/error';
import populateAsyncDataMiddleware from './middleware/populate-async-action-data';
import loggerMiddleware from './middleware/logger';
import reducers from './reducers';

import buildApp from './app.jsx';

const history = createHistory();

const appReducer = combineReducers(
	Object.assign(
		{ routing: routerReducer },
		reducers,
		{ history: state => state || history }
	)
);

const rootReducer = (state, action) => {
	return appReducer(state, action);
};

const store = createStore(
	rootReducer,
	{ history: history },
	applyMiddleware(
		thunkMiddleware,
		errorMiddleware,
		promiseMiddleware(),
		populateAsyncDataMiddleware,
		loggerMiddleware,
		routerMiddleware(history)
	)
);

const App = buildApp(history);

ReactDOM.render(
	<Provider store={ store }>
		<App/>
	</Provider>,
	document.getElementById('app')
);