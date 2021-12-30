const express = require("express");
const app = express();
const port = 8080;

app.use(express.static("../public"));

app.listen(port, () => console.log(`Messaging App starting on port ${port}.`));

const user = require("./user");
app.use(user);

const auth = require("./auth");
// Get by username
app.get("/auth/username-:username/:pass", async (req, res) => {
	const { username, pass } = req.params;
	const result = await auth(username, pass, true);
	if (result) res.status(200).send("");
	else res.status(403).send("");
});
// Get by uid
app.get("/auth/:uid/:pass", async (req, res) => {
	const { uid, pass } = req.params;
	const result = await auth(uid, pass);
	if (result) res.status(200).send("");
	else res.status(403).send("");
});
