import _NavComponents from "./modules/NavComponents.js";
import ChatListElement from "./components/ChatListElement/main.js";

const chatList = document.getElementById("chat-list");

let testElem = new ChatListElement("Eloquent JavaScript", "https://eloquentjavascript.net/favicon.ico");
chatList.appendChild(testElem);
