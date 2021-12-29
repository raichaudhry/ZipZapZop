// ECMAScript (JS)
/**
 * Add padding to the front or back of a number or string.
 * @param {String|Number} str The thing getting padded.
 * @param {Number} length The new length of the thing.
 * @param {String} padding The thing getting padded.
 * @param {Boolean} front Controls wether the padding is added in the front.
 * @returns {String|undefined} Returns `null` if something goes wrong.
 */
const addPadding = (str, length, padding, front = true) => {
	if (str.length > length) return console.error("addPadding: `str` is longer than `length`. \nstr:", str, "\nlength:", length);

	str = String(str);
	padding = String(padding);
	while (str.length < length) {
		if (front) str = padding + str;
		else str += padding;
	}
	return str;
};

export default addPadding;
