import "./modules/components.js";
import db from "./modules/database.js";
import Cookie from "./modules/Cookie.js";
import auth from "./modules/auth.js";
import { decrypt } from "./modules/encryptor.js";

const login = () => /*location.href = "./login"*/ undefined;

const username = Cookie.get("username").value;
if (username == undefined || username == "") login();

(async () => {
	const password = decrypt(Cookie.get("password").value);
	if (password == undefined || password == "") login();

	// Auth
	if (!auth(username, password, true)) login();
	else {
		// Do stuff
		alert("Hi!");
	}
})();
