'use strict'

import React from 'react';

import uuidv4 from 'uuid';

export default class Input extends React.Component {
	constructor() {
		super();

		this.id = uuidv4();
		this.ref = React.createRef();
	}

	handleChange = () => {
		const { name, value } = this.ref.current;
		if (name) {
			this.props.onChange(value, name);
		} else {
			this.props.onChange(value);
		}
	};

	handleIconButtonClick = () => {
		if (this.props.onClearValue) {
			this.props.onClearValue(this.ref.current.value);
		}
	};

	handleAddButtonClick = () => {
		this.props.onAddButtonClick(this.ref.current.value);
	};

	render() {
		const { value, label, name, clearValue, placeholder, onAddButtonClick, labelClass } = this.props;

		return (
			<div className="field">
				<input
					type="text"
					id={this.id}
					ref={this.ref}
					onChange={this.handleChange}
					value={value && value}
					name={name && name}
					placeholder={placeholder && placeholder}			
				/>
				{label &&
					<label htmlFor={this.id} className={labelClass}>{label}</label>
				}
				{clearValue && value &&
					<button 
						type="button" 
						className="btn icon-btn"
						onClick={this.handleIconButtonClick}
					>b</button>
				}
				{onAddButtonClick && value &&
					<button 
						type="button" 
						className="btn icon-btn"
						onClick={this.handleAddButtonClick}
					>f</button>
				}
			</div>
		)
	}
}