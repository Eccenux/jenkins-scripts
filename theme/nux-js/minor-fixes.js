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
	 * Controller functions.
	 *
	 * @returns {Controller}
	 */
	function Controller() {
		this.init = function() {
			var _self = this;
			addEventListener("load", function () {
				fixCategoryViews();
			});
		};
	}

})(jQueryMini);