# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-27

### Added
- Initial release of eslint-plugin-compat-html
- HTML element compatibility checking using @mdn/browser-compat-data
- HTML attribute compatibility checking
- Integration with browserslist for browser targeting
- Support for JSX and HTML parsing
- Configurable browser targets via `browserslistConfig` option
- Comprehensive error reporting with unsupported browser lists
- Detection of experimental features (e.g., `attributionsourceid` attribute)
- Support for global attributes and element-specific attributes
- TypeScript definitions and full type safety
- Extensive test coverage

### Features
- **html-compat rule**: Main ESLint rule for checking HTML compatibility
- **Browser targeting**: Uses project's browserslist configuration by default
- **Custom configuration**: Allows custom browser target specification
- **Accurate data**: Leverages Mozilla's @mdn/browser-compat-data
- **Performance optimized**: Efficient compatibility checking algorithms
- **Developer friendly**: Clear error messages with specific browser lists

### Supported Elements
- HTML5 semantic elements (`<article>`, `<section>`, `<nav>`, `<aside>`, etc.)
- Interactive elements (`<dialog>`, `<details>`, `<summary>`)
- Form elements and input types
- Media elements (`<video>`, `<audio>`, `<picture>`)
- All standard HTML elements

### Supported Attributes
- HTML5 attributes (`contenteditable`, `draggable`, `hidden`, etc.)
- Form attributes (`autocomplete`, `required`, `pattern`, etc.)
- Experimental attributes (`attributionsourceid`, `popover`, etc.)
- Global attributes
- Element-specific attributes

### Browser Support
- Chrome (all versions in @mdn/browser-compat-data)
- Firefox (all versions in @mdn/browser-compat-data)
- Safari (all versions in @mdn/browser-compat-data)
- Edge (all versions in @mdn/browser-compat-data)
- Internet Explorer (all versions in @mdn/browser-compat-data)
- Mobile browsers (Chrome Mobile, Firefox Mobile, Safari iOS, etc.)
- Other browsers (Opera, Samsung Internet, etc.)

## [Unreleased]

### Added
- Deprecated HTML elements and attributes detection with error reporting
- MDN documentation links in all error messages for better developer experience
- Enhanced browser compatibility mapping for more accurate browserlist integration

### Changed
- Improved browserlist integration to only check browsers defined in configuration
- Better error handling for missing MDN compatibility data (now defaults to supported)
- More comprehensive browser name mapping (added support for and_qq, and_uc, android, baidu, ie_mob, op_mini, op_mob, kaios)

### Fixed
- Removed duplicate browser entries in compatibility mapping
- More accurate version comparison for browser compatibility checks

## [Planned Features]
- Support for CSS property compatibility checking
- Integration with Can I Use data
- Performance optimizations
- Additional configuration options
- More granular error reporting
- IDE integration improvements