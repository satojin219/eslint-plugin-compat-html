const compatHtmlPlugin = require("eslint-plugin-compat-html");

module.exports = [
  {
    files: ["**/*.tsx", "**/*.ts"],
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "compat-html": compatHtmlPlugin.default || compatHtmlPlugin
    },
    rules: {
      "compat-html/html-compat": ["warn"]
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
