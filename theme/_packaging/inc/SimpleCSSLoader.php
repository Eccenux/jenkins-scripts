<?php
require_once dirname(__FILE__)."/SimpleJSLoader.php";

/**
 * Simple CSS loader/packer
 */
class SimpleCSSLoader extends SimpleJSLoader
{
	function __construct($strBaseScriptDir)
	{
		$this->isRemoveInlineComments = false;

		parent::__construct($strBaseScriptDir);
	}
	
	protected static function getInfoCommentString($text)
	{
		return "\n/*$text*/";
	}

	/*
		Get module path
	*/
	protected function getModulePath($strModuleName)
	{
		return "{$this->strBaseScriptDir}/{$this->strBaseModulesName}$strModuleName.css";
	}
}

?>