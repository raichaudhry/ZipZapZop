import Cookie from "../modules/Cookie";
import auth from "../modules/db/auth";

const login = (username, password) => {
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
