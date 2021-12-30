const PATH = "/components/ChatView/";
if (!document.getElementById("x-chat-view-template")) {
	let template = document.createElement("template");
	template.id = "x-chat-view-template";
	template.innerHTML = `<link rel="stylesheet" href="${PATH}/style.css">`;
	document.body.appendChild(template);
}

class ChatView extends HTMLElement {
	constructor(id = (() => console.error("ChatView needs `id`"))()) {
		super();

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-chat-view-template");
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {}
}
export default ChatView;
