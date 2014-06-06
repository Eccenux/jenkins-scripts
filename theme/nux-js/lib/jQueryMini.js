/**
 *	jQuery mini
 *
 *	This implments most used feature of jQuery i.e. selecting and traversing a list of elements and onready function.
 *
 *	Yes, it ignores existance of old IE. Currently supports IE9 and higher.
 *
 *	@param {String|Function} parameter CSS-like selector of elements OR function to run when page elements are ready.
 *
 *	@author Maciej "Nux" Jaros
 *	Licensed under (at ones choosing)
 *	<li>MIT License: http://www.opensource.org/licenses/mit-license
 *	<li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 */
function jQueryMini(parameter){
	// onready function
	if (typeof(parameter) == 'function') {
		jQueryMini.addReadyListener(parameter);
	}
	// selector traversing
	else {
		return jQueryMini.traverseSelector(parameter);
	}
}

/**
 * Selector traversing with `each` method.
 *
 * @param {String} selector CSS-like selector of elements.
 * @returns {NodeList|jQueryMini.prototype.traverseSelector.elements}
 */
jQueryMini.traverseSelector = function(selector) {
	var elements = document.querySelectorAll(selector);
	elements.each = function(elementFunction) {
		for (var i = 0; i < elements.length; i++) {
			var el = elements[i];
			elementFunction.call(el);
		}
	};
	return elements;
};

/**
 * Append onReady listener.
 *
 * Support: http://caniuse.com/#feat=domcontentloaded
 *
 * @param {Function} onReady
 *		Function to run when page elements are ready.
 *		Will receive event object.
 */
jQueryMini.addReadyListener = function(onReady) {
	document.addEventListener("DOMContentLoaded", function(event) {
		onReady(event);
	});
};

/**
 * Append listener.
 *
 * Support: http://caniuse.com/#feat=domcontentloaded
 *
 * @param {Node} element Element (or node) to bind the event to.
 * @param {String} eventName Name of event to hook to (note, use "click" rather then "onclick").
 * @param {Function} onEvent
 *		Function to run when page elements are ready.
 *		Will receive event object.
 */
jQueryMini.on = function(element, eventName, onEvent) {
	element.addEventListener(eventName, function(event) {
		onEvent.call(this, event);
	});
};
