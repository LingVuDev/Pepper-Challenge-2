import { getUserByName, getUserInfractions } from './user-api.js';

class App {
	/**
	 * Root element of the app
	 */
	appElement;

	static createApp(selector) {
		const app = document.getElementById(selector);
		return new App(app);
	}

	constructor(appElement) {
		this.appElement = appElement;
		this.init();
	}

	init() {
		const output = this.getOutput();
		this.appElement.insertAdjacentHTML('beforeend', output);
		this.getRelevantInfractionReasons('John').then((data) => {
			app.insertAdjacentHTML('beforeend', `Infraction reasons: <pre>${JSON.stringify(data, null, ' ')}</pre>`);
		});
	}

	getOutput() {
		return this.isLocalServer
			? `<p>
			This document is only there to show the result of the function <code>getRelevantInfractionReasons</code>.
		</p>
		<p>
			Please improve the code quality in <code>index.js</code> as best as you can. Also possible bugs should be fixed.<br>
			The other files must remain unchanged, but you can add new files if needed.
			You can utilise any modern JS features that are supported in latest chrome, but don't use any third-party libraries.<br>
			Have fun!
		</p>`
			: `<strong>Sorry, you need to run this through a local server!</strong>`;
	}

	isLocalServer() {
		return Boolean(location.host);
	}

	/**
	 * @param {string} username
	 */
	async getReasonForWorstInfractionLinkified(username) {
		const user = await getUserByName(username);

		const result = await getUserInfractions(user.id);
		// find most recent infraction with most infraction points
		let foundIndex = 0;
		for (let i = result.length - 1; i >= 0; i--) {
			if (result[i].points > result[foundIndex].points) {
				foundIndex = i;
			}
		}

		// replace urls by links
		return this.replaceUrlByLinks(result[foundIndex].reason);
	}

	/**
	 * @param {string} name
	 */
	async getReasonForMostRecentInfractionLinkified(name) {
		const user = await getUserByName(name);
		const result = await getUserInfractions(user.id);

		const recentItem = result.reduce((currentMostRecentItem, currentItem) => {
			return currentMostRecentItem.id < currentItem.id ? currentItem : currentMostRecentItem;
		});

		// replace urls by links
		return this.replaceUrlByLinks(recentItem.reason);
	}

	replaceUrlByLinks(string) {
		return string.replace(/\bhttps:\/\/\S+/, (match) => '<a href="' + match + '">' + match + '</a>');
	}

	/**
	 * Returns reason of the worst & the most recent user infraction with linkified urls
	 * @param {string} username
	 * @returns {Promise.<Object>}
	 */
	async getRelevantInfractionReasons(username) {
		const worst = await this.getReasonForWorstInfractionLinkified(username);
		const mostRecent = await this.getReasonForMostRecentInfractionLinkified(username);

		return { mostRecent, worst };
	}
}

App.createApp('app');
