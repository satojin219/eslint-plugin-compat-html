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
        'HTML element "{{element}}" is not supported in: {{browsers}}',
      incompatibleAttribute:
        'HTML attribute "{{attribute}}" on element "{{element}}" is not supported in: {{browsers}}',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options: RuleOptions = context.options[0] || {};
    const targetBrowsers = options.browserslistConfig
      ? getSupportedBrowsers(options.browserslistConfig)
      : parseBrowserslistConfig();

    function checkJSXElement(node: any) {
      const elementName = node.name?.name;
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

      if (node.attributes) {
        // for...of ループに修正
        for (const attr of node.attributes) {
          if (attr.type === "JSXAttribute" && attr.name?.name) {
            const attrName = attr.name.name.toLowerCase();
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

      if (node.attributes) {
        // for...of ループに修正
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
          }
        }
      }
    }

    return {
      // JSXElement と JSXOpeningElement の両方で同じ checkJSXElement を呼び出すのは冗長かもしれません。
      // 一般的に、AST ウォーカーは OpeningElement または Element のどちらか一方で十分なことが多いです。
      // JSXOpeningElement は JSXElement の子ノードとしてアクセスできるため、
      // 多くの場合 JSXElement だけで十分ですが、具体的な AST の構造によります。
      JSXElement: checkJSXElement,
      // JSXOpeningElement: checkJSXElement, // 必要なければコメントアウトまたは削除を検討
      HTMLElement: checkHTMLElement,
      // Element: checkHTMLElement // 必要なければコメントアウトまたは削除を検討
    };
  },
};

export default rule;
