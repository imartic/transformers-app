import React from 'react';
import { Component } from '../../common/base-component';

class Header extends Component {
	render() {
		return (
			<header className="main-footer">
				<span>
					&copy;2018 <a href="https://imartic.github.io" target="_blank">Ivan Martić</a>
				</span>
			</header>
		);
	}
}

export default Header;
