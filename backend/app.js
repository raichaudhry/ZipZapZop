const user = require("./user");
const express = require("express");
const chat = require("./chat");
const auth = require("./auth");
const app = express();
const port = 8080;

app.listen(port, () => console.log(`Zip Zap Zop starting on port ${port}.`));

app.use(express.static("/ZipZapZop/public"));

app.use(user);
app.use(chat);
app.use(auth);

// Get date from server
app.get("/date", (_req, res) => res.send(`${Date.now()}`));

// HTTP 418 Easter Egg
app.get("/coffee", (_req, res) => {
	res.status(418).send(`
	<title>HTTP 418: I'm a teapot</title>
	<h1>HTTP Error 418: I'm a teapot</h1>
	Sorry, you can't get coffee here. See the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418">MDN</a> page, the <a href="https://en.wikipedia.org/wiki/Hyper_Text_Coffee_Pot_Control_Protocol">Wikipedia</a> page, and <a href="https://datatracker.ietf.org/doc/html/rfc2324#section-2.3.2">RFC 2324</a> to learn more.`);
});
