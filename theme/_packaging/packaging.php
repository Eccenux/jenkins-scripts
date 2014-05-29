<?php
	header("Content-Type: text/plain");

	//==========================================
	// Basic configuration
	//==========================================
	include_once 'config.php';

	//==========================================
	// Setup
	//==========================================
	require_once "./inc/SimpleJSLoader.php";
	require_once "./inc/SimpleCSSLoader.php";
	require_once "./inc/FileHelper.php";
	$strBaseScriptDir = rtrim(dirname(dirname(__FILE__)), "/\ ");	// up one dir
	$oLoader = new SimpleJSLoader($strBaseScriptDir);
	$oCSSLoader = new SimpleCSSLoader($strBaseScriptDir);
	$oFileHelper = new FileHelper($strBaseScriptDir);

	//==========================================
	// JS
	//==========================================

	$oLoader->noCache = true;
	$oLoader->isPreserveMultiCommentsWithCopyright = true;
	$oLoader->isRemoveInlineComments = true;
	$oLoader->isIgnoreLineNumbers = true;

	$oLoader->buildPackages($strBundleRoot, $buildPackages['theme']);
?>