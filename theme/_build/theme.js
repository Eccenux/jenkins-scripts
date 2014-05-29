
// minor-fixes.js, line#0
/**
	Various small fixes/changes.

	@author Maciej "Nux" Jaros
	Licensed under (at ones choosing)
	<li>MIT License: http:
	<li>or CC-BY: http:
*/
(function () {

	var controller = new Controller();
	controller.init();
// EOC
	function $(selector){
		var elements = document.querySelectorAll(selector);
		return new function() {
			this.each = function(elementFunction) {
				for (var i = 0; i < elements.length; i++) {
					var el = elements[i];
					elementFunction.call(el);
				}
			}
		}
	}
// EOC
	function fixCategoryViews() {

		$('.categoryJobRow a').each(function(){
			this.parentNode.insertBefore(document.createTextNode(this.textContent), this);
			this.style.display='none';
		});

		$('.categoryJobs .hidden-header').each(function(){
			this.className = '';
		});

		$('.categoryJobsColumn table').each(function(){
			this.style.marginTop = '0px';
		});
	}
// EOC
	function Controller() {
		this.init = function() {
			var _self = this;
			addEventListener("load", function () {
				fixCategoryViews();
			});
		};
	}

})();
// minor-fixes.js, EOF
// parameter-grouping.js, line#0
/**
	Grouping parametrs.

	On configuration page add group start box which is a Choice parameter named "group-start" with following options:
	<li>collapsible - if option is given then it will be possible to close the group with a button.
	<li>collapsed - if option is given the group will be closed by default.
	<li>checkboxTrigger-SomeCheckboxParameterName - if option is given group will be closed when checkbox is unchecked (and shown otherwise).

	Group continues until the end of params or next group start box.
	To end a group before the end of params add "group-start" with option "-".

	@todo Specify and show title.
	@todo Add show/hide button (for non checkbox triggered groups).

	@author Maciej "Nux" Jaros
	Licensed under (at ones choosing)
	<li>MIT License: http:
	<li>or CC-BY: http:

	Should be replaced with this being done:
	https:
*/
(function () {

	var controller = new Controller();
	controller.init();
// EOC
	function Parameter(parameterBody) {
// EOC
		this.constructor = function(parameterBody) {
			this.body = parameterBody;
			this.originalDisplay = parameterBody.style.display;
			try {
				this.name = "" + parameterBody.querySelector(".setting-name").textContent;
			}
			catch(e) {
				this.name = null;
				console.log("Name not found");
			}

		};


		this.constructor(parameterBody);
	}
// EOC
	function Group(parameterBody) {
// EOC
		this.constructor = function(parameterBody) {

			this.startBody = parameterBody;

			this.collapsible = false;
			this.collapsed = false;
			this.checkboxTriggered = false;
			this.checkboxTriggerName = "";
			this.parameters = [];

			if (this.startBody != null) {
				this._parseOptions(this);
				//this.startBody.style.display = 'none';

				this.startBody.parentNode.removeChild(this.startBody);
			}
		};
// EOC
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
// EOC
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
// EOC
		this.checkIfMine = function(parameter) {
			if (parameter.name == 'group-start') {
				return false;
			}

			if (!this.checkForMyTrigger(parameter)) {
				this.parameters.push(parameter);
			}
			return true;
		};
// EOC
		this.show = function() {
			this._changeDisplay(false);
		};
// EOC
		this.hide = function() {
			this._changeDisplay('none');
		};
// EOC
		this._changeDisplay = function(display) {
			for (var i = 0; i < this.parameters.length; i++) {
// EOC
				var parameter = this.parameters[i];
				if (display === false) {
					display = parameter.originalDisplay;
				}
				parameter.body.style.display = display;
			}
		};
// EOC
		this.setInitalState = function() {
			if (this.collapsed) {
				this.hide();
			}
			if (this.collapsible || this.checkboxTriggered) {
				for (var i = 0; i < this.parameters.length; i++) {
// EOC
					var parameter = this.parameters[i];
					parameter.body.querySelector(".setting-name").style.color = '#555';
				}
			}
		};


		this.constructor(parameterBody);
	}
// EOC
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
// EOC
		this.groupParameters = function(parameters) {
			var groups = [];
			var group = new Group(null);
			for (var i = 0; i < parameters.length; i++) {
				if (group.checkIfMine(parameters[i])) {
					continue;
				}
				group = new Group(parameters[i].body);
				groups.push(group);
			}
			return groups;
		};
// EOC
		this.parseParameters = function() {
			var parameterBodies = document.querySelectorAll("table.parameters > tbody");
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

// parameter-grouping.js, EOF
// jenkins-init.js, line#0
/**
 * Init EditArea for each shell textarea.
 *
 * @author Maciej "Nux" Jaros
 * Licensed under (at ones choosing)
 * <li>MIT License: http:
 * <li>or CC-BY: http:
 */
(function(){
	var jenkinsThemeBaseUrl = "/jenkins-theme/";	// YMMV - set this to whatever your "theme" files are

	if (!('querySelectorAll' in document)) {
		console.warn('[EditAreaInit] Browser not supported!');
		return;
	}
	loadScript(jenkinsThemeBaseUrl + 'editarea/edit_area_full.js', initAreas);
// EOC
	function loadScript(url, onLoad) {
		var script = document.createElement('script');
		var head = document.getElementsByTagName('head')[0];
		script.setAttribute('src', url);
		head.appendChild(script);

		var intervaId = setInterval(function(){
			if (typeof(editAreaLoader) != 'undefined') {
				clearInterval(intervaId);

				setTimeout(function(){
					onLoad();
				}, 100);
			}
		}, 200);
	}
// EOC
	function initAreas() {
		var userLanguage = navigator.language;
// EOC
		var enhanceUs = document.querySelectorAll(
			'textarea[name="_.execCommand"].ssh-exec-control'
			+ ',div[descriptorid="hudson.tasks.Shell"] textarea[name="command"]'
		);
		for (var i=0; i < enhanceUs.length; i++) {
			var textarea = enhanceUs[i];
			if (textarea.id.length < 1) {
				textarea.id = "enhanceUs_" + i;
			}

			editAreaLoader.init({
				id: textarea.id
				,start_highlight: false
				,allow_resize: "both"
				,allow_toggle: true
				,word_wrap: true
				,min_width: 600
				,min_height: 300
				,language: userLanguage
				,syntax: "bash"
				,change_callback:'editAreaJenkinsAutoUpdate'
			});
		}
	}
// EOC
	window.editAreaJenkinsAutoUpdate = function (tid) {
		document.getElementById(tid).value = editAreaLoader.getValue(tid);
	};
})();
// jenkins-init.js, EOF