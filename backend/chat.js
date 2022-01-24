const authChat = require("./functions/authChat");
const { decodeAscii } = require("./functions/ascii");
const { v4: genUuid } = require("uuid");

const { Pool, options } = require("./poolOptions");
const pool = new Pool(options);

const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.text());

// Get value
router.get("/db/chats/:cuid/:id/:pass/:key", async (req, res) => {
	// cuid = chat uid, uuid = user uid
	let { cuid, id, pass, key } = req.params;
	const client = await pool.connect();
	try {
		const username = id.indexOf("username-") === 0;
		if (username) id = id.replace("username-", "");

		cuid = cuid.replaceAll("'", '"');
		id = id.replaceAll("'", '"');
		pass = pass.replaceAll("'", '"');
		key = key.replaceAll('"', "'");

		// Check user authorization
		if (!authChat(cuid, id, pass)) res.status(403).send("");
		else {
			const query = await client.query(`SELECT ${key === "*" ? "*" : `"${key}"`} FROM chats WHERE ${username ? "username" : "uid"}='${cuid}'`);
			res.send(JSON.stringify(query.rows[0]));
		}
	} catch (e) {
		console.error(e);
	} finally {
		// ALWAYS release client.
		client.release();
	}
});
// Redirect to get everything if there isn't a key.
router.get("/db/chats/:cuid/:uuid/:pass/", (req, res) => {
	const { cuid, uuid, pass } = req.params;
	res.redirect(`/db/chats/${cuid}/${uuid}/${pass}/*`);
});

// Set value
router.put("/db/write/chats/:cuid/:uuid/:pass/:key/:newValue", async (req, res) => {
	// cuid = chat uid, uuid = user uid
	let { cuid, uuid, pass, key, newValue } = req.params;
	const client = await pool.connect();
	try {
		cuid = cuid.replaceAll("'", '"');
		uuid = uuid.replaceAll("'", '"');
		pass = pass.replaceAll("'", '"');
		key = key.replaceAll('"', "'");
		newValue = newValue.replaceAll("'", '"');

		// Check user authorization
		if (!authChat(cuid, uuid, pass)) res.status(403).send("");
		else {
			await client.query(`UPDATE chats SET "${key}"='${newValue}' WHERE uid='${cuid}'`);
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
router.put("/db/write/send-message", async (req, res) => {
	/**
	 * @typedef {Object} message
	 * @property {String} sender The uuid of the user who sent the message
	 * @property {String} content The content of the message
	 * @property {Number} timeSent The time the message was sent, taken from `Date.now()`
	 * @property {Number} serverTime The time the message was sent, taken from the server.
	 * @property {String} original The original message
	 * @property {Boolean} deleted Was the message deleted?
	 */
	let { cuid, uuid, password, msg: msg_ } = req.headers;

	// Ensure that `msg_` is JSON
	try {
		JSON.parse(msg_);
	} catch (e) {
		return res.sendStatus(415);
	}

	/** @type {message} */
	const msg = JSON.parse(msg_);

	// Add MUID to the message
	msg.muid = genUuid();

	const client = await pool.connect();
	try {
		cuid = cuid.replaceAll("'", '"');
		uuid = uuid.replaceAll("'", '"');
		password = password.replaceAll("'", '"');
		msg.content = decodeAscii(msg.content);

		// Check user authorization
		if (!authChat(cuid, uuid, password)) res.sendStatus(403);
		else {
			// Update database
			await client.query(`UPDATE chats SET messages=messages || $1 WHERE uid='${cuid}'`, [[msg]]);
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
			const query = await client.query(`SELECT uid FROM users WHERE username='${username.replaceAll("'", '"')}'`);

			if (query.rowCount != 1) throw new Error(`UUID not found for user '${username}'`);

			people.push(query.rows[0]?.uid);
		}

		if (people.length <= 0) return res.sendStatus(422);

		// Add chat to chats table
		const cuid = genUuid();
		await client.query(`INSERT INTO chats(uid, name, people) VALUES ('${cuid}'::UUID, '${name}', ARRAY['${people.join("', '")}']::UUID[])`);

		// Add chat to everyone's chats column
		for (const uuid of people) {
			// Ensure that the whole program doesn't crash if one user fails
			try {
				await client.query(`UPDATE users SET chats = chats || '${cuid}'::UUID WHERE uid='${uuid}'`);
			} catch (e) {
				console.error(`User '${uuid}' couldn't be added to chat '${cuid}'.`);
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
