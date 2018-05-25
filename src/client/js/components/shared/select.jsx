'use-strict'

import React from 'react';

import { isEmpty } from '../../utils';

import uuidv4 from 'uuid';

export default class Select extends React.Component {
	constructor() {
		super();

		this.id = uuidv4();
		this.ref = React.createRef();
	}

	handleSelect = () => {
		const { name, value } = this.ref.current;
		if (name) {
			this.props.onSelect(value, name);
		} else {
			this.props.onSelect(value);
		}
	};

	render() {
		const { options, value, label, emptyOption, name, disabled, labelOption, labelClass } = this.props;
		return (
			<div className="field select">
				<select 
					id={this.id}
					ref={this.ref}
					value={value}
					name={name}
					onChange={this.handleSelect}
					disabled={disabled}
				>
					{(emptyOption || labelOption) && 
						<option value='' disabled={labelOption || false} selected={labelOption || emptyOption || false}>
							{labelOption ? 'Please select an Option' : '-- None --'}
						</option>						
					}
					{options && options.length > 0 && options.map(
						opt => {
							const optId = (!isEmpty(opt.id)) ? opt.id : null;
							const optValue = (!isEmpty(opt.value)) ? opt.value : opt;
							const optLabel = (!isEmpty(opt.label)) ? opt.label : opt;
							const optIndex = (!isEmpty(optId)) ? optId : `${opt}-${options.indexOf(opt)}`;
							return (
								<option key={optIndex} value={optValue}>
									{optLabel}
								</option>
							)
						}
					) || null}
				</select>
				{label &&
					<label htmlFor={this.id} className={labelClass}>{label}</label>
				}
			</div>
		)
	}
}