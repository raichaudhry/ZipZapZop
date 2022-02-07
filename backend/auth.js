const auth = require("./functions/auth");

const express = require("express");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.text());

router.get("/auth", async (req, res) => {
	const { username, uid, password } = req.headers;
	if (uid) {
		// Auth by uid
		if (await auth(uid, password)) res.sendStatus(200);
		else res.sendStatus(401);
	} else if (username) {
		// Auth by username
		if (await auth(username, password, true)) res.sendStatus(200);
		else res.sendStatus(401);
	} else {
		res.sendStatus(400);
	}
});

module.exports = router;
