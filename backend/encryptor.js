// Node.js
const addPadding = require("./addPadding");

/**
 * Encode a string. Works with any Unicode character.
 * @param {String} str The string to be encoded.
 */
const encrypt = str => {
	// Extract Unicode character codes and put them into an array.
	const chars = [],
		finalChars = [];
	for (const char of str) {
		// Ensure all digits in the character codes are the same length.
		chars.push(addPadding(char.charCodeAt(0), 5, "0"));
	}
	for (const char of chars) {
		// Make different groups out of the string.  0|00|00
		//                                          g1|g2|g3
		let g1 = Number(char.substring(0, 1)),
			g2 = Number(char.substring(1, 3)),
			g3 = Number(char.substring(3, 5));
		let g3t = 0;
		for (const digit of String(g3)) {
			g3t += Number(digit);
		}
		let diff = Math.abs(g2 - g3);
		while (diff > 10 - g1) {
			diff /= 10;
		}
		g1 += Math.floor(diff);
		g2 += g3t;

		// Convert back to strings.
		g1 = String(g1);
		g2 = String(g2);
		g3 = String(g3);
		finalChars.push(String.fromCodePoint(g3 + g1 + g2));
	}
	return finalChars.join("");
};
/**
 * Decode a string encrypted with the `encypt` function.
 * @param {String} str The encoded string to be decoded.
 */
const decrypt = str => {
	const chars = [],
		finalChars = [];
	for (const char of str) {
		chars.push(addPadding(char.codePointAt(0)));
	}
	for (const char of chars) {
		let g3 = Number(char.substring(0, 2)),
			g1 = Number(char.substring(2, 3)),
			g2 = Number(char.substring(3, 5));
		let g3t = 0;
		for (const digit of String(g3)) {
			g3t += Number(digit);
		}
		g2 -= g3t;
		g1 -= Math.abs(g2 - g3);
		finalChars.push(String.fromCharCode(g1 + g2 + g3));
	}
	return finalChars.join("");
};

module.exports = { encrypt, decrypt };
