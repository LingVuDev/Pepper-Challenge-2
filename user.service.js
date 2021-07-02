import { getUserByName as legacyGetUserByName, getUserInfractions as legacyGetUserInfractions } from './user-api.js';

/**
 * Middleware service to map the legacy api to promises
 * TODO: Once the legacy api gets deprecated, use the service methods
 * to make the api requests
 *
 * @class UserService
 */
export class UserService {
	
  /**
   *
   * @param {*} userName
   * @returns
   */
  getUserByName(userName) {
		return new Promise((resolve, reject) => {
			legacyGetUserByName(
				userName,
				(onSuccess) => {
					resolve(onSuccess);
				},
				(onError) => {
					reject(onError);
				}
			);
		});
	}

	/**
   *
   * @param {*} userId
   * @returns
   */
  getUserInfractions(userId) {
		return new Promise((resolve, reject) => {
			legacyGetUserInfractions(
				userId,
				(onSuccess) => {
					resolve(onSuccess);
				},
				(onError) => {
					reject(onError);
				}
			);
		});
	}
}
