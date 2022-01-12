import Error from "../Error/main.js";

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
	 * @property {String} sender The uuid of the user who sent the message
	 * @property {String} content The content of the message
	 * @property {Number} timeSent The time the message was sent, taken from `Date.now()`
	 * @property {Number} serverTime The time the message was sent, taken from the server.
	 * @property {String} original The original message
	 * @property {Boolean} deleted Was the message deleted?
	 */
	/** @param {message} msg */
	constructor(msg) {
		super();

		const content = document.createElement("div");
		content.id = "content";
		content.textContent = msg.content ?? "<zop-error>Message failed to load</zop-error>";

		const author = document.createElement("div");

		this.appendChild(content);

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-message-template");
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {}
}
customElements.define("chat-message", Message);
export default Message;
