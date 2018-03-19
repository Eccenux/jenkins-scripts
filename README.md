Jenkins Scripts
===============

Jenkins JavaScript enhancements package.

The `theme` folder contains simple `_packaging` script that builds `theme.js` for simple inclusion in Jenkins with [Simple Theme Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Simple+Theme+Plugin).

Quick start
-----------
1. Download `theme.js` and `theme.css` from [theme/\_build](https://github.com/Eccenux/jenkins-scripts/tree/master/theme/_build).
2. Install [Simple Theme Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Simple+Theme+Plugin) in your Jenkins.
3. Configure Simple Theme Plugin to point to your downloaded `theme.js` and `theme.css`.

At this point most enhancements described below should work in your Jenkins installation. You might need to download other files from the `_build` folder for all enhancements to work properly.

ViewFilter
----------

Adds a simple filter input for views. Allows quick job filtering searching by words in any order. Technically it simply hides unmatched rows.

EditArea
--------

Integrates [EditArea](http://www.cdolivet.com/editarea/) syntax highlighting engine to enhance Linux shell (bash) scripts editing. This includes commands executed through SSH.

<img align="center" src="https://raw.github.com/Eccenux/jenkins-scripts/master/screen/self-update.png" alt="Self update with syntax highlighting">

Grouping parameters
-------------------

This is a bit hacky enhancement to allow collapsing blocks of parameters with a checkbox. For example you have a checkbox to enable some tests and when it's checked it shows additional testing parameters (hidden by default). Or - my personal favorite - there are some dangerous options that you need to make sure users understands.

Please vote for a less hacky solution is in the [issue JENKINS-19002](https://issues.jenkins-ci.org/browse/JENKINS-19002).

<div style="margin:1em auto">
<img style="float:left; max-width:48%;" src="https://raw.github.com/Eccenux/jenkins-scripts/master/screen/param-group-en-collapsed.png" alt="Collapsed group">
<img style="float:left; max-width:48%;" src="https://raw.github.com/Eccenux/jenkins-scripts/master/screen/param-group-en-opened.png" alt="Opened group">
<p style="clear:both">Above screenshots are from running an example job with a single group (<a href="https://github.com/Eccenux/jenkins-scripts/blob/master/example-grouping/config.xml">config.xml</a>)</p>
</div>

How to make collapsible groups now?

### Step 1. Start a group ###

To start a group add a "Choice" parameter named `group-start` with following options (you can just add one of the options):

  * `collapsible` - if option is given then it will be possible to close the group with a button.
  * `collapsed` - if option is given the group will be closed by default.
  * `checkboxTrigger-SomeCheckboxParameterName` - if option is given group will be closed when checkbox is unchecked (and shown otherwise).

This parameter will be invisible to the user and will also not be submitted with the job.

### Step 2. Add trigger ###

If you use `checkboxTrigger-SomeCheckboxParameterName` then you should add a checkbox ("Boolean Value") parameter below `group-start`. The parameter should be named "SomeCheckboxParameterName".

### Step 3. End a group ###

Group continues until the end of params or next group start box.
To end a group before the end of params add a "Choice" parameter named `group-start` with option "-".


Minor enhancements
------------------

* `nux-js/minor-fixes.js` - contains various minor fixes (mainly usability enhancements).
* `nux-js/checkboxes-helper.js` - for each large checkboxes group add a "clear all" / "choose all" button.
