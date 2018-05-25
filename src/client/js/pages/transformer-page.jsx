import React from 'react';
import { Component, connect } from '../common/base-component';

import { isEmpty } from '../utils';

import Wrapper from '../components/wrapper.jsx';
import Input from '../components/shared/input.jsx';
import Select from '../components/shared/select.jsx';
import ItemList from '../components/shared/item-list.jsx';

import Constants from '../constants/global-constants';

import { 
	changeTransformerValue, 
	saveTransformer,
	deleteTransformer,
	readInitialData
 } from '../actions/global-actions';

@connect(
	state => {
		const props = {
			transformers: state.global.transformers || [],
			factions: state.global.factions || [],
			vehicleTypes: state.global.vehicleTypes || [],
			currentLocationPath: state.history && state.history.location.pathname,
			initialized: state.global.initialized
		}
		
		return props;
	},
	dispatch => {
		return {
			saveTransformer: transformer => dispatch(saveTransformer(transformer)),
			deleteTransformer: id => dispatch(deleteTransformer(id)),
			changeTransformerValue: (key, value) => dispatch(changeTransformerValue(key, value)),
			readInitialData: () => dispatch(readInitialData())
		}
	}
)
export default class TransformerPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			transformer: {
				vehicleGroup: '',
				vehicleType: '',
				vehicleModel: '',
				gear: []
			},
			vehicleTypes: [],
			vehicleModels: [],
			validationError: '',
			factionOpts: [], 
			vehicleTypesByGroup: {}, 
			vehicleModelsByType: {}
		}
	}

	componentDidMount() {
		if (this.props.initialized) {
			this.setInitState();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.initialized && nextProps.transformers && nextProps.transformers.length > 0) {
			this.setInitState(nextProps);
			return true;
		}

		return false;
	}

	setInitState(props) {
		props = props || this.props;

		const transformers = props.transformers;
		const id = props.match.params.id;	
		let transformer = {};
		if (!isEmpty(id)) {
			transformer = transformers && transformers.find(t => t.id == id);
		}

		const factionOpts = props.factions && props.factions.map(f => ({ value: f.id, id: f.id, label: f.name }));

		const vehicleTypesByGroup = {};
		const vehicleModelsByType = {};
		props.vehicleTypes && props.vehicleTypes.forEach(
			vt => {
				if (vehicleTypesByGroup[vt.group]) {
					if(!vehicleTypesByGroup[vt.group].includes(vt.type)) {
						vehicleTypesByGroup[vt.group].push(vt.type);
					}
				} else {
					vehicleTypesByGroup[vt.group] = [vt.type];
				}

				if (vehicleModelsByType[vt.type]) {
					if(!vehicleModelsByType[vt.type].includes(vt.model)) {
						vehicleModelsByType[vt.type].push(vt.model);
					}
				} else {
					vehicleModelsByType[vt.type] = [vt.model];
				}
			}
		);

		this.setState(
			{
				transformers: transformers,
				transformer: transformer,
				factionOpts: factionOpts, 
				vehicleTypesByGroup: vehicleTypesByGroup, 
				vehicleModelsByType: vehicleModelsByType
			},
			() => transformer.vehicleGroup && this.handleGroupSelect(transformer.vehicleGroup, 'vehicleGroup')
		);
	}

	handleChange = (value, name) => {
		this.setState(
			prev => ({
				...prev,
				transformer: {
					...prev.transformer,
					[name]: value
				}
			})
		);
	};

	handleGroupSelect = (group, name) => {
		const { vehicleTypesByGroup, vehicleModelsByType } = this.state;
		group = group || Object.keys(vehicleTypesByGroup)[0];
		if (group && vehicleTypesByGroup) {
			this.setState(
				prev => ({
					...prev,
					transformer: {
						...prev.transformer,
						[name]: group
					},
					vehicleTypes: vehicleTypesByGroup[group]
				})
			);

			const initType = vehicleTypesByGroup[group][0];
			this.handleTypeSelect(initType, 'vehicleType');

			const initModel = vehicleModelsByType[initType][0];
			this.handleChange(initModel, 'vehicleModel');
		}
	};

	handleTypeSelect = (type, name) => {
		const { vehicleModelsByType } = this.state;
		if (vehicleModelsByType && vehicleModelsByType[type]) {
			this.setState(
				prev => ({
					...prev,
					transformer: {
						...prev.transformer,
						[name]: type
					},
				vehicleModels: vehicleModelsByType[type],
				})
			);

			const initModel = vehicleModelsByType[type][0];
			this.handleChange(initModel, 'vehicleModel');
		}
	};

	addGear = gear => {
		if (gear) {
			const transformer = this.state.transformer;
			const gearList = transformer.gear || [];
			gearList.push(gear);
			this.handleChange(gearList, 'gear');
		}
	};

	removeGear = gear => {
		if (gear) {
			const transformer = this.state.transformer;
			let gearList = transformer.gear || [];
			gearList = gearList.filter(g => g !== gear);
			this.handleChange(gearList, 'gear');			
		}
	};

	onSave = () => {
		const { transformer } = this.state;
		if (
			!transformer || !transformer.name || isEmpty(transformer.factionId) || 
			!transformer.vehicleGroup || !transformer.vehicleType || !transformer.vehicleModel
		) {
			this.setState({ validationError: 'Please enter all required fields (marked with *)!' });
			return;
		}

		this.props.saveTransformer(transformer);
		this.navigateToPage('/');
	};

	onCancel = () => {
		this.navigateToPage('/');
	};

	render() {
		const { 
			transformers,
			transformer,
			factions, 
			factionOpts, 
			vehicleTypesByGroup,
			vehicleModelsByType,
			vehicleTypes, 
			vehicleModels, 
			showGearModal, 
			validationError
		} = this.state;

		const vehicleGroups = vehicleTypesByGroup && Object.keys(vehicleTypesByGroup);

		const hasFactionLabelOption = !transformer || (transformer && !transformer.faction);
		const hasVehicleGroupLabelOption = !transformer || (transformer && !transformer.vehicleGroup);
		const hasStatusLabelOption = !transformer || (transformer && !transformer.status);			
		
		return (
			<Wrapper>			
				<div className="card">
					<header>
						<h2>{transformer && transformer.name || 'New Transformer'}</h2>

						<div className="ctrl-group">
							<button type="button" className="btn">
								Save
							</button>
							<button type="button" className="btn" onClick={this.onCancel}>
								Cancel
							</button>
						</div>
					</header>

					<section className="content">
						<form className="transformer-config">
							<section className="config-left">
								<Input 
									value={transformer && transformer.name || ''}
									label='Name'
									name='name'
									onChange={this.handleChange}
									labelClass='required'
								/>
								<Select
									options={factionOpts}
									value={transformer && transformer.factionId || ''}
									label='Faction'
									name='factionId'
									onSelect={this.handleChange}
									labelOption={hasFactionLabelOption}
									labelClass='required'									
								/>
								<Select
									options={vehicleGroups}
									value={transformer && transformer.vehicleGroup || ''}
									label='Vehicle Group'
									name='vehicleGroup'
									onSelect={this.handleGroupSelect}
									labelOption={hasVehicleGroupLabelOption}
									labelClass='required'									
								/>
								<Select
									options={vehicleTypes}
									value={transformer && transformer.vehicleType || ''}
									label='Vehicle Type'
									name='vehicleType'
									onSelect={this.handleTypeSelect}
									disabled={!vehicleTypes || (vehicleTypes && vehicleTypes.length < 1)}
									labelClass='required'									
								/>
								<Select
									options={vehicleModels}
									value={transformer && transformer.vehicleModel || ''}
									label='Vehicle Model'
									name='vehicleModel'
									onSelect={this.handleChange}
									disabled={!vehicleModels || (vehicleModels && vehicleModels.length < 1)}
									labelClass='required'																	
								/>
							</section>
							<section className="config-right">
								<ItemList
									title='Gear'
									items={transformer && transformer.gear}
									onAddButtonClick={this.addGear}
									removeItem={this.removeGear}
								/>
								<Select
									options={Constants.transformerStatuses}
									value={transformer && transformer.status || ''}
									label='Status'
									name='status'
									onSelect={this.handleChange}
									labelOption={hasStatusLabelOption}
									labelClass='required'									
								/>
							</section>
						</form>
					</section>

					<footer>
						<div className="notification-message">{validationError}</div>
						<div className="ctrl-group">
							<button type="button" className="btn" onClick={this.onSave}>
								Save
							</button>
							<button type="button" className="btn" onClick={this.onCancel}>
								Cancel
							</button>
						</div>
					</footer>
				</div>
			</Wrapper>
		);
	}
}
