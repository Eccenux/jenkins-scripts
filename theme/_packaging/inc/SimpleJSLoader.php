<?php
require_once dirname(__FILE__)."/FileHelper.php";

/**
	Simple JS loader/packer
*/
class SimpleJSLoader
{
	/**
	 * If `true` then the class will always generate scripts from scratch (i.e. ignore last change time).
	 *
	 * @var boolean
	 */
	var $noCache = false;
	/**
	 * Prefix for modules loaded in createMiniModules.
	 *
	 * @note This can contain path relative to `$strBaseScriptDir`.
	 *
	 * @var string
	 */
	var $strBaseModulesName = 'edit_calend_';
	/**
	 * File name for a script generated in createMiniModules.
	 *
	 * @note This can contain path relative to `$strBaseScriptDir`.
	 *
	 * @var string
	 */
	var $strMiniModulesName = 'edit_calend.modules.mini.js';
	/**
	 * remove single line comments
	 * @var boolean
	 */
	var $isRemoveInlineComments = true;
	/**
	 * remove single multiline comments
	 * @var boolean
	 */
	var $isRemoveMultiComments = true;
	/**
	 * If true then line number will not be added in places where multiline comments were removed.
	 *
	 * Makes package a bit worse for debugging, but you will have better diffs for packages.
	 *
	 * @var boolean
	 */
	var $isIgnoreLineNumbers = false;
	/**
	 * If true then multiline comments will be preserved if Copyright statement will be detected.
	 * @var boolean
	 */
	var $isPreserveMultiCommentsWithCopyright = true;

	/**
	 * base path for modules and generated scripts
	 * @var string
	 */
	protected $strBaseScriptDir;

	/**
	 * @param type $strBaseScriptDir Base path for both input modules and for generated scripts.
	 */
	public function __construct($strBaseScriptDir)
	{
		$this->strBaseScriptDir = $strBaseScriptDir;
	}
	
	/**
	 * Info comment string helper.
	 *
	 * This was added mostly to be able to change this for SimpleCSSLoader.
	 *
	 * @param string $text comment content text.
	 * @return string comment string.
	 */
	protected static function getInfoCommentString($text)
	{
		return "\n// " . $text;
	}

	/**
	 * Resolve paths of modules.
	 *
	 * @param array $modules should contain names of files without the prefix and an extension.
	 * @return array Paths of files.
	 */
	private function resolveModulesPaths($modules)
	{
		$paths = array();
		foreach ($modules as $m)
		{
			$path = $this->getModulePath($m);
			if (strpos($m, '*')===false) {
				$paths[] = $path;
				continue;
			}
			foreach (glob($path) as $fullpath) {
				// only append files (skip dirs)
				if (is_file($fullpath)) {
					$paths[] = $fullpath;
				}
			}
		}
		return $paths;
	}

	/**
	 * High level function that builds a group of packages with common settings.
	 *
	 * @param array $strBundleRoot
	 * @param array $arrPackagesSpecification
	 *		Packages group specification is an array containing at minimum `packages` array.
	 *		Each element in `packages` array must contain `dest` path which is relative to `strBundleRoot`.
	 *		It must also contain `src` array which contains paths of modules (scripts) to package.
	 *		Optionally 'srcBase' may be provided at any level to provide a prefix or common path to source files.
	 */
	public function buildPackages($strBundleRoot, $arrPackagesSpecification)
	{
		// save state
		$preservedBaseModulesName = $this->strBaseModulesName;

		$this->strBaseModulesName = isset($arrPackagesSpecification['srcBase']) ? $arrPackagesSpecification['srcBase'] : '';
		$rootBaseModulesName = $this->strBaseModulesName;
		foreach ($arrPackagesSpecification['packages'] as $p) {
			if (isset($p['srcBase'])) {
				$this->strBaseModulesName = $p['srcBase'];
			}
			$this->strMiniModulesName = $strBundleRoot.$p['dest'];
			$this->createMiniModules($p['src']);
			$this->strBaseModulesName = $rootBaseModulesName;
		}

		// restore state
		$this->strBaseModulesName = $preservedBaseModulesName;
	}

