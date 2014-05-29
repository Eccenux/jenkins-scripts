<?php

/**
 * File operations helper
 */
class FileHelper
{
	// base path for modules and generated scripts
	protected $strBaseScriptDir;

	public function __construct($strBaseScriptDir)
	{
		$this->strBaseScriptDir = rtrim($strBaseScriptDir, '\/\\');
	}

	protected static function getContents($source, $evalSource = false)
	{
		if (!$evalSource) {
			$sourceContents = file_get_contents($source);
		} else {
			ob_start();
			include($source);
			$sourceContents = ob_get_clean();
		}
		return $sourceContents;
	}

	/**
	 * Overwrites whole destination file with source content.
	 *
	 * @note Creates destination directory if it does not exist.
	 *
	 * @param string $source Source file path relative to $strBaseScriptDir.
	 * @param string $destination Destination file path relative to $strBaseScriptDir.
	 * @param bool $evalSource If true then source file will be evaluted (run as PHP).
	 */
	public function overwriteFile($source, $destination, $evalSource = false)
	{
		$source = "{$this->strBaseScriptDir}/$source";
		$destination = "{$this->strBaseScriptDir}/$destination";
		$sourceContents = self::getContents($source, $evalSource);

		self::createParent($destination);
		file_put_contents($destination, $sourceContents);
	}

	/**
	 * Create parent directory if it does not exist.
	 * @param string $file file path.
	 * @return bool true upon success
	 */
	public static function createParent($file)
	{
		$isOk = true;
		$directory = dirname($file);
		if (!is_dir($directory)) {
			$isOk = mkdir($directory);
		}
		return $isOk;
	}

	/**
	 * Recursively remove whole directory.
	 *
	 * @param string $dir path
	 * @return bool true if everything was removed (including self).
	 */
	private static function rmdirRecursive($dir, $exclusionPatterns) {
		$removeContainerFolder = true;
		foreach(glob($dir . '/*') as $file) {
			if (!empty($exclusionPatterns) && self::matchPatterns($exclusionPatterns, $file)) {
				$removeContainerFolder = false;	// some files are ignored - cannot remove parent
				continue;
			}
			if(is_dir($file)) {
				// not everythin remove? -> cannot remove parent
				if (self::rmdirRecursive($file, $exclusionPatterns)) {
					$removeContainerFolder = false;
				}
			} else {
				unlink($file);
			}
		}
		if ($removeContainerFolder && is_dir($dir)) {
			if (!rmdir($dir)) {
				die("Error removing $dir");
			}
			return false;
		}
		return true;
	}

	/**
	 * Match patterns against subject.
	 *
	 * Similar to preg_match except it works on an array of patterns.
	 *
	 * @param array $patterns Array of patterns.
	 * @param string $subject Some string.
	 * @return bool true if any matched.
	 */
	private static function matchPatterns($patterns, $subject) {
		for ($i = count($patterns) - 1; $i >= 0; $i--) {
			if (preg_match($patterns[$i], $subject)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Recursively copy directory or file.
	 *
	 * @note Use rmdirRecursive if you want to remove directory before copying.
	 *
	 * @param string $src Source path.
	 * @param string $dest Destination path.
	 */
	private static function copyRecursive($src, $dest, $exclusionPatterns) {
		if(is_file($src)) {
			if (empty($exclusionPatterns) || !self::matchPatterns($exclusionPatterns, $src)) {
				copy($src, $dest);
			}
		} else {
			if (!is_dir($dest)) {
				if (!mkdir($dest, 0777, true)) {
					die("Error creating $dest");
				}
			}
			foreach(glob($src . '/*') as $file) {
				$destFile = $dest.'/'.basename($file);
				self::copyRecursive($file, $destFile, $exclusionPatterns);
			}
		}
	}

	/**
	 * Copies files or directory overwriting destination.
	 *
	 * @param string $source Source file path relative to $strBaseScriptDir.
	 * @param string $destination Destination file path relative to $strBaseScriptDir.
	 * @param array $sourceExclusionPatterns (default=empty)
	 *		Exclusion patterns for to match in source path.
	 *		Note! Patterns are preg_match compatible (NOT glob compatible).
	 *		e.g. $exclusionPatterns = array('#\\.lnk$#', '#\\.bat$#')	// exclude Windows links and batch (shell)
	 * @param array $destinationExclusionPatterns (default=empty)
	 *		Exclusion patterns for to match in destination path (i.e. not removed from destination).
	 */
	public function copy($source, $destination, $sourceExclusionPatterns = array(), $destinationExclusionPatterns = array())
	{
		$source = "{$this->strBaseScriptDir}/$source";
		$destination = "{$this->strBaseScriptDir}/$destination";

		self::rmdirRecursive($destination, $destinationExclusionPatterns);
		self::copyRecursive($source, $destination, $sourceExclusionPatterns);
	}

	/**
	 * Replace string in given file.
	 *
	 * @param string $pattern Pattern (or simple string) to search in file.
	 * @param string $replacement Replacement.
	 * @param string $file file path relative to $strBaseScriptDir.
	 * @param bool $useRegExp (default=false)
	 *		If used then you can use any preg_replace compatible
	 *		patterns and replacements (including arrays)
	 */
	public function replaceInFile($pattern, $replacement, $file, $useRegExp = false)
	{
		$file = "{$this->strBaseScriptDir}/$file";

		$fileContents = file_get_contents($file);
		if (!$useRegExp) {
			$fileContents = str_replace($pattern, $replacement, $fileContents);
		} else {
			$fileContents = preg_replace($pattern, $replacement, $fileContents);
		}
		file_put_contents($file, $fileContents);
	}

	/**
	 * Check if file or directory exists.
	 *
	 * @param string $file file or directory path relative to $strBaseScriptDir.
	 * @return bool true if file or directory exists.
	 */
	public function exists($file)
	{
		$file = "{$this->strBaseScriptDir}/$file";

		return file_exists($file);
	}
}

?>