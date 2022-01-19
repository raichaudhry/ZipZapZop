import login from "../login/login.js";
import { encrypt } from "../modules/encryptor.js";
import error from "../modules/error.js";

const form = document.getElementById("form");
form.addEventListener("submit", async _ => {
	const username = document.getElementById("username")?.value,
		password = document.getElementById("password")?.value,
		verifyPassword = document.getElementById("verify-password")?.value;

	if (username && password && verifyPassword) {
		if (!/\w+/.test(username)) return error("The username must be alphanumeric."); // Ensure that the username is alphanumeric.

		if (password !== verifyPassword) return error("The passwords do not match."); // Ensure that the user typed the password correctly

		// Everything is correct, create account
		error(""); // Clear all errors

		const res = await fetch("/db/write/create-account", {
			method: "POST",
			headers: {
				username,
				password: encrypt(password),
			},
		});

		// Check to see if the account was actually created.
		if (res.status == 204) {
			if (login()) {
				location.replace("/"); // Set cookies. If sucessful, then redirect to the homepage.
			} else error("There was a problem signing you in. Go to the <a href='/login'>login page</a> to log in. ");
		} else {
			error(`There was a problem creating your account. <br/>Error ${res.status}`);
		}
	} else error("Please fill out all of the fields.");
});
