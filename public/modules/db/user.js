// `username_` is for backwards compatibility
const user = async (
	id,
	password,
	key = "*",
	username = false,
	username_ = false
) => {
	username = username || username_;
	password = encodeURI(password);
	try {
		const res = await fetch(`/db/user/`, {
			headers: username
				? { username: id, password }
				: { uid: id, password },
		});
		const text = await res.text();
		// `var` for debugging (so it can be accessed in the `catch`)
		var json = JSON.parse(text);
		if (key !== "*") return json[key];
		return json;
	} catch (e) {
		if (e instanceof SyntaxError)
			console.error(`Probable JSON parse error. \nJSON: ${json}\n${e}`);
		else console.error(e);
		return {};
	}
};
export default user;
