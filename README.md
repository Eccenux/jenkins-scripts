Jenkins Enhancements
==============================

Jenkins JavaScript enhancements package.

Any changes since year 2024 should be considered compatible with Jenkins v2 (previous versions where compatible with Jenkins v1).

If you want to use my build just copy `theme\_build\*` to `jenkins-data\userContent\nux-js`. You could also use individual scripts.

See *quick start* guide for installation info and other section for descriptions of large and minor enhancements.

Quick start (installation)
---------------------------------

For building and updating the theme see the [DEV document](DEV.md).

### Full package

1. Download this repo.
2. Copy `theme\_build\*` to your `jenkins-data\userContent\nux-js` (`nux-js` being a new directory).
3. Install [Simple Theme Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Simple+Theme+Plugin) in your Jenkins.
4. Configure Simple Theme Plugin (`/manage/appearance/`) to point to your `theme.js` and `theme.css`. So:
	- CSS URL: `/userContent/nux-js/theme.css`
	- JavaScript URL: `/userContent/nux-js/theme.js`

Save and done. At this point all enhancements described below should work in your Jenkins installation.

### Individual files

To use individual files just add each of them in `/manage/appearance/` configuration page. Before adding individual files remember to add this library too: `nux-js/lib/jQueryMini.js`.

Large enhancements
---------------------------------

### ViewFilter

Main file: `nux-js/view-filter.js`.

Adds a simple filter input for views. Allows quick job filtering searching by words in any order. Technically it simply hides unmatched rows.

### EditArea

Main file: `editarea/jenkins-init.js`.

Integrates [Dolivet's EditArea](http://www.cdolivet.com/editarea/) syntax highlighting engine to enhance code editor of: SSH shell (bash), NodeJS and System Groovy steps.

<img align="center" src="https://raw.github.com/Eccenux/jenkins-scripts/master/screen/self-update.png" alt="Self update with syntax highlighting">

### Grouping parameters

Main file: `editarea/parameter-grouping.js`.

This feature allows you to hide or show groups of settings using a checkbox. For instance, if you check a box to turn on tests, it reveals extra settings for testing (which are hidden initially). Another use case involves a checkbox for risky options, adding an extra step to dynamically reveal some options and ensure users are aware of what they're doing.

<img style="max-height:40vh;" src="https://raw.github.com/Eccenux/jenkins-scripts/master/screen/param-group-en-opened.png" alt="Opened group">

More info: [README: parameter groups](README.param-groups.md).

Minor enhancements
------------------

* `nux-js/job-actions.js` - extra actions in a job's side panel (last build, time trend).
* `nux-js/checkboxes-helper.js` - for each large checkboxes group add a "clear all" / "choose all" button.
