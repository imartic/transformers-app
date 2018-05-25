'use strict';

import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import React from 'react';

import GlobalActionTypes from '../constants/global-action-types';

const extendedConnect = (mapStateToProps, mapDispatchToProps, mergeProps, options) => {
	const newStateToProps = (state, ownProps) => {
		const appProperties = state.application;
		if (!appProperties) {
			return mapStateToProps && mapStateToProps(state, ownProps) || {};
		}

		const result = {};
		return Object.assign(
			{},
			result,
			mapStateToProps && mapStateToProps(state, ownProps) || {}
		);
	};

	const newDispatchToProps = (dispatch, ownProps) => {
		const result = {
			navigateToPage: page => dispatch(push(page)),
			dispatch: dispatch
		};
		let specificImplResult = mapDispatchToProps && mapDispatchToProps(dispatch, ownProps) || {};
		if (typeof specificImplResult === 'function') {
			specificImplResult = specificImplResult(dispatch);
		}
		return Object.assign(
			{},
			result,
			specificImplResult
		)
	};

	return connect(newStateToProps, newDispatchToProps, mergeProps, options);
};

class Component extends React.Component {
	navigateToPage(page) {
		this.props && this.props.dispatch && this.props.dispatch(push(page));
	}

	navigateToUrl(url) {
		this.props && this.props.dispatch && this.props.dispatch({
			type: GlobalActionTypes.NavigatingToOtherPage,
			url: url
		});
		window.location = url;
	}
}

export default Component;
export { Component, extendedConnect as connect };