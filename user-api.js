/**
 * This is a simple mockup for a dated user API.
 * Lets pretend here that this API makes actual network requests and is used by
 * many other older scripts. This means you can't touch this file in any way :(.
 *
 * @typedef {Object} User
 * @property {string} id - key index
 * @property {string} name
 *
 * @typedef {Object} Infraction
 * @property {string} id - key index
 * @property {number} points - the higher, the worse
 * @property {string} reason - note left by the moderator
 */

export let networkError = false;

/**
 * @param {string} userName
 * @param {function(?User)} onSuccess
 * @param {function(Error)} onError
 */
export function getUserByName(userName, onSuccess, onError) {
	setTimeout(() => {
		if (networkError) {
			onError(Error());
			return;
		}

		const mockResult = userName === 'John' ? { id: '123', name: userName } : null;

		onSuccess(mockResult);
	}, 100);
}

/**
 * @param {string} userId
 * @param {function(?Array.<Infraction>)} onSuccess
 * @param {function(Error)} onError
 */
export function getUserInfractions(userId, onSuccess, onError) {
	setTimeout(() => {
		if (networkError) {
			onError(Error());
			return;
		}

		const mockResult =
			userId === '123'
				? [
						{ id: '1', points: 5, reason: 'trolling' },
						{ id: '2', points: 10, reason: 'frequent promotion of http://buy-my-product.com' },
						{ id: '3', points: 1, reason: 'posted image of dogs in cat forum: https://placedog.net/300/200' },
				  ]
				: null;

		onSuccess(mockResult);
	}, 100);
}
