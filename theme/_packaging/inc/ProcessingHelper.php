<?php
require_once dirname(__FILE__)."/SimpleJSLoader.php";
require_once dirname(__FILE__)."/SimpleCSSLoader.php";

/**
 * Index and other HTML proccessing helper.
 *
 * @author Maciej Nux Jaros
 */
class ProcessingHelper
{
	private $buildPackages = array();
	private $bundleRoot = '';
	// relative to processed file so should just be the curent directory...
	private $baseScriptDir = '.';

	/**
	 * Modes
	 * <ul>
	 * <li>'pgb-bundle' - PhoneGap bundle (building from command line).
	 * <li>'dynamic' - Building for in-browser preview (assuming debugging).
	 * </ul>
	 * @readonly
	 * @var string
	 */
	private $mode = '';
	/**
	 * Root for package bundles relative to HTML file.
	 *
	 * @readonly
	 * @var string
	 */
	private $htmlRelativeBundleRoot = '';

	/**
	 * Force (set) given mode.
	 *
	 * @param type $mode
	 */
	public function forceMode($mode)
	{
		$this->mode = $mode;
		$this->htmlRelativeBundleRoot = ($this->mode == 'pgb-bundle') ? '' :  $this->bundleRoot;
	}

	/**
	 *
	 * @param type $buildPackages Packages specification as described in SimpleJSLoader->buildPackages.
	 * @param type $bundleRoot Output path of bunldes.
	 */
	public function __construct($buildPackages, $bundleRoot)
	{
		$this->buildPackages = $buildPackages;
		$this->bundleRoot = $bundleRoot;

		$isCommandlineUsed = php_sapi_name() == "cli";
		$this->forceMode($isCommandlineUsed ? 'pgb-bundle' : 'dynamic');

		$this->cssLoader = new SimpleCSSLoader($this->baseScriptDir);
		$this->jsLoader = new SimpleJSLoader($this->baseScriptDir);
	}

	/**
	 * Do any required processing setup
	 *
	 * @return string Processing mode. See `mode` property for description.
	 */
	public function topSetup()
	{
		date_default_timezone_set('Europe/Paris');

		// delay output to rewrite URLs
		if ($this->mode == 'dynamic') {
			ob_start();
		}

		return $this->mode;
	}
	/**
	 * Do any required finalization
	 *
	 * @note It will attempt to fix links in HTML (rewrite from .html to .php), but it's advised to use mod rewrite as it will work for JS too.
	 *
	 * @param string $fileName HTML file name (without extension).
	 */
	public function bottomFinalization($fileName)
	{
		if ($this->mode == 'dynamic') {
			$content = ob_get_clean();
			// rewrite links from HTML to PHP
			echo preg_replace('#'.$fileName.'\\.html#i', $fileName.'.php', $content);
		}
	}

	private function getPackage($packageGroup, $groupItem=0)
	{
		if (empty($this->buildPackages[$packageGroup]) || empty($this->buildPackages[$packageGroup]['packages'][$groupItem])) {
			return '';
		}
		return $this->buildPackages[$packageGroup]['packages'][$groupItem];
	}

	/**
	 * Build HTML for including given CSS package.
	 * 
	 * @param string $packageGroup Package group name in build packages specfication.
	 * @param string|int $groupItem This is either name or number in `packages` array.
	 *		If omitted we will assume there is only one non-named file in the package.
	 * @param string $extraAttributes Any extra
	 * @return string HTML for including CSS in head element.
	 */
	public function css($packageGroup, $groupItem=0, $extraAttributes='')
	{
		$package = $this->getPackage($packageGroup, $groupItem);
		if (empty($package)) {
			return '';
		}
		// return as single package
		$attrs = 'rel="stylesheet"' . (empty($extraAttributes) ? '' : ' '.$extraAttributes);
		if ($this->mode != 'dynamic' || empty($package['debug'])) {
			$href = $this->htmlRelativeBundleRoot . $package['dest'];
			$html = "<link href=\"$href\" $attrs>";
		}
		// return as all files that build the package
		else {
			$paths = $this->cssLoader->getPathsOfItems($this->buildPackages[$packageGroup], $groupItem);
			$html = "\n\t<!-- {$package['dest']} -->";
			foreach ($paths as $path) {
				$href = $path;
				$html .= "\n\t<link href=\"$href\" $attrs>";
			}
		}
		return "$html\n";
	}
	/**
	 * Build HTML for including given JavaScript package.
	 *
	 * @param string $packageGroup Package group name in build packages specfication.
	 * @param string|int $groupItem This is either name or number in `packages` array.
	 *		If omitted we will assume there is only one non-named file in the package.
	 * @param string $extraAttributes Any extra
	 * @return string HTML for including a script (or scripts) in head element.
	 */
	public function js($packageGroup, $groupItem=0, $extraAttributes='')
	{
		$package = $this->getPackage($packageGroup, $groupItem);
		if (empty($package)) {
			return '';
		}
		$attrs = 'type="text/javascript"' . (empty($extraAttributes) ? '' : ' '.$extraAttributes);
		// return as single package
		if ($this->mode != 'dynamic' || empty($package['debug'])) {
			$href = $this->htmlRelativeBundleRoot . $package['dest'];
			$html = "<script src=\"$href\" $attrs></script>";
		}
		// return as all files that build the package
		else {
			$paths = $this->jsLoader->getPathsOfItems($this->buildPackages[$packageGroup], $groupItem);
			$html = "\n\t<!-- {$package['dest']} -->";
			foreach ($paths as $path) {
				$href = $path;
				$html .= "\n\t<script src=\"$href\" $attrs></script>";
			}
		}
		return "$html\n";
	}

}

?>