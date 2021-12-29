/// CSS Hooks: --bg-image for the background image of the button.

const PATH = "/components/ButtonIcon/";
if (!document.getElementById("x-button-icon-template")) {
	let buttonIconTemplate = document.createElement("template");
	buttonIconTemplate.id = "x-button-icon-template";
	buttonIconTemplate.innerHTML = `<link rel="stylesheet" href="${PATH}/style.css">`;
	document.body.appendChild(buttonIconTemplate);
}

class ButtonIcon extends HTMLElement {
	constructor() {
		super();
		this.tabIndex = "0";
		this.setAttribute("role", "button");
		this.addEventListener("keyup", e => {
			if (e.key == " " || e.key == "Enter" || e.key == "Return") this.dispatchEvent(new Event("click"));
		});

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-button-icon-template");
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
}
customElements.define("button-icon", ButtonIcon);
export default ButtonIcon;
