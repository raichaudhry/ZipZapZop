/**
 * Checks a user's credentials to see if they are correct.
 * @param {String} id The uid or username of the user.
 * @param {String} password The user's password.
 * @param {Boolean} username **DEPRECATED!!!** Act as if `id` is a username. Defaults to false.
 * @returns {Boolean} True if credentials are correct, false if not.
 */
const auth = async (id, password, username = false) => {
	try {
		password = encodeURI(password);
		const res = await fetch(`/auth`, {
			headers: username
				? { username: id, password }
				: { uid: id, password },
		});
		switch (res.status) {
			case 200:
				return true;
			case 401:
			case 400:
				return false;
			default:
				return null;
		}
	} catch (e) {
		console.error(e);
		return false;
	}
};
export default auth;
