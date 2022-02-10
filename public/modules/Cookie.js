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
		this.reset();
	}
	/** Sets all of the cookie's metadata. */
	reset() {
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
		const metadata = "";
		for (const option in this.options) {
			metadata += `;${option}=${this.options[option]}`;
		}

		document.cookie = `${this.name}=${metadata};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
	}

	/** Change cookie options (for chaining) */
	option(name, value) {
		this[name] = value;
		return this;
	}

	/**
	 * Returns all the cookies in the document.
	 * @type {Cookie[]}
	 */
	static get cookies() {
		if (document.cookie === "") return {};

		const cookies = {};
		for (let cookieString of document.cookie.split(/; ?/)) {
			const cookieSplit = cookieString.split("=");
			const name = cookieSplit[0],
				value = cookieSplit[1];
			const cookie = new Cookie(name, value);
			cookies[name] = cookie;
		}
		return cookies;
	}
	/**
	 * Returns a cookie from the browser. If not found, it will return undefined.
	 * @param {String} name The name of the cookie.
	 * @returns {Cookie?}
	 */
	static get(name) {
		return Cookie.cookies[name];
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
