import components from "./modules/components.js";
import Cookie from "./modules/Cookie.js";
import auth from "./modules/db/auth.js";
import { encrypt, decrypt } from "./modules/encryptor.js";
import user from "./modules/db/user.js";
import ChatView from "./components/ChatView/main.js";

const cookies = {};
cookies.username = Cookie.get("username");
cookies.password = Cookie.get("password");

const login = async () => {
	location.replace("./login");
};

const main = async () => {
	const username = cookies.username.value;
	const password = cookies.password.value;

	cookies.uuid = Cookie.get("uuid") || Cookie.set({ name: "uuid", value: await user(username, password, "uid", undefined, true) })[0];

	const uuid = cookies.uuid.value;
	const chats = (await user(username, password, "chats", undefined, true)) || [];

	for (const cuid of chats) {
		const req = await fetch(`/db/chats/${cuid}/${uuid}/${password}/`);
		if (req.status < 200 || req.status >= 300) continue;

		const data = await req.json();
		const chatListElem = new components.ChatListElement(data.name, data.uid, "/assets/chatIcon.svg");

		chatListElem.addEventListener(
			"open-chat",
			/** @param {CustomEvent} e */ async e => {
				const chatView = new ChatView(e.detail.cuid, e.detail.name);
				chatView.setAttribute("open", "");
				document.body.appendChild(chatView);
			}
		);

		document.getElementById("chat-list").appendChild(chatListElem);
	}
};

(async () => {
	if (cookies.username == undefined || cookies.password == undefined) login();

	// Auth
	if (!(await auth(cookies.username.value, cookies.password.value, true))) login();
	else main();
})();
