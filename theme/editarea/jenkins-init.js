/**
 * Init EditArea for each known textarea.
 *
 * @author Maciej "Nux" Jaros
 * Licensed under (at ones choosing)
 * <li>MIT License: http://www.opensource.org/licenses/mit-license
 * <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 */
(function(){
	// /userContent/nux-js/theme.js
	var jenkinsThemeBaseUrl = "/userContent/nux-js/";	// YMMV - set this to whatever your "theme" files are

	var logTag = '[DolivetEditArea]';

	var lastId = 0;
	var enhanceName = 'js-ux-DolivetEditArea';
	// var inputSelector = 'textarea.jenkins-input:not(.codemirror)';
	var inputSelector = 'textarea:not(.codemirror)';
	var userLanguage = navigator.language;

	// viablity check
	if (!('querySelectorAll' in document)) {
		console.warn(logTag, 'Browser not supported!');
		return;
	}
	var isConfigPage = location.pathname.search(/job\/.+\/configure/) >= 0;
	if (!isConfigPage) {
		return;
	}

	// load extra
	loadScript(jenkinsThemeBaseUrl + 'editarea/edit_area_full.js', initAreas);

	/**
	 * Go through sections.
	 */
	function initAreas() {
		// Jenkins Behaviour(s) -- run when new element is added
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

	/**
	 * Load script.
	 *
	 * @param {String} url Script URL.
	 * @param {Function} onLoad Function to run when script was loaded.
	 */
	function loadScript(url, onLoad) {
		var script = document.createElement('script');
		var head = document.getElementsByTagName('head')[0];
		script.setAttribute('src', url);
		head.appendChild(script);
		// wait for the script to load
		var intervaId = setInterval(function(){
			if (typeof(editAreaLoader) != 'undefined') {
				clearInterval(intervaId);
				// wait just a bit more just in case...
				setTimeout(function(){
					onLoad();
				}, 100);
			}
		}, 200);
	}

	/** Check if the input was already enhanced in any known way. */
	function alreadyDone(textarea) {
		return (textarea.classList.contains(enhanceName) || textarea.classList.contains('codemirror') );
	}

	/** Highlighter check. */
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

	/**
	 * Init all recognized textareas.
	 */
	function initSection(inputs, highlighter) {
		var count = 0;

		for (var textarea of inputs) {
			if (alreadyDone(textarea)) {
				console.log(logTag, 'already done: ', textarea.id);
				continue;
			}
			textarea.classList.add(enhanceName);
			textarea.classList.add(enhanceName + '-' + highlighter);
			// custom id
			if (textarea.id.length < 1) {
				lastId++;
				textarea.id = enhanceName + '-i' + lastId;
			}
			// initialisation
			count++;
			editAreaLoader.init({
				id: textarea.id
				,start_highlight: true
				,allow_resize: "both"
				,allow_toggle: true
				,display: "later"	// do not start with the editor
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

	/**
	 * Auto update textarea from EditArea.
	 * 
	 * @param {type} tid
	 * @returns {undefined}
	 */
	window.editAreaJenkinsAutoUpdate = function (tid) {
		document.getElementById(tid).value = editAreaLoader.getValue(tid);
	};
})();