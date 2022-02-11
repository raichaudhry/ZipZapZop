const { Pool, options } = require("./poolOptions");
const pool = new Pool(options);

const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.text());

// Get a value
router.get("/db/user/", async (req, res) => {
	let { username, uid, password, key = "*" } = req.headers;

	if (!((username || uid) && password && key)) res.sendStatus(400);

	// Prevent SQL injection.
	username = username?.replaceAll("'", '"');
	uid = uid?.replaceAll("'", '"');
	password = password.replaceAll("'", '"');
	key = key.replaceAll('"', "'");

	if (key != "*") key = `"${key}"`;

	const client = await pool.connect();
	try {
		// Add quotes to prevent SQL injection.
		const query = await client.query(
			`SELECT ${key} FROM users WHERE ${
				!!username ? `username='${username}'` : `uid='${uid}'`
			} AND password='${password}'`
		);
		const output = query.rows[0];

		if (query.rowCount == 1) res.send(output);
		else
			throw new Error(
				`\`query.rowCount\` != 1\`query.rowCount\`: '${query.rowCount}'\nQuery: '${query}'`
			);
	} catch (err) {
		console.error(err);
		res.status(500).send("{}");
	} finally {
		// ALWAYS check out client.
		client.release();
	}
});

// Get username from UUID
router.get("/db/user/username", async (req, res) => {
	let { uid } = req.headers;
	const client = await pool.connect();
	try {
		// Add quotes to prevent SQL injection.
		uid = uid.replaceAll("'", '"');

		const query = await client.query(
			`SELECT username FROM users WHERE uid='${uid}'`
		);
		const output = query.rows[0];
		res.send(output);
	} catch (err) {
		console.error(err);
		res.status(500).send("");
	} finally {
		// ALWAYS check out client.
		client.release();
	}
});

// Set a new value
router.put("/db/write/user/", async (req, res) => {
	let { username, uid, password, key, newValue } = req.headers;

	if (!((username || uid) && password && key && newValue))
		res.sendStatus(400);

	// Prevent SQL injection.
	username = username?.replaceAll("'", '"');
	uid = uid?.replaceAll("'", '"');
	password = password.replaceAll("'", '"');
	key = key.replaceAll('"', "'");
	newValue = newValue.replaceAll("'", '"');

	const client = await pool.connect();
	try {
		// Add quotes to prevent SQL injection.
		await client.query(
			`UPDATE users SET ${key} = '${newValue}' WHERE ${
				!!username ? `username='${username}'` : `uid='${uid}'`
			} AND password='${password}';`
		);
		res.sendStatus(204);
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	} finally {
		// ALWAYS check out client.
		client.release();
	}
});

// Create an account
router.post("/db/write/create-account", async (req, res) => {
	let { username, password } = req.headers;

	// Verify that the username matches the criteria
	if (
		!/\w+/.test(username) &&
		username.indexOf("username-") === 0 &&
		username.length <= 42
	)
		return res.sendStatus(422);

	// Remove single quotes from both
	// Don't need to do it for the username bc it already is only alphanumeric.
	password = password.replaceAll("'", '"');

	const client = await pool.connect();
	try {
		await client.query(
			`INSERT INTO users(username, password) VALUES ('${username}', '${password}')`
		);
		res.sendStatus(204);
	} catch (err) {
		res.status(500).send(`${err}`);
		console.error(err);
	} finally {
		// ALWAYS check out client.
		client.release();
	}
});

module.exports = router;
