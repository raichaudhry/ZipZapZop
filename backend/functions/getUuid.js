const { Pool, options } = require("../poolOptions");
const pool = new Pool(options);

/**
 * Get the UUID of a user from the username.
 * @param {String} username The username of the user.
 * @returns {String?} A UUID string. Returns `null` if the UUID is not found.
 */
const getUuid = async username => {
	const client = await pool.connect();
	try {
		// Prevent SQL injection
		username = username.replaceAll("'", '"');

		const query = await client.query(
			`SELECT uid FROM users WHERE username='${username}'`
		);
		if (query.rows.length != 1)
			return (
				res.status(422).send(`No uuid found for user '${username}'.`) ??
				null
			);
		return query.rows[0].uid ?? null;
	} catch (e) {
		console.error(e);
		return null;
	} finally {
		// ALWAYS reset the client
		client.release();
	}
};

module.exports = getUuid;
