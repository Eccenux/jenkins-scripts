/**
	Various small fixes/changes.

	@author Maciej "Nux" Jaros
	Licensed under (at ones choosing)
	<li>MIT License: http://www.opensource.org/licenses/mit-license
	<li>or CC-BY: http://creativecommons.org/licenses/by/3.0/
*/
(function ($) {

	var controller = new Controller();
	controller.init();
	
	/**
		Links in groupped view is incorret in that all links are relative to current URL (and not some job).
	*/
	function fixCategoryViews() {
		// remove links
		$('.categoryJobRow a').each(function(){
			this.parentNode.insertBefore(document.createTextNode(this.textContent), this);
			this.style.display='none';
		});
		// show headers
		$('.categoryJobs .hidden-header').each(function(){
			this.className = '';
		});
		// fix header margin
		$('.categoryJobsColumn table').each(function(){
			this.style.marginTop = '0px';
		});
	}

	/**
		Extra tasks/links in side panel of a job.
		
		+Last Build
	*/
	function jobSidePanelEnhance() {
		$('#side-panel #tasks').each(function(){
			var nel = document.createElement('div');
			nel.innerHTML = '<div class="task">'
				+'<a class="task-icon-link" href="lastBuild/console">'
					+'<img style="width: 24px; height: 24px; width: 24px; height: 24px; margin: 2px;" src="/plugin/extra-columns/images/32x32/terminal.png">'
				+'</a>&nbsp;'
				+'<a class="task-link" href="lastBuild/console">Ostatni/bieżący log</a>'
			+'</div>';
			this.appendChild(nel);
			//<a href="job/adm-mol.pl--check-for-errors/lastBuild/console"><img title="Ostatnie/bieżące wyjście z konsoli" alt="Ostatnie/bieżące wyjście z konsoli" src="/plugin/extra-columns/images/32x32/terminal.png" border="0"></a>
		});
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
				var isJobPage = location.pathname.search('/job/') >= 0;
				fixCategoryViews();
				if (isJobPage) {
					jobSidePanelEnhance();
				}
			});
		};
	}

})(jQueryMini);