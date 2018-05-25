import React from 'react';

import uuidv4 from 'uuid';

import Input from './input.jsx';

export default class ItemList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			newItem: ''
		}
	}

	handleChange = (value, name) => {
		this.setState({ [name]: value });
	};

	addItem = () => {
		const { newItem } = this.state;
		if (newItem) {
			this.props.onAddButtonClick(this.state.newItem);
			this.setState({ newItem: '' });
		}
	};

	render() {
		const { title, items, className, onAddButtonClick } = this.props;
		let listClass = 'item-list';
		if (className) {
			listClass += ` ${className}`;
		}
		return (
			<article className={listClass}>
				<div className="list-title">{title}</div>

				{onAddButtonClick &&
					<div className="list-input">
						<Input
							value={this.state.newItem}
							placeholder='Enter new item...'
							name='newItem'
							onChange={this.handleChange}
							onAddButtonClick={this.addItem}
						/>
					</div>
				}
				<div className="content">
					<ul>
						{items && items.length > 0 && items.map(
							item => {
								const itemIndex = uuidv4();

								return (
									<li key={itemIndex} value={item}>
										{item}
										<button 
											type="button" 
											className="item-icon remove" 
											onClick={event => { this.props.removeItem(item, event); event.stopPropagation(); }}
										>b</button>
									</li>
								)
							}
						) || null}
					</ul>
				</div>
			</article>
		)
	}
}