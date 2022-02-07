const PATH = "/components/SideNav/";
if (!document.getElementById("x-side-nav-template")) {
	let template = document.createElement("template");
	template.id = "x-side-nav-template";
	template.innerHTML = `<link rel="stylesheet" href="${PATH}/style.css" />
	<button class="material-icons-round" id="menu">menu</button>

	<nav id="nav">
		<ol id="list"></ol>
	</nav>`;
	document.body.appendChild(template);
}

class SideNav extends HTMLElement {
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
				return new CustomEvent("zopSideNavClose", {
					detail: {
						elem: self.shadowRoot.host,
					},
					composed: true,
					bubbles: false,
				});
			},
			get open() {
				return new CustomEvent("zopSideNavOpen", {
					detail: {
						elem: self.shadowRoot.host,
					},
					composed: true,
					bubbles: false,
				});
			},
			get change() {
				return new CustomEvent("zopSideNavStateChange", {
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

	/**
	 * Create a sidebar/menu.
	 * @param  {...Node} items The navigation items.
	 */
	constructor(...items) {
		super();

		// Shadow DOM
		this.attachShadow({ mode: "open" }).appendChild(
			document
				.getElementById("x-side-nav-template")
				.content.cloneNode(true)
		);

		// Handle slot
		items.push(...this.childNodes);

		// Add items to nav
		const list = this.shadowRoot.getElementById("list");
		this.items = items;
		for (const item of this.items) {
			const elem = document.createElement("li");
			elem.appendChild(item);
			list.appendChild(elem);
		}

		// Add event listeners
		const menu = this.shadowRoot.getElementById("menu");
		menu.addEventListener("click", _ => {
			if (this.isOpen) this.close();
			else this.open();
		});

		// BUG: it starts too far to the left before it is first opened.
		// BUG: the drop shadow is still there.
		this.close();
	}
	connectedCallback() {
		// Import material icons outside of shadow dom (chrome bug)
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href =
			"https://fonts.googleapis.com/icon?family=Material+Icons+Round";
		document.head.appendChild(link);
	}
	open() {
		const menu = this.shadowRoot.getElementById("menu");
		menu.innerHTML = "close";
		{
			// Set nav styles
			const nav = this.shadowRoot.getElementById("nav");
			nav.style.left = "0";

			const paddingTop =
				menu.getBoundingClientRect().bottom +
				this.getBoundingClientRect().top;

			nav.style.paddingTop = `${paddingTop}px`;
			nav.style.paddingLeft = menu.getBoundingClientRect().left + "px";
			nav.style.height = `${
				document.documentElement.clientHeight -
				paddingTop -
				getComputedStyle(nav).paddingBottom.split("px")[0]
			}px`;
		}

		this.setAttribute("data-open", "");
		this.dispatchEvent(this.event.open);
		this.dispatchEvent(this.event.change);
	}
	close() {
		const menu = this.shadowRoot.getElementById("menu");
		menu.innerHTML = "menu";

		this.removeAttribute("data-open");
		this.dispatchEvent(this.event.close);
		this.dispatchEvent(this.event.change);

		// Set nav styles
		const nav = this.shadowRoot.getElementById("nav");
		nav.style.left = `-${nav.getBoundingClientRect().width}px`;
	}
}
customElements.define("side-nav", SideNav);
export default SideNav;
