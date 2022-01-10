import Cookie from "../modules/Cookie.js";
import auth from "../modules/db/auth.js";
import { decrypt, encrypt } from "../modules/encryptor.js";

const cookies = {
	uid: Cookie.get("uuid"),
	pass: Cookie.get("password"),
};
if (cookies.uid && cookies.pass && auth(cookies.uid.value, decrypt(cookies.pass.value))) {
	// Logged in
	location.replace("/");
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
