<?php
/**
 * Basic configuration file.
 */

//==========================================
// Your paths
//==========================================
// Output path (relative to $strBaseScriptDir)
$strBundleRoot = '_build/';

//==========================================
// Your packages definitions
//
// 'srcBase' can be both name prefix and common path to source files
// 'dest' is relative to $strBundleRoot
// 'src' is relative to base directory (where index.php is) and prefixed with 'srcBase'
//==========================================
$buildPackages = array(
	// - - - - - - - - - - - - - - - - - - - - -
	// JS
	// - - - - - - - - - - - - - - - - - - - - -
	'theme' => array(
		'srcBase' => '',
		'packages' => array(
			// application build (common including i18n and model)
			'common' => array(
				'debug' => true,	// unpack in browser by default
				'dest' => 'theme.js',
				'src' => array(
					// note `*` means all immediate JS files (does not include subdirs)
					'nux-js/lib/*',
					'nux-js/*',
					'editarea/*',
				),
			),
		),
	),
);

?>