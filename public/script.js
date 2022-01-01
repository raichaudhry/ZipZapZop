import components from "./modules/components.js";
import db from "./modules/db/database.js";
import Cookie from "./modules/Cookie.js";
import auth from "./modules/db/auth.js";
import { encrypt, decrypt } from "./modules/encryptor.js";
import user from "./modules/db/user.js";
import ChatView from "./components/ChatView/main.js";

const login = () => location.replace("./login");

const username = Cookie.get("username").value;
if (username == undefined || username == "") login();

const main = async () => {
	const cookies = {};
	cookies.username = Cookie.get("username");
	cookies.password = Cookie.get("password");

	const username = cookies.username.value;
	const password = decrypt(cookies.password.value);

	cookies.uuid = Cookie.get("uuid") || Cookie.set({ name: "uuid", value: await user(username, password, "uid", undefined, true) })[0];

	const uuid = cookies.uuid.value;
	const chats = (await user(username, password, "chats", undefined, true)) || {};

	for (const cuid of chats) {
		const req = await fetch(`/db/chats/${cuid}/${uuid}/${encrypt(password)}/`);
		if (req.status < 200 || req.status >= 300) continue;

		const data = await req.json();
		const chatListElem = new components.ChatListElement(data.name, data.uid, "/assets/chatIcon.svg");

		chatListElem.addEventListener(
			"open-chat",
			/** @param {CustomEvent} e */ async e => {
				const chatView = new ChatView(cuid);
				chatView.setAttribute("open", "");
				document.body.appendChild(chatView);
			}
		);

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
