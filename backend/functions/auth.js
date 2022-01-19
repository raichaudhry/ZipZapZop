const { encrypt, decrypt } = require("./encryptor");
const { Pool, options } = require("../poolOptions");
const pool = new Pool(options);

/**
 * Checks to see if the user's credentials are correct.
 * @param {String} id The user's uid (a uuid).
 * @param {String} pass The user's password.
 * @returns {Boolean} Returns `true` if the user's credentials are correct, and `false` if they aren't. If the user doesn't exist, it will return `false`.
 */
/** @param username Deprecated!!! Use only UIDs instead. */
const auth = async (id, pass, username = false) => {
	if (username) console.warn("The `username` parameter is deprecated. Always use the UID.");

	// Prevent SQL injection
	id = id.replaceAll("'", '"');
	pass = decodeURI(pass).replaceAll("'", '"');

	const client = await pool.connect();
	try {
		const query = await client.query(`SELECT uid FROM users WHERE ${username ? "username" : "uid"}='${id}' AND password='${pass}'`);
		const output = query.rows[0];
		if (output == undefined) return false;
		return true;
	} catch (err) {
		console.error(err);
		return false;
	} finally {
		// ALWAYS release client at end.
		client.release();
	}
};

module.exports = auth;
