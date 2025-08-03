const compatHtmlPlugin = require("eslint-plugin-html-compat");

module.exports = [
  {
    files: ["**/*.tsx", "**/*.ts"],
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "html-compat": compatHtmlPlugin.default || compatHtmlPlugin
    },
    rules: {
      "html-compat/html-compat": ["warn", {
        browserslistConfig: ["> 1%", "last 2 versions", "not dead", "ie 11", "firefox 60", "safari 12"],
        ignoreBrowsers: ["safari 12"]
      }]
    },
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  }
];
