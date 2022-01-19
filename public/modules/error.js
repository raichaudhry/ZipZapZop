/**
 * Show an error message to the user.
 * @param {String} msg The error message.
 * @param {HTMLElement?} elem The element to put the message into. If nullish, the message will be `alert`ed.
 */
const error = (msg, elem = document.querySelector(".error")) => (elem ? (elem.innerHTML = msg) : alert(msg));

export default error;
