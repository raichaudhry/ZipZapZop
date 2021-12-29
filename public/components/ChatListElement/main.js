const PATH = "/components/ChatListElement/";
if (!document.getElementById("x-chat-list-element-template")) {
	let template = document.createElement("template");
	template.id = "x-chat-list-element-template";
	template.innerHTML = `
	<link rel="stylesheet" href="${PATH}/style.css">
	<slot name='icon'></slot>
	<slot name='title'></slot>
	`;
	document.body.appendChild(template);
}

/** A custom HTML element for the element in the list that represents a chat. */
class ChatListElement extends HTMLElement {
	/**
	 * @param {string} name The name of the chat.
	 * @param {string} iconSrc The URL of the chat icon.
	 */
	constructor(name, id, iconSrc) {
		super();

		if (name) {
			let title = document.createElement("h1");
			title.slot = "title";
			title.textContent = name;
			this.appendChild(title);
		}
		if (iconSrc) {
			let icon = document.createElement("img");
			icon.slot = "icon";
			icon.src = iconSrc;
			this.appendChild(icon);
		}

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-chat-list-element-template");
		shadowRoot.appendChild(template.content.cloneNode(true));

		this.addEventListener("click", () => {
			const event = new CustomEvent("open-chat", { bubbles: true, composed: true, detail: { id } });
			this.dispatchEvent(event);
		});
	}
	connectedCallback() {}
}
customElements.define("chat-list-element", ChatListElement);
export default ChatListElement;
