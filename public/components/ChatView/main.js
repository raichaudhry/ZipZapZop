import Cookie from "../../modules/Cookie.js";
import Message from "./message/main.js";

const PATH = "/components/ChatView/";
if (!document.getElementById("x-chat-view-template")) {
	let template = document.createElement("template");
	template.id = "x-chat-view-template";
	template.innerHTML = `
	<link rel="stylesheet" href="${PATH}/style.css">
	<slot></slot>`;
	document.body.appendChild(template);
}

class ChatView extends HTMLElement {
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
	connectedCallback() {
		this.loadMessages();
	}
	async loadMessages() {
		const uuid = Cookie.get("uuid").value,
			password = Cookie.get("password").value;
		const res = await fetch(`/db/chats/${this.cuid}/${uuid}/${password}/messages`);

		/**
		 * @typedef {Object} message
		 * @property {String} sender The uuid of the user who sent the message
		 * @property {String} message The content of the message
		 * @property {Number} timeSent The time the message was send, taken from `Date.now()`
		 * @property {String} og The original message
		 * @property {Boolean} deleted Was the message deleted?
		 */

		/** @type {message} */
		const messages = (await res.json()).messages;

		for (const message of messages) {
			const elem = new Message(message.message);
			this.appendChild(elem);
		}
	}
}
customElements.define("chat-view", ChatView);
export default ChatView;
