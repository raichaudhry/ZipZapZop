// ECMAScript (JS)
import { encrypt, decrypt } from "../encryptor.js";
import user from "./user.js";

/**
 * Checks a user's credentials to see if they are correct.
 * @param {String} id The uid or username of the user.
 * @param {String} password The user's password.
 * @param {Boolean} username **DEPRECATED!!!** Act as if `id` is a username. Defaults to false.
 * @returns {Boolean} True if credentials are correct, false if not.
 */
const auth = async (id, password, username = false) => {
	try {
		let uuid = id;
		if (username) {
			console.warn("The `username` parameter is deprecated.");
			uuid =
				(await user(id, password, "uid", true)) ??
				(() => {
					throw new Error(`\`uid\` not found for user '${id}' with password '${password}'`);
				})();
		}

		const res = await fetch(`/auth/${uuid}/${encodeURI(password)}`);
		const status = res.status;
		if (status == 200) return true;
		else if (status == 403) return false;
		else return null;
	} catch (e) {
		console.error(e);
		return false;
	}
};
export default auth;
