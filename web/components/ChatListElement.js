import ChatIcon from "./ChatIcon.js";

/** A custom HTML element for the element in the list that represents a chat.
 *
 * Intended to be added to the DOM by JS.
 */
class ChatListElement extends HTMLElement {
	/**
	 * @param {string} name The name of the chat.
	 * @param {string} iconURL The URL of the chat icon.
	 */
	constructor(name, iconURL) {
		super();
		this.name = name;
		this.iconURL = iconURL;

		this.innerHTML = "";
		/// Chat Icon
		this.icon = new ChatIcon(this.iconURL);
		this.appendChild(this.icon);
	}
	connectedCallback() {}
}
customElements.define("chat-list-element", ChatListElement);
export default ChatListElement;
