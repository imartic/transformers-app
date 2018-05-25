import GlobalActionTypes from '../constants/global-action-types';

export default function applicationReducer(state = {}, action) {
	state = Object.assign({}, state);

	if (action.asynchronous) {
		switch (action.asynchronous.actionName) {
			case GlobalActionTypes.ReadInitialData:
				if (action.asynchronous.isFulfilled) {
					const initData = action.payload;
					let transformers = initData.transformers;
					const factions = initData.factions;
					const vehicleTypes = initData.vehicleTypes;

					if (
						transformers && transformers.length > 0 && 
						factions && factions.length > 0
					) {
						transformers = transformers && transformers.length > 0 && transformers.map(
							transformer => {
								return prepareTransformer(transformer, factions);
							}
						);
					}

					state = Object.assign(
						{},
						state,
						{
							factions: factions,							
							transformers: transformers,
							vehicleTypes: vehicleTypes,
							initialized: true
						}
					);
				}
				break;

			case GlobalActionTypes.SaveTransformer:
				if (action.asynchronous.isFulfilled) {
					const newTransformer = action.payload;
					const factionsArr = [...state.factions];
					let newTransformersArr = [...state.transformers];	
					const preparedTransformer = prepareTransformer(newTransformer, factionsArr);											

					const filteredTransformersArr = newTransformersArr.filter(f => f.id !== newTransformer.id) || [];
					if (filteredTransformersArr && filteredTransformersArr.length > 0) {						
						filteredTransformersArr.push(preparedTransformer);
						newTransformersArr = filteredTransformersArr;						
					} else {
						newTransformersArr.push(preparedTransformer);						
					}

					state = Object.assign({}, state, { transformers: newTransformersArr, isWaitingForRemoteData: false });
				} else if (action.asynchronous.isPending) {
					state = Object.assign({}, state, { isWaitingForRemoteData: true });
				} else if (action.asynchronous.isRejected) {
					state = Object.assign({}, state, { isWaitingForRemoteData: false, remoteDataError: action.payload });
				}
				break;

			case GlobalActionTypes.PatchTransformer:
				if (action.asynchronous.isFulfilled) {
					const transformer = action.payload;
					let tfs = [...state.transformers];
					tfs = tfs.map(
						t => {
							if (t.id === transformer.id) {
								t = Object.assign(t, transformer);
							}
							return t;
						}
					);
					state = Object.assign({}, state, { transformers: tfs, isWaitingForRemoteData: false });
				} else if (action.asynchronous.isPending) {
					state = Object.assign({}, state, { isWaitingForRemoteData: true });
				} else if (action.asynchronous.isRejected) {
					state = Object.assign({}, state, { isWaitingForRemoteData: false, remoteDataError: action.payload });
				}
				break;

			case GlobalActionTypes.DeleteTransformer:
				if (action.asynchronous.isFulfilled) {
					const transformerId = action.payload;
					let transformersArr = [...state.transformers];

					transformersArr.splice(transformersArr.map(t => t.id).indexOf(transformerId), 1);

					state = Object.assign({}, state, { transformers: transformersArr, isWaitingForRemoteData: false });
				} else if (action.asynchronous.isPending) {
					state = Object.assign({}, state, { isWaitingForRemoteData: true });
				} else if (action.asynchronous.isRejected) {
					state = Object.assign({}, state, { isWaitingForRemoteData: false, remoteDataError: action.payload });
				}
				break;
		}
	} else {
		switch(action.type) {
			case GlobalActionTypes.ChangeTransformerValue:
				const key = action.payload.key;
				const value = action.payload.value;
				const transformer = action.payload.transformer;

				transformer[key] = value;

				// transformer.updateIndicator = (transformer.updateIndicator || 0) + 1;

				state = Object.assign({}, state, { transformers: [...state.transformers] });
				break;
		}
	}

	return state;
}

function prepareTransformer(transformer, factions) {
	const faction = factions.find(f => f.id === transformer.factionId);
	if (faction) {
		transformer.faction = faction;
		transformer.factionName = faction.name;							
	}
	
	return transformer;
}
