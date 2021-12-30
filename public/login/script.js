import database from "../modules/database.js";
import Cookie from "../modules/Cookie.js";
import auth from "../modules/auth.js";
import { encrypt } from "../modules/encryptor.js";

const uid = Cookie.get("uid");
const pass = Cookie.get("pass");
if (uid && pass && database.auth(uid, pass)) {
	// Logged in
	location.href = "/";
}
/** @type {HTMLFormElement} */
const form = document.getElementById("form"),
	/** @type {HTMLInputElement} */
	usernameInput = document.getElementById("username"),
	/** @type {HTMLInputElement} */
	passInput = document.getElementById("password");
form.addEventListener("submit", async () => {
	const username = usernameInput.value,
		password = passInput.value;
	if (auth(username, password, true)) {
		Cookie.set(
			{
				name: "username",
				value: username,
				options: {
					path: "/",
				},
			},
			{
				name: "password",
				value: encrypt(password),
				options: {
					path: "/",
				},
			}
		);
		location.href = "/" + (new URLSearchParams(location.href).get("from") || "");
	} else {
		document.getElementById("error").innerHTML = "Incorrect username or password.";
	}
});
