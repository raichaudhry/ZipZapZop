const { Pool, options } = require("./poolOptions");
const pool = new Pool(options);
const express = require("express");
const app = express();
const port = 8080;

app.listen(port, () => console.log(`Messaging App starting on port ${port}.`));

app.use(express.static("/Messaging App/public"));
(async () => {
	const client = await pool.connect();
	try {
		const query = await client.query("SELECT tablename FROM pg_tables WHERE tablename !~ '(pg)|(sql).*';");
		if (query.rows.length == 0) app.get((req, res) => res.status(500).send("There was an error. Please try again later. "));
	} catch (err) {
		console.error(`${err}`);
		client.release();
	}
})();

const user = require("./user");
app.use(user);

const chat = require("./chat");
app.use(chat);

const auth = require("./functions/auth");
// Get by username
app.get("/auth/username-:username/:pass", async (req, res) => {
	const { username, pass } = req.params;
	const result = await auth(username, pass, true);
	if (result) res.sendStatus(200);
	else res.sendStatus(403);
});
// Get by uid
app.get("/auth/:uid/:pass", async (req, res) => {
	const { uid, pass } = req.params;
	const result = await auth(uid, pass);
	if (result) res.sendStatus(200);
	else res.sendStatus(403);
});

// Get date from server
app.get("/date", (_req, res) => res.send(`${Date.now()}`));

// HTTP 418 Easter Egg
app.get("/coffee", (_req, res) => {
	res.status(418).send(`
	<title>HTTP 418: I'm a teapot</title>
	<h1>HTTP Error 418</h1>
	Sorry, you can't get coffee here. This server is a teapot. See the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418">MDN</a> page, the <a href="https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol">Wikipedia</a> page, and <a href="https://datatracker.ietf.org/doc/html/rfc2324#section-2.3.2">RFC 2324</a> to learn more.`);
});
