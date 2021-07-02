import { getUserByName, getUserInfractions } from './user-api.js';

export const InfractionTypes = {
	MostRecent: 'MostRecent',
	Worst: 'Worst',
};

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
	 * Gets the reason for the most recent and worst infraction linkified
	 * @param {*} result
	 * @returns {string}
	 */
	getInfractionLinkified(result) {
		let worstIndex = 0;
		let mostRecentIndex = 0;

		for (let i = 0; i <= result.length - 1; i++) {
			if (result[i].points > result[worstIndex].points) {
				worstIndex = i;
			}
			if (result[i].id > result[mostRecentIndex].id) {
				mostRecentIndex = i;
			}
		}

		return {
			worst: this.replaceUrlByLinks(result[worstIndex].reason),
			mostRecent: this.replaceUrlByLinks(result[mostRecentIndex].reason),
		};
	}

	/**
	 *
	 * @param {*} string
	 * @returns
	 */
	replaceUrlByLinks(string) {
		return string.replace(/\bhttps:\/\/\S+/, (match) => `<a href='${match}'>${match}</a>`);
	}

	/**
	 * Returns reason of the worst & the most recent user infraction with linkified urls
	 * @param {string} username
	 * @returns {Promise.<Object>}
	 */
	async getRelevantInfractionReasons(username) {
		const { id } = await getUserByName(username);
		const result = await getUserInfractions(id);

		return this.getInfractionLinkified(result);
	}
}

App.createApp('app');
