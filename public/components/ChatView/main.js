import Cookie from "../../modules/Cookie.js";
import Message from "../Message/main.js";
import user from "../../modules/db/user.js";
import { encodeAscii } from "../../modules/ascii.js";

class AuthError extends Error {
	constructor(msg) {
		super(msg);
		this.name = "AuthError";
	}
}

const PATH = "/components/ChatView/";
if (!document.getElementById("x-chat-view-template")) {
	let template = document.createElement("template");
	template.id = "x-chat-view-template";
	template.innerHTML = `
	<link rel="stylesheet" href="${PATH}/style.css">
	<slot name="messages"></slot>
	<slot name="form"></slot>

	<form id="msg-form" action="javascript:void(0)" autocomplete="off" slot="form">
		<input type="text" placeholder="Message" id="msg-input">
		<input type="submit" value="Send!">
	</form>`;
	document.body.appendChild(template);
}

class ChatView extends HTMLElement {
	/**
	 * @typedef {Object} message
	 * @property {String} muid The UUID of the message.
	 * @property {String} author The UUID of the user who sent the message
	 * @property {String} content The content of the message
	 * @property {Number} timeSent The time the message was sent, taken from `Date.now()`
	 * @property {Number} serverTime The time the message was sent, taken from the server.
	 * @property {String} original The original message
	 * @property {Boolean} deleted Was the message deleted?
	 */

	/**
	 * @param {String} cuid The UID of the chat.
	 * @param {HTMLHeadingElement} title An `<h1>` that will serve
	 */
	constructor(cuid, title) {
		super();

		this.cuid = cuid;
		this.title = title;

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-chat-view-template");
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
	async connectedCallback() {
		await this.loadMessages();

		// Add event listener
		const uuid = Cookie.get("uuid").value,
			password = Cookie.get("password").value;
		const msgForm = this.shadowRoot.getElementById("msg-form"),
			msgInput = this.shadowRoot.getElementById("msg-input");

		msgForm.addEventListener("submit", async e => {
			try {
				// Get new message content
				const msg = msgInput.value;
				msgInput.value = "";

				// Get date from server
				const date = await (async () => {
					const res = await fetch("/date");
					return Number(res.text());
				})();

				// Push to server
				const res = await fetch(`/db/write/send-message`, {
					method: "PUT",
					headers: {
						cuid: this.cuid,
						uuid,
						password,
						/** @type {message} */
						msg: JSON.stringify({
							author: uuid,
							content: encodeAscii(msg),
							timeSent: Date.now(),
							serverTime: date,
							original: encodeAscii(msg),
							deleted: false,
						}),
					},
				});
				if (res.status == 204) this.loadMessages();
				else if (res.status == 500) alert("There was an error. Try sending the message again later.");
				else alert("There was an unknown error.");
			} catch (e) {
				console.error(e);
				alert(`There was an error. \n${e}`);
			}
		});

		this.appendChild(msgForm);
	}
	async loadMessages() {
		const uuid = Cookie.get("uuid").value,
			password = Cookie.get("password").value;
		const res = await fetch(`/db/chats/${this.cuid}/${uuid}/${password}/messages`);

		if (res.status == 403) {
			throw new AuthError(`Auth failed for chat '${this.cuid}'.
			uuid: '${uuid}'
			pass: '${password}'`);
		}

		// Set the title in the nav bar
		document.getElementById("title").textContent = this.title;

		// Add messages
		/** @type {message[]} */
		const messages = (await res.json()).messages ?? [];

		// Clear all previous messages
		this.shadowRoot.host.querySelectorAll("chat-message").forEach(elem => elem.remove());

		for (const message of messages) {
			const elem = new Message(message);
			elem.slot = "messages";
			this.appendChild(elem);
		}

		// Add a placeholder if there are no messages
		if (messages.length === 0) {
			const elem = document.createElement("div");
			elem.classList.add("no-msgs");
			elem.innerHTML = "No messages :(";
			this.appendChild(elem);
		}
	}
}
customElements.define("chat-view", ChatView);
export default ChatView;
