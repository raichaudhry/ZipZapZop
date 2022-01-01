const auth = require("./auth");
const removeQuotes = require("./removeQuotes");

const { Pool } = require("pg");
const pool = new Pool({ port: 5433 });

const authChat = async (cuid_, uuid_, pass_) => {
	// Make sure the user exists
	if (!(await auth(uuid_, pass_))) return false;

	// Prevent SQL injection
	const { cuid_: cuid, uuid_: uuid, pass_: pass } = removeQuotes({ cuid_, uuid_, pass_ });

	// Make sure chat exists
	const client = await pool.connect();
	const query = await client.query(`SELECT people FROM chats WHERE uid='${cuid}'`);
	const res = query.rows[0];
	if (!res) return false;

	// Make sure the user can access the chat
	/** @type {String[]} */
	const people = res.people;
	if (people.indexOf(uuid) === -1) return false;
	return true;
};

module.exports = authChat;
