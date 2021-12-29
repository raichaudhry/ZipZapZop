const { encrypt, decrypt } = require("./encryptor");
const { Pool } = require("pg");
const pool = new Pool({ port: 5433 });

/**
 * Checks to see if the user's credentials are correct.
 * @param {String} uid The user's uid (a uuid).
 * @param {String} pass The user's password.
 * @returns {Boolean} Returns `true` if the user's credentials are correct, and `false` if they aren't. If the user doesn't exist, it will return `false`.
 */
const auth = async (uid, pass) => {
	// Prevent SQL injection
	uid = uid.replace("'", '"');
	pass = decrypt(pass).replace("'", '"');

	const client = await pool.connect();
	try {
		const query = await client.query(`SELECT uid FROM users WHERE uid='${uid}' AND password='${pass}'`);
		const output = query.rows[0];
		// Check to see if the output is a uuid
		if (output == undefined) return null;
		return true;
	} catch (err) {
		console.error(err);
	} finally {
		// ALWAYS release client at end.
		client.release();
	}
};

module.exports = auth;
