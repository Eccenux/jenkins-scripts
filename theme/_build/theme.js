
// ReArray.js, line#0

// EOC
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
// EOC
	escapeStr4RegExp(str) {
		return str.replace(/([\[\]\{\}\|\.\*\?\(\)\$\^\\])/g, '\\$1');
	}
// EOC
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
// ReArray.js, EOF
// ViewFilter.js, line#0

// EOC
/**
 * Adds a simple filter input for any views (widgets).
 *
 * @author Maciej "Nux" Jaros
 *
 * Basic usage example:
 * <pre>

	var listFilter = new ViewFilter();

	$(function(){listFilter.init("#filter-controls-container", "#list-container li")});
 * </pre>
 *
 * By default text contents of whol items are matched.
 * You might wan to re-define `itemToText` to e.g. only use text from header:
 * <pre>

	var sectionFilter = new ViewFilter();

	sectionFilter.itemToText = function(item) {
		return item.querySelector('h2').textContent;
	};

	$(function(){sectionFilter.init("#controls", "section")});
 * </pre>
 *
 * Note! For dynamic items you must call `.preParseItems()` after changing items
 *
 * Licensed under (at ones choosing)
 * <li>MIT License: http:
 * <li>or CC-BY: http:
 *
 * @returns {ViewFilter}
 */

class ViewFilter_hashed_a40934580jldhfj084957lhgldf {
// EOC
	constructor(controlsSelector, itemsSelector) {
// EOC
		this.items = [];
// EOC
		this.i18n = {
			search: 'Search',
		}
// EOC
		this.itemProperty = 'ViewFilter_text';
// EOC
		this.allowRegExp = false;

		this.inputPhrase = null;
// EOC
		this.minItems = 2;

		this.controlsSelector = controlsSelector;
		this.itemsSelector = itemsSelector;
	}
// EOC
	itemToText (item) {
		return item.textContent.trim();
	}
// EOC
	init(controlsSelector, itemsSelector) {
		this.controlsSelector = controlsSelector;
		this.itemsSelector = itemsSelector;

		if (this.preParseItems()) {
			this.initControls();
		}
	}
// EOC
	preParseItems () {

		this.items = document.querySelectorAll(this.itemsSelector);
		if (this.items.length < this.minItems) {
			return false;
		}

		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			item[this.itemProperty] = this.itemToText(item);
		}
		return true;
	}
// EOC
	generateGuid (innerId) {
		return innerId + '-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}
// EOC
	initControls () {

		let parent = document.querySelector(this.controlsSelector);
		if (!parent) {
			return false;
		}

		this.addCss();


		const className = 'view-filter-controls';
		let allContainer = parent.querySelector('.' + className);
		if (!allContainer) {
			allContainer = document.createElement('div');
			allContainer.className = className;
			parent.appendChild(allContainer);
		}

		let container = document.createElement('div');
		allContainer.appendChild(container);
		this.filterContainer = container;


		this.prepareSearchField(container);
		this.prepareCounter(container);
		this.prepareRegExpField(container);
		return true;
	}
// EOC
	prepareSearchField(container) {
		var _self = this;
		var inputPhrase = document.createElement("input");
		inputPhrase.setAttribute("type", "text");
		inputPhrase.setAttribute("placeholder", this.i18n.search);
		inputPhrase.setAttribute("title", this.i18n.search);
		inputPhrase.addEventListener('keyup', function() {
			_self.filter(this.value);
		});
		container.appendChild(inputPhrase);
		this.inputPhrase = inputPhrase;
	}
// EOC
	prepareRegExpField(container) {
		var _self = this;

		var idRegExp = this.generateGuid("RegExp");
		var label = document.createElement("label");
		label.setAttribute("for", idRegExp);
		var inputRegExp = document.createElement("input");
		inputRegExp.setAttribute("type", "checkbox");
		inputRegExp.id = idRegExp;
		inputRegExp.addEventListener('click', function() {
			_self.allowRegExp = this.checked;
			_self.filter(_self.inputPhrase.value);
		});
		label.appendChild(document.createTextNode('RegExp'));
		container.appendChild(inputRegExp);
		container.appendChild(label);
	}
// EOC
	prepareCounter(container) {
		var span = document.createElement("span");
		this.counterElement = span;
		container.appendChild(span);
	}
// EOC
	invalidPhraseInfo (info) {
		this.inputPhrase.setCustomValidity(info);
	}
// EOC
	invalidPhraseClear () {
		this.inputPhrase.setCustomValidity("");
	}
// EOC
	filter (phrase) {

		var re;
		if (!this.allowRegExp) {

			var words = phrase
				.replace(/^\s+/, '')
				.replace(/\s+$/, '')
				.replace(/\s+/g, ' ')
				.split(' ')
			;

			re = new ReArray(words, 'i');
		} else {
			try {
				re = new RegExp(phrase, 'i');
			} catch (e) {
				this.invalidPhraseInfo(e.message);
				return false;
			}
		}
		this.invalidPhraseClear();
		var matchCount = 0;
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if (re.test(item[this.itemProperty])) {
				item.style.display = '';
				matchCount++;
			} else {
				item.style.display = 'none';
			}
		}
		this.counterElement.textContent = ` (${matchCount})`;
		return true;
	}
// EOC
	getCss() {
		return `
			.view-filter-controls {
				display: flex;
				gap: 1em;
			}
		`;
	}
// EOC
	addCss() {
		const id = 'viewfilter-style-a40934580jldhfj084957lhgldf';
		if (document.getElementById(id)) {
			return;
		}
		let style = document.createElement('style');
		style.id = id;
		style.innerHTML = this.getCss();
		document.head.appendChild(style);
	}
}

