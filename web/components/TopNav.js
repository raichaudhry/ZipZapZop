class TopNav extends HTMLElement {
	constructor() {
		super();
		this.classList.add("horizontal-nav");
		this.addStylesheets();
		this.setAttribute("role", "nav");
		this.resetBoxShadow();

		this.parentElement.addEventListener("scroll", this.resetBoxShadow.bind(this));
	}
	connectedCallback() {
		this.oldMarginTop = this.parentElement.style.marginTop;
		this.parentElement.style.marginTop = `${this.getBoundingClientRect().height}px`;
	}
	disconnectedCallback() {
		this.parentElement.style.marginTop = `${this.oldMarginTop}`;
	}
	resetBoxShadow() {
		if (this.parentElement.scrollTop <= 0) this.style.boxShadow = "var(--box-shadow-smallest)";
		else this.style.boxShadow = "var(--box-shadow-default)";
	}
	addStylesheets() {
		const style = document.createElement("style");
		style.innerHTML = `
		.horizontal-nav {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			position: fixed;
			top: 0;
			left: 0;
			right: 0;

			padding: var(--padding-default);

			box-shadow: var(--box-shadow-default);
		}
		.horizontal-nav > * {
			vertical-align: middle;
		}`;
		document.head.appendChild(style);
	}
}
customElements.define("top-nav", TopNav);
export default TopNav;
