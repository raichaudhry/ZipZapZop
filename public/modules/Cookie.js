class Cookie {
	/**
	 * Creates a new cookie in the browser. If the cookie already exists, it will be overridden.
	 * @param {String} name The name of the cookie.
	 * @param {String} value The content of the cookie.
	 * @param {Object} options The metadata of the cookie (e.g. expiration date);
	 */
	constructor(name, value, options = {}) {
		this.name = name;
		this.value = value;
		this.options = options;
		this.setMetadata();
	}
	/** Sets all of the cookie's metadata. */
	setMetadata() {
		let cookieString = `${this.name}=${this.value}`;
		for (const key in this.options) {
			const value = this.options[key];
			if (value) cookieString += `;${key}=${value}`;
			else cookieString += `;${key}`;
		}
		document.cookie = cookieString;
	}

	/** Removes the cookie from the browser. */
	delete() {
		this.option("expires", "Thu, 01 Jan 1970 00:00:01 GMT");
		if (Cookie.rawCookies[this.name]) return false;
		console.log(document.cookie);
		return true;
	}

	/** Change cookie options (for chaining) */
	option(name, value) {
		switch (name) {
			case "name":
			case "value":
			case "options":
				this[name] = value;
				break;
			default:
				this.options[name] = value;
				break;
		}
		this.setMetadata();
		return this;
	}

	/**
	 * Returns all the cookies in the document.
	 * @type {{String: Cookie}}
	 */
	static get cookies() {
		const rawCookies = Cookie.rawCookies;
		const cookies = {};
		for (const rawCookie in rawCookies) {
			const { name, value } = rawCookie;
			cookies[name] = new Cookie(name, value);
		}
		return cookies;
	}

	/**
	 * Returns all the cookies in the document.
	 * @type {{String: String}}
	 */
	static get rawCookies() {
		if (document.cookie === "") return {};

		const cookies = {};
		for (let cookieString of document.cookie.split(/; ?/)) {
			const cookieSplit = cookieString.split("=");
			const name = cookieSplit[0],
				value = cookieSplit[1];
			cookies[name] = value;
		}
		return cookies;
	}

	/**
	 * Returns a cookie from the browser. If not found, it will return undefined.
	 * @param {String} name The name of the cookie.
	 * @param {Object} options The options for the cookie (e.g. path, to prevent creating duplicate cookies).
	 * @returns {Cookie?}
	 */
	static get(name, options = { path: "/" }) {
		const rawCookie = Cookie.rawCookies[name];
		if (rawCookie) return new Cookie(name, rawCookie, options);
		else return null;
	}

	/**
	 * Creates a new cookie in the browser. If the cookie already exists, it will be overridden.
	 * @param {String} name The name of the cookie.
	 * @param {String} value The content of the cookie.
	 * @param {Object} options The metadata of the cookie (e.g. expiration date);
	 * @returns {Cookie[]} Returns an array of all the `Cookie`s that were just made.
	 */
	static set(...cookies) {
		const output = [];
		for (const cookie of cookies) {
			output.push(new Cookie(cookie.name, cookie.value, cookie.options));
		}
		return output;
	}
}
export default Cookie;
