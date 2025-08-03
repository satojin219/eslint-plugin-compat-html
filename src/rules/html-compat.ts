import type { Rule } from "eslint";
import {
  parseBrowserslistConfig,
  getSupportedBrowsers,
} from "../utils/browserslist";
import {
  checkHtmlElementCompatibility,
  checkHtmlAttributeCompatibility,
} from "../utils/compatibility";

interface RuleOptions {
  browserslistConfig?: string | string[];
  ignoreBrowsers?: string[];
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Check HTML element and attribute compatibility with target browsers",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: undefined,
    schema: [
      {
        type: "object",
        properties: {
          browserslistConfig: {
            oneOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } },
            ],
          },
          ignoreBrowsers: {
            type: "array",
            items: { type: "string" },
            description: "List of browsers to ignore in compatibility checks (e.g., ['ie 11', 'opera_mini'])",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      incompatibleElement:
        'HTML element "{{element}}" is not supported in: {{browsers}}.\n See {{mdnUrl}} for details.',
      incompatibleAttribute:
        'HTML attribute "{{attribute}}" on element "{{element}}" is not supported in: {{browsers}}.\n See {{mdnUrl}} for details.',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options: RuleOptions = context.options[0] || {};
    const targetBrowsers = options.browserslistConfig
      ? getSupportedBrowsers(options.browserslistConfig)
      : parseBrowserslistConfig();

    function checkJSXElement(node: any) {
      const elementName = node.openingElement?.name?.name || node.name?.name;
      if (!elementName) return;

      const elementResult = checkHtmlElementCompatibility(
        elementName,
        targetBrowsers,
        options.ignoreBrowsers
      );
      if (!elementResult.isSupported) {
        context.report({
          node,
          messageId: "incompatibleElement",
          data: {
            element: elementName,
            browsers: elementResult.unsupportedBrowsers.join(", "),
            mdnUrl: elementResult.mdnUrl || "",
          },
        });
      }

      const attributes = node.openingElement?.attributes || node.attributes;
      if (attributes) {
        for (const attr of attributes) {
          if (attr.type === "JSXAttribute" && attr.name?.name) {
            const attrName = attr.name.name.toLowerCase();

            const jsxOnlyAttributes = [
              "classname",
              "htmlfor",
              "defaultvalue",
              "defaultchecked",
            ];
            if (jsxOnlyAttributes.includes(attrName)) {
              continue;
            }

            const attrResult = checkHtmlAttributeCompatibility(
              elementName,
              attrName,
              targetBrowsers,
              options.ignoreBrowsers
            );

            if (!attrResult.isSupported) {
              context.report({
                node: attr,
                messageId: "incompatibleAttribute",
                data: {
                  attribute: attrName,
                  element: elementName,
                  browsers: attrResult.unsupportedBrowsers.join(", "),
                  mdnUrl: attrResult.mdnUrl || "",
                },
              });
            }
          }
        }
      }
    }

    function checkHTMLElement(node: any) {
      const elementName = node.tagName?.toLowerCase();
      if (!elementName) return;

      const elementResult = checkHtmlElementCompatibility(
        elementName,
        targetBrowsers,
        options.ignoreBrowsers
      );
      if (!elementResult.isSupported) {
        context.report({
          node,
          messageId: "incompatibleElement",
          data: {
            element: elementName,
            browsers: elementResult.unsupportedBrowsers.join(", "),
            mdnUrl: elementResult.mdnUrl || "",
          },
        });
      }

      if (node.attributes) {
        for (const attr of node.attributes) {
          const attrName =
            attr.key?.name?.toLowerCase() || attr.name?.toLowerCase();
          if (attrName) {
            const attrResult = checkHtmlAttributeCompatibility(
              elementName,
              attrName,
              targetBrowsers,
              options.ignoreBrowsers
            );

            if (!attrResult.isSupported) {
              context.report({
                node: attr,
                messageId: "incompatibleAttribute",
                data: {
                  attribute: attrName,
                  element: elementName,
                  browsers: attrResult.unsupportedBrowsers.join(", "),
                  mdnUrl: attrResult.mdnUrl || "",
                },
              });
            }
          }
        }
      }
    }

    return {
      JSXElement: checkJSXElement,
      HTMLElement: checkHTMLElement,
      Element: checkHTMLElement,
      VElement: checkHTMLElement,
    };
  },
};

export default rule;
