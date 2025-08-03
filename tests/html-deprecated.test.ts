import { RuleTester } from 'eslint';
import rule from '../src/rules/html-deprecated';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    }
  }
});

describe('html-deprecated rule', () => {
  ruleTester.run('html-deprecated', rule, {
    valid: [
      {
        code: '<div>Hello World</div>'
      },
      {
        code: '<span className="test">Content</span>'
      },
      {
        code: '<p id="paragraph">Text</p>'
      },
      {
        code: '<section><h1>Title</h1><p>Content</p></section>'
      },
      {
        code: '<button type="button">Click me</button>'
      }
    ],
    
    invalid: [
      {
        code: '<center>Centered content</center>',
        errors: [
          {
            messageId: 'deprecatedElement'
          }
        ]
      },
      {
        code: '<font color="red">Red text</font>',
        errors: [
          {
            messageId: 'deprecatedElement'
          },
          {
            messageId: 'deprecatedAttribute'
          }
        ]
      },
      {
        code: '<marquee>Scrolling text</marquee>',
        errors: [
          {
            messageId: 'deprecatedElement'
          }
        ]
      },
      {
        code: '<big>Large text</big>',
        errors: [
          {
            messageId: 'deprecatedElement'
          }
        ]
      },
      {
        code: '<tt>Teletype text</tt>',
        errors: [
          {
            messageId: 'deprecatedElement'
          }
        ]
      },
      {
        code: '<strike>Strikethrough text</strike>',
        errors: [
          {
            messageId: 'deprecatedElement'
          }
        ]
      },
      {
        code: '<acronym title="HyperText Markup Language">HTML</acronym>',
        errors: [
          {
            messageId: 'deprecatedElement'
          }
        ]
      },
      {
        code: '<nobr>No break text</nobr>',
        errors: [
          {
            messageId: 'deprecatedElement'
          }
        ]
      },
      {
        code: '<img src="image.jpg" align="left" />',
        errors: [
          {
            messageId: 'deprecatedAttribute'
          }
        ]
      },
      {
        code: '<table border="1"><tr><td>Cell</td></tr></table>',
        errors: [
          {
            messageId: 'deprecatedAttribute'
          }
        ]
      },
      {
        code: '<div align="center">Centered div</div>',
        errors: [
          {
            messageId: 'deprecatedAttribute'
          }
        ]
      },
      {
        code: '<table bgcolor="yellow"><tr><td>Cell</td></tr></table>',
        errors: [
          {
            messageId: 'deprecatedAttribute'
          }
        ]
      }
    ]
  });
});