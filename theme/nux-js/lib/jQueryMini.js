/**
 *	jQuery mini
 *
 *	This implments most used feature of jQuery i.e. selecting and traversing a list of elements.
 *
 *	Yes, it ignores existance of old IE. Currently supports IE8, but will drop it without notice.
 *
 *	@param {String} selector CSS-like selecotr of elements.
 *
 *	@author Maciej "Nux" Jaros
 *	Licensed under (at ones choosing)
 *	<li>MIT License: http://www.opensource.org/licenses/mit-license
 *	<li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 */
function jQueryMini(selector){
	var elements = document.querySelectorAll(selector);
	return new function() {
		this.each = function(elementFunction) {
			for (var i = 0; i < elements.length; i++) {
				var el = elements[i];
				elementFunction.call(el);
			}
		};
	};
}