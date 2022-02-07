const { decrypt } = require("./functions/encryptor");
const { Pool, options } = require("./poolOptions");
const pool = new Pool(options);

const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.text());

// Get a value
router.get("/db/users/:id/:pass/:key", async (req, res) => {
	let { id, pass, key } = req.params;

	const username = id.indexOf("username-") === 0;
	if (username) id = id.replace("username-", "");

	// Prevent SQL injection.
	id = id.replaceAll("'", '"');
	pass = pass.replaceAll("'", '"');
	key = key.replaceAll('"', "'");

	const client = await pool.connect();
	try {
		// Add quotes to prevent SQL injection.
		const query = await client.query(
			`SELECT ${key} FROM users WHERE ${
				!!username ? `username='${username}'` : `uid=${uid}`
			} AND password='${pass}'`
		);
		const output = query.rows[0];

		if (query.rowCount == 1) res.send(output);
		else throw new Error(`\`query.rowCount\` != 1\`query.rowCount\`: '${query.rowCount}'\nQuery: '${query}'`);
	} catch (err) {
		console.error(err);
		res.status(500).send("{}");
	} finally {
		// ALWAYS check out client.
		client.release();
	}
});
router.get("/db/users/:id/:pass/", (req, res) => {
	const { id, pass } = req.params;
	res.redirect(`/db/users/${id}/${pass}/*`);
});

// Set a new value
router.put("/db/write/users/:id/:pass/:key/:newValue", async (req, res) => {
	let { id, pass, key, newValue } = req.params;
	key = key;

	const username = id.indexOf("username-") === 0;
	if (username) id = id.replace("username-", "");

	// Prevent SQL injection.
	id = id.replaceAll("'", '"');
	pass = pass.replaceAll("'", '"');
	key = key.replaceAll('"', "'");
	newValue = newValue.replaceAll("'", '"');

	const client = await pool.connect();
	try {
		// Add quotes to prevent SQL injection.
		await client.query(
			`UPDATE users SET ${key} = '${newValue}' WHERE ${
				!!username ? `username='${username}'` : `uid=${uid}`
			} AND password='${pass}';`
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
	// Don't need to do it for the username b/c it already is only alphanumeric.
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
