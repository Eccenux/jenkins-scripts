<?php
require_once dirname(__FILE__)."/FileHelper.php";

/**
 * Simple HTML parser
 */
class SimpleHTMLParser extends FileHelper
{
	function __construct($strBaseScriptDir)
	{
		parent::__construct($strBaseScriptDir);
	}

	/**
	 * Get body tag postion from HTML.
	 *
	 * @param string $html Contents of HTML file.
	 * @return array|boolean Returns false when not found or an array with start, end, length.
	 */
	private static function getBodyPostion ($html)
	{
		$bodyStart = stripos ($html, '<body');
		$bodyStart = strpos ($html, '>', $bodyStart);
		$bodyEnd  = strripos ($html, '</body>');
		if ($bodyStart === false || $bodyEnd === false)
		{
			return false;
		}
		return array('start' => $bodyStart, 'end' => $bodyEnd, 'length' => $bodyEnd - $bodyStart);
	}

	/**
	 * Copies body from source and overwrites it in destination file.
	 * 
	 * @param string $source Source file path relative to $strBaseScriptDir.
	 * @param string $destination Destination file path relative to $strBaseScriptDir.
	 * @param bool $evalSource If true then source file will be evaluted (run as PHP).
	 */
	public static function overwriteBody($source, $destination, $evalSource = false)
	{
		$source = "{$this->strBaseScriptDir}/$source";
		$destination = "{$this->strBaseScriptDir}/$destination";
		$sourceContents = self::getContents($source, $evalSource);
		
		// generate from scratch if destination does not exist
		if (!is_file($destination)) {
			file_put_contents($destination, $sourceContents);
		}
		$body = self::getBodyPostion ($sourceContents);
		if ($body !== false)
		{
			$sourceContents = substr($sourceContents, $body['start'], $body['length']);
			$destinationContents = file_get_contents($destination);
			$body = self::getBodyPostion ($destinationContents);
			$destinationContents = substr_replace ($destinationContents, $sourceContents, $body['start'], $body['length']);
			file_put_contents($destination, $destinationContents);
		}
	}
}

?>