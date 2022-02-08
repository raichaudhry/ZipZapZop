const chat = async (
	cuid,
	id,
	password,
	key = "*",
	username = false,
	username_ = false
) => {
	username = username || username_;

	const headers = { cuid, password, key };
	
	const res = await fetch(`/db/chat`, {
		headers: username
			? { username: id, ...headers }
			: { uuid: id, ...headers },
	});
	const json = await res.text();
	try {
		if (key !== "*") return JSON.parse(json)[key];
		return JSON.parse(json);
	} catch (e) {
		console.error(e);
		return null;
	}
};
export default chat;
