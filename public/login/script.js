import Cookie from "../modules/Cookie.js";
import auth from "../modules/db/auth.js";
import login from "./login.js";
import { decrypt, encrypt } from "../modules/encryptor.js";

const cookies = {
	uid: Cookie.get("uuid"),
	username: Cookie.get("username"),
	pass: Cookie.get("password"),
};

if ((cookies.uid || cookies.username) && cookies.pass && (await auth(cookies.uid?.value ?? cookies.username?.value, cookies.pass.value, cookies.uid?.value ? false : true))) finishLogin(); // Already logged in

/** @type {HTMLFormElement} */
const form = document.getElementById("form"),
	/** @type {HTMLInputElement} */
	usernameInput = document.getElementById("username"),
	/** @type {HTMLInputElement} */
	passInput = document.getElementById("password");

form.addEventListener("submit", async () => {
	const username = usernameInput.value,
		password = encrypt(passInput.value);
	if ((await auth(username, password, true)) && (await login(username, password))) {
		document.getElementById("error").innerHTML = "";

		// Redirect to original page.
		location.replace("/" + (new URLSearchParams(document.location.search).get("from") ?? ""));
	} else {
		document.getElementById("error").innerHTML = "Incorrect username or password.";
	}
});
