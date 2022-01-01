// ECMAScript (JS)
import { encrypt } from "../encryptor.js";

/**
 * Checks a user's credentials to see if they are correct.
 * @param {String} id The uid or username of the user.
 * @param {String} password The user's password.
 * @param {Boolean} username Act as if `id` is a username. Defaults to false.
 * @returns {Boolean} True if credentials are correct, false if not.
 */
const auth = async (id, password, username = false) => {
	password = encrypt(password);
	const res = await fetch(`/auth/${username ? "username-" : ""}${id}/${password}`);
	const status = res.status;
	if (status == 200) return true;
	else if (status == 403) return false;
	else return null;
};
export default auth;
