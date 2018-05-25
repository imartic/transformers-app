import React from 'react';
import { Component, connect } from '../common/base-component';

import Wrapper from '../components/wrapper.jsx';
import DataTable from '../components/data-table.jsx';

import Constants from '../constants/global-constants';

import { 
	changeTransformerValue, 
	patchTransformer,
	deleteTransformer,
	cloneTransformer
 } from '../actions/global-actions';

@connect(
	state => {
		return {
			transformers: state.global.transformers || [],
			factions: state.global.factions || []
		};
	},
	dispatch => {
		return {
			patchTransformer: (id, body) => dispatch(patchTransformer(id, body)),
			deleteTransformer: id => dispatch(deleteTransformer(id)),
			cloneTransformer: transformer => dispatch(cloneTransformer(transformer))
		}
	}
)
export default class HomePage extends Component {
	handleChange = e => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	};

	handleStatusChange = (selectedStatus, transformer) => {
		this.props.patchTransformer(transformer.id, {status: selectedStatus});		
	};

	handleRowAction = (action, transformer) => {
		switch(action) {
			case 'edit':
				this.navigateToPage(`/transformer/${transformer.id}`);
				break;
			case 'delete':
				this.props.deleteTransformer(transformer.id);
				break;
			case 'clone':
				this.props.cloneTransformer(transformer);
				break;
		}
	};

	render() {
		const { transformers, factions } = this.props;

		const columns = TABLE_COLUMNS(Constants.transformerStatuses);

		let fractionsArr = [];
		const tableStyle = columns.forEach(() => fractionsArr.push('4fr'));
		fractionsArr.push('1fr');
		const fractions = fractionsArr.join(' ');
		const inlineStyle = {'--column-template': fractions};

		const filterOptions = factions && factions.map(f => f.name);

		return (
			<Wrapper>
				<div className="card">
					<header>
						<h2>Transformers</h2>

						<div className="ctrl-group">
							<button 
								type="button" 
								className="btn" 
								onClick={() => this.navigateToPage('/transformer/')}
							>
								Add New
							</button>
						</div>
					</header>

					<section className="content">
						<DataTable
							columns={columns || []}
							rows={transformers || []}
							className="transformers"
							inlineStyle={inlineStyle}
							searchBy={columns[0]}
							onSelectChange={this.handleStatusChange}
							filterOptions={filterOptions || []}
							filterColumn={columns[1]}
							rowActions={Constants.tableRowActions || []}
							onRowAction={this.handleRowAction}		
						/>
					</section>

					<footer></footer>
				</div>
			</Wrapper>
		);
	}
}

const TABLE_COLUMNS = selectOptions => [
	{
		id: 0,
		label: 'Name',
		style: 'ta-l',
		attributeName: 'name',
		type: 'text'
	},
	{
		id: 1,
		label: 'Faction',
		style: 'ta-l',
		attributeName: 'factionName',
		type: 'text'
	},
	{
		id: 2,
		label: 'Status',
		style: 'ta-c',
		attributeName: 'status',
		type: 'select',
		selectOptions: selectOptions
	}
];
