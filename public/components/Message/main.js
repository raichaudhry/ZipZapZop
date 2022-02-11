import Cookie from "../../modules/Cookie.js";
import user from "../../modules/db/user.js";
import _Error from "../Error/main.js";

const PATH = "/components/Message";
if (!document.getElementById("x-message-template")) {
	let template = document.createElement("template");
	template.id = "x-message-template";
	template.innerHTML = `
	<link rel="stylesheet" href="${PATH}/style.css">
	<slot></slot>`;
	document.body.appendChild(template);
}

class Message extends HTMLElement {
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
	/** @param {message} msg */
	constructor(msg) {
		super();

		this.msg = msg;

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-message-template");
		shadowRoot.appendChild(template.content.cloneNode(true));

		// Set id of `chat-message`
		this.shadowRoot.host.id = `zop-message-${msg.muid}`;

		const content = document.createElement("div");
		content.id = "content";
		if (msg.content) content.textContent = msg.content;
		else
			content.innerHTML = "<zop-error>Message failed to load</zop-error>";

		const author = this.shadowRoot.getElementById("author");
		fetch("/db/user/username", { uid: msg.author }).then(authorUsername => {
			if (authorUsername) author.textContent = authorUsername;
			else
				author.innerHTML =
					"<zop-error>No author found for message.</zop-error>";

			this.shadowRoot.appendChild(content);
			this.shadowRoot.appendChild(author);
		});
	}
	async connectedCallback() {
		this.shadowRoot.host.id = `msg-${this.msg.muid}`;
	}
}
customElements.define("chat-message", Message);
export default Message;
