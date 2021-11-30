class ChatIcon extends HTMLElement {
	/** @param {string} imgSrc The URL of the image. */
	constructor(imgSrc) {
		super();
		this.setAttribute("role", "img");
		this.classList.add("chat-icon");
		this.addStylesheets();

		if (imgSrc != null) {
			this.img = document.createElement("img");
			this.img.src = `/assets/${imgSrc}`;
		} else {
			this.img = this.querySelector("img");
		}
		this.innerHTML = "";
		this.appendChild(this.img);
	}
	connectedCallback() {
		if (this.img == null) {
			// Should never happen but just in case:
			this.img = this.querySelector("img");
			this.innerHTML = "";
			this.appendChild(this.img);
		}
	}
	addStylesheets() {
		const style = document.createElement("style");
		style.innerHTML = `
		.chat-icon, .chat-icon img {
			border-radius: 50%;
			width: var(--chat-icon-size);
			height: var(--chat-icon-size);
		}`;
		document.head.appendChild(style);
	}
}
customElements.define("chat-icon", ChatIcon);
export default ChatIcon;
