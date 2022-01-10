const auth = require("./auth");
const { Pool, options } = require("../poolOptions");
const pool = new Pool(options);

const authChat = async (cuid, uuid, pass) => {
	const client = await pool.connect();
	try {
		// Make sure the user exists
		if (!(await auth(uuid, pass))) return false;

		// Prevent SQL injection
		cuid = cuid.replace("'", '"');
		uuid = uuid.replace("'", '"');
		pass = pass.replace("'", '"');

		// Make sure chat exists
		const query = await client.query(`SELECT people FROM chats WHERE uid='${cuid}'`);
		const res = query.rows[0];

		if (!res) return false;

		// Make sure the user can access the chat
		/** @type {String[]} */
		const people = res.people;
		if (people.indexOf(uuid) === -1) return false;
		return true;
	} finally {
		client.release();
	}
};

module.exports = authChat;
