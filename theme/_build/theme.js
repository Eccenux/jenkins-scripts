
// jQueryMini.js, line#0
/**
 *	jQuery mini
 *
 *	This implments most used features of jQuery:
 *	<li>selecting and traversing a list of elements; e.g.: $('#class').each(function(){this...})
 *	<li>running function on document ready; e.g.: $(function(){...})
 *	<li>running function on event function; e.g.: $.on(element, 'change', function(){...})
 *
 *	Yes, it ignores existance of old IE. Currently supports IE9 and higher.
 *
 *	@param {String|Function} parameter CSS-like selector of elements OR function to run when page elements are ready.
 *
 *	@author Maciej "Nux" Jaros
 *	Licensed under (at ones choosing)
 *	<li>MIT License: http:
 *	<li>or CC-BY: http:
 */
function jQueryMini(parameter){

	if (typeof(parameter) == 'function') {
		jQueryMini.addReadyListener(parameter);
	}

	else {
		return jQueryMini.traverseSelector(parameter);
	}
}
// EOC
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
// EOC
jQueryMini.addReadyListener = function(onReady) {
	document.addEventListener("DOMContentLoaded", function(event) {
		onReady(event);
	});
};
// EOC
jQueryMini.on = function(element, eventName, onEvent) {
	element.addEventListener(eventName, function(event) {
		onEvent.call(this, event);
	});
};

// jQueryMini.js, EOF
// checkboxes-helper.js, line#0
/**
	Checkboxes helper.

	For each checkboxes group add a (un)check all button.

	@author Maciej "Nux" Jaros
	Licensed under (at ones choosing)
	<li>MIT License: http:
	<li>or CC-BY: http:
*/
(function () {

	var controller = new Controller();
	controller.init();
// EOC
	var prepareUncheckAll = function() {
		var parameterBodies = document.querySelectorAll("table.parameters > tbody");
		for (var i = 0; i < parameterBodies.length; i++) {
			var parameterBody = parameterBodies[i];
			var checkboxes = parameterBody.querySelectorAll("input[type=checkbox]");
			if (checkboxes.length > 3) {
				addUncheckButton(parameterBody);
			}
		}
	};
// EOC
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
// EOC
	function Controller() {
		this.init = function() {
			addEventListener("load", function () {
				prepareUncheckAll();
			});
		};
	}

})();

// checkboxes-helper.js, EOF
// job-actions.js, line#0
/**
	Extra job actions.

	@author Maciej "Nux" Jaros
	Licensed under (at ones choosing)
	<li>MIT License: http:
	<li>or CC-BY: http:
*/
(function ($) {

	var controller = new Controller();
	controller.init();
// EOC
	function jobSidePanelEnhance() {
		var jobBaseUrl = location.pathname.replace(/(\/job\/.+?\/).*/, '$1');
		var tpl = (o) => `
			<div class="task">
				<span class="task-link-wrapper">
					<a href="${o.href}" class="task-link task-link-no-confirm">
						<span class="task-icon-link">${o.icon}</span>
						<span class="task-link-text">${o.label}</span>
					</a>
				</span>
			</div>
		`.replace(/[\r\n]+[ \t]*/g, '');

		$('#side-panel #tasks').each(function(){
			var nel;

			nel = document.createElement('div');
			nel.innerHTML = tpl({
				href: `${jobBaseUrl}lastBuild/console`,
				icon: `<svg class="icon-terminal icon-md" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title></title><rect x="32" y="48" width="448" height="416" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"></rect><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M96 112l80 64-80 64M192 240h64"></path></svg>`,
				label: `Last/current log`,
			});
			this.appendChild(nel);


			nel = document.createElement('div');
			nel.innerHTML = tpl({
				href: `${jobBaseUrl}buildTimeTrend`,
				// icon:  '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="63" height="63" viewBox="0 0 16.6 16.6"><g><circle cx="8.3" cy="8.3" r="7.6" fill="none" stroke="#000" stroke-width="1.4" /><path fill="#acacac" d="M8.3 2.4v6h6a6 6 0 0 0-6-6 6 6 0 0 0-.1 0z" /><circle cx="8.3" cy="8.3" r=".9" /><path fill="none" stroke="#000" stroke-linecap="round" stroke-width=".6" d="M8.3 2.4v6h6" /></g></svg>',
				icon:  '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="63" height="63" viewBox="0 0 16.6 16.6"><g><circle cx="8.3" cy="8.3" r="7.6" fill="none" stroke="#000" stroke-width=".8" /><path d="M8.3 2.4v6h6a6 6 0 0 0-6-6 6 6 0 0 0-.1 0z" fill="#ccc" /><circle cx="8.3" cy="8.3" r="1.1" /><path fill="none" stroke="#000" stroke-linecap="round" d="M8.3 2.4v6h6" stroke-width=".8" /></g></svg>',
				label: `Time trend`,
			});
			this.appendChild(nel);
		});
	}
// EOC
	function Controller() {
		this.init = function() {
			var isJobPage = location.pathname.search('/job/') >= 0;
			if (isJobPage) {
				addEventListener("load", function () {

					if (document.getElementById('buildHistory')) {
						jobSidePanelEnhance();
					}
				});
			}
		};
	}

})(jQueryMini);
// job-actions.js, EOF
// login-check.js, line#0
/**
 * Adds a notice for users that are not logged in with upper case letter.
 *
 * @author Maciej "Nux" Jaros
 *
 * Licensed under (at ones choosing)
 * <li>MIT License: http:
 * <li>or CC-BY: http:
 *
 * @requires jQueryMini or an actual jQuery library.
 */