// export { ViewFilter:ViewFilter_hashed_a40934580jldhfj084957lhgldf }
// ViewFilter.js, EOF
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

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function(event) {
			onReady(event);
		});
	} else {

		onReady({$wasLoaded:true});
	}
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

	See docs in: README.param-groups.md

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

	var logTag = '[param-groups]';
// EOC
	class Parameter {
// EOC
		constructor(parameterBody) {
// EOC
			this.body = parameterBody;
// EOC
			this.originalDisplay = parameterBody.style.display;
// EOC
			this.name = '';
// EOC
			this.valid = false;


			try {
				this.name = "" + parameterBody.querySelector("input[name=name]").value;
			}
			catch(e) {
				console.warn(logTag, "Input not found?", e);
			}
			if (!this.name.length) {
				console.warn(logTag, "Name not found", parameterBody);
			} else {
				this.valid = true;
			}
		}
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
			if (/^group-(start|end)(_[0-9]+)?$/.test(parameter.name)) {
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
					if (parameter.valid) {
						parameter.body.classList.add('par-gr-hideable-item');
					}
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


				var groups = _self.groupParameters(parameters);


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
			var parameterBodies = document.querySelectorAll(".parameters > .jenkins-form-item");
			var parameters = [];
			for (var i = 0; i < parameterBodies.length; i++) {
				var parameterBody = parameterBodies[i];
				var parameter = new Parameter(parameterBody);
				if (parameter.valid) {
					parameters.push(parameter);
				}
			}
			return parameters;
		};
	}

})();

// parameter-grouping.js, EOF
// view-filter.js, line#0

// EOC
// EOC
// EOC
function setupMainJobFilter($, ViewFilter) {
	var filterView = new ViewFilter();
	filterView.i18n.search = 'Filter jobs (name, url)';
	filterView.itemProperty = 'ViewFilter_MainJobFilter';


	filterView.itemToText = function(item) {
		var text = '';
		var extraText = '';
		var links = item.getElementsByClassName('model-link');
		if (links.length) {
			text = links[0].textContent;
			extraText = links[0].getAttribute('href');
		}

		return text + ' ' + extraText;
	};


	$(()=>{

		filterView.init("#view-message", "#projectstatus [id^=job_]");
	});
}
// EOC
function setupExtraJobFilter($, ViewFilter) {
	var filterView = new ViewFilter();
	filterView.i18n.search = 'Extras format - launch:..., desc:..., cron:...';
	filterView.itemProperty = 'ViewFilter_ExtraJobFilter';

	let columns = false;

	filterView.itemToText = function(item) {
		if (!columns) {
			console.warn('columns not found');
			return item.textContent;
		}
		let texts = [];

		let cells = item.querySelectorAll('td');
		if (cells.length) {
			if (columns.nextLaunch && cells[columns.nextLaunch]) {
				texts.push('launch:' + cells[columns.nextLaunch].textContent.trim());
			}
			if (columns.buildDesc && cells[columns.buildDesc]) {
				texts.push('desc:' + cells[columns.buildDesc].textContent.trim());
			}
			if (columns.cron && cells[columns.cron]) {
				texts.push('cron:' + cells[columns.cron].textContent.trim());
			}
		}

		return texts.join(' ; ');
	};


	$(()=>{
		columns = findColumns();

		filterView.init("#view-message", "#projectstatus [id^=job_]");

		addLaunchFilterButton(filterView);
	});
}
// EOC
function addLaunchFilterButton(filterView) {
	const button = document.createElement("button");
	button.textContent = "Launch filter";
	button.style.cssText = 'margin-left: 1ch;';
	button.setAttribute("title", "Insert current century as 'launch:20'");

	button.addEventListener('click', function() {
		let currentCentury = Math.floor(new Date().getFullYear() / 100);
		filterView.inputPhrase.value = `launch:${currentCentury}`;
		filterView.filter(filterView.inputPhrase.value);
	});

	filterView.filterContainer.appendChild(button);
}
// EOC
function findColumns() {
	const jobtable = document.querySelector('.jenkins-table.sortable');
	if (!jobtable) {
		return false;
	}


	let head = jobtable.querySelector('thead');
	let columns = {cron:0, nextLaunch:0, buildDesc:0};
	head.querySelectorAll('th').forEach((el, i) => {
		let headText = el.textContent.trim().toLowerCase()

		if (headText.startsWith('cron trig')) {
			columns.cron = i;
			console.log('cron', i, el);
		}
		else if (headText.startsWith('next launch')) {
			columns.nextLaunch = i;
		}
		else if (headText.startsWith('build desc')) {
			columns.buildDesc = i;
		}
	})
	return columns;
}


(function ($) {

	const ViewFilter = ViewFilter_hashed_a40934580jldhfj084957lhgldf;

	setupMainJobFilter($, ViewFilter);
	setupExtraJobFilter($, ViewFilter);
})(jQueryMini);
// view-filter.js, EOF
// jenkins-init.js, line#0

// EOC
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

		let behaviour;
		behaviour = behaviourGen('java', "hudson.plugins.groovy.SystemGroovy");
		Behaviour.specify(behaviour.selector, behaviour.id, behaviour.priority, behaviour.fun);
		behaviour = behaviourGen('bash', "jenkins.plugins.publish_over_ssh.BapSshBuilderPlugin");
		Behaviour.specify(behaviour.selector, behaviour.id, behaviour.priority, behaviour.fun);
		behaviour = behaviourGen('js', "jenkins.plugins.nodejs.NodeJSCommandInterpreter");
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
		} else if (descriptorid === "jenkins.plugins.nodejs.NodeJSCommandInterpreter") {
			highlighter = 'js';
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