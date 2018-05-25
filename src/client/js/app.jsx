'use strict';

import React from 'react';

import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import ErrorBoundary from './components/error-boundary.jsx';
import HomePage from './pages/home-page.jsx';
import TransformerPage from './pages/transformer-page.jsx';

export default function buildAppComponent(history) {
	class App extends React.Component {
		render() {
			return (
				<ErrorBoundary>
					<ConnectedRouter history={ history }>
						<Switch>
							<Route exact path='/' component={ HomePage } />
							<Route path='/transformer/:id' component={ TransformerPage } />
							<Route path='/transformer/' component={ TransformerPage } />						
						</Switch>
					</ConnectedRouter>
				</ErrorBoundary>
			)
		}
	}

	return App;
}
