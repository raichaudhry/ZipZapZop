const router = require("express").Router();

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
			await client.query(
				`UPDATE chats SET messages=messages || $1 WHERE uid='${cuid}'`,
				[[msg]]
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

module.exports = router;
