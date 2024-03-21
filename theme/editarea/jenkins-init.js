/**
 * Init EditArea for each shell textarea.
 *
 * @author Maciej "Nux" Jaros
 * Licensed under (at ones choosing)
 * <li>MIT License: http://www.opensource.org/licenses/mit-license
 * <li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
 */
(function(){
	// /userContent/nux-js/theme.js
	var jenkinsThemeBaseUrl = "/userContent/nux-js/";	// YMMV - set this to whatever your "theme" files are

	if (!('querySelectorAll' in document)) {
		console.warn('[EditAreaInit] Browser not supported!');
		return;
	}
	loadScript(jenkinsThemeBaseUrl + 'editarea/edit_area_full.js', initAreas);

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

	/**
	 * Init all recognized textareas.
	 */
	function initAreas() {
		var userLanguage = navigator.language;
		var enhanceUs = document.querySelectorAll(
			'textarea[name="_.execCommand"].ssh-exec-control'
			+ ',div[descriptorid="hudson.tasks.Shell"] textarea[name="command"]'
		);
		for (var i=0; i < enhanceUs.length; i++) {
			var textarea = enhanceUs[i];
			if (textarea.id.length < 1) {
				textarea.id = "enhanceUs_" + i;
			}
			// initialisation
			editAreaLoader.init({
				id: textarea.id
				,start_highlight: true
				,allow_resize: "both"
				,allow_toggle: true
				,display: "later"	// do not start with the editor
				,word_wrap: true
				,min_width: 600
				,min_height: 300
				,language: userLanguage
				,syntax: "bash"
				,change_callback:'editAreaJenkinsAutoUpdate'
			});
		}
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