Building a theme package
==============================

If you just just change individual JS and CSS, then you are probably only interested in *Packaging*.

Most of the other stuff in this document provides an overview of the build configuration file for developers (*Configuration Structure*). The configuration file is used to define and manage the build process for web assets, including JavaScript and CSS files.


The section *Additional considerations* has some notes about PHP versions and copying of extra files.

## Packaging

Scripts can be used individually, but you'll probably want to build a package for easier configuration.

The build script is in `theme\_packaging` and it's output is `theme\_build`.

Execute `_packaging\packaging.php` via PHP to prepare all theme files.

## Configuration Structure

The configuration file (`config.php`) is structured into several key sections:

### Paths
- `$strBundleRoot`: Defines the output directory for the build process, relative to the base script directory. By default, it is set to '_build/'.
- `$strBaseScriptDir`: Defines a base for above (set in the packaging script).

### Packages Definitions
The `$buildPackages` array contains the definitions for different types of assets (e.g., JavaScript, CSS) that need to be built (merged). Each entry in this array is an associative array with the following keys:
- `srcBase`: Acts as both a name prefix and a common path to source files. It is used to simplify the definition of source files.
- `dest`: Specifies the destination filename for the built package, relative to `$strBundleRoot`.
- `src`: Lists the source files or directories, relative to the base directory (where `index.php` is located), and prefixed with `srcBase`.

Note that the special character `*` is used to include all immediate files in a directory (subdirectories are not included).

### Example Package Definition
```php
'theme' => array(
    'srcBase' => '',
    'packages' => array(
        'common' => array(
            'debug' => true,    // Unpack in browser by default
            'dest' => 'theme.js',
            'src' => array(
                'nux-js/lib/*', // Includes all JS files in 'nux-js/lib'
                'nux-js/*',     // Includes all JS files in 'nux-js'
            ),
        ),
    ),
),
```

This example defines a JavaScript package named `theme`, which includes all JavaScript files directly under `nux-js/lib` and `nux-js`. The built file will be named `theme.js` and placed in the `_build/` directory.

## Additional considerations

Some files are copied directly in the packaging script. The `packaging.php` file should be pretty straight forward.

Note that the script was created quite a long time ago and it should work as far back as in PHP5, but it is also quite simple and should work in PHP7 and PHP8 (and probably in future versions).