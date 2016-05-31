/**
	Checkboxes helper.
	
	For each checkboxes group add a (un)check all button.
	
	@author Maciej "Nux" Jaros
	Licensed under (at ones choosing)
	<li>MIT License: http://www.opensource.org/licenses/mit-license
	<li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
*/
(function () {

	var controller = new Controller();
	controller.init();

	/**
	 * For each checkboxes group add a (un)check all button.
	 */
	var prepareUncheckAll = function() {
		var parameterBodies = document.querySelectorAll("table.parameters > tbody");
		for (var i = 0; i < parameterBodies.length; i++) {
			var parameterBody = parameterBodies[i];
			var checkboxes = parameterBody.querySelectorAll("input[type=checkbox]");
			if (checkboxes.length > 3) {
				addUncheckButton(parameterBody);
			}
		}
		return parameters;
	};

	/**
	 * For each checkboxes group add a (un)check all button.
	 */
	var addUncheckButton = function(parameterBody) {
		var container = parameterBody.querySelector(".setting-main");
		var btn = document.createElement('a');
		container.appendChild(btn);
		btn.href="#";
		btn.checkboxesChecked = true;
		btn.setButtonState = function() {
			btn.textContent = (btn.checkboxesChecked) ? 'clear all' : 'choose all';
			//btn.textContent = (btn.checkboxesChecked) ? '☐☐' : '☑☑';
		}
		btn.onclick = function() {
			var checkboxes = parameterBody.querySelectorAll("input[type=checkbox]");
			for (var i = 0; i < checkboxes.length; i++) {
				checkboxes[i].checked = !btn.checkboxesChecked;
			}
			btn.checkboxesChecked = !btn.checkboxesChecked;
			btn.setButtonState();
		};
		btn.setButtonState();
	};
	
	/**
	 * Controller functions.
	 *
	 * @returns {Controller}
	 */
	function Controller() {
		this.init = function() {
			addEventListener("load", function () {
				prepareUncheckAll();
			});
		};
	}

})();
