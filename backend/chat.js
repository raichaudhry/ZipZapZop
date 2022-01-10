const authChat = require("./functions/authChat");
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

		cuid = cuid.replace("'", '"');
		id = id.replace("'", '"');
		pass = pass.replace("'", '"');
		key = key.replace('"', "'");

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
		cuid = cuid.replace("'", '"');
		uuid = uuid.replace("'", '"');
		pass = pass.replace("'", '"');
		key = key.replace('"', "'");
		newValue = newValue.replace("'", '"');

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
	const decodeAscii = ascii => String.fromCodePoint(...ascii.split(" "));
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

	const client = await pool.connect();
	try {
		cuid = cuid.replace("'", '"');
		uuid = uuid.replace("'", '"');
		password = password.replace("'", '"');
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

module.exports = router;