	/**
	 * Get an array of paths of scripts specified by the package group.
	 *
	 * @param string $strBaseScriptDir Base path for both input modules and for generated scripts.
	 * @param array $arrPackagesSpecification Package group specfication.
	 * @param string|int $groupItem This is either name or number in `packages` array.
	 * @return array
	 */
	public function getPathsOfItems($arrPackagesSpecification, $groupItem)
	{
		// save state
		$preservedBaseModulesName = $this->strBaseModulesName;

		$this->strBaseModulesName = isset($arrPackagesSpecification['srcBase']) ? $arrPackagesSpecification['srcBase'] : '';
		$p = $arrPackagesSpecification['packages'][$groupItem];
		if (isset($p['srcBase'])) {
			$this->strBaseModulesName = $p['srcBase'];
		}
		$paths = $this->resolveModulesPaths($p['src']);

		// restore state
		$this->strBaseModulesName = $preservedBaseModulesName;

		return $paths;
	}

	/**
	 * Create minified file from an array of JS modules.
	 *
	 * @note All paths are resolved with `glob` function so you may use asteriks to include more then one file.
	 *
	 * @param array $arrModules should contain names of files without the prefix and an extension.
	 * @return string Mini modules script name.
	 */
	public function createMiniModules($arrModules)
	{
		$arrModules = $this->resolveModulesPaths($arrModules);

		$strOutputPath = "{$this->strBaseScriptDir}/{$this->strMiniModulesName}";
		
		// check if we need to change anything
		if (!$this->noCache)
		{
			$isChanged = $this->isChanged($arrModules, $strOutputPath);
		}
		else
		{
			$isChanged = true;
		}
		
		// generate & create file
		if ($isChanged)
		{
			FileHelper::createParent($strOutputPath);
			$hFile = fopen ($strOutputPath, 'w+');
			foreach ($arrModules as $m)
			{
				$strFileName = basename($m);
				fwrite ($hFile, $this->getInfoCommentString("$strFileName, line#0")."\n");	// file start marker
				fwrite ($hFile, $this->getMiniContents($m));
				fwrite ($hFile, $this->getInfoCommentString("$strFileName, EOF"));		// EOF marker
			}
			fclose ($hFile);
		}
		
		return $this->strMiniModulesName;
	}
	
	/**
	 * Checks if any of module files were changed after changing the output file.
	 *
	 * @param array $arrModules
	 * @param string $strOutputPath
	 * @return boolean
	 */
	private static function isChanged($arrModules, $strOutputPath)
	{
		if (!file_exists($strOutputPath))
		{
			return true;
		}
		
		$intMaxTime = 0;
		foreach ($arrModules as $m)
		{
			$intTmpTime = filemtime($m);
			if ($intTmpTime>$intMaxTime)
			{
				$intMaxTime = $intTmpTime;
			}
		}
		$intFileTime = filemtime($strOutputPath);
		
		return ($intFileTime < $intMaxTime);
	}

	/**
	 * Get module path.
	 * @param string $strModuleName
	 * @return string
	 */
	protected function getModulePath($strModuleName)
	{
		return "{$this->strBaseScriptDir}/{$this->strBaseModulesName}$strModuleName.js";
	}

