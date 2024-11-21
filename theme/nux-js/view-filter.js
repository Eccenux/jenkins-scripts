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
	var filterView = new ViewFilter();
	filterView.i18n.search = 'Filter jobs (name, url)';
	filterView.itemProperty = 'ViewFilter_MainJobFilter';
	
	// adjust to only get name and url
	filterView.itemToText = function(item) {
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
	$(()=>{
		// init(controlsSelector, itemsSelector)
		filterView.init("#view-message", "#projectstatus [id^=job_]");
	});
}

/**
 * Extra job filter setup.
 * @param {jQueryMini} $ the mini or actual jQuery.
 * @param {ViewFilter_hashed_a40934580jldhfj084957lhgldf} ViewFilter the ViewFilter.
 */
function setupExtraJobFilter($, ViewFilter) {
	var filterView = new ViewFilter();
	filterView.i18n.search = 'Extras format - launch:..., desc:..., cron:...';
	filterView.itemProperty = 'ViewFilter_ExtraJobFilter';

	let columns = false;
	// adjust to only get name and url
	filterView.itemToText = function(item) {
		if (!columns) {
			console.warn('columns not found');
			return item.textContent;
		}
		let texts = [];

		let cells = item.querySelectorAll('td');
		if (cells.length) {
			if (columns.nextLanuch && cells[columns.nextLanuch]) {
				texts.push('launch:' + cells[columns.nextLanuch].textContent.trim());
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

	// on load create controls and pre-parse items
	$(()=>{
		columns = findColumns();
		// init(controlsSelector, itemsSelector)
		filterView.init("#view-message", "#projectstatus [id^=job_]");
	});
}

/**
 * Find indexes of columns by text of headers.
 * @returns {Object} false if no table; otherwise: {columnKey:<int>}.
 * 	Keys: cron, nextLanuch, buildDesc.
 */
function findColumns() {
	const jobtable = document.querySelector('.jenkins-table.sortable');
	if (!jobtable) {
		return false;
	}

	// 
	let head = jobtable.querySelector('thead');
	let columns = {cron:0, nextLanuch:0, buildDesc:0};
	head.querySelectorAll('th').forEach((el, i) => {
		let headText = el.textContent.trim().toLowerCase()
		//console.log(i, el)
		if (headText.startsWith('cron trig')) {
			columns.cron = i;
			console.log('cron', i, el);
		}
		else if (headText.startsWith('next launch')) {
			columns.nextLanuch = i;
		}
		else if (headText.startsWith('build desc')) {
			columns.buildDesc = i;
		}
	})
	return columns;
}

// execute
(function ($) {
	// unhashed
	const ViewFilter = ViewFilter_hashed_a40934580jldhfj084957lhgldf;

	setupMainJobFilter($, ViewFilter);
	setupExtraJobFilter($, ViewFilter);
})(jQueryMini);