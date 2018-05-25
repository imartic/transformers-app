import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware'

const PROMISE_REGEX = new RegExp(`(.*)_(${PENDING}|${FULFILLED}|${REJECTED})$`);

export default function populateAsynchronousActionData() {
	return next => action => {
		const result = PROMISE_REGEX.exec(action.type);
		if (result) {
			action.asynchronous = {
				actionName: result[1],
				isFulfilled: result[2] === FULFILLED,
				isPending: result[2] === PENDING,
				isRejected: result[2] === REJECTED
			}
		}
		next(action);
	};
}