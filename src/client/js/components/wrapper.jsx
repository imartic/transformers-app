import React from 'react';
import Header from './layout/header.jsx';
import Footer from './layout/footer.jsx';

import { Component, connect } from '../common/base-component';
import { readInitialData } from '../actions/global-actions';

@connect(
	state => {
		return {
			initialized: state.global.initialized,
			transformers: state.global.transformers
		};
	},
	dispatch => {
		return {
			readInitialData: () => dispatch(readInitialData())
		}
	}
)
class Wrapper extends Component {
	componentDidMount() {
		if (!this.props.initialized) {
			this.props.readInitialData();
		}
	}

	render() {
		const props = this.props;

		return (
			<main>
				<Header/>

				<div className="main-content">
					{!props.initialized && 'Loading...' || <AppData app={props.children}/>}
				</div>

				<Footer/>
			</main>
		);
	}
}

class AppData extends React.Component {
	render() {
		const app = this.props.app;

		return (
			<React.Fragment>
				{app}
			</React.Fragment>
		)
	}
}

export default Wrapper;