Grouping parameters
==============================

The need to group parameters seems obvious to me, but sadly not available in Jenkins. So I created this enhancement, but please vote for a less hacky solution in the [issue JENKINS-19002](https://issues.jenkins-ci.org/browse/JENKINS-19002).

How does this look like?
---------------------------------------

This enhancement allows collapsing blocks of parameters with a checkbox. For example you have a checkbox to enable some tests and when it's checked it shows additional testing parameters (hidden by default). Or - my personal favourite - there are some dangerous options that you need to make sure users understands.

<div style="margin:1em auto">
<img style="float:left; max-width:48%;" src="https://raw.github.com/Eccenux/jenkins-scripts/master/screen/param-group-en-collapsed.png" alt="Collapsed group">
<img style="float:left; max-width:48%;" src="https://raw.github.com/Eccenux/jenkins-scripts/master/screen/param-group-en-opened.png" alt="Opened group">
<p style="clear:both">Above screenshots are from running an example job with a single group (<a href="https://github.com/Eccenux/jenkins-scripts/blob/master/example-grouping/config.xml">config.xml</a>)</p>
</div>

How to make collapsible groups?
---------------------------------------

### Step 1. Start a group ###

To start a group add a "Choice" parameter named `group-start` (or `group-start_<0-9>`) with following options (you can just add one of the options):

  * `collapsible` - if option is given then it will be possible to close the group with a button.
  * `collapsed` - if option is given the group will be closed by default.
  * `checkboxTrigger-SomeCheckboxParameterName` - if option is given group will be closed when checkbox is unchecked (and shown otherwise).

This parameter will be invisible to the user and will also not be submitted with the job.

### Step 2. Add trigger ###

If you use `checkboxTrigger-SomeCheckboxParameterName` then you should add a checkbox ("Boolean Value") parameter below `group-start`. The parameter should be named "SomeCheckboxParameterName".

### Step 3. End a group ###

Group continues until the end of parameters or next group start box.
To end a group before the end of parameters add a "Choice" parameter named `group-start` with option "-". 
You can also use `group-end` or `group-end_<0-9>`.
