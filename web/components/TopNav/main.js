const PATH = "/web/components/TopNav/";
if (!document.getElementById("x-top-nav-template")) {
	let template = document.createElement("template");
	template.id = "x-top-nav-template";
	template.innerHTML = `
	<link rel="stylesheet" href="${PATH}/style.css">
	<slot></slot>
	`;
	document.body.appendChild(template);
}

class TopNav extends HTMLElement {
	constructor() {
		super();
		this.setAttribute("role", "nav");

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-top-nav-template");
		shadowRoot.appendChild(template.content.cloneNode(true));

		this.resetBoxShadow();
		this.parentElement.addEventListener("scroll", this.resetBoxShadow.bind(this));
	}
	connectedCallback() {
		setTimeout(() => {
			this.oldMarginTop = this.parentElement.style.marginTop;
			this.parentElement.style.marginTop = `${this.getBoundingClientRect().height}px`;
		}, 50);
	}
	disconnectedCallback() {
		this.parentElement.style.marginTop = `${this.oldMarginTop}`;
	}
	resetBoxShadow() {
		if (this.parentElement.scrollTop <= 0) this.style.boxShadow = "var(--box-shadow-smallest)";
		else this.style.boxShadow = "var(--box-shadow-default)";
	}
}
customElements.define("top-nav", TopNav);
export default TopNav;
