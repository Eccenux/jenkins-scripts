/* global ViewFilter_hashed_a40934580jldhfj084957lhgldf, jQueryMini */
/**
 * Adds filters for job views.
 *
 * Testing:
 * $('head').append('<script src="http://localhost/_test/jenkins/nux-js/view-filter.js" />')
 */

/**
 * Main job filter setup.
 * @param {jQueryMini} $ the mini or actual jQuery.
 * @param {ViewFilter_hashed_a40934580jldhfj084957lhgldf} ViewFilter the ViewFilter.
 */
function setupMainJobFilter($, ViewFilter) {
	// this will be a filter for sections (e.g. stats)
	var sectionFilter = new ViewFilter();
	// i18n
	sectionFilter.i18n.search = 'Filter jobs (name, url)';
	// we just filter by header of section (e.g. stat name)
	sectionFilter.itemToText = function(item) {
		var text = '';
		var extraText = '';
		var links = item.getElementsByClassName('model-link');
		if (links.length) {
			text = links[0].textContent;	// only take project name to avoid e.g. matching invisible text from health status
			extraText = links[0].getAttribute('href');
		}

		return text + ' ' + extraText;
	};
	// on load create controls and pre-parse items
	// init(controlsSelector, itemsSelector)
	$(()=>{
		sectionFilter.init("#view-message", "#projectstatus [id^=job_]");
	});
}

// execute
(function($){
	// unhashed
	const ViewFilter = ViewFilter_hashed_a40934580jldhfj084957lhgldf;

	setupMainJobFilter($, ViewFilter);
})(jQueryMini);