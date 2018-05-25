'use strict';

import GlobalActionTypes from '../constants/global-action-types';

import { 
	readInitialDataAsync, 
	saveTransformerAsync,
	patchTransformerAsync,
	deleteTransformerAsync
} from '../services/remote-service';

export function readInitialData() {
	return {
		type: GlobalActionTypes.ReadInitialData,
		payload: readInitialDataAsync()
	}
}

export function changeTransformerValue(key, value, transformer) {
	return {
		type: GlobalActionTypes.ChangeTransformerValue,
		payload: { key, value, transformer }
	}
}

export function saveTransformer(transformer) {
	if (!transformer) {
		return;
	}

	return {
		type: GlobalActionTypes.SaveTransformer,
		payload: saveTransformerAsync(transformer)
	}
}

export function patchTransformer(id, body) {
	if (id === null || id === 'undefined' || !body) {
		return;
	}

	return {
		type: GlobalActionTypes.PatchTransformer,
		payload: patchTransformerAsync(id, body)
	}
}

export function deleteTransformer(id) {
	if (id === null || id === 'undefined') {
		return;
	}

	return {
		type: GlobalActionTypes.DeleteTransformer,
		payload: deleteTransformerAsync(id)
	}
}

export function cloneTransformer(transformer) {
	if (!transformer) {
		return;
	}

	const transformerClone = {...transformer};
	delete transformerClone.id;

	return saveTransformer(transformerClone);
}
