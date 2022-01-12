const PATH = "/components/Error";
if (!document.getElementById("x-error-template")) {
	let template = document.createElement("template");
	template.id = "x-error-template";
	template.innerHTML = `
	<link rel="stylesheet" href="${PATH}/style.css">
	<slot></slot>`;
	document.body.appendChild(template);
}

/** Display an error to the user. */
class Error extends HTMLElement {
	/** @param {String} msg The text to display to the user (NOT HTML) */
	constructor(msg) {
		super();

		const elem = document.createElement("div");
		elem.textContent = msg ?? "There was an unknown error.";
		this.appendChild(elem);

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-message-template");
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
	connectedCallback() {}
}
customElements.define("zop-error", Error);
export default Error;
