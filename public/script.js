import components from "./modules/components.js";
import Cookie from "./modules/Cookie.js";
import auth from "./modules/db/auth.js";
import { encrypt, decrypt } from "./modules/encryptor.js";
import user from "./modules/db/user.js";
import ChatView from "./components/ChatView/main.js";
import CreateChat from "./components/CreateChat/main.js";
import Modal from "./components/Modal/main.js";
import chat from "./modules/db/chat.js";

try {
	const cookies = {};
	cookies.username = Cookie.get("username");
	cookies.password = Cookie.get("password");

	const login = async () => {
		location.replace("./login");
	};

	const main = async () => {
		// Set up chats
		const username = cookies.username.value;
		const password = cookies.password.value;

		// Get the uuid cookie, or set it.
		cookies.uuid =
			Cookie.get("uuid") ??
			Cookie.set({
				name: "uuid",
				value: await user(username, password, "uid", undefined, true),
			})[0];

		const uuid = cookies.uuid.value;

		// Handle creating new chats
		document.getElementById("compose")?.addEventListener("click", _ => {
			const elem = new CreateChat(),
				modal = new Modal("Compose", elem);

			modal.addEventListener("zopModalClose", _ => modal.remove());
			modal.open();
			document.body.appendChild(modal);

			elem.addEventListener(
				"zopCreateChatSubmit",
				({ detail: { worked } }) => {
					if (worked) modal.close();
					else alert("Something went wrong");
				}
			);
		});

		// Poll for new chats
		let foundChats = [];
		const pollChats = async () => {
			const chats = (await user(uuid, password, "chats")) ?? [];

			for (const cuid of chats) {
				if (foundChats.indexOf(cuid) !== -1) continue;
				else foundChats.push(cuid);

				const data = await chat(cuid, uuid, password);
				if (!data) {
					console.warn(`No data found for chat ${cuid}`);
					continue;
				}

				const chatListElem = new components.ChatListElement(
					data.name,
					data.uid,
					data.iconUrl ?? "/assets/chatIcon.svg"
				);

				chatListElem.addEventListener(
					"open-chat",
					/** @param {CustomEvent} e */ async e => {
						const chatView = new ChatView(
							e.detail.cuid,
							e.detail.name
						);
						chatView.setAttribute("open", "");
						document.body.appendChild(chatView);
					}
				);

				document.getElementById("chat-list").appendChild(chatListElem);
			}
			setTimeout(pollChats, 1000);
		};
		pollChats();

		// Log out
		const logout = document
			.getElementById("hamburger")
			.shadowRoot.getElementById("logout");
		logout.addEventListener("click", _e => {
			const cookies = ["uuid", "username", "password"];
			cookies.forEach(cookieName => Cookie.get(cookieName)?.delete());
			login();
		});
	};

	(async () => {
		if (cookies.username == undefined || cookies.password == undefined)
			login();

		// Auth
		if (!(await auth(cookies.username.value, cookies.password.value, true)))
			login();
		else main();
	})();
} catch (e) {
	alert("There was an error. This page will reload automatically. \n${e}");
	location.reload();
}
