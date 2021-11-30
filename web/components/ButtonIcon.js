class ButtonIcon extends HTMLElement {
	constructor() {
		super();
		this.classList.add("icon");
		this.tabIndex = "0";
		this.setAttribute("role", "button");
		this.addEventListener("keyup", e => {
			if (e.key == " " || e.key == "Enter" || e.key == "Return") this.dispatchEvent(new Event("click"));
		});
	}
	addStylesheets() {
		const style = document.createElement("style");
		style.innerHTML = `
		.icon {
			background-size: 100%;
			background-position: center;
			background-color: transparent;

			border: none;

			width: var(--icon-size);
			height: var(--icon-size);
		}`;
		document.head.appendChild(style);
	}
}
customElements.define("button-icon", ButtonIcon);
export default ButtonIcon;
