import { UserService } from './user.service.js';

const getText = (key, params = []) => {
  const texts = {
    localServer: `<p>
				This document is only there to show the result of the function <code>getRelevantInfractionReasons</code>.
			</p>
			<p>
				Please improve the code quality in <code>index.js</code> as best as you can. Also possible bugs should be fixed.<br>
				The other files must remain unchanged, but you can add new files if needed.
				You can utilise any modern JS features that are supported in latest chrome, but don't use any third-party libraries.<br>
				Have fun!
			</p>`,
    notALocalServer: `
			<strong>Sorry, you need to run this through a local server!</strong>
		`,
    infractionReason: `
			Infraction reasons: <pre>${params[0]}</pre>
		`,
  };
  return texts[key];
};

class App {
  /**
   * Root element of the app
   */
  appElement;

  userService;

  static createApp(selector) {
    const app = document.getElementById(selector);
    return new App(app, new UserService());
  }

  constructor(appElement, userService) {
    this.appElement = appElement;
    this.userService = userService;
    this.init();
  }

  init() {
    this.isLocalServer() ? this.displayText('localServer') : this.displayText('notLocalServer');

    this.getRelevantInfractionReasons('John').then((data) => {
      this.displayText('infractionReason', [JSON.stringify(data, null, ' ')]);
    });
  }

  /**
   * Appends text to the app template by the text key and the params.
   * The text parts can be modified above by the `getText` function
   * TODO: Move the static texts to a seperate file, because for demontration purposes
   * I will not do this.
   * @param {*} key
   * @param {*} param
   */
  displayText(key, param) {
    this.appElement.insertAdjacentHTML('beforeend', getText(key, param));
  }

  /**
   * Checks if this document was served by a web server
   * @returns
   */
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
   * Maps url strings to a tag links
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
    const { id } = await this.userService.getUserByName(username);
    const result = await this.userService.getUserInfractions(id);

    return this.getInfractionLinkified(result);
  }
}

App.createApp('app');
