const encodeAscii = unicode => {
	let ascii = "";
	for (const char of unicode) {
		ascii += " ";
		ascii += char.codePointAt(0);
	}
	ascii = ascii.substring(1);
	return ascii;
};
const decodeAscii = ascii => String.fromCodePoint(...ascii.split(" "));

module.exports = {
	encodeAscii,
	decodeAscii,
};
