const removeQuotes = require("./functions/removeQuotes");
const authChat = require("./functions/authChat");

const { Pool } = require("pg");
const pool = new Pool({ port: 5433 });

const express = require("express");
const auth = require("./functions/auth");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.text());

router.get("/db/chats/:cuid/:uuid/:pass/:key", async (req, res) => {
	// cuid = chat uid, uuid = user uid
	let { cuid: cuid_, uuid: uuid_, pass: pass_, key: key_ } = req.params;
	const client = await pool.connect();
	try {
		const { cuid_: cuid, uuid_: uuid, pass_: pass, key_: key } = removeQuotes({ cuid_, uuid_, pass_, key_ });

		// Check user authorization
		if (!authChat(cuid, uuid, pass)) res.status(403).send("");
		else {
			const query = await client.query(`SELECT ${key === "*" ? "*" : `'${key}'`} FROM chats WHERE uid='${cuid}'`);
			res.send(JSON.stringify(query.rows[0]));
		}
	} finally {
		// ALWAYS release client.
		client.release();
	}
});
// Redirect to get everything if there isn't a key.
router.get("/db/chats/:cuid/:uuid/:pass/", async (req, res) => {
	const { cuid, uuid, pass } = req.params;
	res.redirect(`/db/chats/${cuid}/${uuid}/${pass}/*`);
});

module.exports = router;
