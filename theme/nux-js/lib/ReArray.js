// https://gist.github.com/Eccenux/5a72d124f2379d36760c195b07002a6b/

/**
 * Helper class for testing match of an array of strings.
 *
 * @param {Array} strings Array of strings to be prepared and used in search.
 * @param {String} regExpFlags Flags passed to RegExp (g/i/m).
 */
class ReArray {
	constructor(strings, regExpFlags, exactMatch) {
		this._reArray = [];

		var strToRegExp;
		if (!exactMatch) {
			strToRegExp = (str) => this.escapeStr4RegExp(str);
		} else {
			strToRegExp = (str) => '^'+this.escapeStr4RegExp(str)+'$';
		}

		for (var i = 0; i < strings.length; i++) {
			this._reArray.push(new RegExp(strToRegExp(strings[i]), regExpFlags));
		}
	}
	/**
	 * Escape phrase pre-creating RegExp.
	 *
	 * @param {String} str
	 * @returns {String}
	 */
	escapeStr4RegExp(str) {
		return str.replace(/([\[\]\{\}\|\.\*\?\(\)\$\^\\])/g, '\\$1');
	}
	/**
	 * Test RegExp array for the given string.
	 *
	 * @param {String} str String to match aginst array of RegExp.
	 * @param {Boolean} matchAny (default=false) If true then match any the RegExp, otherwise all must match.
	 * @returns {Boolean}
	 */
	test(str, matchAny) {
		var numMatches = 0;
		for (var i = 0; i < this._reArray.length; i++) {
			var re = this._reArray[i];
			if (re.test(str)) {
				if (matchAny) {
					return true;
				} else {
					numMatches++;
				}
			}
		}
		return (numMatches == this._reArray.length);
	}
}

// export { ReArray }