import components from "./modules/components.js";
import db from "./modules/db/database.js";
import Cookie from "./modules/Cookie.js";
import auth from "./modules/db/auth.js";
import { encrypt, decrypt } from "./modules/encryptor.js";
import user from "./modules/db/user.js";

const login = () => /*location.href = "./login"*/ undefined;

const username = Cookie.get("username").value;
if (username == undefined || username == "") login();

const main = async () => {
	const cookies = {};
	cookies.username = Cookie.get("username");
	cookies.password = Cookie.get("password");
	const username = cookies.username.value;
	const password = decrypt(cookies.password.value);
	const uuid = await user(username, password, "uid", undefined, true);
	const chats = (await user(username, password, "chats", undefined, true)) || {};
	for (const chat of chats) {
		const req = await fetch(`/db/chats/${chat}/${uuid}/${encrypt(password)}/`);
		if (req.status < 200 || req.status >= 300) continue;
		const data = await req.json();
		const chatListElem = new components.ChatListElement(data.name, data.uid, "/assets/chatIcon.svg");
		document.getElementById("chat-list").appendChild(chatListElem);
	}
};

(async () => {
	const password = decrypt(Cookie.get("password").value);
	if (password == undefined || password == "") login();

	// Auth
	if (!auth(username, password, true)) login();
	else main();
})();
