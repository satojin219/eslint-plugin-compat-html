import type { Rule } from "eslint";
import {
  parseBrowserslistConfig,
  getSupportedBrowsers,
} from "../utils/browserslist";
import {
  checkHtmlElementCompatibility,
  checkHtmlAttributeCompatibility,
  checkHtmlElementDeprecation,
  checkHtmlAttributeDeprecation,
} from "../utils/compatibility";

interface RuleOptions {
  browserslistConfig?: string | string[];
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
        },
        additionalProperties: false,
      },
    ],
    messages: {
      incompatibleElement:
        'HTML element "{{element}}" is not supported in: {{browsers}}. See {{mdnUrl}} for details.',
      incompatibleAttribute:
        'HTML attribute "{{attribute}}" on element "{{element}}" is not supported in: {{browsers}}. See {{mdnUrl}} for details.',
      deprecatedElement:
        'HTML element "{{element}}" is deprecated{{deprecationNote}}. See {{mdnUrl}} for details.',
      deprecatedAttribute:
        'HTML attribute "{{attribute}}" on element "{{element}}" is deprecated{{deprecationNote}}. See {{mdnUrl}} for details.',
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
        targetBrowsers
      );
      if (!elementResult.isSupported) {
        context.report({
          node,
          messageId: "incompatibleElement",
          data: {
            element: elementName,
            browsers: elementResult.unsupportedBrowsers.join(", "),
            mdnUrl: elementResult.mdnUrl || '',
          },
        });
      }

      const deprecationResult = checkHtmlElementDeprecation(elementName);
      if (deprecationResult.isDeprecated) {
        context.report({
          node,
          messageId: "deprecatedElement",
          data: {
            element: elementName,
            deprecationNote: deprecationResult.deprecationNote 
              ? `: ${deprecationResult.deprecationNote}` 
              : '',
            mdnUrl: deprecationResult.mdnUrl || '',
          },
        });
      }

      const attributes = node.openingElement?.attributes || node.attributes;
      if (attributes) {
        for (const attr of attributes) {
          if (attr.type === "JSXAttribute" && attr.name?.name) {
            const attrName = attr.name.name.toLowerCase();
            
            const jsxOnlyAttributes = ['classname', 'htmlfor', 'defaultvalue', 'defaultchecked'];
            if (jsxOnlyAttributes.includes(attrName)) {
              continue;
            }
            
            const attrResult = checkHtmlAttributeCompatibility(
              elementName,
              attrName,
              targetBrowsers
            );

            if (!attrResult.isSupported) {
              context.report({
                node: attr,
                messageId: "incompatibleAttribute",
                data: {
                  attribute: attrName,
                  element: elementName,
                  browsers: attrResult.unsupportedBrowsers.join(", "),
                  mdnUrl: attrResult.mdnUrl || '',
                },
              });
            }

            const attrDeprecationResult = checkHtmlAttributeDeprecation(elementName, attrName);
            if (attrDeprecationResult.isDeprecated) {
              context.report({
                node: attr,
                messageId: "deprecatedAttribute",
                data: {
                  attribute: attrName,
                  element: elementName,
                  deprecationNote: attrDeprecationResult.deprecationNote 
                    ? `: ${attrDeprecationResult.deprecationNote}` 
                    : '',
                  mdnUrl: attrDeprecationResult.mdnUrl || '',
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
        targetBrowsers
      );
      if (!elementResult.isSupported) {
        context.report({
          node,
          messageId: "incompatibleElement",
          data: {
            element: elementName,
            browsers: elementResult.unsupportedBrowsers.join(", "),
          },
        });
      }

      const deprecationResult = checkHtmlElementDeprecation(elementName);
      if (deprecationResult.isDeprecated) {
        context.report({
          node,
          messageId: "deprecatedElement",
          data: {
            element: elementName,
            deprecationNote: deprecationResult.deprecationNote 
              ? `: ${deprecationResult.deprecationNote}` 
              : '',
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
              targetBrowsers
            );

            if (!attrResult.isSupported) {
              context.report({
                node: attr,
                messageId: "incompatibleAttribute",
                data: {
                  attribute: attrName,
                  element: elementName,
                  browsers: attrResult.unsupportedBrowsers.join(", "),
                },
              });
            }

            const attrDeprecationResult = checkHtmlAttributeDeprecation(elementName, attrName);
            if (attrDeprecationResult.isDeprecated) {
              context.report({
                node: attr,
                messageId: "deprecatedAttribute",
                data: {
                  attribute: attrName,
                  element: elementName,
                  deprecationNote: attrDeprecationResult.deprecationNote 
                    ? `: ${attrDeprecationResult.deprecationNote}` 
                    : '',
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
      Element: checkHTMLElement
    };
  },
};

export default rule;
