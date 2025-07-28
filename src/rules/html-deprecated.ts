import type { Rule } from "eslint";
import {
  checkHtmlElementDeprecation,
  checkHtmlAttributeDeprecation,
} from "../utils/compatibility";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Check for deprecated HTML elements and attributes",
      category: "Possible Errors",
      recommended: true,
    },
    fixable: undefined,
    schema: [],
    messages: {
      deprecatedElement:
        'HTML element "{{element}}" is deprecated{{deprecationNote}}.\n See {{mdnUrl}} for details.',
      deprecatedAttribute:
        'HTML attribute "{{attribute}}" on element "{{element}}" is deprecated{{deprecationNote}}.\n See {{mdnUrl}} for details.',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    function checkJSXElement(node: any) {
      const elementName = node.openingElement?.name?.name || node.name?.name;
      if (!elementName) return;

      const deprecationResult = checkHtmlElementDeprecation(elementName);
      if (deprecationResult.isDeprecated) {
        context.report({
          node,
          messageId: "deprecatedElement",
          data: {
            element: elementName,
            deprecationNote: deprecationResult.deprecationNote
              ? `: ${deprecationResult.deprecationNote}`
              : "",
            mdnUrl: deprecationResult.mdnUrl || "",
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

            const attrDeprecationResult = checkHtmlAttributeDeprecation(
              elementName,
              attrName
            );
            if (attrDeprecationResult.isDeprecated) {
              context.report({
                node: attr,
                messageId: "deprecatedAttribute",
                data: {
                  attribute: attrName,
                  element: elementName,
                  deprecationNote: attrDeprecationResult.deprecationNote
                    ? `: ${attrDeprecationResult.deprecationNote}`
                    : "",
                  mdnUrl: attrDeprecationResult.mdnUrl || "",
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

      const deprecationResult = checkHtmlElementDeprecation(elementName);
      if (deprecationResult.isDeprecated) {
        context.report({
          node,
          messageId: "deprecatedElement",
          data: {
            element: elementName,
            deprecationNote: deprecationResult.deprecationNote
              ? `: ${deprecationResult.deprecationNote}`
              : "",
            mdnUrl: deprecationResult.mdnUrl || "",
          },
        });
      }

      if (node.attributes) {
        for (const attr of node.attributes) {
          const attrName =
            attr.key?.name?.toLowerCase() || attr.name?.toLowerCase();
          if (attrName) {
            const attrDeprecationResult = checkHtmlAttributeDeprecation(
              elementName,
              attrName
            );
            if (attrDeprecationResult.isDeprecated) {
              context.report({
                node: attr,
                messageId: "deprecatedAttribute",
                data: {
                  attribute: attrName,
                  element: elementName,
                  deprecationNote: attrDeprecationResult.deprecationNote
                    ? `: ${attrDeprecationResult.deprecationNote}`
                    : "",
                  mdnUrl: attrDeprecationResult.mdnUrl || "",
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
    };
  },
};

export default rule;
