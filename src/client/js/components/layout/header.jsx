import React from 'react';
import { Component } from '../../common/base-component';

class Header extends Component {
	render() {
		return (
			<header className="main-header">
				<figure className="logo">
					<img src='/img/logo.png'/>
					<span className="wordmark">Transformers App</span>
				</figure>
			</header>
		);
	}
}

export default Header;
