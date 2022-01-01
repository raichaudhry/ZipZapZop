const authChat = require("./functions/authChat");

const { Pool } = require("pg");
const pool = new Pool({ port: 5433 });

const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.text());

router.get("/db/chats/:cuid/:uuid/:pass/:key", async (req, res) => {
	// cuid = chat uid, uuid = user uid
	let { cuid, uuid, pass, key } = req.params;
	const client = await pool.connect();
	try {
		cuid = cuid.replace("'", '"');
		uuid = uuid.replace("'", '"');
		pass = pass.replace("'", '"');
		key = key.replace('"', "'");

		// Check user authorization
		if (!authChat(cuid, uuid, pass)) res.status(403).send("");
		else {
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
