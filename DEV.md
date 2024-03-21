Building a Theme Package
========================

If you plan to change individual JavaScript (JS) and CSS files, you'll likely be most interested in the *Packaging* section.

Most of this document gives an overview of the build configuration file for developers (*Configuration Structure*). It's used to define and manage the build process for web assets, including JavaScript and CSS files.

The *Additional Considerations* section includes notes about PHP versions and the copying of extra files.

## Packaging

While scripts can be used individually, building a package is often more convenient for configuration.

The build script is located in `theme/_packaging`, and its output is in `theme/_build`.

To prepare all theme files, execute `_packaging/packaging.php` via PHP.

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

## Additional Considerations

Some files are directly copied in the packaging script, so you might need to check that out too (not only `config.php`). The `packaging.php` file should be straightforward though.

Note that this script was created a long time ago and so it should still work with PHP 5. However, it is also quite simple and should be compatible with PHP 7, PHP 8, and likely future PHP versions.
