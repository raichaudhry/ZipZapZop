import { encrypt } from "../encryptor.js";
const user = async (id, password, key, newValue, username = false) => {
	password = encrypt(password);
	const res = await fetch(`/db/users/${username ? "username-" : ""}${id}/${password}/${key}`);
	const json = await res.text();
	try {
		if (key !== "*") return JSON.parse(json)[key];
		return JSON.parse(json);
	} catch (e) {
		return {};
	}
};
export default user;
