import { isPromise } from '../utils';

export default function globalErrorMiddleware() {
	return next => action => {
		if (isPromise(action.payload)) {
			return next(action).catch(
				error => {
					console.error(`Error while conducting action "${action.type}"`, error);
				}
			);
		} else {
			try {
				return next(action);
			} catch (error) {
				console.error(`Error while conducting action "${action.type}"`, error);
			}
		}
	};
}