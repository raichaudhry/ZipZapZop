import Cookie from "../modules/Cookie.js";
import auth from "../modules/db/auth.js";

/**
 * Sets the cookies to log a user in.
 * @param {String} username The username of the user.
 * @param {String} password The password of the user.
 * @returns {Boolean} If the user can't be logged in, it will return false. If the user was logged in, it will return true.
 */
const login = async (username, password) => {
	if (await auth(username, password, true)) {
		Cookie.set(
			{
				name: "username",
				value: username,
				options: {
					path: "/",
				},
			},
			{
				name: "password",
				value: password,
				options: {
					path: "/",
				},
			}
		);
		return true;
	} else {
		return false;
	}
};
export default login;
