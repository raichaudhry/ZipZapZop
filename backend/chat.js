const authChat = require("./functions/authChat");
const { v4: genUuid } = require("uuid");
const getUuid = require("./functions/getUuid");

const { Pool, options } = require("./poolOptions");
const pool = new Pool(options);

const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.text());

// Get value
router.get("/db/chat/", async (req, res) => {
	// cuid = chat uid, uuid = user uid
	let { cuid, username, uuid, password, key = "*" } = req.headers;
	const client = await pool.connect();
	try {
		cuid = cuid.replaceAll("'", '"');
		username = username?.replaceAll("'", '"');
		uuid = uuid?.replaceAll("'", '"');
		password = password.replaceAll("'", '"');
		key = key.replaceAll('"', "'");

		if (key != "*") key = `"${key}"`;

		if (!uuid) {
			if (!(uuid = await getUuid(username))) {
				res.sendStatus(400);
				throw new Error(`UUID not found for username '${usernane}'`);
			}
		}

		// Check user authorization
		if (!authChat(cuid, username, password)) res.status(403).send("");
		else {
			const query = await client.query(
				`SELECT ${key} FROM chats WHERE uid='${cuid}'`
			);
			res.send(JSON.stringify(query.rows[0]));
		}
	} catch (e) {
		console.error(e);
		if (res.statusCode >= 200 || res.statusCode < 300) res.sendStatus(500);
	} finally {
		// ALWAYS release client.
		client.release();
	}
});

// Set value
router.put("/db/write/chat", async (req, res) => {
	// cuid = chat uid, uuid = user uid
	let { cuid, uuid, username, password, key, newValue } = req.headers;
	const client = await pool.connect();

	if (!uuid) {
		if (!(uuid = await getUuid(username))) {
			res.sendStatus(400);
			throw new Error(`UUID not found for username '${usernane}'`);
		}
	}

	try {
		cuid = cuid.replaceAll("'", '"');
		uuid = uuid.replaceAll("'", '"');
		password = password.replaceAll("'", '"');
		key = key.replaceAll('"', "'");
		newValue = newValue.replaceAll("'", '"');

		// Check user authorization
		if (!authChat(cuid, uuid, password)) res.status(403).send("");
		else {
			await client.query(
				`UPDATE chats SET "${key}"='${newValue}' WHERE uid='${cuid}'`
			);
			res.sendStatus(204);
		}
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	} finally {
		// ALWAYS release client.
		client.release();
	}
});

router.post("/db/write/create-chat", async (req, res) => {
	/**
	 * The name of the chat.
	 * @type {String}
	 */
	const name = req.get("name") || people_.join(", ").replace("'", '"'),
		/**
		 * An array of usernames.
		 * @type {String[]}
		 */
		people_ = JSON.parse(req.get("people"));

	if (people_.length <= 0) return res.sendStatus(422);

	const client = await pool.connect();
	try {
		// Get user UUIDs
		/**
		 * An array of UUIDs
		 * @type {String[]} */
		const people = [];
		for (const username of people_) {
			const query = await client.query(
				`SELECT uid FROM users WHERE username='${username.replaceAll(
					"'",
					'"'
				)}'`
			);

			if (query.rowCount != 1)
				throw new Error(`UUID not found for user '${username}'`);

			people.push(query.rows[0]?.uid);
		}

		if (people.length <= 0) return res.sendStatus(422);

		// Add chat to chats table
		const cuid = genUuid();
		await client.query(
			`INSERT INTO chats(uid, name, people) VALUES ('${cuid}'::UUID, '${name}', ARRAY['${people.join(
				"', '"
			)}']::UUID[])`
		);

		// Add chat to everyone's chats column
		for (const uuid of people) {
			// Ensure that the whole program doesn't crash if one user fails
			try {
				await client.query(
					`UPDATE users SET chats = chats || '${cuid}'::UUID WHERE uid='${uuid}'`
				);
			} catch (e) {
				console.error(
					`User '${uuid}' couldn't be added to chat '${cuid}'.`
				);
				console.error(e);
			}
		}

		res.sendStatus(204);
	} catch (e) {
		console.error(e);
		res.sendStatus(500);
	} finally {
		// ALWAYS release client
		client.release();
	}
});

module.exports = router;
