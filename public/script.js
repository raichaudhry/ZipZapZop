import db from "./modules/database.js";
import _NavComponents from "./modules/NavComponents.js";
import ChatListElement from "./components/ChatListElement/main.js";
import Cookie from "./modules/Cookie.js";

const login = () => (location.href = "./login");

const uid = Cookie.get("uid");
if (uid == undefined || uid.length != 4 || isNaN(Number(uid))) login();

(async () => {
	const pass = Cookie.get("pass");
	if (!pass) login();

	// Auth
})();
