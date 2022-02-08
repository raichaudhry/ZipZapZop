const { Pool, options } = require("../poolOptions");
const pool = new Pool(options);

/**
 * Checks to see if the user's credentials are correct.
 * @param {String} id The user's uid (a uuid).
 * @param {String} password The user's password.
 * @returns {Boolean} Returns `true` if the user's credentials are correct, and `false` if they aren't. If the user doesn't exist, it will return `false`.
 */
const auth = async (id, password, username = false) => {
	// Prevent SQL injection
	id = id.replaceAll("'", '"');
	password = decodeURI(password).replaceAll("'", '"');

	const client = await pool.connect();
	try {
		const query = await client.query(
			`SELECT uid FROM users WHERE ${
				username ? "username" : "uid"
			}='${id}' AND password='${password}'`
		);
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
