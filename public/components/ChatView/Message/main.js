const PATH = "/components/ChatView/Message";
if (!document.getElementById("x-message-template")) {
	let template = document.createElement("template");
	template.id = "x-message-template";
	template.innerHTML = `
	<link rel="stylesheet" href="${PATH}/style.css">
	<slot></slot>`;
	document.body.appendChild(template);
}

class Message extends HTMLElement {
	constructor(msg) {
		super();

		if (msg) {
			const span = document.createElement("span");
			span.textContent = msg;
			this.appendChild(span);
		}

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
