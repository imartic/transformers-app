import React from 'react';
import { Component, connect } from '../common/base-component';

import Input from './shared/input.jsx';
import Select from './shared/select.jsx';
import Dropdown from './shared/dropdown.jsx';

import { isEmpty } from '../utils';

class Cell extends Component {
	handleSelectChange = (value) => {
		const currentRowObj = this.props.currentRow;
		this.props.onSelectChange(value, currentRowObj);
	};

	handleDropdownItemClick = (action) => {
		const currentRowObj = this.props.currentRow;
		this.props.onActionClick(action, currentRowObj);
	};

	renderCell = () => {
		const { className, value, selectOptions, actions } = this.props;
		const type = this.props.type || 'text';

		if ((!isEmpty(value)) || type === 'action') {
			if (type === 'select') {
				return (
					<div className={className}>
						<form>
							<Select
								options={selectOptions}
								onSelect={this.handleSelectChange}
								value={value}
							/>
						</form>
					</div>
				);
			} else if (type === 'action') {
				return (
					<div className={className}>
						<Dropdown
							items={actions}
							onItemClick={this.handleDropdownItemClick}
						/>
					</div>
				);
			} else {
				return (
					<div className={className}>
						<span>{value}</span>
					</div>
				);
			}
		} else {
			return null;
		}
	};

	render() { 
		return (this.renderCell());
	}
}

export default class DataTable extends Component {
	constructor() {
		super();

		this.state = {
			searchValue: '',
			filterValue: ''
		};
	}

	filterRows = (rows, searchBy, filterColumn) => {
		const { searchValue, filterValue } = this.state;		
		if (rows && rows.length > 0 && (searchValue || filterValue)) {
			rows = rows.filter(
				row => {
					let isVisible = true;
					if (filterValue) {
						isVisible = row[filterColumn.attributeName].indexOf(filterValue) !== -1;
					}

					if (isVisible && searchValue) {
						const attrVal = row[searchBy.attributeName].toLowerCase();
						const searchVal = searchValue.toLowerCase();
						isVisible = attrVal.indexOf(searchVal) !== -1;
					}

					return isVisible;
				}
			);
		}

		return rows;
	};

	handleSearch = searchValue => {
		this.setState({ searchValue });
	};

	handleFilter = filterValue => {
		this.setState({ filterValue });
	};

	handleSelectChange = (rowObj, selectedValue) => {		
		this.props.onSelectChange(rowObj, selectedValue);
	};

	clearSearch = () => {
		this.setState({ searchValue: '' });		
	};

	handleActionClick = (action, rowObj) => {
		this.props.onRowAction(action, rowObj);
	};

	render() {
		const { searchValue, filterValue } = this.state;
		const { 
			columns, 
			rows, 
			inlineStyle, 
			className, 
			searchBy,
			filterOptions,
			filterColumn,
			rowActions
		} = this.props;

		let tableClass = 'item-list data-table';
		if (className) {
			tableClass += ` ${className}`;
		}

		const filteredRows = this.filterRows(rows, searchBy, filterColumn);

		const enableRowActions = rowActions && rowActions.length > 0 || false;

		return (
			<div className="data-table">
				{(searchBy || filterOptions) ?
					<form className="table-filter">
						{searchBy &&
							<Input 
								value={searchValue}
								onChange={this.handleSearch}
								label={`Search by ${searchBy.label}`}
								clearValue={true}
								onClearValue={this.clearSearch}
							/>
						}
						{filterOptions &&
							<Select
								options={filterOptions}
								onSelect={this.handleFilter}
								label={`Filter by ${filterColumn.label}`}
								value={filterValue}
								emptyOption={true}
							/>
						}
					</form>
					: null
				}

				<div className={tableClass} style={inlineStyle}>
					<article className="row headings">
						{columns && columns.length > 0 && columns.map(
							col => {
								const cellClass = `cell ${col.style}`;
								return (
									<Cell
										className={cellClass}
										key={col.id}
										value={col.label}
									/>
								)
							}
						)}
						{enableRowActions &&
							<Cell
								className="cell"						
								key="action-col-header"
								value=""
							/>
						}
					</article>

					{filteredRows && filteredRows.length > 0 && filteredRows.map(
						row => {
							return (
								<article className="row transformer" key={row.id}>
									{columns && columns.length > 0 && columns.map(
										col => {
											const cellClass = `cell ${col.style}`;
											const cellId = `${row.id}-${col.id}`;
											return (
												<Cell 
													className={cellClass}
													key={cellId}
													value={row[col.attributeName]}
													type={col.type}
													selectOptions={col.selectOptions}
													onSelectChange={this.handleSelectChange}
													currentRow={row}
												/>
											);
										}
									)}
									{enableRowActions &&
										<Cell
											className="cell ta-r"											
											key="action-col"
											type="action"
											currentRow={row}											
											actions={rowActions}
											onActionClick={this.handleActionClick}
										/>
									}
								</article>
							);
						}
					) || <p className="list-message">No results found.</p>}
				</div>
			</div>
		);
	}
}
