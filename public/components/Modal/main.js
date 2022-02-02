const PATH = "/components/Modal/";
if (!document.getElementById("x-zop-modal-template")) {
	let template = document.createElement("template");
	template.id = "x-zop-modal-template";
	template.innerHTML = `<link rel="stylesheet" href="${PATH}/style.css" />
	<div id="modal">
		<slot name="title" id="title"></slot>
		<slot name="content" id="content"></slot>
		<button class="material-icons-round" id="close">close</button>
	</div>`;
	document.body.appendChild(template);
}

class Modal extends HTMLElement {
	// state variable
	get state() {
		return this.hasAttribute("data-open") ? "open" : "closed";
	}
	get isOpen() {
		return this.state == "open";
	}
	get isClosed() {
		return this.state == "closed";
	}

	// Close/open event
	event = (() => {
		const self = this;
		return {
			get close() {
				return new CustomEvent("zopModalClose", {
					detail: {
						elem: self.shadowRoot.host,
					},
					composed: true,
					bubbles: false,
				});
			},
			get open() {
				return new CustomEvent("zopModalOpen", {
					detail: {
						elem: self.shadowRoot.host,
					},
					composed: true,
					bubbles: false,
				});
			},
			get change() {
				return new CustomEvent("zopModalStateChange", {
					composed: true,
					bubbles: false,
					detail: {
						elem: self.shadowRoot.host,
						newState: self.state,
						isOpen: self.isOpen,
						isClosed: self.isClosed,
					},
				});
			},
		};
	})();

	// Modal (wrapper) div
	get modal() {
		return this.shadowRoot.getElementById("modal");
	}

	/**
	 * Make a modal to show content to the user.
	 * @param {String} title The header of the modal.
	 * @param {String|Node} content The HTML to be shown in the modal.
	 */
	constructor(title, content) {
		super();

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-zop-modal-template");
		shadowRoot.appendChild(template.content.cloneNode(true));

		// Make elements if the parameters exist
		if (title != undefined) {
			const header = document.createElement("h1");
			header.textContent = title;
			header.slot = "title";
			this.appendChild(header);
		}
		if (content != undefined) {
			const div = document.createElement("div");

			// Change innerHTML if `content` is a `string`, or append the node if it is a `Node`
			if (content instanceof String) div.innerHTML = content;
			else if (content instanceof Node) this.modal.appendChild(content);

			div.slot = "content";
			this.appendChild(div);
		}
	}
	connectedCallback() {
		// Resize font
		const style = document.createElement("style");
		style.innerHTML = `#close {
				font-size: ${getComputedStyle(this.modal).fontSize.split("px")[0] * 1.5}px;
			}`;
		this.appendChild(style);

		// Add event listeners
		this.shadowRoot
			.getElementById("close")
			.addEventListener("click", _ => this.close());
	}
	open() {
		this.shadowRoot.host.setAttribute("data-open", "");
		this.dispatchEvent(this.event.open);
		this.dispatchEvent(this.event.change);
	}
	close() {
		this.shadowRoot.host.removeAttribute("data-open");
		this.dispatchEvent(this.event.close);
		this.dispatchEvent(this.event.change);
	}
}
customElements.define("zop-modal", Modal);
export default Modal;
