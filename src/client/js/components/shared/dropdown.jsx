import React from 'react';

export default class Dropdown extends React.Component {
	constructor() {
		super();

		this.state = {
			showMenu: false,
		}
	}

	onItemClick = item => {
		this.props.onItemClick(item);
		// this.toggleMenu();
	};

	// Toggling the menu by click
	// toggleMenu = () => {
	// 	if (!this.state.showMenu) {
	// 		document.addEventListener('click', this.handleOutsideClick, false);
	// 	} else {
	// 		document.removeEventListener('click', this.handleOutsideClick, false);
	// 	}

	// 	this.setState({ showMenu: !this.state.showMenu });
	// };

	// handleOutsideClick = e => {
	// 	if (this.node.contains(e.target)) {
	// 	  	return;
	// 	}
		
	// 	this.toggleMenu();
	// }

	render() {
		const { items, onItemClick } = this.props;

		return (
			<div className="dropdown" ref={node => { this.node = node; }}>
				<button
					type="button"
					className="item-icon dropdown-button"
					// onClick={this.toggleMenu}
				>f</button>

				{/* {this.state.showMenu && */}
					<ul className="dropdown-content">
						{items && items.length > 0 && items.map(
							item => {
								const itemKey = `${item.name}-${items.indexOf(item)}`;
								return (
									<li key={itemKey} onClick={() => this.onItemClick(item.name)}>
										{item.label}
									</li>
								);
							}
						)}
					</ul>
				{/* } */}
			</div>
		);
	}
}
