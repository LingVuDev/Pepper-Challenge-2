/**
 * This code needs help.
 */

import { getUserByName, getUserInfractions } from './user-api.js';

/**
 * @param {string} username
 * @param {function(string)} callback
 */
function getReasonForWorstInfractionLinkified(username, callback) {
	getUserByName(username, function (user) {
		getUserInfractions(user.id, function (result) {
			// find most recent infraction with most infraction points
			let foundIndex = 0;
			for (let i = result.length - 1; i >= 0; i--) {
				if (result[i].points > result[foundIndex].points) {
					foundIndex = i;
				}
			}

			// replace urls by links
			callback(result[foundIndex].reason.replace(/\bhttps:\/\/\S+/, (match) => '<a href="' + match + '">' + match + '</a>'));
		});
	});
}

/**
 * @param {string} name
 * @param {function(string)} callback
 */
function getReasonForMostRecentInfractionLinkified(name, callback) {
	getUserByName(name, function (user) {
		getUserInfractions(user.id, function (result) {
			// find most recent infraction
			let foundIndex = 0;
			for (let i = 1; i < result.length; i++) {
				if (result[i].id > result[foundIndex].id) {
					foundIndex = i;
				}
			}

			// replace urls by links
			callback(result[foundIndex].reason.replace(/\bhttps:\/\/\S+/, (match) => '<a href="' + match + '">' + match + '</a>'));
		});
	});
}

/**
 * Returns reason of the worst & the most recent user infraction with linkified urls
 * @param {string} username
 * @returns {Promise.<Object>}
 */
export function getRelevantInfractionReasons(username) {
	return new Promise(function (resolve) {
		getReasonForWorstInfractionLinkified(username, function (worst) {
			getReasonForMostRecentInfractionLinkified(username, function (mostRecent) {
				resolve({ mostRecent, worst });
			});
		});
	});
}
