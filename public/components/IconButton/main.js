const PATH = "/components/IconButton/";
if (!document.getElementById("x-icon-button-template")) {
	let template = document.createElement("template");
	template.id = "x-icon-button-template";
	template.innerHTML = `<link rel="stylesheet" href="${PATH}/style.css" />
	<button>
		<slot name="icon"></slot>
		<slot name="label"></slot>
	</button>`;
	document.body.appendChild(template);
}

class IconButton extends HTMLElement {
	constructor(iconName, label, options = { materialIconType: "round" }) {
		super();

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-icon-button-template");
		shadowRoot.appendChild(template.content.cloneNode(true));

		this.iconName = iconName;
		this.label = label;
		this.options = options;

		this.options.materialIconType =
			this.options.materialIconType ?? "round";
	}
	setElements() {
		if (this.iconName) {
			const icon = document.createElement("span");
			icon.slot = "icon";
			icon.innerHTML = this.iconName;
			icon.classList.add(
				this.options.materialIconType != "filled"
					? `material-icons-${this.options.materialIconType}`
					: "material-icons"
			);
			this.appendChild(icon);
		}
		if (this.label) {
			const label = document.createElement("span");
			label.slot = "label";
			label.innerHTML = this.label;
			this.appendChild(label);
		}
	}
	connectedCallback() {
		// Load material icons
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = `https://fonts.googleapis.com/icons?family=Material+Icons+${
			this.options.materialIconType ?? "round"
		}|Material+Icons`;
		document.head.appendChild(link);
	}
}
customElements.define("icon-button", IconButton);
export default IconButton;
