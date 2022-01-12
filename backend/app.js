const { Pool, options } = require("./poolOptions");
const pool = new Pool(options);
const user = require("./user");
const express = require("express");
const chat = require("./chat");
const auth = require("./functions/auth");
const app = express();
const port = 8080;

app.listen(port, () => console.log(`Zip Zap Zop starting on port ${port}.`));

app.use(express.static("/ZipZapZop/public"));

app.use(user);
app.use(chat);

// Get by username
app.get("/auth/username-:username/:pass", async (req, res) => {
	const { username, pass } = req.params;
	if (await auth(username, pass, true)) res.sendStatus(200);
	else res.sendStatus(403);
});
// Get by uid
app.get("/auth/:uid/:pass", async (req, res) => {
	const { uid, pass } = req.params;
	if (await auth(uid, pass)) res.sendStatus(200);
	else res.sendStatus(403);
});

// Get date from server
app.get("/date", (_req, res) => res.send(`${Date.now()}`));

// HTTP 418 Easter Egg
app.get("/coffee", (_req, res) => {
	res.status(418).send(`
	<title>HTTP 418: I'm a teapot</title>
	<h1>HTTP Error 418: I'm a teapot</h1>
	Sorry, you can't get coffee here. See the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418">MDN</a> page, the <a href="https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol">Wikipedia</a> page, and <a href="https://datatracker.ietf.org/doc/html/rfc2324#section-2.3.2">RFC 2324</a> to learn more.`);
});
