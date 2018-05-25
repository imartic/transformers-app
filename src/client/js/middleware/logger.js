export default function loggerMiddleware() {
	return next => action => {
		const { type, payload, asynchronous } = action;

		if (process.env.NODE_ENV !== 'production') {
			console.groupCollapsed(asynchronous ? asynchronous.actionName : type);
			console.log('Payload:', payload);
			console.log('Asynchronous:', asynchronous);
			console.groupEnd();
		}

		return next(action);
	};
}
