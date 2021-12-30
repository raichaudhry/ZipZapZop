import { encrypt } from "./encryptor.js";

class NotFoundError extends Error {
	constructor(msg) {
		super(msg);
		this.name = "NotFoundError";
	}
}

const database = {
	/**
	 * Get a user's info.
	 * @param {String} uid The user's uid (a uuid).
	 * @param {String} pass The user's password.
	 * @param {String?} key The key of the value being fetched (optional)
	 * @param {String?} newValue The new value of the key being set (optional). If set, `key` must also be set.
	 */
	user: async (uid, pass, key = "*", newValue) => {
		if (newValue) {
			// Update value
		} else {
			pass = encrypt(pass);
			const res = await fetch(`/db/users/${uid}/${pass}/${key}`);
			const json = await res.json();
			if (key === "*") return json;
			else return json[key];
		}
	},
	/**
	 * Check to see if a user's credentials are correct.
	 * @param {String} uid The user's uid (a uuid).
	 * @param {String} pass The user's password.
	 * @returns {Boolean} Returns `true` is credentials are correct, `false` if they aren't.
	 */
	auth: async (uid, pass) => {
		pass = encrypt(pass);
		const res = await fetch(`/auth/${uid}/${pass}`);
		const text = await res.text();
		return text === "true";
	},
};

export default database;
