/**
	Extra job actions.

	@author Maciej "Nux" Jaros
	Licensed under (at ones choosing)
	<li>MIT License: http://www.opensource.org/licenses/mit-license
	<li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
*/
(function ($) {

	var controller = new Controller();
	controller.init();
	
	/**
		Extra job actions.
		
		Adds links in a side panel of a job.
		
		<li>last build console
		<li>build-time trends
	*/
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
			// last build console
			nel = document.createElement('div');
			nel.innerHTML = tpl({
				href: `${jobBaseUrl}lastBuild/console`,
				icon: `<svg class="icon-terminal icon-md" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title></title><rect x="32" y="48" width="448" height="416" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"></rect><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M96 112l80 64-80 64M192 240h64"></path></svg>`,
				label: `Last/current log`,
			});
			this.appendChild(nel);
			
			// build-time trends
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

	/**
	 * Controller functions.
	 *
	 * @returns {Controller}
	 */
	function Controller() {
		this.init = function() {
			var isJobPage = location.pathname.search('/job/') >= 0;
			if (isJobPage) {
				addEventListener("load", function () {
					// not on config page
					if (document.getElementById('buildHistory')) {
						jobSidePanelEnhance();
					}
				});
			}
		};
	}

})(jQueryMini);