(function ($) {
	$(function(){
		$('#j_username').each(function(){

			$.on(this, 'change', function() {
				var login = this.value;
				if (login.length && login[0].toLowerCase() === login[0]) {
					alert('Login MUSI być wpisany z dużej litery!'
						+'\n\nInaczej nie będziesz mieć normalnych uprawnień.'
						+'\n\nPrzykład: józefk - źle, JózefK - dobrze.'
					);
				}
			});

			var el = document.createElement('span');
			el.textContent = ' Login MUSI być wpisany z dużej litery (józefk - źle, JózefK - dobrze).';
			this.parentNode.appendChild(el);
		});
	});
})(jQueryMini);
// login-check.js, EOF
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
// view-filter.js, line#0
(function($){

/**
 * Adds a simple filter input for views.
 *
 * $('head').append('<script src="http://localhost/_test/jenkins/nux-js/view-filter.js" />')
 *
 * @author Maciej "Nux" Jaros
 *
 * Licensed under (at ones choosing)
 * <li>MIT License: http:
 * <li>or CC-BY: http:
 *
 * @requires jQueryMini or Actual jQuery.
 * @returns {ViewFilter}
 */
function ViewFilter()
{
// EOC
	var _self = this;

	var items = [];
// EOC
	this.init = function () {

		var container = document.getElementById("view-message");
		if (!container) {
			return;
		}


		items = $('#projectstatus [id^=job_]');
		if (items.length < 2) {
			return;
		}

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			item.ViewFilter_text = '';
			item.ViewFilter_extraText = '';
			var links = item.getElementsByClassName('model-link');
			if (links.length) {
				item.ViewFilter_text = links[0].textContent;
				item.ViewFilter_extraText = links[0].getAttribute('href');
			}
		}


		var input = document.createElement("input");
		input.setAttribute("type", "text");
		input.setAttribute("placeholder", document.getElementById("search-box").getAttribute("placeholder"));
		$.on(input, 'keyup', function() {
			_self.filter(this.value);
		});
		container.appendChild(input);
	};
// EOC
	this.filter = function (phrase) {

		var words = phrase
				.replace(/^\s+/, '')
				.replace(/\s+$/, '')
				.replace(/\s+/g, ' ')
				.split(' ')
		;

		var re = new ReArray(words, 'i');
		//var re = new RegExp('('+words+')', 'i');
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (re.test(item.ViewFilter_text + ' ' + item.ViewFilter_extraText)) {
				item.style.display='';
			} else {
				item.style.display='none';
			}
		}
	};
// EOC
	function ReArray(strings, regExpFlags) {
		this._reArray = [];

		for (var i=0; i<strings.length; i++) {
			this._reArray.push(new RegExp(this.escapeStr4RegExp(strings[i]), regExpFlags));
		}
	}
// EOC
	ReArray.prototype.escapeStr4RegExp = function(str) {
		return str.replace(/([\[\]\{\}\|\.\*\?\(\)\$\^\\])/g, '\\$1');
	};
// EOC
	ReArray.prototype.test = function(str, matchAny) {
		var numMatches = 0;
		for (var i=0; i<this._reArray.length; i++) {
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
	};
}

ViewFilter = new ViewFilter();

$(function(){ViewFilter.init()});

})(jQueryMini);
// view-filter.js, EOF
// jenkins-init.js, line#0
/**
 * Init EditArea for each known textarea.
 *
 * @author Maciej "Nux" Jaros
 * Licensed under (at ones choosing)
 * <li>MIT License: http:
 * <li>or CC-BY: http:
 */
