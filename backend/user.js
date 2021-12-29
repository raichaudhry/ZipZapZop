const { Pool } = require("pg");
const pool = new Pool({ port: 5433 });

const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.text());

router.get("/db/users/:uid/:pass/:key", async (req, res) => {
	let { uid, pass, key } = req.params;

	// Prevent SQL injection.
	uid = uid.replace("'", '"');
	pass = pass.replace("'", '"');
	key = key.replace("'", '"');

	const client = await pool.connect();
	try {
		// Add quotes to prevent SQL injection.
		const query = `SELECT ${key === "*" ? "*" : '"' + key + '"'} FROM users WHERE uid='${uid}' AND password='${pass}';`;
		const output = (await client.query(query)).rows[0];
		res.send(output);
	} catch (err) {
		console.error(err);
	} finally {
		// ALWAYS check out client.
		client.release();
	}
});
// Redirect to get everything if there isn't a key.
router.get("/db/users/:uid/:pass", async (req, res) => {
	const { uid, pass } = req.params;
	res.redirect(`/db/users/${uid}/${pass}/*`);
});

module.exports = router;
