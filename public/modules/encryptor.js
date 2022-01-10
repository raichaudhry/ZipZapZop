// ECMAScript (JS)
/** @param {String} str The string to encode. */
export const encrypt = str => {
	let output = "";
	for (const char of str) {
		output += String.fromCodePoint((char.codePointAt(0) + 1) % 1114112);
	}
	return output;
};
/** @param {String} str The string to decode. */
export const decrypt = str => {
	let output = "";
	for (const char of str) {
		let codePoint = char.codePointAt(0);
		if (codePoint - 1 < 0) codePoint = 1114112;
		output += String.fromCodePoint(codePoint - 1);
	}
	return output;
};

