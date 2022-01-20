import { encrypt } from "../encryptor.js";
const chat = async (cuid, id, password, key, username = false, username_ = false) => {
	username = username || username_;
	password = encrypt(password);
	if (newValue) {
		const res = await fetch(`/db/write/chats/${cuid}/${username ? "username-" : ""}${id}/${password}/${key}/${newValue}`);
		if (res.status == 204) return true;
		else if (res.status == 500) return false;
		else return null;
	} else {
		const res = await fetch(`/db/chats/${cuid}/${username ? "username-" : ""}${id}/${password}/${key}`);
		const json = await res.text();
		try {
			if (key !== "*") return JSON.parse(json)[key];
			return JSON.parse(json);
		} catch (e) {
			console.error(e);
			return {};
		}
	}
};
export default chat;
