import Cookie from "../../modules/Cookie.js";
import error from "../../modules/error.js";

const PATH = "/components/createChat/";
if (!document.getElementById("x-create-chat-template")) {
	let template = document.createElement("template");
	template.id = "x-create-chat-template";
	template.innerHTML = `<link rel="stylesheet" href="${PATH}/style.css" />
<div id="wrapper">
	<form action="javascript:void(0)" id="form">
		<fieldset>
			<legend>Name</legend>
			<label for="name" style="display: none;">Name: </label>
			<input type="text" name="name" id="name" placeholder="My Awesome Chat" />
		</fieldset>

		<fieldset>
			<legend>People</legend>
			<span id="people" x-no-people>No people added.</span>
			<input type="text" id="add-value" placeholder="JohnDoe123" />
			<input type="button" id="add" value="add" class="material-icons-round" title="Add people" style="font-size: 1em" />
		</fieldset>

		<input type="submit" value="Create chat!" />
	</form>
</div>`;
	document.body.appendChild(template);
}

class CreateChat extends HTMLElement {
	/**
	 * @param {String=} to The UUID of the recipient.
	 * @param {String=} msg The content of the message.
	 */
	#people = [];
	#name = "";

	constructor(to, msg) {
		super();

		// Shadow DOM
		let shadowRoot = this.attachShadow({ mode: "open" });
		/** @type HTMLTemplateElement */
		let template = document.getElementById("x-create-chat-template");
		shadowRoot.appendChild(template.content.cloneNode(true));

		const uuid = Cookie.get("uuid")?.value;
		if (!uuid) {
			throw new Error(`User UUID not found. Cookie: '${uuid}'`);
		}

		this.to = to;
		this.msg = msg;
	}
	connectedCallback() {
		const root = this.shadowRoot;
		root.getElementById("add")?.addEventListener("click", async _ => {
			const people = root.getElementById("people");
			if (people.hasAttribute("x-no-people")) people.innerHTML = "";
			people.innerHTML += `${people.hasAttribute("x-no-people") ? "" : ", "}${root.getElementById("add-value").value}`;
			people.removeAttribute("x-no-people");
		});
		root.getElementById("form")?.addEventListener("submit", async _ => {
			const name = root.getElementById("name")?.value,
				people = root.getElementById("people")?.textContent.split(", ");

			if (root.getElementById("people").hasAttribute("x-no-people")) return error("You must add people to create a chat.");

			if (await this.create(name, people)) alert("Chat created!");
			else alert("Chat not created :(");
		});
	}
	async create(name = this.#name, people = this.#people, returnStatus = false) {
		// Add current user to people
		const username = Cookie.get("username")?.value;
		if (username) people.push(username);
		else throw new Error(`Username not found. \nCookie value: '${username}'`);

		const res = await fetch("/db/write/create-chat", {
				method: "POST",
				headers: {
					people: JSON.stringify(people),
					name: name || people.join(", "),
				},
			}),
			status = res.status;

		if (returnStatus) return status;

		switch (status) {
			case 204:
				// Chat created
				return true;
			default:
				// Chat not created
				console.error(status);
				return false;
		}
	}
}

customElements.define("create-chat", CreateChat);
export default CreateChat;