	/**
	 * Gets minified contents of the given file.
	 *
	 * @param string $strFilePath
	 * @return string
	 */
	private function getMiniContents($strFilePath)
	{
		// contents
		$strCode = file_get_contents($strFilePath);
		
		// BOM del
		$strCode = preg_replace('#^\xEF\xBB\xBF#', '', $strCode);
		
		// lines (simpli/uni)fication
		$strCode = preg_replace(array("#\r\n#", "#\r#"), "\n", $strCode);
		
		// remove in-line comments without removing any vertical whitespace
		// TODO: A different aproach? Preserve strings and then match comments...
		if ($this->isRemoveInlineComments)
		{
			$strCode = preg_replace("#[ \t]*//[^\"\'\n]*[^\\\\\"\'\n](?=\n)#", '', $strCode);

			// not working: $strCode = preg_replace("#\n//[^'\n]*(['\"])[^'\n]*\1(?=\n)#", "\n", $strCode);
			$strCode = preg_replace("#\n//[^\"\n]*\"[^\"\n]*\"[^\"\n]*(?=\n)#", "\n", $strCode);
			$strCode = preg_replace("#\n//[^'\n]*'[^'\n]*'[^'\n]*(?=\n)#", "\n", $strCode);

			$strCode = preg_replace("#\n//(?=\n)#", "\n", $strCode);
		}
		
		// remove horizontal whitespace from EOL
		$strCode = preg_replace("#[ \t]+\n#", "\n", $strCode);
		
		// remove multi-line comments, add in-line comment in format: "// EOC@line#X".
		if ($this->isRemoveMultiComments)
		{
			$strCode = $this->parseMultiCom($strCode);
		}
		
		// add semicolon if not present
		$strCode = preg_replace("#([^\s};])\s*$#", "$1;\n", $strCode);
		
		return $strCode;
	}

	/**
	 * Parse multiline comments.
	 *
	 * @param string $strCode Input code.
	 * @return string Parsed code.
	 */
	private function parseMultiCom($strCode)
	{
		// prepare for simplified search
		//$strCode = "\n".$strCode."\n";
		
		//
		// find comments (take note of start and len)
		$arrComments = array();
		$reMulti = "#(?:^|\n)\s*/\*[\s\S]*?\*/\s*(?=\n|$)#";
		if (preg_match_all($reMulti, $strCode, $arrMatches, PREG_OFFSET_CAPTURE))
		{
			// ignore empty comments (remove from list)
			foreach ($arrMatches[0] as $i=>$v)
			{
				if (preg_match('#^\s*/\*\*/\s*$#i', $arrMatches[0][$i][0]))
				{
					unset($arrMatches[0][$i]);
				}
			}

			// remove comments with copyright from the list
			if ($this->isPreserveMultiCommentsWithCopyright)
			{
				foreach ($arrMatches[0] as $i=>$v)
				{
					if (preg_match('#\s(Copyright|license)#i', $arrMatches[0][$i][0]))
					{
						unset($arrMatches[0][$i]);
					}
				}
			}
			
			// create a list of comments (start, len, previous)
			foreach ($arrMatches[0] as $m)
			{
				$intInd = count($arrComments);
				$arrComments[$intInd] = array('start'=>$m[1], 'len'=>strlen($m[0]));
				if ($intInd>0)
				{
					$arrComments[$intInd]['previous'] = $arrComments[$intInd-1]['start']+$arrComments[$intInd-1]['len'];
				}
				else
				{
					$arrComments[$intInd]['previous'] = 0;
				}
			}
		}
		
		//
		// replace comments
		$intCorrection = 0;
		$intLines = 0;
		foreach ($arrComments as $c)
		{
			$intLines += 1+preg_match_all("#\n#"
				, substr($strCode
					, $c['previous']-$intCorrection
					, ($c['start']-$c['previous'])+$c['len'])
				, $m);
			$intLenPre = strlen($strCode);
			if ($this->isIgnoreLineNumbers) {
				$strCode = substr_replace($strCode, $this->getInfoCommentString("EOC"), $c['start']-$intCorrection, $c['len']);
			}
			else {
				$strCode = substr_replace($strCode, $this->getInfoCommentString("EOC@line#{$intLines}"), $c['start']-$intCorrection, $c['len']);
			}
			$intLines--;	// correction as line at the end is not matched
			$intCorrection += $intLenPre-strlen($strCode);
		}
		
		return $strCode;
	}
}

?>