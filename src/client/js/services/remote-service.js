import { isEmpty } from '../utils';

const invokeRequestAsync = (url, method, body) => {
	return fetch(url, {
		method: method,
		body: JSON.stringify(body),
		headers: { "Content-type": "application/json; charset=UTF-8" }
	}).then(
		response => {
			if (response.status < 300 && response.status >= 200) {
				return response.json();
			}
			return Promise.reject({
				status: response.status,
				data: response
			});
		},
		error => {
			console.error(error);
			return Promise.reject({
					status: error && error.status,
					data: error && error.message,
					stack: error && error.stack
				});
		}
	);
};

export async function invokeGetAsync(url) {
	return invokeRequestAsync(url, 'GET');
}

export async function invokePostAsync(url, body) {
	return invokeRequestAsync(url, 'POST', body);
}

export async function invokePutAsync(url, body) {
	return invokeRequestAsync(url, 'PUT', body);
}

export async function invokePatchAsync(url, body) {
	return invokeRequestAsync(url, 'PATCH', body);
}

export async function invokeDeleteAsync(url) {
	return invokeRequestAsync(url, 'DELETE');
}

export async function readInitialDataAsync() {
	return Promise.all([
		readFactionsAsync(),
		readTransformersAsync(),
		readVehicleTypesAsync()
	]).then(
		results => {
			const factions = results[0];
			let transformers = results[1];
			const vehicleTypes = results[2];

			return { factions, transformers, vehicleTypes };
		}
	)
}

export async function readTransformersAsync() {
	return invokeGetAsync('/transformers');
}

export async function readFactionsAsync() {
	return invokeGetAsync('/factions');
}

export async function readVehicleTypesAsync() {
	return invokeGetAsync('/vehicleTypes');
}

export async function saveTransformerAsync(transformer) {
	const id = transformer && transformer.id;
	
	if (!isEmpty(id)) {
		return invokePutAsync(`/transformers/${id}`, prepareTransformerData(transformer));
	} else {
		return invokePostAsync('/transformers/', prepareTransformerData(transformer));	
	}
}

export async function patchTransformerAsync(id, body) {
	return invokePatchAsync(`/transformers/${id}`, body);
}

export async function deleteTransformerAsync(id) {
	return invokeDeleteAsync(`/transformers/${id}`).then(() => id);
}

function prepareTransformerData(transformer) {
	return {
		id: transformer.id,
      	name: transformer.name,
      	vehicleGroup: transformer.vehicleGroup,
      	vehicleType: transformer.vehicleType,
      	vehicleModel: transformer.vehicleModel,
      	gear: transformer.gear,
      	factionId: parseInt(transformer.factionId),
      	status: transformer.status
	};
}
