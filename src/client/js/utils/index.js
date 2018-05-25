export function isPromise(value) {
	if (value !== null && typeof value === 'object') {
		return value && typeof value.then === 'function';
	}

	return false;
}

// let lastId = 0;
// export function generateId(prefix='id') {
//     lastId++;
//     return `${prefix}${lastId}`;
// }

export function isEmpty(val) {
	return val === null || val === undefined;
}
