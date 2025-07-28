import htmlCompat from "./rules/html-compat";
import htmlDeprecated from "./rules/html-deprecated";

const plugin = {
  meta: {
    name: "eslint-plugin-compat-html",
    version: "1.0.0",
    namespace: "compat-html",
  },
  rules: {
    "html-compat": htmlCompat,
    "html-deprecated": htmlDeprecated,
  },
  configs: {
    recommended: {
      plugins: ["compat-html"],
      rules: {
        "compat-html/html-compat": "error",
        "compat-html/html-deprecated": "error",
      },
    },
  },
};

export default plugin;
