/**
 * Remove **'** from strings and replace them with **"**.
 * @param  {{String: String}} strs
 * @returns {{String: String}|String}
 */
const removeQuotes = strs => {
	const output = {};
	for (let strName in strs) {
		const modifed = strs[strName].replace("'", '"');
		if (Object.keys(strs).length == 1) return modifed;
		output[strName] = modifed;
	}
	return output;
};
module.exports = removeQuotes;
