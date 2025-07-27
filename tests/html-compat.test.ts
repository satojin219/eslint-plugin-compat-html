import { RuleTester } from 'eslint';
import rule from '../src/rules/html-compat';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
});

describe('html-compat rule', () => {
  ruleTester.run('html-compat', rule, {
    valid: [
      {
        code: '<div>Hello World</div>',
        options: [{ browserslistConfig: ['> 1%'] }]
      },
      {
        code: '<span className="test">Content</span>',
        options: [{ browserslistConfig: ['> 1%'] }]
      },
      {
        code: '<p id="paragraph">Text</p>',
        options: [{ browserslistConfig: ['> 1%'] }]
      }
    ],
    
    invalid: [
      {
        code: '<dialog>Modal content</dialog>',
        options: [{ browserslistConfig: ['ie 11'] }],
        errors: [
          {
            messageId: 'incompatibleElement'
          }
        ]
      },
      {
        code: '<details><summary>Summary</summary>Details</details>',
        options: [{ browserslistConfig: ['ie 11'] }],
        errors: [
          {
            messageId: 'incompatibleElement'
          },
          {
            messageId: 'incompatibleElement'
          }
        ]
      }
    ]
  });
});