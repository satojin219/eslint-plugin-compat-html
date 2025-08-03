# eslint-plugin-compat-html

[![npm version](https://badge.fury.io/js/eslint-plugin-compat-html.svg)](https://badge.fury.io/js/eslint-plugin-compat-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ESLint plugin to check HTML element and attribute compatibility using browserslist and @mdn/browser-compat-data.

## ✨ Features

- 🔍 **Accurate compatibility checking** using @mdn/browser-compat-data
- 🎯 **Browser targeting** with browserslist integration
- ⚛️ **JSX and HTML support** for React and vanilla HTML projects
- 🧪 **Experimental feature detection** (e.g., `attributionsourceid`)
- ⚙️ **Configurable browser targets**
- 📊 **Detailed error reporting** with unsupported browser lists

## 🚀 Installation

```bash
npm install --save-dev eslint-plugin-compat-html
```

## 📖 Usage

### Basic Configuration

Add to your ESLint configuration:

```json
{
  "plugins": ["compat-html"],
  "rules": {
    "compat-html/html-compat": "error"
  }
}
```

### Recommended Configuration

```json
{
  "extends": ["plugin:compat-html/recommended"]
}
```

### Custom Browser Targets

```json
{
  "rules": {
    "compat-html/html-compat": ["error", {
      "browserslistConfig": ["> 1%", "last 2 versions", "not dead"]
    }]
  }
}
```

### Legacy Browser Support

```json
{
  "rules": {
    "compat-html/html-compat": ["error", {
      "browserslistConfig": ["ie 11", "> 1%"]
    }]
  }
}
```

### Ignoring Specific Browsers

```json
{
  "rules": {
    "compat-html/html-compat": ["error", {
      "browserslistConfig": ["> 1%", "last 2 versions"],
      "ignoreBrowsers": ["ie 11", "opera_mini"]
    }]
  }
}
```

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `browserslistConfig` | `string[]` | Project's browserslist | Custom browser targets |
| `ignoreBrowsers` | `string[]` | `[]` | List of browsers to ignore in compatibility checks |

## 📝 Examples

### Modern HTML Elements

```jsx
// ❌ Will warn if targeting IE 11
<dialog open>
  <p>This is a modal dialog</p>
  <button>Close</button>
</dialog>

// ❌ Will warn for older browsers
<details>
  <summary>Click to expand</summary>
  <p>Hidden content</p>
</details>

// ✅ Widely supported
<div className="container">
  <h1>Title</h1>
  <p>Content</p>
</div>
```

### Experimental Attributes

```jsx
// ❌ Will warn for all browsers except Safari 14.1+
<a href="https://example.com" attributionsourceid="source123">
  Link with attribution
</a>

// ✅ Standard attributes work everywhere
<a href="https://example.com" target="_blank" rel="noopener">
  Standard link
</a>
```

### Form Elements

```jsx
// ❌ Will warn for IE 11
<input type="color" />
<input type="date" />

// ✅ Widely supported
<input type="text" />
<input type="email" />
```

## 🎯 Supported Elements & Attributes

The plugin checks compatibility for:

- **HTML5 semantic elements**: `<article>`, `<section>`, `<nav>`, `<aside>`, etc.
- **Interactive elements**: `<dialog>`, `<details>`, `<summary>`
- **Form input types**: `color`, `date`, `datetime-local`, `range`, etc.
- **Experimental attributes**: `attributionsourceid`, `popover`, etc.
- **Global attributes**: `contenteditable`, `draggable`, `hidden`, etc.

## 🛠️ Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [@mdn/browser-compat-data](https://github.com/mdn/browser-compat-data) for comprehensive browser compatibility data
- [browserslist](https://github.com/browserslist/browserslist) for browser targeting
- [ESLint](https://eslint.org/) for the plugin architecture

## 📊 Browser Support Data

This plugin uses the latest @mdn/browser-compat-data, which includes:

- All major browsers (Chrome, Firefox, Safari, Edge, IE)
- Mobile browsers (Chrome Mobile, Firefox Mobile, Safari iOS)
- Other browsers (Opera, Samsung Internet, etc.)
- Experimental and deprecated features