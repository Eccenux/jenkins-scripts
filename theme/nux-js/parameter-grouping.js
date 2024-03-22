/**
	Grouping parametrs.

	See docs in: README.param-groups.md
	
	@todo Specify and show title.
	@todo Add show/hide button (for non checkbox triggered groups).
	
	@author Maciej "Nux" Jaros
	Licensed under (at ones choosing)
	<li>MIT License: http://www.opensource.org/licenses/mit-license
	<li>or CC-BY: http://creativecommons.org/licenses/by/3.0/

	Should be replaced with this being done:
	https://issues.jenkins-ci.org/browse/JENKINS-19002
*/
(function () {

	var controller = new Controller();
	controller.init();

	var logTag = '[param-groups]';

	/**
	 * Parameter container.
	 *
	 * @param {Node} parameterBody Body of the parameter.
	 * @returns {Parameter}
	 */
	function Parameter(parameterBody) {
		/**
		 * @param {Node} parameterBody
		 */
		this.constructor = function(parameterBody) {
			this.body = parameterBody;
			this.originalDisplay = parameterBody.style.display;
			try {
				this.name = "" + parameterBody.querySelector(".setting-main > div > input[name=name]").textContent;
			}
			catch(e) {
				this.name = null;
				console.log(logTag, "Name not found");
			}
			
		};
		
		// constructor call
		this.constructor(parameterBody);
	}

	/**
	 * Group specification.
	 *
	 * @param {Node} parameterBody Body of the parameter.
	 * @returns {Group}
	 */
	function Group(parameterBody) {
		/**
		 * @param {Node} parameterBody
		 */
		this.constructor = function(parameterBody) {
			//Parameter.constructor.call(this, parameterBody);
			this.startBody = parameterBody;
			
			this.collapsible = false;		// if true then it will be possible to close the group with a button.
			this.collapsed = false;			// if true the group will be closed by default.
			this.checkboxTriggered = false;	// if true group will be closed when checkbox is unchecked (and shown otherwise).
			this.checkboxTriggerName = "";	// read from checkboxTrigger-SomeCheckboxParameterName
			this.parameters = [];			// parameters in the group excluding checkboxTrigger
			
			if (this.startBody != null) {
				this._parseOptions(this);
				//this.startBody.style.display = 'none';
				// detach to avoid sending group specification as an actual parameter
				this.startBody.parentNode.removeChild(this.startBody);
			}
		};

		/**
		 * Parse options into properties.
		 *
		 * See file header for info.
		 */
		this._parseOptions = function () {
			var optionBodies = this.startBody.querySelectorAll("option");
			for (var i = 0; i < optionBodies.length; i++) {
				var optionBody = optionBodies[i];
				var option = optionBody.textContent;
				if (option == 'collapsible') {
					this.collapsible = true;
				}
				else if (option == 'collapsed') {
					this.collapsed = true;
				}
				else if (option.indexOf('checkboxTrigger-') == 0) {
					this.checkboxTriggered = true;
					this.checkboxTriggerName = option.replace(/^checkboxTrigger-/, '');
				}
			}
		};

		/**
		 * Check if given parameter is a trigger and initialise it if so.
		 * @param {Parameter} parameter
		 * @returns {Boolean}
		 */
		this.checkForMyTrigger = function(parameter) {
			if (this.checkboxTriggered
					&& parameter.name == this.checkboxTriggerName) {
				this.checkboxTrigger = parameter;
				var _self = this;
				var checkbox = parameter.body.querySelector("[name='value']");
				this.collapsed = !checkbox.checked;
				checkbox.addEventListener("change", function () {
					if (this.checked) {
						_self.show();
					}
					else {
						_self.hide();
					}
				});
				return true;
			}
			return false;
		};

		/**
		 * Check if given parameter is within the group and acquire it if so.
		 * @param {Parameter} parameter
		 * @returns {Boolean}
		 */
		this.checkIfMine = function(parameter) {
			if (/^group-(start|end)(_[0-9]+)?$/.test(parameter.name)) {
				return false;
			}
			// trigger is not an element of the group
			if (!this.checkForMyTrigger(parameter)) {
				this.parameters.push(parameter);
			}
			return true;
		};

		/**
		 * Show group contents.
		 */
		this.show = function() {
			this._changeDisplay(false);
		};

		/**
		 * Hide group contents.
		 */
		this.hide = function() {
			this._changeDisplay('none');
		};

		/**
		 * Change display of group contents.
		 *
		 * @param {false|String} display If false then revert otherwise set display to given type.
		 */
		this._changeDisplay = function(display) {
			for (var i = 0; i < this.parameters.length; i++) {
				/** @type Parameter */
				var parameter = this.parameters[i];
				if (display === false) {
					display = parameter.originalDisplay;
				}
				parameter.body.style.display = display;
			}
		};

		/**
		 * Sets initial state.
		 * 
		 * @note This should be done after initalizing by running checkIfMine on all parameters.
		 */
		this.setInitalState = function() {
			if (this.collapsed) {
				this.hide();
			}
			if (this.collapsible || this.checkboxTriggered) {
				for (var i = 0; i < this.parameters.length; i++) {
					/** @type Parameter */
					var parameter = this.parameters[i];
					try {
						parameter.body.querySelector(".setting-name").style.color = '#555';
					} catch(e) {
						console.log(logTag, "Unable to set initial color", parameter, e);
					}
				}
			}
		};

		// constructor call
		this.constructor(parameterBody);
	}

	/**
	 * Controller functions.
	 *
	 * @returns {Controller}
	 */
	function Controller() {
		this.init = function() {
			var _self = this;
			addEventListener("load", function () {
				var parameters = _self.parseParameters();
				console.log(parameters);

				var groups = _self.groupParameters(parameters);
				console.log(groups);

				for (var i = 0; i < groups.length; i++) {
					groups[i].setInitalState();
				}
			});
		};

		/**
		 * Grouping parameters into groups.
		 * @param {Array} parameters Array of objects of type Parameter.
		 * @returns {Array} Array of objects of type Group.
		 */
		this.groupParameters = function(parameters) {
			var groups = [];
			var group = new Group(null);	// fake group
			for (var i = 0; i < parameters.length; i++) {
				if (group.checkIfMine(parameters[i])) {
					continue;
				}
				group = new Group(parameters[i].body);
				groups.push(group);
			}
			return groups;
		};

		/**
		 * Basic parsing of paramaters from HTML document.
		 * @returns {Array} Array of objects of type Parameter.
		 */
		this.parseParameters = function() {
			var parameterBodies = document.querySelectorAll(".parameters > .jenkins-form-item");
			var parameters = [];
			for (var i = 0; i < parameterBodies.length; i++) {
				var parameterBody = parameterBodies[i];
				var parameter = new Parameter(parameterBody);
				if (parameter.name != null) {
					parameters.push(parameter);
				}
			}
			return parameters;
		};
	}

})();