(function(){

	var jenkinsThemeBaseUrl = "/userContent/nux-js/";	// YMMV - set this to whatever your "theme" files are

	var logTag = '[DolivetEditArea]';

	var lastId = 0;
	var enhanceName = 'js-ux-DolivetEditArea';
	// var inputSelector = 'textarea.jenkins-input:not(.codemirror)';
	var inputSelector = 'textarea:not(.codemirror)';
	var userLanguage = navigator.language;


	if (!('querySelectorAll' in document)) {
		console.warn(logTag, 'Browser not supported!');
		return;
	}
	var isConfigPage = location.pathname.search(/job\/.+\/configure/) >= 0;
	if (!isConfigPage) {
		return;
	}


	loadScript(jenkinsThemeBaseUrl + 'editarea/edit_area_full.js', initAreas);
// EOC
	function initAreas() {

		var behaviourGen = (highlighter, descriptorid) => ({
			selector: `.jenkins-form-item [descriptorid="${descriptorid}"] textarea`,
			id: `${enhanceName}-${highlighter}`,
			priority: 0,
			fun: (input) => {
				var {count} = initSection([input], highlighter);
				console.log(logTag, 'behaviour event:', {descriptorid, highlighter, count});
			},
		});
		var behaviour = behaviourGen('java', "hudson.plugins.groovy.SystemGroovy");
		Behaviour.specify(behaviour.selector, behaviour.id, behaviour.priority, behaviour.fun);
		var behaviour = behaviourGen('bash', "jenkins.plugins.publish_over_ssh.BapSshBuilderPlugin");
		Behaviour.specify(behaviour.selector, behaviour.id, behaviour.priority, behaviour.fun);

		var sections = [...document.querySelectorAll('.jenkins-form-item [descriptorid]')];
		var summary = {
			total: 0,
			plugins: [],
		}
		for (var section of sections) {
			var descriptorid = section.getAttribute('descriptorid');
			var inputs = section.querySelectorAll(inputSelector);
			if (!inputs.length) {
				continue;
			}
			var highlighter = getHighlighter(descriptorid);
			if (highlighter) {
				var {count} = initSection(inputs, highlighter);
				summary.total += count;
				summary.plugins.push(descriptorid);
			}
		}
		var pluginList = [...new Set(summary.plugins)].join(', ');
		console.log(logTag, `initialized: [${summary.total}] ${pluginList}.`);
	}
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
	function alreadyDone(textarea) {
		return (textarea.classList.contains(enhanceName) || textarea.classList.contains('codemirror') );
	}
// EOC
	function getHighlighter(descriptorid) {
		var highlighter = '';
		if (descriptorid === "hudson.plugins.groovy.SystemGroovy") {
			highlighter = 'java';
		} else if (descriptorid === "jenkins.plugins.publish_over_ssh.BapSshBuilderPlugin") {
			highlighter = 'bash';
		}
		if (!highlighter.length) {
			return false;
		}
		return highlighter;
	}
// EOC
	function initSection(inputs, highlighter) {
		var count = 0;

		for (var textarea of inputs) {
			if (alreadyDone(textarea)) {
				console.log(logTag, 'already done: ', textarea.id);
				continue;
			}
			textarea.classList.add(enhanceName);
			textarea.classList.add(enhanceName + '-' + highlighter);

			if (textarea.id.length < 1) {
				lastId++;
				textarea.id = enhanceName + '-i' + lastId;
			}

			count++;
			editAreaLoader.init({
				id: textarea.id
				,start_highlight: true
				,allow_resize: "both"
				,allow_toggle: true
				,display: "later"
				,word_wrap: true
				,min_width: 400
				,min_height: 200
				,language: userLanguage
				,syntax: highlighter
				,change_callback:'editAreaJenkinsAutoUpdate'
			});
		}

		return {count};
	}
// EOC
	window.editAreaJenkinsAutoUpdate = function (tid) {
		document.getElementById(tid).value = editAreaLoader.getValue(tid);
	};
})();
// jenkins-init.js, EOF