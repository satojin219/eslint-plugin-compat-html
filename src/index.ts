import htmlCompat from "./rules/html-compat";

const plugin = {
  meta: {
    name: "eslint-plugin-compat-html",
    version: "1.0.0",
    namespace: "compat-html",
  },
  rules: {
    "html-compat": htmlCompat,
  },
  configs: {
    recommended: {
      plugins: ["compat-html"],
      rules: {
        "compat-html/html-compat": "error",
      },
    },
  },
};

export default plugin;
